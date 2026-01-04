from fastapi import APIRouter, Depends, status

from app.application.schemas.user_schemas import (
    ChangePasswordInputDTO,
    UpdateMeInputDTO,
)
from app.application.use_cases.user_usecase import UserUsecase
from app.di.user import get_user_usecase
from app.infrastructure.security.security_service_impl import (
    User,
    get_current_user_from_cookie,
)
from app.presentation.schemas.user_schemas import (
    ChangePasswordRequest,
    ChangePasswordResponse,
    GetMeResponse,
    UpdateMeRequest,
    UpdateMeResponse,
)

router = APIRouter(prefix='/users', tags=['ユーザー'])


@router.get('/me', response_model=GetMeResponse, status_code=status.HTTP_200_OK)
def get_me(
    current_user: User = Depends(get_current_user_from_cookie),
    user_usecase: UserUsecase = Depends(get_user_usecase),
) -> GetMeResponse:
    """自分の情報取得エンドポイント"""
    output_dto = user_usecase.get_me(current_user.id)

    return GetMeResponse(
        id=output_dto.id,
        email=output_dto.email,
        name=output_dto.name,
        name_kana=output_dto.name_kana,
        phone=output_dto.phone,
        company=output_dto.company,
        is_email_verified=output_dto.is_email_verified,
        created_at=output_dto.created_at,
    )


@router.put('/me', response_model=UpdateMeResponse, status_code=status.HTTP_200_OK)
def update_me(
    request: UpdateMeRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    user_usecase: UserUsecase = Depends(get_user_usecase),
) -> UpdateMeResponse:
    """自分の情報更新エンドポイント"""
    input_dto = UpdateMeInputDTO(
        name=request.name,
        name_kana=request.name_kana,
        phone=request.phone,
        company=request.company,
    )
    output_dto = user_usecase.update_me(current_user.id, input_dto)

    return UpdateMeResponse(
        id=output_dto.id,
        email=output_dto.email,
        name=output_dto.name,
        name_kana=output_dto.name_kana,
        phone=output_dto.phone,
        company=output_dto.company,
        message=output_dto.message,
    )


@router.put(
    '/me/password', response_model=ChangePasswordResponse, status_code=status.HTTP_200_OK
)
def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    user_usecase: UserUsecase = Depends(get_user_usecase),
) -> ChangePasswordResponse:
    """パスワード変更エンドポイント"""
    input_dto = ChangePasswordInputDTO(
        current_password=request.current_password,
        new_password=request.new_password,
    )
    output_dto = user_usecase.change_password(current_user.id, input_dto)

    return ChangePasswordResponse(message=output_dto.message)
