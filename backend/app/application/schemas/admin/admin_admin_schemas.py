"""管理者管理DTOスキーマ"""

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.domain.entities.admin import AdminRole


# === 管理者DTO ===
class AdminDTO(BaseModel):
    """管理者DTO"""

    id: int = Field(..., description='管理者ID')
    email: str = Field(..., description='メールアドレス')
    name: str = Field(..., description='名前')
    role: AdminRole = Field(..., description='権限')
    is_active: bool = Field(..., description='有効フラグ')
    last_login_at: datetime | None = Field(None, description='最終ログイン日時')
    created_at: datetime | None = Field(None, description='作成日時')


# === 管理者一覧取得 ===
class GetAdminsInputDTO(BaseModel):
    """管理者一覧取得入力DTO"""

    role: AdminRole | None = Field(None, description='権限フィルタ')
    is_active: bool | None = Field(None, description='有効フラグフィルタ')
    limit: int = Field(20, ge=1, le=100, description='取得件数')
    offset: int = Field(0, ge=0, description='オフセット')


class GetAdminsOutputDTO(BaseModel):
    """管理者一覧取得出力DTO"""

    admins: list[AdminDTO] = Field(..., description='管理者一覧')
    total: int = Field(..., description='総件数')
    limit: int = Field(..., description='取得件数')
    offset: int = Field(..., description='オフセット')


# === 管理者作成 ===
class CreateAdminInputDTO(BaseModel):
    """管理者作成入力DTO"""

    email: EmailStr = Field(..., description='メールアドレス')
    password: str = Field(..., min_length=8, description='パスワード')
    name: str = Field(..., max_length=100, description='名前')
    role: AdminRole = Field(..., description='権限')


class CreateAdminOutputDTO(BaseModel):
    """管理者作成出力DTO"""

    admin: AdminDTO = Field(..., description='作成された管理者')
    message: str = Field(..., description='メッセージ')


# === 管理者更新 ===
class UpdateAdminInputDTO(BaseModel):
    """管理者更新入力DTO"""

    email: EmailStr | None = Field(None, description='メールアドレス')
    name: str | None = Field(None, max_length=100, description='名前')
    role: AdminRole | None = Field(None, description='権限')
    is_active: bool | None = Field(None, description='有効フラグ')
    password: str | None = Field(None, min_length=8, description='パスワード')


class UpdateAdminOutputDTO(BaseModel):
    """管理者更新出力DTO"""

    admin: AdminDTO = Field(..., description='更新された管理者')
    message: str = Field(..., description='メッセージ')


# === 管理者削除 ===
class DeleteAdminOutputDTO(BaseModel):
    """管理者削除出力DTO"""

    message: str = Field(..., description='メッセージ')
