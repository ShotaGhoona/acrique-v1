"""管理者認証APIエンドポイント"""

from fastapi import APIRouter, Depends, Request, Response, status

from app.application.use_cases.admin_auth_usecase import AdminAuthUsecase
from app.di.admin_auth import get_admin_auth_usecase
from app.infrastructure.security.admin_security import (
    AdminAuth,
    get_current_admin_from_cookie,
)
from app.presentation.schemas.admin_auth_schemas import (
    AdminLoginRequest,
    AdminLoginResponse,
    AdminLogoutResponse,
    AdminStatusResponse,
)

router = APIRouter(prefix='/admin/auth', tags=['管理者認証'])


@router.post('/login', response_model=AdminLoginResponse, status_code=status.HTTP_200_OK)
def admin_login(
    request_body: AdminLoginRequest,
    request: Request,
    response: Response,
    usecase: AdminAuthUsecase = Depends(get_admin_auth_usecase),
) -> AdminLoginResponse:
    """管理者ログイン

    管理者のメールアドレスとパスワードで認証し、
    アクセストークンをCookieに設定する。
    """
    ip_address = request.client.host if request.client else None
    output_dto = usecase.login(request_body.to_dto(), ip_address)

    # Cookieにアクセストークンを設定
    response.set_cookie(
        key='admin_access_token',
        value=output_dto.access_token,
        httponly=True,
        secure=True,
        samesite='lax',
        max_age=8 * 60 * 60,  # 8時間
    )

    return AdminLoginResponse.from_dto(output_dto)


@router.post(
    '/logout', response_model=AdminLogoutResponse, status_code=status.HTTP_200_OK
)
def admin_logout(
    request: Request,
    response: Response,
    current_admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminAuthUsecase = Depends(get_admin_auth_usecase),
) -> AdminLogoutResponse:
    """管理者ログアウト

    アクセストークンのCookieを削除する。
    """
    ip_address = request.client.host if request.client else None
    output_dto = usecase.logout(current_admin.id, ip_address)

    # Cookieを削除
    response.delete_cookie(key='admin_access_token')

    return AdminLogoutResponse.from_dto(output_dto)


@router.get('/status', response_model=AdminStatusResponse, status_code=status.HTTP_200_OK)
def admin_status(
    current_admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminAuthUsecase = Depends(get_admin_auth_usecase),
) -> AdminStatusResponse:
    """管理者認証状態取得

    現在ログイン中の管理者情報を取得する。
    """
    output_dto = usecase.get_status(current_admin.id)
    return AdminStatusResponse.from_dto(output_dto)
