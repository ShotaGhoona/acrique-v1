"""ユーザーAPIエンドポイント"""

from fastapi import APIRouter, Depends, status

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
    return GetMeResponse.from_dto(output_dto)


@router.put('/me', response_model=UpdateMeResponse, status_code=status.HTTP_200_OK)
def update_me(
    request: UpdateMeRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    user_usecase: UserUsecase = Depends(get_user_usecase),
) -> UpdateMeResponse:
    """自分の情報更新エンドポイント"""
    output_dto = user_usecase.update_me(current_user.id, request.to_dto())
    return UpdateMeResponse.from_dto(output_dto)


@router.put(
    '/me/password', response_model=ChangePasswordResponse, status_code=status.HTTP_200_OK
)
def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    user_usecase: UserUsecase = Depends(get_user_usecase),
) -> ChangePasswordResponse:
    """パスワード変更エンドポイント"""
    output_dto = user_usecase.change_password(current_user.id, request.to_dto())
    return ChangePasswordResponse.from_dto(output_dto)
