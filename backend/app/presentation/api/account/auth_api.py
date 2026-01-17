"""認証APIエンドポイント"""

from fastapi import APIRouter, Depends, Response, status

from app.application.use_cases.account.auth_usecase import AuthUsecase
from app.di.account.auth import get_auth_usecase
from app.infrastructure.security.security_service_impl import (
    User,
    get_current_user_from_cookie,
    get_optional_user_from_cookie,
)
from app.presentation.schemas.account.auth_schemas import (
    LoginRequest,
    LoginResponse,
    LogoutResponse,
    PasswordResetConfirmRequest,
    PasswordResetConfirmResponse,
    PasswordResetRequest,
    PasswordResetResponse,
    RegisterRequest,
    RegisterResponse,
    ResendVerificationRequest,
    ResendVerificationResponse,
    StatusResponse,
    VerifyEmailRequest,
    VerifyEmailResponse,
)

router = APIRouter(prefix='/auth', tags=['認証'])


@router.post(
    '/register', response_model=RegisterResponse, status_code=status.HTTP_201_CREATED
)
def register(
    request: RegisterRequest,
    auth_usecase: AuthUsecase = Depends(get_auth_usecase),
) -> RegisterResponse:
    """会員登録エンドポイント"""
    output_dto = auth_usecase.register(request.to_dto())
    return RegisterResponse.from_dto(output_dto)


@router.post('/login', response_model=LoginResponse, status_code=status.HTTP_200_OK)
def login(
    request: LoginRequest,
    response: Response,
    auth_usecase: AuthUsecase = Depends(get_auth_usecase),
) -> LoginResponse:
    """ログインエンドポイント"""
    output_dto = auth_usecase.login(request.to_dto())

    # Cookieにアクセストークンを設定
    response.set_cookie(
        key='access_token',
        value=output_dto.access_token,
        httponly=True,
        secure=True,
        samesite='lax',
        max_age=7 * 24 * 60 * 60,  # 7日間
    )

    return LoginResponse.from_dto(output_dto)


@router.post('/logout', response_model=LogoutResponse, status_code=status.HTTP_200_OK)
def logout(
    response: Response,
    current_user: User = Depends(get_current_user_from_cookie),
    auth_usecase: AuthUsecase = Depends(get_auth_usecase),
) -> LogoutResponse:
    """ログアウトエンドポイント"""
    output_dto = auth_usecase.logout()
    response.delete_cookie(key='access_token')
    return LogoutResponse.from_dto(output_dto)


@router.get('/status', response_model=StatusResponse, status_code=status.HTTP_200_OK)
def get_status(
    current_user: User | None = Depends(get_optional_user_from_cookie),
    auth_usecase: AuthUsecase = Depends(get_auth_usecase),
) -> StatusResponse:
    """認証状態取得エンドポイント

    トークンがない、または無効な場合は is_authenticated=False を返す（401エラーにならない）
    """
    if current_user is None:
        return StatusResponse(is_authenticated=False, user_id=None)
    output_dto = auth_usecase.get_auth_status(user_id=current_user.id)
    return StatusResponse.from_dto(output_dto)


@router.post(
    '/verify-email', response_model=VerifyEmailResponse, status_code=status.HTTP_200_OK
)
def verify_email(
    request: VerifyEmailRequest,
    auth_usecase: AuthUsecase = Depends(get_auth_usecase),
) -> VerifyEmailResponse:
    """メール認証エンドポイント"""
    output_dto = auth_usecase.verify_email(request.to_dto())
    return VerifyEmailResponse.from_dto(output_dto)


@router.post(
    '/password-reset',
    response_model=PasswordResetResponse,
    status_code=status.HTTP_200_OK,
)
def request_password_reset(
    request: PasswordResetRequest,
    auth_usecase: AuthUsecase = Depends(get_auth_usecase),
) -> PasswordResetResponse:
    """パスワードリセット依頼エンドポイント"""
    output_dto = auth_usecase.request_password_reset(request.to_dto())
    return PasswordResetResponse.from_dto(output_dto)


@router.post(
    '/password-reset/confirm',
    response_model=PasswordResetConfirmResponse,
    status_code=status.HTTP_200_OK,
)
def confirm_password_reset(
    request: PasswordResetConfirmRequest,
    auth_usecase: AuthUsecase = Depends(get_auth_usecase),
) -> PasswordResetConfirmResponse:
    """パスワードリセット実行エンドポイント"""
    output_dto = auth_usecase.confirm_password_reset(request.to_dto())
    return PasswordResetConfirmResponse.from_dto(output_dto)


@router.post(
    '/resend-verification',
    response_model=ResendVerificationResponse,
    status_code=status.HTTP_200_OK,
)
def resend_verification_email(
    request: ResendVerificationRequest,
    auth_usecase: AuthUsecase = Depends(get_auth_usecase),
) -> ResendVerificationResponse:
    """メール認証再送信エンドポイント"""
    output_dto = auth_usecase.resend_verification_email(request.to_dto())
    return ResendVerificationResponse.from_dto(output_dto)
