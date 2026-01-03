from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class TokenType(str, Enum):
    """トークン種別"""

    EMAIL_VERIFICATION = 'email_verification'
    PASSWORD_RESET = 'password_reset'


class VerificationToken(BaseModel):
    """認証トークンエンティティ"""

    id: int | None = Field(None, description='トークンID')
    user_id: int = Field(..., description='ユーザーID')
    token: str = Field(..., description='トークン文字列')
    token_type: TokenType = Field(..., description='トークン種別')
    expires_at: datetime = Field(..., description='有効期限')
    used_at: datetime | None = Field(None, description='使用日時')
    created_at: datetime | None = Field(None, description='作成日時')

    class Config:
        from_attributes = True

    @property
    def is_expired(self) -> bool:
        """有効期限切れかどうか"""
        return datetime.utcnow() > self.expires_at

    @property
    def is_used(self) -> bool:
        """使用済みかどうか"""
        return self.used_at is not None

    @property
    def is_valid(self) -> bool:
        """有効なトークンかどうか"""
        return not self.is_expired and not self.is_used
