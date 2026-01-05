"""管理者認証DTOスキーマ"""

from pydantic import BaseModel, EmailStr, Field

from app.domain.entities.admin import AdminRole


# === ログイン ===
class AdminLoginInputDTO(BaseModel):
    """管理者ログイン入力DTO"""

    email: EmailStr = Field(..., description='メールアドレス')
    password: str = Field(..., description='パスワード')


class AdminLoginOutputDTO(BaseModel):
    """管理者ログイン出力DTO"""

    access_token: str = Field(..., description='アクセストークン')
    admin_id: int = Field(..., description='管理者ID')
    name: str = Field(..., description='名前')
    role: AdminRole = Field(..., description='権限')


# === ログアウト ===
class AdminLogoutOutputDTO(BaseModel):
    """管理者ログアウト出力DTO"""

    message: str = Field(..., description='メッセージ')


# === 認証状態 ===
class AdminStatusOutputDTO(BaseModel):
    """管理者認証状態出力DTO"""

    is_authenticated: bool = Field(..., description='認証状態')
    admin_id: int = Field(..., description='管理者ID')
    email: str = Field(..., description='メールアドレス')
    name: str = Field(..., description='名前')
    role: AdminRole = Field(..., description='権限')
