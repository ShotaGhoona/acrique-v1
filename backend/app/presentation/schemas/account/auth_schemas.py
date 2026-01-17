"""認証リクエスト/レスポンススキーマ"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.application.schemas.account.auth_schemas import (
    LoginInputDTO,
    LoginOutputDTO,
    LogoutOutputDTO,
    PasswordResetConfirmInputDTO,
    PasswordResetConfirmOutputDTO,
    PasswordResetRequestInputDTO,
    PasswordResetRequestOutputDTO,
    RegisterInputDTO,
    RegisterOutputDTO,
    ResendVerificationInputDTO,
    ResendVerificationOutputDTO,
    StatusOutputDTO,
    VerifyEmailInputDTO,
    VerifyEmailOutputDTO,
)


# === 会員登録 ===
class RegisterRequest(BaseModel):
    """会員登録リクエスト"""

    email: EmailStr = Field(..., description='メールアドレス')
    password: str = Field(..., min_length=8, description='パスワード（8文字以上）')
    name: str | None = Field(None, description='氏名')
    name_kana: str | None = Field(None, description='フリガナ')
    phone: str | None = Field(None, description='電話番号')
    company: str | None = Field(None, description='会社名')

    def to_dto(self) -> RegisterInputDTO:
        """Request → DTO 変換"""
        return RegisterInputDTO(**self.model_dump())


class RegisterResponse(BaseModel):
    """会員登録レスポンス"""

    user_id: int = Field(..., description='ユーザーID')
    email: str = Field(..., description='メールアドレス')
    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: RegisterOutputDTO) -> RegisterResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === ログイン ===
class LoginRequest(BaseModel):
    """ログインリクエスト"""

    email: EmailStr = Field(..., description='メールアドレス')
    password: str = Field(..., description='パスワード')

    def to_dto(self) -> LoginInputDTO:
        """Request → DTO 変換"""
        return LoginInputDTO(**self.model_dump())


class LoginResponse(BaseModel):
    """ログインレスポンス"""

    message: str = Field(..., description='メッセージ')
    access_token: str = Field(..., description='アクセストークン')
    user_id: int = Field(..., description='ユーザーID')

    @classmethod
    def from_dto(
        cls, dto: LoginOutputDTO, message: str = 'ログイン成功'
    ) -> LoginResponse:
        """DTO → Response 変換（messageはPresentation層で追加）"""
        return cls(
            message=message,
            access_token=dto.access_token,
            user_id=dto.user_id,
        )


# === ログアウト ===
class LogoutResponse(BaseModel):
    """ログアウトレスポンス"""

    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: LogoutOutputDTO) -> LogoutResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === 認証状態 ===
class StatusResponse(BaseModel):
    """認証状態レスポンス"""

    is_authenticated: bool = Field(..., description='認証済みかどうか')
    user_id: int | None = Field(None, description='ユーザーID（未認証の場合はnull）')
    email: str | None = Field(None, description='メールアドレス（未認証の場合はnull）')
    name: str | None = Field(None, description='氏名')
    is_email_verified: bool | None = Field(
        None, description='メール認証済みかどうか（未認証の場合はnull）'
    )

    @classmethod
    def from_dto(cls, dto: StatusOutputDTO) -> StatusResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === メール認証 ===
class VerifyEmailRequest(BaseModel):
    """メール認証リクエスト"""

    token: str = Field(..., description='認証トークン')

    def to_dto(self) -> VerifyEmailInputDTO:
        """Request → DTO 変換"""
        return VerifyEmailInputDTO(**self.model_dump())


class VerifyEmailResponse(BaseModel):
    """メール認証レスポンス"""

    message: str = Field(..., description='メッセージ')
    verified_at: datetime = Field(..., description='認証日時')

    @classmethod
    def from_dto(cls, dto: VerifyEmailOutputDTO) -> VerifyEmailResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === パスワードリセット依頼 ===
class PasswordResetRequest(BaseModel):
    """パスワードリセット依頼リクエスト"""

    email: EmailStr = Field(..., description='メールアドレス')

    def to_dto(self) -> PasswordResetRequestInputDTO:
        """Request → DTO 変換"""
        return PasswordResetRequestInputDTO(**self.model_dump())


class PasswordResetResponse(BaseModel):
    """パスワードリセット依頼レスポンス"""

    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: PasswordResetRequestOutputDTO) -> PasswordResetResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === パスワードリセット実行 ===
class PasswordResetConfirmRequest(BaseModel):
    """パスワードリセット実行リクエスト"""

    token: str = Field(..., description='リセットトークン')
    new_password: str = Field(
        ..., min_length=8, description='新しいパスワード（8文字以上）'
    )

    def to_dto(self) -> PasswordResetConfirmInputDTO:
        """Request → DTO 変換"""
        return PasswordResetConfirmInputDTO(**self.model_dump())


class PasswordResetConfirmResponse(BaseModel):
    """パスワードリセット実行レスポンス"""

    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: PasswordResetConfirmOutputDTO) -> PasswordResetConfirmResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === メール認証再送信 ===
class ResendVerificationRequest(BaseModel):
    """メール認証再送信リクエスト"""

    email: EmailStr = Field(..., description='メールアドレス')

    def to_dto(self) -> ResendVerificationInputDTO:
        """Request → DTO 変換"""
        return ResendVerificationInputDTO(**self.model_dump())


class ResendVerificationResponse(BaseModel):
    """メール認証再送信レスポンス"""

    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: ResendVerificationOutputDTO) -> ResendVerificationResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())
