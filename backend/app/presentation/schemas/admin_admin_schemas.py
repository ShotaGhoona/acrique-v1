"""管理者管理リクエスト/レスポンススキーマ"""

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.application.schemas.admin_admin_schemas import (
    AdminDTO,
    CreateAdminInputDTO,
    CreateAdminOutputDTO,
    DeleteAdminOutputDTO,
    GetAdminsOutputDTO,
    UpdateAdminInputDTO,
    UpdateAdminOutputDTO,
)
from app.domain.entities.admin import AdminRole


# === 管理者レスポンス ===
class AdminResponse(BaseModel):
    """管理者レスポンス"""

    id: int = Field(..., description='管理者ID')
    email: str = Field(..., description='メールアドレス')
    name: str = Field(..., description='名前')
    role: AdminRole = Field(..., description='権限')
    is_active: bool = Field(..., description='有効フラグ')
    last_login_at: datetime | None = Field(None, description='最終ログイン日時')
    created_at: datetime | None = Field(None, description='作成日時')

    @classmethod
    def from_dto(cls, dto: AdminDTO) -> 'AdminResponse':
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === 管理者一覧レスポンス ===
class GetAdminsResponse(BaseModel):
    """管理者一覧取得レスポンス"""

    admins: list[AdminResponse] = Field(..., description='管理者一覧')
    total: int = Field(..., description='総件数')
    limit: int = Field(..., description='取得件数')
    offset: int = Field(..., description='オフセット')

    @classmethod
    def from_dto(cls, dto: GetAdminsOutputDTO) -> 'GetAdminsResponse':
        """DTO → Response 変換"""
        return cls(
            admins=[AdminResponse.from_dto(a) for a in dto.admins],
            total=dto.total,
            limit=dto.limit,
            offset=dto.offset,
        )


# === 管理者作成 ===
class CreateAdminRequest(BaseModel):
    """管理者作成リクエスト"""

    email: EmailStr = Field(..., description='メールアドレス')
    password: str = Field(..., min_length=8, description='パスワード')
    name: str = Field(..., max_length=100, description='名前')
    role: AdminRole = Field(..., description='権限')

    def to_dto(self) -> CreateAdminInputDTO:
        """Request → DTO 変換"""
        return CreateAdminInputDTO(**self.model_dump())


class CreateAdminResponse(BaseModel):
    """管理者作成レスポンス"""

    admin: AdminResponse = Field(..., description='作成された管理者')
    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: CreateAdminOutputDTO) -> 'CreateAdminResponse':
        """DTO → Response 変換"""
        return cls(
            admin=AdminResponse.from_dto(dto.admin),
            message=dto.message,
        )


# === 管理者更新 ===
class UpdateAdminRequest(BaseModel):
    """管理者更新リクエスト"""

    email: EmailStr | None = Field(None, description='メールアドレス')
    name: str | None = Field(None, max_length=100, description='名前')
    role: AdminRole | None = Field(None, description='権限')
    is_active: bool | None = Field(None, description='有効フラグ')
    password: str | None = Field(None, min_length=8, description='パスワード')

    def to_dto(self) -> UpdateAdminInputDTO:
        """Request → DTO 変換"""
        return UpdateAdminInputDTO(**self.model_dump())


class UpdateAdminResponse(BaseModel):
    """管理者更新レスポンス"""

    admin: AdminResponse = Field(..., description='更新された管理者')
    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: UpdateAdminOutputDTO) -> 'UpdateAdminResponse':
        """DTO → Response 変換"""
        return cls(
            admin=AdminResponse.from_dto(dto.admin),
            message=dto.message,
        )


# === 管理者削除 ===
class DeleteAdminResponse(BaseModel):
    """管理者削除レスポンス"""

    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: DeleteAdminOutputDTO) -> 'DeleteAdminResponse':
        """DTO → Response 変換"""
        return cls(message=dto.message)
