"""注文リクエスト/レスポンススキーマ"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field

from app.application.schemas.checkout.order_schemas import (
    CancelOrderInputDTO,
    CancelOrderOutputDTO,
    CreateOrderInputDTO,
    CreateOrderItemInputDTO,
    CreateOrderOutputDTO,
    GetOrderOutputDTO,
    GetOrdersOutputDTO,
    OrderDetailDTO,
    OrderDTO,
    OrderItemDTO,
)
from app.domain.entities.order import OrderStatus, PaymentMethod


# === 注文明細レスポンス共通 ===
class OrderItemResponse(BaseModel):
    """注文明細レスポンス"""

    id: int = Field(..., description='注文明細ID')
    product_id: str = Field(..., description='商品ID')
    product_name: str = Field(..., description='商品名')
    product_name_ja: str | None = Field(None, description='商品名（日本語）')
    quantity: int = Field(..., description='数量')
    unit_price: int = Field(..., description='単価')
    options: dict[str, Any] | None = Field(None, description='選択オプション')
    subtotal: int = Field(..., description='小計')
    requires_upload: bool = Field(False, description='入稿必須')
    upload_type: str | None = Field(None, description='入稿タイプ (logo/qr/photo/text)')

    @classmethod
    def from_dto(cls, dto: OrderItemDTO) -> OrderItemResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === 注文レスポンス共通 ===
class OrderResponse(BaseModel):
    """注文レスポンス"""

    id: int = Field(..., description='注文ID')
    order_number: str = Field(..., description='注文番号')
    status: OrderStatus = Field(..., description='ステータス')
    subtotal: int = Field(..., description='小計')
    shipping_fee: int = Field(..., description='送料')
    tax: int = Field(..., description='消費税')
    total: int = Field(..., description='合計')
    payment_method: PaymentMethod | None = Field(None, description='決済方法')
    paid_at: datetime | None = Field(None, description='支払日時')
    shipped_at: datetime | None = Field(None, description='発送日時')
    tracking_number: str | None = Field(None, description='追跡番号')
    delivered_at: datetime | None = Field(None, description='配達日時')
    cancelled_at: datetime | None = Field(None, description='キャンセル日時')
    notes: str | None = Field(None, description='顧客備考')
    created_at: datetime | None = Field(None, description='作成日時')

    @classmethod
    def from_dto(cls, dto: OrderDTO) -> OrderResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === 注文詳細レスポンス ===
class OrderDetailResponse(OrderResponse):
    """注文詳細レスポンス"""

    shipping_address_id: int | None = Field(None, description='配送先ID')
    cancel_reason: str | None = Field(None, description='キャンセル理由')
    items: list[OrderItemResponse] = Field(..., description='注文明細')

    @classmethod
    def from_dto(cls, dto: OrderDetailDTO) -> OrderDetailResponse:
        """DTO → Response 変換"""
        return cls(
            id=dto.id,
            order_number=dto.order_number,
            status=dto.status,
            subtotal=dto.subtotal,
            shipping_fee=dto.shipping_fee,
            tax=dto.tax,
            total=dto.total,
            payment_method=dto.payment_method,
            paid_at=dto.paid_at,
            shipped_at=dto.shipped_at,
            tracking_number=dto.tracking_number,
            delivered_at=dto.delivered_at,
            cancelled_at=dto.cancelled_at,
            notes=dto.notes,
            created_at=dto.created_at,
            shipping_address_id=dto.shipping_address_id,
            cancel_reason=dto.cancel_reason,
            items=[OrderItemResponse.from_dto(item) for item in dto.items],
        )


# === 注文一覧取得 ===
class GetOrdersResponse(BaseModel):
    """注文一覧取得レスポンス"""

    orders: list[OrderResponse] = Field(..., description='注文一覧')
    total: int = Field(..., description='総件数')
    limit: int = Field(..., description='取得件数')
    offset: int = Field(..., description='オフセット')

    @classmethod
    def from_dto(cls, dto: GetOrdersOutputDTO) -> GetOrdersResponse:
        """DTO → Response 変換"""
        return cls(
            orders=[OrderResponse.from_dto(order) for order in dto.orders],
            total=dto.total,
            limit=dto.limit,
            offset=dto.offset,
        )


# === 注文詳細取得 ===
class GetOrderResponse(BaseModel):
    """注文詳細取得レスポンス"""

    order: OrderDetailResponse = Field(..., description='注文詳細')

    @classmethod
    def from_dto(cls, dto: GetOrderOutputDTO) -> GetOrderResponse:
        """DTO → Response 変換"""
        return cls(order=OrderDetailResponse.from_dto(dto.order))


# === 注文作成 ===
class CreateOrderItemRequest(BaseModel):
    """注文明細作成リクエスト"""

    product_id: str = Field(..., description='商品ID')
    quantity: int = Field(..., ge=1, description='数量')
    options: dict[str, Any] | None = Field(None, description='選択オプション')

    def to_dto(self) -> CreateOrderItemInputDTO:
        """Request → DTO 変換"""
        return CreateOrderItemInputDTO(**self.model_dump())


class CreateOrderRequest(BaseModel):
    """注文作成リクエスト"""

    shipping_address_id: int = Field(..., description='配送先ID')
    payment_method: PaymentMethod = Field(..., description='決済方法')
    notes: str | None = Field(None, max_length=1000, description='顧客備考')
    items: list[CreateOrderItemRequest] | None = Field(
        None,
        description='注文明細（指定しない場合はカートから作成）',
    )

    def to_dto(self) -> CreateOrderInputDTO:
        """Request → DTO 変換"""
        return CreateOrderInputDTO(
            shipping_address_id=self.shipping_address_id,
            payment_method=self.payment_method,
            notes=self.notes,
            items=[item.to_dto() for item in self.items] if self.items else None,
        )


class CreateOrderResponse(BaseModel):
    """注文作成レスポンス"""

    order: OrderDetailResponse = Field(..., description='作成された注文')
    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: CreateOrderOutputDTO) -> CreateOrderResponse:
        """DTO → Response 変換"""
        return cls(
            order=OrderDetailResponse.from_dto(dto.order),
            message=dto.message,
        )


# === 注文キャンセル ===
class CancelOrderRequest(BaseModel):
    """注文キャンセルリクエスト"""

    cancel_reason: str | None = Field(None, max_length=500, description='キャンセル理由')

    def to_dto(self) -> CancelOrderInputDTO:
        """Request → DTO 変換"""
        return CancelOrderInputDTO(**self.model_dump())


class CancelOrderResponse(BaseModel):
    """注文キャンセルレスポンス"""

    order: OrderResponse = Field(..., description='キャンセルされた注文')
    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: CancelOrderOutputDTO) -> CancelOrderResponse:
        """DTO → Response 変換"""
        return cls(
            order=OrderResponse.from_dto(dto.order),
            message=dto.message,
        )
