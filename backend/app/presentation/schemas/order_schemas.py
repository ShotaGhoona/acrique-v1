"""注文リクエスト/レスポンススキーマ"""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field

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


# === 注文詳細レスポンス ===
class OrderDetailResponse(OrderResponse):
    """注文詳細レスポンス"""

    shipping_address_id: int | None = Field(None, description='配送先ID')
    cancel_reason: str | None = Field(None, description='キャンセル理由')
    items: list[OrderItemResponse] = Field(..., description='注文明細')


# === 注文一覧取得 ===
class GetOrdersResponse(BaseModel):
    """注文一覧取得レスポンス"""

    orders: list[OrderResponse] = Field(..., description='注文一覧')
    total: int = Field(..., description='総件数')
    limit: int = Field(..., description='取得件数')
    offset: int = Field(..., description='オフセット')


# === 注文詳細取得 ===
class GetOrderResponse(BaseModel):
    """注文詳細取得レスポンス"""

    order: OrderDetailResponse = Field(..., description='注文詳細')


# === 注文作成 ===
class CreateOrderItemRequest(BaseModel):
    """注文明細作成リクエスト"""

    product_id: str = Field(..., description='商品ID')
    quantity: int = Field(..., ge=1, description='数量')
    options: dict[str, Any] | None = Field(None, description='選択オプション')


class CreateOrderRequest(BaseModel):
    """注文作成リクエスト"""

    shipping_address_id: int = Field(..., description='配送先ID')
    payment_method: PaymentMethod = Field(..., description='決済方法')
    notes: str | None = Field(None, max_length=1000, description='顧客備考')
    items: list[CreateOrderItemRequest] | None = Field(
        None,
        description='注文明細（指定しない場合はカートから作成）',
    )


class CreateOrderResponse(BaseModel):
    """注文作成レスポンス"""

    order: OrderDetailResponse = Field(..., description='作成された注文')
    message: str = Field(..., description='メッセージ')


# === 注文キャンセル ===
class CancelOrderRequest(BaseModel):
    """注文キャンセルリクエスト"""

    cancel_reason: str | None = Field(None, max_length=500, description='キャンセル理由')


class CancelOrderResponse(BaseModel):
    """注文キャンセルレスポンス"""

    order: OrderResponse = Field(..., description='キャンセルされた注文')
    message: str = Field(..., description='メッセージ')
