from fastapi import APIRouter, Depends, status

from app.application.schemas.address_schemas import (
    CreateAddressInputDTO,
    UpdateAddressInputDTO,
)
from app.application.use_cases.address_usecase import AddressUsecase
from app.di.address import get_address_usecase
from app.infrastructure.security.security_service_impl import (
    User,
    get_current_user_from_cookie,
)
from app.presentation.schemas.address_schemas import (
    AddressResponse,
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

    return GetAddressListResponse(
        addresses=[
            AddressResponse(
                id=addr.id,
                label=addr.label,
                name=addr.name,
                postal_code=addr.postal_code,
                prefecture=addr.prefecture,
                city=addr.city,
                address1=addr.address1,
                address2=addr.address2,
                phone=addr.phone,
                is_default=addr.is_default,
                created_at=addr.created_at,
            )
            for addr in output_dto.addresses
        ],
        total=output_dto.total,
    )


@router.post('', response_model=CreateAddressResponse, status_code=status.HTTP_201_CREATED)
def create_address(
    request: CreateAddressRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    address_usecase: AddressUsecase = Depends(get_address_usecase),
) -> CreateAddressResponse:
    """配送先追加エンドポイント"""
    input_dto = CreateAddressInputDTO(
        label=request.label,
        name=request.name,
        postal_code=request.postal_code,
        prefecture=request.prefecture,
        city=request.city,
        address1=request.address1,
        address2=request.address2,
        phone=request.phone,
        is_default=request.is_default,
    )
    output_dto = address_usecase.create_address(current_user.id, input_dto)

    return CreateAddressResponse(
        address=AddressResponse(
            id=output_dto.address.id,
            label=output_dto.address.label,
            name=output_dto.address.name,
            postal_code=output_dto.address.postal_code,
            prefecture=output_dto.address.prefecture,
            city=output_dto.address.city,
            address1=output_dto.address.address1,
            address2=output_dto.address.address2,
            phone=output_dto.address.phone,
            is_default=output_dto.address.is_default,
            created_at=output_dto.address.created_at,
        ),
        message=output_dto.message,
    )


@router.get('/{address_id}', response_model=GetAddressResponse, status_code=status.HTTP_200_OK)
def get_address(
    address_id: int,
    current_user: User = Depends(get_current_user_from_cookie),
    address_usecase: AddressUsecase = Depends(get_address_usecase),
) -> GetAddressResponse:
    """配送先詳細取得エンドポイント"""
    output_dto = address_usecase.get_address(current_user.id, address_id)

    return GetAddressResponse(
        address=AddressResponse(
            id=output_dto.address.id,
            label=output_dto.address.label,
            name=output_dto.address.name,
            postal_code=output_dto.address.postal_code,
            prefecture=output_dto.address.prefecture,
            city=output_dto.address.city,
            address1=output_dto.address.address1,
            address2=output_dto.address.address2,
            phone=output_dto.address.phone,
            is_default=output_dto.address.is_default,
            created_at=output_dto.address.created_at,
        )
    )


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
    input_dto = UpdateAddressInputDTO(
        label=request.label,
        name=request.name,
        postal_code=request.postal_code,
        prefecture=request.prefecture,
        city=request.city,
        address1=request.address1,
        address2=request.address2,
        phone=request.phone,
    )
    output_dto = address_usecase.update_address(current_user.id, address_id, input_dto)

    return UpdateAddressResponse(
        address=AddressResponse(
            id=output_dto.address.id,
            label=output_dto.address.label,
            name=output_dto.address.name,
            postal_code=output_dto.address.postal_code,
            prefecture=output_dto.address.prefecture,
            city=output_dto.address.city,
            address1=output_dto.address.address1,
            address2=output_dto.address.address2,
            phone=output_dto.address.phone,
            is_default=output_dto.address.is_default,
            created_at=output_dto.address.created_at,
        ),
        message=output_dto.message,
    )


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

    return DeleteAddressResponse(message=output_dto.message)


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

    return SetDefaultAddressResponse(
        address=AddressResponse(
            id=output_dto.address.id,
            label=output_dto.address.label,
            name=output_dto.address.name,
            postal_code=output_dto.address.postal_code,
            prefecture=output_dto.address.prefecture,
            city=output_dto.address.city,
            address1=output_dto.address.address1,
            address2=output_dto.address.address2,
            phone=output_dto.address.phone,
            is_default=output_dto.address.is_default,
            created_at=output_dto.address.created_at,
        ),
        message=output_dto.message,
    )
