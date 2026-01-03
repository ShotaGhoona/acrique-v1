from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# === 会員登録 ===
class RegisterInputDTO(BaseModel):
    """会員登録入力DTO"""

    email: EmailStr = Field(..., description='メールアドレス')
    password: str = Field(..., min_length=8, description='パスワード（8文字以上）')
    name: str | None = Field(None, description='氏名')
    name_kana: str | None = Field(None, description='フリガナ')
    phone: str | None = Field(None, description='電話番号')
    company: str | None = Field(None, description='会社名')


class RegisterOutputDTO(BaseModel):
    """会員登録出力DTO"""

    user_id: int = Field(..., description='ユーザーID')
    email: str = Field(..., description='メールアドレス')
    message: str = Field(..., description='メッセージ')


# === ログイン ===
class LoginInputDTO(BaseModel):
    """ログイン入力DTO"""

    email: EmailStr = Field(..., description='メールアドレス')
    password: str = Field(..., description='パスワード')


class LoginOutputDTO(BaseModel):
    """ログイン出力DTO"""

    access_token: str = Field(..., description='アクセストークン')
    user_id: int = Field(..., description='ユーザーID')


# === ログアウト ===
class LogoutOutputDTO(BaseModel):
    """ログアウト出力DTO"""

    message: str = Field(..., description='メッセージ')


# === 認証状態 ===
class StatusOutputDTO(BaseModel):
    """認証状態出力DTO"""

    is_authenticated: bool = Field(..., description='認証済みかどうか')
    user_id: int = Field(..., description='ユーザーID')
    email: str = Field(..., description='メールアドレス')
    name: str | None = Field(None, description='氏名')
    is_email_verified: bool = Field(..., description='メール認証済みかどうか')


# === メール認証 ===
class VerifyEmailInputDTO(BaseModel):
    """メール認証入力DTO"""

    token: str = Field(..., description='認証トークン')


class VerifyEmailOutputDTO(BaseModel):
    """メール認証出力DTO"""

    message: str = Field(..., description='メッセージ')
    verified_at: datetime = Field(..., description='認証日時')


# === パスワードリセット依頼 ===
class PasswordResetRequestInputDTO(BaseModel):
    """パスワードリセット依頼入力DTO"""

    email: EmailStr = Field(..., description='メールアドレス')


class PasswordResetRequestOutputDTO(BaseModel):
    """パスワードリセット依頼出力DTO"""

    message: str = Field(..., description='メッセージ')


# === パスワードリセット実行 ===
class PasswordResetConfirmInputDTO(BaseModel):
    """パスワードリセット実行入力DTO"""

    token: str = Field(..., description='リセットトークン')
    new_password: str = Field(..., min_length=8, description='新しいパスワード（8文字以上）')


class PasswordResetConfirmOutputDTO(BaseModel):
    """パスワードリセット実行出力DTO"""

    message: str = Field(..., description='メッセージ')


# === メール認証再送信 ===
class ResendVerificationInputDTO(BaseModel):
    """メール認証再送信入力DTO"""

    email: EmailStr = Field(..., description='メールアドレス')


class ResendVerificationOutputDTO(BaseModel):
    """メール認証再送信出力DTO"""

    message: str = Field(..., description='メッセージ')
