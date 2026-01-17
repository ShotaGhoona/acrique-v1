"""注文APIエンドポイント"""

from fastapi import APIRouter, Depends, Query, status

from app.application.schemas.checkout.order_schemas import GetOrdersInputDTO
from app.application.use_cases.checkout.order_usecase import OrderUsecase
from app.di.checkout.order import get_order_usecase
from app.domain.entities.order import OrderStatus
from app.infrastructure.security.security_service_impl import (
    User,
    get_current_user_from_cookie,
)
from app.presentation.schemas.checkout.order_schemas import (
    CancelOrderRequest,
    CancelOrderResponse,
    CreateOrderRequest,
    CreateOrderResponse,
    GetOrderResponse,
    GetOrdersResponse,
)

router = APIRouter(prefix='/orders', tags=['注文'])


@router.get('', response_model=GetOrdersResponse, status_code=status.HTTP_200_OK)
def get_orders(
    status_filter: OrderStatus | None = Query(None, alias='status'),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user_from_cookie),
    order_usecase: OrderUsecase = Depends(get_order_usecase),
) -> GetOrdersResponse:
    """注文一覧取得エンドポイント"""
    input_dto = GetOrdersInputDTO(
        status=status_filter,
        limit=limit,
        offset=offset,
    )
    output_dto = order_usecase.get_orders(current_user.id, input_dto)
    return GetOrdersResponse.from_dto(output_dto)


@router.get(
    '/{order_id}', response_model=GetOrderResponse, status_code=status.HTTP_200_OK
)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user_from_cookie),
    order_usecase: OrderUsecase = Depends(get_order_usecase),
) -> GetOrderResponse:
    """注文詳細取得エンドポイント"""
    output_dto = order_usecase.get_order(current_user.id, order_id)
    return GetOrderResponse.from_dto(output_dto)


@router.post('', response_model=CreateOrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    request: CreateOrderRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    order_usecase: OrderUsecase = Depends(get_order_usecase),
) -> CreateOrderResponse:
    """注文作成エンドポイント"""
    output_dto = order_usecase.create_order(current_user.id, request.to_dto())
    return CreateOrderResponse.from_dto(output_dto)


@router.post(
    '/{order_id}/cancel',
    response_model=CancelOrderResponse,
    status_code=status.HTTP_200_OK,
)
def cancel_order(
    order_id: int,
    request: CancelOrderRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    order_usecase: OrderUsecase = Depends(get_order_usecase),
) -> CancelOrderResponse:
    """注文キャンセルエンドポイント"""
    output_dto = order_usecase.cancel_order(current_user.id, order_id, request.to_dto())
    return CancelOrderResponse.from_dto(output_dto)
