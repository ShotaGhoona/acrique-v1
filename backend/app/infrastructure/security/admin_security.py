"""管理者認証セキュリティ"""

from datetime import datetime, timedelta

from fastapi import HTTPException, Request, status
from jose import JWTError, jwt
from pydantic import BaseModel, Field

from app.config import get_settings


class AdminAuth(BaseModel):
    """管理者認証情報スキーマ"""

    id: int = Field(..., description='管理者ID')
    role: str = Field(..., description='権限')


def _load_rsa_keys() -> tuple[bytes, bytes]:
    """RSA鍵ペアを環境変数から読み込み"""
    settings = get_settings()
    jwt_private_key = settings.jwt_private_key.replace('\\n', '\n').encode('utf-8')
    jwt_public_key = settings.jwt_public_key.replace('\\n', '\n').encode('utf-8')
    return jwt_private_key, jwt_public_key


def create_admin_access_token(
    admin_id: int,
    role: str,
    expires_delta: timedelta | None = None,
) -> str:
    """管理者用アクセストークンを生成

    Args:
        admin_id: 管理者ID
        role: 権限
        expires_delta: 有効期限（デフォルト8時間）

    Returns:
        JWTアクセストークン
    """
    settings = get_settings()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=8))
    to_encode = {
        'admin_id': admin_id,
        'role': role,
        'exp': expire,
        'type': 'admin',  # ユーザートークンと区別
    }
    private_key, _ = _load_rsa_keys()
    encoded_jwt = jwt.encode(to_encode, private_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt if isinstance(encoded_jwt, str) else encoded_jwt.decode('utf-8')


def get_current_admin_from_cookie(request: Request) -> AdminAuth:
    """Cookieから管理者アクセストークンを取得して検証

    Args:
        request: FastAPIリクエスト

    Returns:
        AdminAuth: 管理者認証情報

    Raises:
        HTTPException: 認証失敗時
    """
    settings = get_settings()

    # 認証無効時はダミー管理者を返す（開発用）
    if not settings.enable_auth:
        return AdminAuth(id=0, role='super_admin')

    token = request.cookies.get('admin_access_token')
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='管理者認証が必要です',
        )

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='トークンの検証に失敗しました',
    )

    try:
        _, public_key = _load_rsa_keys()
        payload = jwt.decode(token, public_key, algorithms=[settings.jwt_algorithm])

        # 管理者トークンかどうか確認
        if payload.get('type') != 'admin':
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='無効なトークンです',
            )

        admin_id = payload.get('admin_id')
        role = payload.get('role')
        if admin_id is None or role is None:
            raise credentials_exception

        return AdminAuth(id=admin_id, role=role)
    except JWTError as e:
        raise credentials_exception from e
