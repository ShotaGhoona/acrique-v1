"""顧客管理リクエスト/レスポンススキーマ"""

from datetime import datetime

from pydantic import BaseModel, Field

from app.application.schemas.admin.admin_user_schemas import (
    CustomerDetailDTO,
    CustomerDTO,
    GetCustomerOutputDTO,
    GetCustomersOutputDTO,
)
from app.application.schemas.checkout.order_schemas import GetOrdersOutputDTO, OrderDTO
from app.domain.entities.order import OrderStatus, PaymentMethod


# === 顧客レスポンス ===
class CustomerResponse(BaseModel):
    """顧客レスポンス"""

    id: int = Field(..., description='ユーザーID')
    email: str = Field(..., description='メールアドレス')
    name: str | None = Field(None, description='氏名')
    name_kana: str | None = Field(None, description='フリガナ')
    phone: str | None = Field(None, description='電話番号')
    company: str | None = Field(None, description='会社名')
    is_email_verified: bool = Field(..., description='メール認証済み')
    created_at: datetime | None = Field(None, description='登録日時')
    updated_at: datetime | None = Field(None, description='更新日時')

    @classmethod
    def from_dto(cls, dto: CustomerDTO) -> 'CustomerResponse':
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


class CustomerDetailResponse(CustomerResponse):
    """顧客詳細レスポンス"""

    stripe_customer_id: str | None = Field(None, description='Stripe顧客ID')
    order_count: int = Field(..., description='注文数')
    total_spent: int = Field(..., description='累計購入金額')

    @classmethod
    def from_dto(cls, dto: CustomerDetailDTO) -> 'CustomerDetailResponse':
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === 顧客一覧レスポンス ===
class GetCustomersResponse(BaseModel):
    """顧客一覧取得レスポンス"""

    customers: list[CustomerResponse] = Field(..., description='顧客一覧')
    total: int = Field(..., description='総件数')
    limit: int = Field(..., description='取得件数')
    offset: int = Field(..., description='オフセット')

    @classmethod
    def from_dto(cls, dto: GetCustomersOutputDTO) -> 'GetCustomersResponse':
        """DTO → Response 変換"""
        return cls(
            customers=[CustomerResponse.from_dto(c) for c in dto.customers],
            total=dto.total,
            limit=dto.limit,
            offset=dto.offset,
        )


# === 顧客詳細レスポンス ===
class GetCustomerResponse(BaseModel):
    """顧客詳細取得レスポンス"""

    customer: CustomerDetailResponse = Field(..., description='顧客詳細')

    @classmethod
    def from_dto(cls, dto: GetCustomerOutputDTO) -> 'GetCustomerResponse':
        """DTO → Response 変換"""
        return cls(customer=CustomerDetailResponse.from_dto(dto.customer))


# === 注文レスポンス（顧客注文履歴用） ===
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
    def from_dto(cls, dto: OrderDTO) -> 'OrderResponse':
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === 顧客注文履歴レスポンス ===
class GetCustomerOrdersResponse(BaseModel):
    """顧客注文履歴取得レスポンス"""

    orders: list[OrderResponse] = Field(..., description='注文一覧')
    total: int = Field(..., description='総件数')
    limit: int = Field(..., description='取得件数')
    offset: int = Field(..., description='オフセット')

    @classmethod
    def from_dto(cls, dto: GetOrdersOutputDTO) -> 'GetCustomerOrdersResponse':
        """DTO → Response 変換"""
        return cls(
            orders=[OrderResponse.from_dto(o) for o in dto.orders],
            total=dto.total,
            limit=dto.limit,
            offset=dto.offset,
        )
