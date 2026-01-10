"""Stripeサービス実装"""

import stripe

from app.application.interfaces.stripe_service import (
    IStripeService,
    PaymentIntentResult,
)
from app.config import get_settings
from app.domain.exceptions.payment import PaymentIntentCreationError


class StripeServiceImpl(IStripeService):
    """Stripe操作を行うサービス実装"""

    def __init__(self):
        settings = get_settings()
        stripe.api_key = settings.stripe_secret_key
        self.webhook_secret = settings.stripe_webhook_secret

    def create_payment_intent(
        self,
        amount: int,
        currency: str = 'jpy',
        customer_id: str | None = None,
        metadata: dict | None = None,
    ) -> PaymentIntentResult:
        """PaymentIntentを作成

        Args:
            amount: 金額（日本円の場合は整数）
            currency: 通貨コード
            customer_id: Stripe顧客ID
            metadata: メタデータ（注文IDなど）

        Returns:
            PaymentIntentResult
        """
        try:
            params: dict = {
                'amount': amount,
                'currency': currency,
                'automatic_payment_methods': {'enabled': True},
            }

            if customer_id:
                params['customer'] = customer_id

            if metadata:
                params['metadata'] = metadata

            payment_intent = stripe.PaymentIntent.create(**params)

            return PaymentIntentResult(
                payment_intent_id=payment_intent.id,
                client_secret=payment_intent.client_secret,
                amount=payment_intent.amount,
                status=payment_intent.status,
            )

        except stripe.error.StripeError as e:
            raise PaymentIntentCreationError(str(e))

    def retrieve_payment_intent(
        self,
        payment_intent_id: str,
    ) -> PaymentIntentResult:
        """PaymentIntentを取得

        Args:
            payment_intent_id: PaymentIntent ID

        Returns:
            PaymentIntentResult
        """
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        return PaymentIntentResult(
            payment_intent_id=payment_intent.id,
            client_secret=payment_intent.client_secret,
            amount=payment_intent.amount,
            status=payment_intent.status,
        )

    def create_customer(
        self,
        email: str,
        name: str | None = None,
        metadata: dict | None = None,
    ) -> str:
        """Stripe顧客を作成してIDを返す

        Args:
            email: メールアドレス
            name: 顧客名
            metadata: メタデータ

        Returns:
            Stripe顧客ID
        """
        params: dict = {'email': email}

        if name:
            params['name'] = name

        if metadata:
            params['metadata'] = metadata

        customer = stripe.Customer.create(**params)
        return customer.id

    def construct_webhook_event(
        self,
        payload: bytes,
        sig_header: str,
    ) -> dict:
        """Webhookイベントを構築・検証

        Args:
            payload: リクエストボディ
            sig_header: Stripe-Signatureヘッダー

        Returns:
            Stripeイベントオブジェクト（辞書形式）

        Raises:
            stripe.error.SignatureVerificationError: 署名検証失敗
        """
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            self.webhook_secret,
        )
        # Event objectを辞書に変換
        return {
            'type': event.type,
            'data': {
                'object': dict(event.data.object),
            },
        }
