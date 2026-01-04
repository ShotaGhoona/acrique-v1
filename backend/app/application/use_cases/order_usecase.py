"""注文ユースケース"""

from datetime import datetime

from fastapi import HTTPException, status

from app.application.schemas.order_schemas import (
    CancelOrderInputDTO,
    CancelOrderOutputDTO,
    CreateOrderInputDTO,
    CreateOrderOutputDTO,
    GetOrderOutputDTO,
    GetOrdersInputDTO,
    GetOrdersOutputDTO,
    OrderDetailDTO,
    OrderDTO,
    OrderItemDTO,
)
from app.domain.entities.order import Order, OrderItem, OrderStatus
from app.domain.repositories.address_repository import IAddressRepository
from app.domain.repositories.cart_item_repository import ICartItemRepository
from app.domain.repositories.order_repository import IOrderRepository
from app.domain.repositories.product_repository import IProductRepository


# 消費税率
TAX_RATE = 0.10


class OrderUsecase:
    """注文管理ユースケース"""

    def __init__(
        self,
        order_repository: IOrderRepository,
        product_repository: IProductRepository,
        cart_item_repository: ICartItemRepository,
        address_repository: IAddressRepository,
    ):
        self.order_repository = order_repository
        self.product_repository = product_repository
        self.cart_item_repository = cart_item_repository
        self.address_repository = address_repository

    def get_orders(
        self, user_id: int, input_dto: GetOrdersInputDTO
    ) -> GetOrdersOutputDTO:
        """注文一覧を取得"""
        orders = self.order_repository.get_by_user_id(
            user_id=user_id,
            status=input_dto.status,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )

        total = self.order_repository.count_by_user_id(
            user_id=user_id,
            status=input_dto.status,
        )

        return GetOrdersOutputDTO(
            orders=[self._to_order_dto(order) for order in orders],
            total=total,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )

    def get_order(self, user_id: int, order_id: int) -> GetOrderOutputDTO:
        """注文詳細を取得"""
        order = self.order_repository.get_by_id(order_id)

        if order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='注文が見つかりません',
            )

        # 他人の注文へのアクセスを防止
        if order.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='この注文を閲覧する権限がありません',
            )

        return GetOrderOutputDTO(order=self._to_order_detail_dto(order))

    def create_order(
        self, user_id: int, input_dto: CreateOrderInputDTO
    ) -> CreateOrderOutputDTO:
        """注文を作成"""
        # 配送先の確認
        address = self.address_repository.get_by_id(input_dto.shipping_address_id)
        if address is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='配送先が見つかりません',
            )

        # 他人の配送先へのアクセスを防止
        if address.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='この配送先を使用する権限がありません',
            )

        # 注文明細の作成
        order_items: list[OrderItem] = []

        if input_dto.items:
            # 明細が指定されている場合
            for item_input in input_dto.items:
                product = self.product_repository.get_by_id(item_input.product_id)
                if product is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f'商品が見つかりません: {item_input.product_id}',
                    )

                if not product.is_active:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f'この商品は現在購入できません: {product.name_ja}',
                    )

                # 単価計算（オプション価格差分を含む）
                unit_price = product.base_price
                if item_input.options:
                    for option_value in item_input.options.values():
                        if (
                            isinstance(option_value, dict)
                            and 'price_diff' in option_value
                        ):
                            unit_price += option_value.get('price_diff', 0)

                order_items.append(
                    OrderItem(
                        product_id=item_input.product_id,
                        product_name=product.name,
                        product_name_ja=product.name_ja,
                        quantity=item_input.quantity,
                        unit_price=unit_price,
                        options=item_input.options,
                        subtotal=unit_price * item_input.quantity,
                    )
                )
        else:
            # カートから注文を作成
            cart_items = self.cart_item_repository.get_by_user_id(user_id)

            if not cart_items:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail='カートが空です',
                )

            for cart_item in cart_items:
                product = self.product_repository.get_by_id(cart_item.product_id)
                if product is None:
                    # 商品が削除されている場合はスキップ
                    self.cart_item_repository.delete(cart_item.id)
                    continue

                if not product.is_active:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f'この商品は現在購入できません: {product.name_ja}',
                    )

                # 単価計算
                unit_price = product.base_price
                if cart_item.options:
                    for option_value in cart_item.options.values():
                        if (
                            isinstance(option_value, dict)
                            and 'price_diff' in option_value
                        ):
                            unit_price += option_value.get('price_diff', 0)

                order_items.append(
                    OrderItem(
                        product_id=cart_item.product_id,
                        product_name=product.name,
                        product_name_ja=product.name_ja,
                        quantity=cart_item.quantity,
                        unit_price=unit_price,
                        options=cart_item.options,
                        subtotal=unit_price * cart_item.quantity,
                    )
                )

            if not order_items:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail='購入可能な商品がありません',
                )

        # 合計金額の計算
        subtotal = sum(item.subtotal for item in order_items)
        shipping_fee = 0  # 送料は後から設定可能
        tax = int(subtotal * TAX_RATE)
        total = subtotal + tax + shipping_fee

        # 注文番号の生成
        order_number = self.order_repository.generate_order_number()

        # 注文の作成
        order = Order(
            user_id=user_id,
            order_number=order_number,
            status=OrderStatus.PENDING,
            shipping_address_id=input_dto.shipping_address_id,
            subtotal=subtotal,
            shipping_fee=shipping_fee,
            tax=tax,
            total=total,
            payment_method=input_dto.payment_method,
            notes=input_dto.notes,
            items=order_items,
        )

        created_order = self.order_repository.create(order)

        # カートから作成した場合はカートを空にする
        if not input_dto.items:
            self.cart_item_repository.delete_all_by_user_id(user_id)

        return CreateOrderOutputDTO(
            order=self._to_order_detail_dto(created_order),
            message='注文を作成しました',
        )

    def cancel_order(
        self, user_id: int, order_id: int, input_dto: CancelOrderInputDTO
    ) -> CancelOrderOutputDTO:
        """注文をキャンセル"""
        order = self.order_repository.get_by_id(order_id)

        if order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='注文が見つかりません',
            )

        # 他人の注文へのアクセスを防止
        if order.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='この注文をキャンセルする権限がありません',
            )

        # キャンセル可能かチェック
        if not order.can_cancel():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='この注文はキャンセルできません',
            )

        # キャンセル処理
        order.status = OrderStatus.CANCELLED
        order.cancelled_at = datetime.now()
        order.cancel_reason = input_dto.cancel_reason

        updated_order = self.order_repository.update(order)

        return CancelOrderOutputDTO(
            order=self._to_order_dto(updated_order),
            message='注文をキャンセルしました',
        )

    def _to_order_dto(self, order: Order) -> OrderDTO:
        """OrderエンティティをOrderDTOに変換"""
        return OrderDTO(
            id=order.id,
            order_number=order.order_number,
            status=order.status,
            subtotal=order.subtotal,
            shipping_fee=order.shipping_fee,
            tax=order.tax,
            total=order.total,
            payment_method=order.payment_method,
            paid_at=order.paid_at,
            shipped_at=order.shipped_at,
            tracking_number=order.tracking_number,
            delivered_at=order.delivered_at,
            cancelled_at=order.cancelled_at,
            notes=order.notes,
            created_at=order.created_at,
        )

    def _to_order_detail_dto(self, order: Order) -> OrderDetailDTO:
        """OrderエンティティをOrderDetailDTOに変換"""
        return OrderDetailDTO(
            id=order.id,
            order_number=order.order_number,
            status=order.status,
            shipping_address_id=order.shipping_address_id,
            subtotal=order.subtotal,
            shipping_fee=order.shipping_fee,
            tax=order.tax,
            total=order.total,
            payment_method=order.payment_method,
            paid_at=order.paid_at,
            shipped_at=order.shipped_at,
            tracking_number=order.tracking_number,
            delivered_at=order.delivered_at,
            cancelled_at=order.cancelled_at,
            cancel_reason=order.cancel_reason,
            notes=order.notes,
            created_at=order.created_at,
            items=[
                OrderItemDTO(
                    id=item.id,
                    product_id=item.product_id,
                    product_name=item.product_name,
                    product_name_ja=item.product_name_ja,
                    quantity=item.quantity,
                    unit_price=item.unit_price,
                    options=item.options,
                    subtotal=item.subtotal,
                )
                for item in order.items
            ],
        )
