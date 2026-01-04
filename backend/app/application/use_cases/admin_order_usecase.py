"""Admin注文管理ユースケース"""

from datetime import datetime
from typing import Any

from app.application.schemas.admin_order_schemas import (
    AdminOrderDetailDTO,
    AdminOrderDTO,
    AdminOrderItemDTO,
    GetAdminOrderOutputDTO,
    GetAdminOrdersInputDTO,
    GetAdminOrdersOutputDTO,
    ShipOrderInputDTO,
    ShipOrderOutputDTO,
    UpdateAdminOrderInputDTO,
    UpdateAdminOrderOutputDTO,
    UpdateOrderStatusInputDTO,
    UpdateOrderStatusOutputDTO,
)
from app.domain.entities.order import Order, OrderStatus
from app.domain.exceptions.order import OrderNotFoundError
from app.domain.repositories.order_repository import IOrderRepository


class AdminOrderUsecase:
    """Admin注文管理ユースケース"""

    def __init__(self, order_repository: IOrderRepository):
        self.order_repository = order_repository

    def get_orders(self, input_dto: GetAdminOrdersInputDTO) -> GetAdminOrdersOutputDTO:
        """注文一覧を取得"""
        orders = self.order_repository.get_all(
            search=input_dto.search,
            status=input_dto.status,
            date_from=input_dto.date_from,
            date_to=input_dto.date_to,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )
        total = self.order_repository.count_all(
            search=input_dto.search,
            status=input_dto.status,
            date_from=input_dto.date_from,
            date_to=input_dto.date_to,
        )

        return GetAdminOrdersOutputDTO(
            orders=[self._to_order_dto(order) for order in orders],
            total=total,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )

    def get_order(self, order_id: int) -> GetAdminOrderOutputDTO:
        """注文詳細を取得"""
        order = self.order_repository.get_by_id(order_id)
        if order is None:
            raise OrderNotFoundError()

        return GetAdminOrderOutputDTO(order=self._to_order_detail_dto(order))

    def update_order(
        self, order_id: int, input_dto: UpdateAdminOrderInputDTO
    ) -> UpdateAdminOrderOutputDTO:
        """注文を更新"""
        order = self.order_repository.get_by_id(order_id)
        if order is None:
            raise OrderNotFoundError()

        # 更新可能フィールドのみ更新
        if input_dto.admin_notes is not None:
            order.admin_notes = input_dto.admin_notes
        if input_dto.shipping_address_id is not None:
            order.shipping_address_id = input_dto.shipping_address_id

        updated_order = self.order_repository.update(order)

        return UpdateAdminOrderOutputDTO(
            order=self._to_order_detail_dto(updated_order),
            message='注文情報を更新しました',
        )

    def update_status(
        self, order_id: int, input_dto: UpdateOrderStatusInputDTO
    ) -> UpdateOrderStatusOutputDTO:
        """ステータスを更新"""
        order = self.order_repository.get_by_id(order_id)
        if order is None:
            raise OrderNotFoundError()

        # ステータス遷移のバリデーション
        self._validate_status_transition(order.status, input_dto.status)

        # ステータス更新
        order.status = input_dto.status

        # ステータスに応じたタイムスタンプ更新
        now = datetime.now()
        if input_dto.status == OrderStatus.PAID:
            order.paid_at = now
        elif input_dto.status == OrderStatus.CONFIRMED:
            order.confirmed_at = now
        elif input_dto.status == OrderStatus.SHIPPED:
            order.shipped_at = now
        elif input_dto.status == OrderStatus.DELIVERED:
            order.delivered_at = now
        elif input_dto.status == OrderStatus.CANCELLED:
            order.cancelled_at = now
            if input_dto.note:
                order.cancel_reason = input_dto.note

        updated_order = self.order_repository.update(order)

        return UpdateOrderStatusOutputDTO(
            order=self._to_order_detail_dto(updated_order),
            message=f'ステータスを「{input_dto.status.value}」に更新しました',
        )

    def ship_order(
        self, order_id: int, input_dto: ShipOrderInputDTO
    ) -> ShipOrderOutputDTO:
        """発送処理"""
        order = self.order_repository.get_by_id(order_id)
        if order is None:
            raise OrderNotFoundError()

        # 発送可能なステータスかチェック
        if order.status not in [OrderStatus.CONFIRMED, OrderStatus.PROCESSING]:
            raise ValueError('この注文は発送処理できません')

        # 発送情報を設定
        order.status = OrderStatus.SHIPPED
        order.shipped_at = datetime.now()
        order.tracking_number = input_dto.tracking_number

        updated_order = self.order_repository.update(order)

        return ShipOrderOutputDTO(
            order=self._to_order_detail_dto(updated_order),
            message='発送処理が完了しました',
        )

    def _validate_status_transition(
        self, current: OrderStatus, new: OrderStatus
    ) -> None:
        """ステータス遷移をバリデーション"""
        allowed_transitions: dict[OrderStatus, list[OrderStatus]] = {
            OrderStatus.PENDING: [OrderStatus.AWAITING_PAYMENT, OrderStatus.CANCELLED],
            OrderStatus.AWAITING_PAYMENT: [OrderStatus.PAID, OrderStatus.CANCELLED],
            OrderStatus.PAID: [
                OrderStatus.AWAITING_DATA,
                OrderStatus.CONFIRMED,
                OrderStatus.CANCELLED,
            ],
            OrderStatus.AWAITING_DATA: [OrderStatus.DATA_REVIEWING],
            OrderStatus.DATA_REVIEWING: [
                OrderStatus.CONFIRMED,
                OrderStatus.AWAITING_DATA,
            ],
            OrderStatus.CONFIRMED: [OrderStatus.PROCESSING],
            OrderStatus.PROCESSING: [OrderStatus.SHIPPED],
            OrderStatus.SHIPPED: [OrderStatus.DELIVERED],
            OrderStatus.DELIVERED: [],
            OrderStatus.CANCELLED: [],
        }

        if new not in allowed_transitions.get(current, []):
            raise ValueError(
                f'ステータスを「{current.value}」から「{new.value}」に変更することはできません'
            )

    def _to_order_dto(self, order: Order) -> AdminOrderDTO:
        """OrderエンティティをDTOに変換"""
        return AdminOrderDTO(
            id=order.id,
            user_id=order.user_id,
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

    def _to_order_detail_dto(self, order: Order) -> AdminOrderDetailDTO:
        """Orderエンティティを詳細DTOに変換"""
        return AdminOrderDetailDTO(
            id=order.id,
            user_id=order.user_id,
            order_number=order.order_number,
            status=order.status,
            shipping_address_id=order.shipping_address_id,
            subtotal=order.subtotal,
            shipping_fee=order.shipping_fee,
            tax=order.tax,
            total=order.total,
            payment_method=order.payment_method,
            stripe_payment_intent_id=order.stripe_payment_intent_id,
            paid_at=order.paid_at,
            confirmed_at=order.confirmed_at,
            shipped_at=order.shipped_at,
            tracking_number=order.tracking_number,
            delivered_at=order.delivered_at,
            cancelled_at=order.cancelled_at,
            cancel_reason=order.cancel_reason,
            notes=order.notes,
            admin_notes=order.admin_notes,
            created_at=order.created_at,
            updated_at=order.updated_at,
            items=[
                AdminOrderItemDTO(
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
