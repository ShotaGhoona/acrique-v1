"""決済ユースケース"""

import logging
from datetime import datetime

from app.application.interfaces.email_service import (
    IEmailService,
    OrderConfirmationData,
)
from app.application.interfaces.stripe_service import IStripeService
from app.application.schemas.payment_schemas import (
    CreatePaymentIntentInputDTO,
    CreatePaymentIntentOutputDTO,
)
from app.domain.entities.order import OrderStatus
from app.domain.exceptions.common import PermissionDeniedError
from app.domain.exceptions.order import OrderNotFoundError
from app.domain.exceptions.payment import (
    OrderNotPendingError,
    PaymentAlreadyProcessedError,
    WebhookSignatureError,
)
from app.domain.repositories.address_repository import IAddressRepository
from app.domain.repositories.order_repository import IOrderRepository
from app.domain.repositories.user_repository import IUserRepository

logger = logging.getLogger(__name__)


class PaymentUsecase:
    """決済ユースケース"""

    def __init__(
        self,
        stripe_service: IStripeService,
        order_repository: IOrderRepository,
        user_repository: IUserRepository,
        email_service: IEmailService,
        address_repository: IAddressRepository,
    ):
        self.stripe_service = stripe_service
        self.order_repository = order_repository
        self.user_repository = user_repository
        self.email_service = email_service
        self.address_repository = address_repository

    def create_payment_intent(
        self, user_id: int, input_dto: CreatePaymentIntentInputDTO
    ) -> CreatePaymentIntentOutputDTO:
        """PaymentIntentを作成

        1. 注文の存在確認・権限確認
        2. 注文ステータス確認
        3. Stripe PaymentIntentを作成
        4. 注文にPaymentIntent IDを紐付け

        Args:
            user_id: ユーザーID
            input_dto: 入力DTO

        Returns:
            CreatePaymentIntentOutputDTO

        Raises:
            OrderNotFoundError: 注文が見つからない
            PermissionDeniedError: 権限がない
            PaymentAlreadyProcessedError: 既に決済済み
            OrderNotPendingError: 支払い可能な状態でない
        """
        # 1. 注文の存在確認
        order = self.order_repository.get_by_id(input_dto.order_id)
        if order is None:
            raise OrderNotFoundError()

        # 権限確認（自分の注文か）
        if order.user_id != user_id:
            raise PermissionDeniedError('この注文の決済を行う')

        # 2. 注文ステータス確認
        if order.stripe_payment_intent_id and order.status == OrderStatus.PAID:
            raise PaymentAlreadyProcessedError()

        if order.status not in [OrderStatus.PENDING, OrderStatus.AWAITING_PAYMENT]:
            raise OrderNotPendingError()

        # ユーザー情報取得（Stripe Customer ID用）
        user = self.user_repository.get_by_id(user_id)

        # 3. Stripe PaymentIntentを作成
        # 金額はDBから取得（Frontendを信用しない）
        result = self.stripe_service.create_payment_intent(
            amount=order.total,
            currency='jpy',
            customer_id=user.stripe_customer_id if user else None,
            metadata={
                'order_id': str(order.id),
                'order_number': order.order_number,
                'user_id': str(user_id),
            },
        )

        # 4. 注文にPaymentIntent IDを紐付け
        order.stripe_payment_intent_id = result.payment_intent_id
        order.status = OrderStatus.AWAITING_PAYMENT
        self.order_repository.update(order)

        logger.info(
            f'PaymentIntent created: {result.payment_intent_id} '
            f'for order {order.order_number}'
        )

        return CreatePaymentIntentOutputDTO(
            client_secret=result.client_secret,
            payment_intent_id=result.payment_intent_id,
            amount=result.amount,
        )

    def handle_webhook(self, payload: bytes, sig_header: str) -> None:
        """Webhookを処理

        Args:
            payload: リクエストボディ
            sig_header: Stripe-Signatureヘッダー

        Raises:
            WebhookSignatureError: 署名検証失敗
        """
        try:
            event = self.stripe_service.construct_webhook_event(payload, sig_header)
        except Exception as e:
            logger.error(f'Webhook signature verification failed: {e}')
            raise WebhookSignatureError() from e

        event_type = event.get('type')
        data = event.get('data', {}).get('object', {})

        logger.info(f'Received webhook event: {event_type}')

        if event_type == 'payment_intent.succeeded':
            self._handle_payment_succeeded(data)
        elif event_type == 'payment_intent.payment_failed':
            self._handle_payment_failed(data)
        elif event_type == 'charge.refunded':
            self._handle_refund(data)
        else:
            logger.info(f'Unhandled event type: {event_type}')

    def _handle_payment_succeeded(self, payment_intent: dict) -> None:
        """決済成功を処理

        Args:
            payment_intent: PaymentIntentオブジェクト
        """
        payment_intent_id = payment_intent.get('id')
        metadata = payment_intent.get('metadata', {})
        order_id = metadata.get('order_id')

        if not order_id:
            logger.warning(
                f'No order_id in metadata for PaymentIntent {payment_intent_id}'
            )
            return

        order = self.order_repository.get_by_id(int(order_id))
        if order is None:
            logger.error(f'Order not found: {order_id}')
            return

        # 既に処理済みの場合はスキップ
        if order.status == OrderStatus.PAID:
            logger.info(f'Order {order.order_number} already paid, skipping')
            return

        # ステータスを更新
        order.status = OrderStatus.PAID
        order.paid_at = datetime.now()
        self.order_repository.update(order)

        logger.info(f'Order {order.order_number} marked as paid')

        # 注文確認メールを送信
        self._send_order_confirmation_email(order)

    def _send_order_confirmation_email(self, order) -> None:
        """注文確認メールを送信

        Args:
            order: 注文エンティティ
        """
        try:
            # ユーザー情報を取得
            user = self.user_repository.get_by_id(order.user_id)
            if user is None:
                logger.error(f'User not found for order {order.order_number}')
                return

            # 配送先住所を取得
            shipping_address_str = ''
            if order.shipping_address_id:
                address = self.address_repository.get_by_id(order.shipping_address_id)
                if address:
                    shipping_address_str = (
                        f'〒{address.postal_code}\n'
                        f'{address.prefecture}{address.city}{address.address1}\n'
                        f'{address.address2 or ""}\n'
                        f'{address.name}'
                    ).strip()

            # 注文商品リストを作成
            items = [
                {
                    'name': item.product_name_ja or item.product_name,
                    'quantity': item.quantity,
                    'price': item.subtotal,
                }
                for item in order.items
            ]

            # メール送信データを作成
            order_data = OrderConfirmationData(
                order_number=order.order_number,
                order_date=order.created_at.strftime('%Y年%m月%d日'),
                total=order.total,
                items=items,
                shipping_address=shipping_address_str,
                user_name=user.name or '',
            )

            # メール送信
            self.email_service.send_order_confirmation_email(user.email, order_data)

        except Exception as e:
            # メール送信失敗は注文処理に影響させない
            logger.error(
                f'Failed to send order confirmation email for {order.order_number}: {e}'
            )

    def _handle_payment_failed(self, payment_intent: dict) -> None:
        """決済失敗を処理

        Args:
            payment_intent: PaymentIntentオブジェクト
        """
        payment_intent_id = payment_intent.get('id')
        metadata = payment_intent.get('metadata', {})
        order_id = metadata.get('order_id')
        last_error = payment_intent.get('last_payment_error', {})

        logger.warning(
            f'Payment failed for PaymentIntent {payment_intent_id}: '
            f'order_id={order_id}, error={last_error.get("message")}'
        )

    def _handle_refund(self, charge: dict) -> None:
        """返金を処理

        Args:
            charge: Chargeオブジェクト
        """
        payment_intent_id = charge.get('payment_intent')

        logger.info(f'Refund processed for PaymentIntent {payment_intent_id}')
