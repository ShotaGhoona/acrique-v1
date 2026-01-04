"""Admin注文管理DTOスキーマ"""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field

from app.domain.entities.order import OrderStatus, PaymentMethod


# ========== 共通DTO ==========


class AdminOrderItemDTO(BaseModel):
    """注文明細DTO"""

    id: int
    product_id: str
    product_name: str
    product_name_ja: str | None
    quantity: int
    unit_price: int
    options: dict[str, Any] | None
    subtotal: int


class AdminOrderDTO(BaseModel):
    """注文DTO（一覧用）"""

    id: int
    user_id: int
    order_number: str
    status: OrderStatus
    subtotal: int
    shipping_fee: int
    tax: int
    total: int
    payment_method: PaymentMethod | None
    paid_at: datetime | None
    shipped_at: datetime | None
    tracking_number: str | None
    delivered_at: datetime | None
    cancelled_at: datetime | None
    notes: str | None
    created_at: datetime


class AdminOrderDetailDTO(AdminOrderDTO):
    """注文詳細DTO"""

    shipping_address_id: int | None
    stripe_payment_intent_id: str | None
    confirmed_at: datetime | None
    cancel_reason: str | None
    admin_notes: str | None
    updated_at: datetime | None
    items: list[AdminOrderItemDTO]


# ========== 注文一覧 ==========


class GetAdminOrdersInputDTO(BaseModel):
    """注文一覧取得入力DTO"""

    search: str | None = None
    status: list[OrderStatus] | None = None
    date_from: datetime | None = None
    date_to: datetime | None = None
    limit: int = Field(default=20, ge=1, le=100)
    offset: int = Field(default=0, ge=0)


class GetAdminOrdersOutputDTO(BaseModel):
    """注文一覧取得出力DTO"""

    orders: list[AdminOrderDTO]
    total: int
    limit: int
    offset: int


# ========== 注文詳細 ==========


class GetAdminOrderOutputDTO(BaseModel):
    """注文詳細取得出力DTO"""

    order: AdminOrderDetailDTO


# ========== 注文更新 ==========


class UpdateAdminOrderInputDTO(BaseModel):
    """注文更新入力DTO"""

    admin_notes: str | None = None
    shipping_address_id: int | None = None


class UpdateAdminOrderOutputDTO(BaseModel):
    """注文更新出力DTO"""

    order: AdminOrderDetailDTO
    message: str


# ========== ステータス更新 ==========


class UpdateOrderStatusInputDTO(BaseModel):
    """ステータス更新入力DTO"""

    status: OrderStatus
    note: str | None = None


class UpdateOrderStatusOutputDTO(BaseModel):
    """ステータス更新出力DTO"""

    order: AdminOrderDetailDTO
    message: str


# ========== 発送処理 ==========


class ShipOrderInputDTO(BaseModel):
    """発送処理入力DTO"""

    tracking_number: str
    carrier: str | None = None


class ShipOrderOutputDTO(BaseModel):
    """発送処理出力DTO"""

    order: AdminOrderDetailDTO
    message: str
