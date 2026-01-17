"""カートAPIエンドポイント"""

from fastapi import APIRouter, Depends, status

from app.application.use_cases.checkout.cart_usecase import CartUsecase
from app.di.checkout.cart import get_cart_usecase
from app.infrastructure.security.security_service_impl import (
    User,
    get_current_user_from_cookie,
)
from app.presentation.schemas.checkout.cart_schemas import (
    AddToCartRequest,
    AddToCartResponse,
    ClearCartResponse,
    DeleteCartItemResponse,
    GetCartResponse,
    UpdateCartItemRequest,
    UpdateCartItemResponse,
)

router = APIRouter(prefix='/cart', tags=['カート'])


@router.get('', response_model=GetCartResponse, status_code=status.HTTP_200_OK)
def get_cart(
    current_user: User = Depends(get_current_user_from_cookie),
    cart_usecase: CartUsecase = Depends(get_cart_usecase),
) -> GetCartResponse:
    """カート内容取得エンドポイント"""
    output_dto = cart_usecase.get_cart(current_user.id)
    return GetCartResponse.from_dto(output_dto)


@router.post(
    '/items', response_model=AddToCartResponse, status_code=status.HTTP_201_CREATED
)
def add_to_cart(
    request: AddToCartRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    cart_usecase: CartUsecase = Depends(get_cart_usecase),
) -> AddToCartResponse:
    """カート追加エンドポイント"""
    output_dto = cart_usecase.add_to_cart(current_user.id, request.to_dto())
    return AddToCartResponse.from_dto(output_dto)


@router.put(
    '/items/{item_id}',
    response_model=UpdateCartItemResponse,
    status_code=status.HTTP_200_OK,
)
def update_cart_item(
    item_id: int,
    request: UpdateCartItemRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    cart_usecase: CartUsecase = Depends(get_cart_usecase),
) -> UpdateCartItemResponse:
    """カートアイテム更新エンドポイント"""
    output_dto = cart_usecase.update_cart_item(current_user.id, item_id, request.to_dto())
    return UpdateCartItemResponse.from_dto(output_dto)


@router.delete(
    '/items/{item_id}',
    response_model=DeleteCartItemResponse,
    status_code=status.HTTP_200_OK,
)
def delete_cart_item(
    item_id: int,
    current_user: User = Depends(get_current_user_from_cookie),
    cart_usecase: CartUsecase = Depends(get_cart_usecase),
) -> DeleteCartItemResponse:
    """カートアイテム削除エンドポイント"""
    output_dto = cart_usecase.delete_cart_item(current_user.id, item_id)
    return DeleteCartItemResponse.from_dto(output_dto)


@router.delete('', response_model=ClearCartResponse, status_code=status.HTTP_200_OK)
def clear_cart(
    current_user: User = Depends(get_current_user_from_cookie),
    cart_usecase: CartUsecase = Depends(get_cart_usecase),
) -> ClearCartResponse:
    """カート全削除エンドポイント"""
    output_dto = cart_usecase.clear_cart(current_user.id)
    return ClearCartResponse.from_dto(output_dto)
