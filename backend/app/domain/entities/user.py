from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class User(BaseModel):
    """ユーザーエンティティ"""

    id: int | None = Field(None, description='ユーザーID')
    email: EmailStr = Field(..., description='メールアドレス')
    password_hash: str = Field(..., description='ハッシュ化されたパスワード')
    name: str | None = Field(None, description='氏名')
    name_kana: str | None = Field(None, description='フリガナ')
    phone: str | None = Field(None, description='電話番号')
    company: str | None = Field(None, description='会社名')
    stripe_customer_id: str | None = Field(None, description='Stripe顧客ID')
    email_verified_at: datetime | None = Field(None, description='メール認証日時')
    created_at: datetime | None = Field(None, description='作成日時')
    updated_at: datetime | None = Field(None, description='更新日時')

    class Config:
        """Pydantic設定"""

        from_attributes = True

    @property
    def is_email_verified(self) -> bool:
        """メール認証済みかどうか"""
        return self.email_verified_at is not None
