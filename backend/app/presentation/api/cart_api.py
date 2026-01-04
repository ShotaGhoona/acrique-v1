"""カートAPIエンドポイント"""

from fastapi import APIRouter, Depends, status

from app.application.schemas.cart_schemas import (
    AddToCartInputDTO,
    UpdateCartItemInputDTO,
)
from app.application.use_cases.cart_usecase import CartUsecase
from app.di.cart import get_cart_usecase
from app.infrastructure.security.security_service_impl import (
    User,
    get_current_user_from_cookie,
)
from app.presentation.schemas.cart_schemas import (
    AddToCartRequest,
    AddToCartResponse,
    CartItemResponse,
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

    return GetCartResponse(
        items=[
            CartItemResponse(
                id=item.id,
                product_id=item.product_id,
                product_name=item.product_name,
                product_name_ja=item.product_name_ja,
                product_image_url=item.product_image_url,
                base_price=item.base_price,
                quantity=item.quantity,
                options=item.options,
                subtotal=item.subtotal,
                created_at=item.created_at,
                updated_at=item.updated_at,
            )
            for item in output_dto.items
        ],
        item_count=output_dto.item_count,
        total_quantity=output_dto.total_quantity,
        subtotal=output_dto.subtotal,
        tax=output_dto.tax,
        total=output_dto.total,
    )


@router.post('/items', response_model=AddToCartResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    request: AddToCartRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    cart_usecase: CartUsecase = Depends(get_cart_usecase),
) -> AddToCartResponse:
    """カート追加エンドポイント"""
    input_dto = AddToCartInputDTO(
        product_id=request.product_id,
        quantity=request.quantity,
        options=request.options,
    )
    output_dto = cart_usecase.add_to_cart(current_user.id, input_dto)

    return AddToCartResponse(
        item=CartItemResponse(
            id=output_dto.item.id,
            product_id=output_dto.item.product_id,
            product_name=output_dto.item.product_name,
            product_name_ja=output_dto.item.product_name_ja,
            product_image_url=output_dto.item.product_image_url,
            base_price=output_dto.item.base_price,
            quantity=output_dto.item.quantity,
            options=output_dto.item.options,
            subtotal=output_dto.item.subtotal,
            created_at=output_dto.item.created_at,
            updated_at=output_dto.item.updated_at,
        ),
        message=output_dto.message,
    )


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
    input_dto = UpdateCartItemInputDTO(
        quantity=request.quantity,
        options=request.options,
    )
    output_dto = cart_usecase.update_cart_item(current_user.id, item_id, input_dto)

    return UpdateCartItemResponse(
        item=CartItemResponse(
            id=output_dto.item.id,
            product_id=output_dto.item.product_id,
            product_name=output_dto.item.product_name,
            product_name_ja=output_dto.item.product_name_ja,
            product_image_url=output_dto.item.product_image_url,
            base_price=output_dto.item.base_price,
            quantity=output_dto.item.quantity,
            options=output_dto.item.options,
            subtotal=output_dto.item.subtotal,
            created_at=output_dto.item.created_at,
            updated_at=output_dto.item.updated_at,
        ),
        message=output_dto.message,
    )


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

    return DeleteCartItemResponse(message=output_dto.message)


@router.delete('', response_model=ClearCartResponse, status_code=status.HTTP_200_OK)
def clear_cart(
    current_user: User = Depends(get_current_user_from_cookie),
    cart_usecase: CartUsecase = Depends(get_cart_usecase),
) -> ClearCartResponse:
    """カート全削除エンドポイント"""
    output_dto = cart_usecase.clear_cart(current_user.id)

    return ClearCartResponse(
        deleted_count=output_dto.deleted_count,
        message=output_dto.message,
    )
