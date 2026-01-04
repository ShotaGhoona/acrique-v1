"""Admin注文管理リクエスト/レスポンススキーマ"""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field

from app.application.schemas.admin_order_schemas import (
    AdminOrderDetailDTO,
    AdminOrderDTO,
    AdminOrderItemDTO,
    GetAdminOrdersInputDTO,
    ShipOrderInputDTO,
    UpdateAdminOrderInputDTO,
    UpdateOrderStatusInputDTO,
)
from app.domain.entities.order import OrderStatus, PaymentMethod


# ========== Response Models ==========


class AdminOrderItemResponse(BaseModel):
    """注文明細レスポンス"""

    id: int
    product_id: str
    product_name: str
    product_name_ja: str | None
    quantity: int
    unit_price: int
    options: dict[str, Any] | None
    subtotal: int

    @classmethod
    def from_dto(cls, dto: AdminOrderItemDTO) -> 'AdminOrderItemResponse':
        return cls(
            id=dto.id,
            product_id=dto.product_id,
            product_name=dto.product_name,
            product_name_ja=dto.product_name_ja,
            quantity=dto.quantity,
            unit_price=dto.unit_price,
            options=dto.options,
            subtotal=dto.subtotal,
        )


class AdminOrderResponse(BaseModel):
    """注文レスポンス（一覧用）"""

    id: int
    user_id: int
    order_number: str
    status: str
    subtotal: int
    shipping_fee: int
    tax: int
    total: int
    payment_method: str | None
    paid_at: datetime | None
    shipped_at: datetime | None
    tracking_number: str | None
    delivered_at: datetime | None
    cancelled_at: datetime | None
    notes: str | None
    created_at: datetime

    @classmethod
    def from_dto(cls, dto: AdminOrderDTO) -> 'AdminOrderResponse':
        return cls(
            id=dto.id,
            user_id=dto.user_id,
            order_number=dto.order_number,
            status=dto.status.value,
            subtotal=dto.subtotal,
            shipping_fee=dto.shipping_fee,
            tax=dto.tax,
            total=dto.total,
            payment_method=dto.payment_method.value if dto.payment_method else None,
            paid_at=dto.paid_at,
            shipped_at=dto.shipped_at,
            tracking_number=dto.tracking_number,
            delivered_at=dto.delivered_at,
            cancelled_at=dto.cancelled_at,
            notes=dto.notes,
            created_at=dto.created_at,
        )


class AdminOrderDetailResponse(AdminOrderResponse):
    """注文詳細レスポンス"""

    shipping_address_id: int | None
    stripe_payment_intent_id: str | None
    confirmed_at: datetime | None
    cancel_reason: str | None
    admin_notes: str | None
    updated_at: datetime | None
    items: list[AdminOrderItemResponse]

    @classmethod
    def from_dto(cls, dto: AdminOrderDetailDTO) -> 'AdminOrderDetailResponse':
        return cls(
            id=dto.id,
            user_id=dto.user_id,
            order_number=dto.order_number,
            status=dto.status.value,
            shipping_address_id=dto.shipping_address_id,
            subtotal=dto.subtotal,
            shipping_fee=dto.shipping_fee,
            tax=dto.tax,
            total=dto.total,
            payment_method=dto.payment_method.value if dto.payment_method else None,
            stripe_payment_intent_id=dto.stripe_payment_intent_id,
            paid_at=dto.paid_at,
            confirmed_at=dto.confirmed_at,
            shipped_at=dto.shipped_at,
            tracking_number=dto.tracking_number,
            delivered_at=dto.delivered_at,
            cancelled_at=dto.cancelled_at,
            cancel_reason=dto.cancel_reason,
            notes=dto.notes,
            admin_notes=dto.admin_notes,
            created_at=dto.created_at,
            updated_at=dto.updated_at,
            items=[AdminOrderItemResponse.from_dto(item) for item in dto.items],
        )


class GetAdminOrdersResponse(BaseModel):
    """注文一覧レスポンス"""

    orders: list[AdminOrderResponse]
    total: int
    limit: int
    offset: int


class GetAdminOrderResponse(BaseModel):
    """注文詳細レスポンス"""

    order: AdminOrderDetailResponse


class UpdateAdminOrderResponse(BaseModel):
    """注文更新レスポンス"""

    order: AdminOrderDetailResponse
    message: str


class UpdateOrderStatusResponse(BaseModel):
    """ステータス更新レスポンス"""

    order: AdminOrderDetailResponse
    message: str


class ShipOrderResponse(BaseModel):
    """発送処理レスポンス"""

    order: AdminOrderDetailResponse
    message: str


# ========== Request Models ==========


class UpdateAdminOrderRequest(BaseModel):
    """注文更新リクエスト"""

    admin_notes: str | None = Field(None, max_length=2000)
    shipping_address_id: int | None = None

    def to_dto(self) -> UpdateAdminOrderInputDTO:
        return UpdateAdminOrderInputDTO(
            admin_notes=self.admin_notes,
            shipping_address_id=self.shipping_address_id,
        )


class UpdateOrderStatusRequest(BaseModel):
    """ステータス更新リクエスト"""

    status: str
    note: str | None = Field(None, max_length=500)

    def to_dto(self) -> UpdateOrderStatusInputDTO:
        return UpdateOrderStatusInputDTO(
            status=OrderStatus(self.status),
            note=self.note,
        )


class ShipOrderRequest(BaseModel):
    """発送処理リクエスト"""

    tracking_number: str = Field(..., min_length=1, max_length=100)
    carrier: str | None = Field(None, max_length=50)

    def to_dto(self) -> ShipOrderInputDTO:
        return ShipOrderInputDTO(
            tracking_number=self.tracking_number,
            carrier=self.carrier,
        )
