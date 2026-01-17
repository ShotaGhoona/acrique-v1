"""管理者認証リクエスト/レスポンススキーマ"""

from pydantic import BaseModel, EmailStr, Field

from app.application.schemas.admin.admin_auth_schemas import (
    AdminLoginInputDTO,
    AdminLoginOutputDTO,
    AdminLogoutOutputDTO,
    AdminStatusOutputDTO,
)
from app.domain.entities.admin import AdminRole


# === ログイン ===
class AdminLoginRequest(BaseModel):
    """管理者ログインリクエスト"""

    email: EmailStr = Field(..., description='メールアドレス')
    password: str = Field(..., description='パスワード')

    def to_dto(self) -> AdminLoginInputDTO:
        """Request → DTO 変換"""
        return AdminLoginInputDTO(**self.model_dump())


class AdminLoginResponse(BaseModel):
    """管理者ログインレスポンス"""

    admin_id: int = Field(..., description='管理者ID')
    name: str = Field(..., description='名前')
    role: AdminRole = Field(..., description='権限')
    message: str = Field(default='ログインしました', description='メッセージ')

    @classmethod
    def from_dto(cls, dto: AdminLoginOutputDTO) -> 'AdminLoginResponse':
        """DTO → Response 変換"""
        return cls(
            admin_id=dto.admin_id,
            name=dto.name,
            role=dto.role,
        )


# === ログアウト ===
class AdminLogoutResponse(BaseModel):
    """管理者ログアウトレスポンス"""

    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: AdminLogoutOutputDTO) -> 'AdminLogoutResponse':
        """DTO → Response 変換"""
        return cls(message=dto.message)


# === 認証状態 ===
class AdminStatusResponse(BaseModel):
    """管理者認証状態レスポンス"""

    is_authenticated: bool = Field(..., description='認証状態')
    admin_id: int = Field(..., description='管理者ID')
    email: str = Field(..., description='メールアドレス')
    name: str = Field(..., description='名前')
    role: AdminRole = Field(..., description='権限')

    @classmethod
    def from_dto(cls, dto: AdminStatusOutputDTO) -> 'AdminStatusResponse':
        """DTO → Response 変換"""
        return cls(**dto.model_dump())
