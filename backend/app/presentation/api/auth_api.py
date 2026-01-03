from fastapi import APIRouter, Depends, Response, status

from app.application.schemas.auth_schemas import (
    LoginInputDTO,
    PasswordResetConfirmInputDTO,
    PasswordResetRequestInputDTO,
    RegisterInputDTO,
    ResendVerificationInputDTO,
    VerifyEmailInputDTO,
)
from app.application.use_cases.auth_usecase import AuthUsecase
from app.di.auth import get_auth_usecase
from app.infrastructure.security.security_service_impl import (
    User,
    get_current_user_from_cookie,
)
from app.presentation.schemas.auth_schemas import (
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
    input_dto = RegisterInputDTO(
        email=request.email,
        password=request.password,
        name=request.name,
        name_kana=request.name_kana,
        phone=request.phone,
        company=request.company,
    )
    output_dto = auth_usecase.register(input_dto)

    return RegisterResponse(
        user_id=output_dto.user_id,
        email=output_dto.email,
        message=output_dto.message,
    )


@router.post('/login', response_model=LoginResponse, status_code=status.HTTP_200_OK)
def login(
    request: LoginRequest,
    response: Response,
    auth_usecase: AuthUsecase = Depends(get_auth_usecase),
) -> LoginResponse:
    """ログインエンドポイント"""
    input_dto = LoginInputDTO(email=request.email, password=request.password)

    output_dto = auth_usecase.login(input_dto)

    # Cookieにアクセストークンを設定
    response.set_cookie(
        key='access_token',
        value=output_dto.access_token,
        httponly=True,
        secure=True,
        samesite='lax',
        max_age=7 * 24 * 60 * 60,  # 7日間
    )

    return LoginResponse(
        message='ログイン成功',
        access_token=output_dto.access_token,
        user_id=output_dto.user_id,
    )


@router.post('/logout', response_model=LogoutResponse, status_code=status.HTTP_200_OK)
def logout(
    response: Response,
    current_user: User = Depends(get_current_user_from_cookie),
    auth_usecase: AuthUsecase = Depends(get_auth_usecase),
) -> LogoutResponse:
    """ログアウトエンドポイント"""
    output_dto = auth_usecase.logout()
    response.delete_cookie(key='access_token')

    return LogoutResponse(message=output_dto.message)


@router.get('/status', response_model=StatusResponse, status_code=status.HTTP_200_OK)
def get_status(
    current_user: User = Depends(get_current_user_from_cookie),
    auth_usecase: AuthUsecase = Depends(get_auth_usecase),
) -> StatusResponse:
    """認証状態取得エンドポイント"""
    output_dto = auth_usecase.get_auth_status(user_id=current_user.id)

    return StatusResponse(
        is_authenticated=output_dto.is_authenticated,
        user_id=output_dto.user_id,
        email=output_dto.email,
        name=output_dto.name,
        is_email_verified=output_dto.is_email_verified,
    )


@router.post(
    '/verify-email', response_model=VerifyEmailResponse, status_code=status.HTTP_200_OK
)
def verify_email(
    request: VerifyEmailRequest,
    auth_usecase: AuthUsecase = Depends(get_auth_usecase),
) -> VerifyEmailResponse:
    """メール認証エンドポイント"""
    input_dto = VerifyEmailInputDTO(token=request.token)
    output_dto = auth_usecase.verify_email(input_dto)

    return VerifyEmailResponse(
        message=output_dto.message,
        verified_at=output_dto.verified_at,
    )


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
    input_dto = PasswordResetRequestInputDTO(email=request.email)
    output_dto = auth_usecase.request_password_reset(input_dto)

    return PasswordResetResponse(message=output_dto.message)


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
    input_dto = PasswordResetConfirmInputDTO(
        token=request.token,
        new_password=request.new_password,
    )
    output_dto = auth_usecase.confirm_password_reset(input_dto)

    return PasswordResetConfirmResponse(message=output_dto.message)


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
    input_dto = ResendVerificationInputDTO(email=request.email)
    output_dto = auth_usecase.resend_verification_email(input_dto)

    return ResendVerificationResponse(message=output_dto.message)
