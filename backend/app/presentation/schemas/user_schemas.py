"""ユーザーリクエスト/レスポンススキーマ"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.application.schemas.user_schemas import (
    ChangePasswordInputDTO,
    ChangePasswordOutputDTO,
    GetMeOutputDTO,
    UpdateMeInputDTO,
    UpdateMeOutputDTO,
)


# === 自分の情報取得 ===
class GetMeResponse(BaseModel):
    """自分の情報取得レスポンス"""

    id: int = Field(..., description='ユーザーID')
    email: str = Field(..., description='メールアドレス')
    name: str | None = Field(None, description='氏名')
    name_kana: str | None = Field(None, description='フリガナ')
    phone: str | None = Field(None, description='電話番号')
    company: str | None = Field(None, description='会社名')
    is_email_verified: bool = Field(..., description='メール認証済みかどうか')
    created_at: datetime | None = Field(None, description='作成日時')

    @classmethod
    def from_dto(cls, dto: GetMeOutputDTO) -> GetMeResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === 自分の情報更新 ===
class UpdateMeRequest(BaseModel):
    """自分の情報更新リクエスト"""

    name: str | None = Field(None, description='氏名')
    name_kana: str | None = Field(None, description='フリガナ')
    phone: str | None = Field(None, description='電話番号')
    company: str | None = Field(None, description='会社名')

    def to_dto(self) -> UpdateMeInputDTO:
        """Request → DTO 変換"""
        return UpdateMeInputDTO(**self.model_dump())


class UpdateMeResponse(BaseModel):
    """自分の情報更新レスポンス"""

    id: int = Field(..., description='ユーザーID')
    email: str = Field(..., description='メールアドレス')
    name: str | None = Field(None, description='氏名')
    name_kana: str | None = Field(None, description='フリガナ')
    phone: str | None = Field(None, description='電話番号')
    company: str | None = Field(None, description='会社名')
    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: UpdateMeOutputDTO) -> UpdateMeResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === パスワード変更 ===
class ChangePasswordRequest(BaseModel):
    """パスワード変更リクエスト"""

    current_password: str = Field(..., description='現在のパスワード')
    new_password: str = Field(
        ..., min_length=8, description='新しいパスワード（8文字以上）'
    )

    def to_dto(self) -> ChangePasswordInputDTO:
        """Request → DTO 変換"""
        return ChangePasswordInputDTO(**self.model_dump())


class ChangePasswordResponse(BaseModel):
    """パスワード変更レスポンス"""

    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: ChangePasswordOutputDTO) -> ChangePasswordResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())
