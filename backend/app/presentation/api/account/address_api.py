"""配送先APIエンドポイント"""

from fastapi import APIRouter, Depends, status

from app.application.use_cases.account.address_usecase import AddressUsecase
from app.di.account.address import get_address_usecase
from app.infrastructure.security.security_service_impl import (
    User,
    get_current_user_from_cookie,
)
from app.presentation.schemas.account.address_schemas import (
    CreateAddressRequest,
    CreateAddressResponse,
    DeleteAddressResponse,
    GetAddressListResponse,
    GetAddressResponse,
    SetDefaultAddressResponse,
    UpdateAddressRequest,
    UpdateAddressResponse,
)

router = APIRouter(prefix='/addresses', tags=['配送先'])


@router.get('', response_model=GetAddressListResponse, status_code=status.HTTP_200_OK)
def get_address_list(
    current_user: User = Depends(get_current_user_from_cookie),
    address_usecase: AddressUsecase = Depends(get_address_usecase),
) -> GetAddressListResponse:
    """配送先一覧取得エンドポイント"""
    output_dto = address_usecase.get_address_list(current_user.id)
    return GetAddressListResponse.from_dto(output_dto)


@router.post(
    '', response_model=CreateAddressResponse, status_code=status.HTTP_201_CREATED
)
def create_address(
    request: CreateAddressRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    address_usecase: AddressUsecase = Depends(get_address_usecase),
) -> CreateAddressResponse:
    """配送先追加エンドポイント"""
    output_dto = address_usecase.create_address(current_user.id, request.to_dto())
    return CreateAddressResponse.from_dto(output_dto)


@router.get(
    '/{address_id}', response_model=GetAddressResponse, status_code=status.HTTP_200_OK
)
def get_address(
    address_id: int,
    current_user: User = Depends(get_current_user_from_cookie),
    address_usecase: AddressUsecase = Depends(get_address_usecase),
) -> GetAddressResponse:
    """配送先詳細取得エンドポイント"""
    output_dto = address_usecase.get_address(current_user.id, address_id)
    return GetAddressResponse.from_dto(output_dto)


@router.put(
    '/{address_id}', response_model=UpdateAddressResponse, status_code=status.HTTP_200_OK
)
def update_address(
    address_id: int,
    request: UpdateAddressRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    address_usecase: AddressUsecase = Depends(get_address_usecase),
) -> UpdateAddressResponse:
    """配送先更新エンドポイント"""
    output_dto = address_usecase.update_address(
        current_user.id, address_id, request.to_dto()
    )
    return UpdateAddressResponse.from_dto(output_dto)


@router.delete(
    '/{address_id}', response_model=DeleteAddressResponse, status_code=status.HTTP_200_OK
)
def delete_address(
    address_id: int,
    current_user: User = Depends(get_current_user_from_cookie),
    address_usecase: AddressUsecase = Depends(get_address_usecase),
) -> DeleteAddressResponse:
    """配送先削除エンドポイント"""
    output_dto = address_usecase.delete_address(current_user.id, address_id)
    return DeleteAddressResponse.from_dto(output_dto)


@router.put(
    '/{address_id}/default',
    response_model=SetDefaultAddressResponse,
    status_code=status.HTTP_200_OK,
)
def set_default_address(
    address_id: int,
    current_user: User = Depends(get_current_user_from_cookie),
    address_usecase: AddressUsecase = Depends(get_address_usecase),
) -> SetDefaultAddressResponse:
    """デフォルト配送先設定エンドポイント"""
    output_dto = address_usecase.set_default_address(current_user.id, address_id)
    return SetDefaultAddressResponse.from_dto(output_dto)
