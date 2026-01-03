from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# === 会員登録 ===
class RegisterRequest(BaseModel):
    """会員登録リクエスト"""

    email: EmailStr = Field(..., description='メールアドレス')
    password: str = Field(..., min_length=8, description='パスワード（8文字以上）')
    name: str | None = Field(None, description='氏名')
    name_kana: str | None = Field(None, description='フリガナ')
    phone: str | None = Field(None, description='電話番号')
    company: str | None = Field(None, description='会社名')


class RegisterResponse(BaseModel):
    """会員登録レスポンス"""

    user_id: int = Field(..., description='ユーザーID')
    email: str = Field(..., description='メールアドレス')
    message: str = Field(..., description='メッセージ')


# === ログイン ===
class LoginRequest(BaseModel):
    """ログインリクエスト"""

    email: EmailStr = Field(..., description='メールアドレス')
    password: str = Field(..., description='パスワード')


class LoginResponse(BaseModel):
    """ログインレスポンス"""

    message: str = Field(..., description='メッセージ')
    access_token: str = Field(..., description='アクセストークン')
    user_id: int = Field(..., description='ユーザーID')


# === ログアウト ===
class LogoutResponse(BaseModel):
    """ログアウトレスポンス"""

    message: str = Field(..., description='メッセージ')


# === 認証状態 ===
class StatusResponse(BaseModel):
    """認証状態レスポンス"""

    is_authenticated: bool = Field(..., description='認証済みかどうか')
    user_id: int = Field(..., description='ユーザーID')
    email: str = Field(..., description='メールアドレス')
    name: str | None = Field(None, description='氏名')
    is_email_verified: bool = Field(..., description='メール認証済みかどうか')


# === メール認証 ===
class VerifyEmailRequest(BaseModel):
    """メール認証リクエスト"""

    token: str = Field(..., description='認証トークン')


class VerifyEmailResponse(BaseModel):
    """メール認証レスポンス"""

    message: str = Field(..., description='メッセージ')
    verified_at: datetime = Field(..., description='認証日時')


# === パスワードリセット依頼 ===
class PasswordResetRequest(BaseModel):
    """パスワードリセット依頼リクエスト"""

    email: EmailStr = Field(..., description='メールアドレス')


class PasswordResetResponse(BaseModel):
    """パスワードリセット依頼レスポンス"""

    message: str = Field(..., description='メッセージ')


# === パスワードリセット実行 ===
class PasswordResetConfirmRequest(BaseModel):
    """パスワードリセット実行リクエスト"""

    token: str = Field(..., description='リセットトークン')
    new_password: str = Field(
        ..., min_length=8, description='新しいパスワード（8文字以上）'
    )


class PasswordResetConfirmResponse(BaseModel):
    """パスワードリセット実行レスポンス"""

    message: str = Field(..., description='メッセージ')


# === メール認証再送信 ===
class ResendVerificationRequest(BaseModel):
    """メール認証再送信リクエスト"""

    email: EmailStr = Field(..., description='メールアドレス')


class ResendVerificationResponse(BaseModel):
    """メール認証再送信レスポンス"""

    message: str = Field(..., description='メッセージ')
