"""顧客管理DTOスキーマ"""

from datetime import datetime

from pydantic import BaseModel, Field


# === 顧客DTO ===
class CustomerDTO(BaseModel):
    """顧客DTO"""

    id: int = Field(..., description='ユーザーID')
    email: str = Field(..., description='メールアドレス')
    name: str | None = Field(None, description='氏名')
    name_kana: str | None = Field(None, description='フリガナ')
    phone: str | None = Field(None, description='電話番号')
    company: str | None = Field(None, description='会社名')
    is_email_verified: bool = Field(..., description='メール認証済み')
    created_at: datetime | None = Field(None, description='登録日時')
    updated_at: datetime | None = Field(None, description='更新日時')


class CustomerDetailDTO(CustomerDTO):
    """顧客詳細DTO"""

    stripe_customer_id: str | None = Field(None, description='Stripe顧客ID')
    order_count: int = Field(..., description='注文数')
    total_spent: int = Field(..., description='累計購入金額')


# === 顧客一覧取得 ===
class GetCustomersInputDTO(BaseModel):
    """顧客一覧取得入力DTO"""

    search: str | None = Field(None, description='検索キーワード（email/name）')
    limit: int = Field(20, ge=1, le=100, description='取得件数')
    offset: int = Field(0, ge=0, description='オフセット')


class GetCustomersOutputDTO(BaseModel):
    """顧客一覧取得出力DTO"""

    customers: list[CustomerDTO] = Field(..., description='顧客一覧')
    total: int = Field(..., description='総件数')
    limit: int = Field(..., description='取得件数')
    offset: int = Field(..., description='オフセット')


# === 顧客詳細取得 ===
class GetCustomerOutputDTO(BaseModel):
    """顧客詳細取得出力DTO"""

    customer: CustomerDetailDTO = Field(..., description='顧客詳細')


# === 顧客注文履歴取得 ===
class GetCustomerOrdersInputDTO(BaseModel):
    """顧客注文履歴取得入力DTO"""

    limit: int = Field(20, ge=1, le=100, description='取得件数')
    offset: int = Field(0, ge=0, description='オフセット')
