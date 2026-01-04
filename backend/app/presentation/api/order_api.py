"""注文APIエンドポイント"""

from fastapi import APIRouter, Depends, Query, status

from app.application.schemas.order_schemas import (
    CancelOrderInputDTO,
    CreateOrderInputDTO,
    CreateOrderItemInputDTO,
    GetOrdersInputDTO,
)
from app.application.use_cases.order_usecase import OrderUsecase
from app.di.order import get_order_usecase
from app.domain.entities.order import OrderStatus
from app.infrastructure.security.security_service_impl import (
    User,
    get_current_user_from_cookie,
)
from app.presentation.schemas.order_schemas import (
    CancelOrderRequest,
    CancelOrderResponse,
    CreateOrderRequest,
    CreateOrderResponse,
    GetOrderResponse,
    GetOrdersResponse,
    OrderDetailResponse,
    OrderItemResponse,
    OrderResponse,
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

    return GetOrdersResponse(
        orders=[
            OrderResponse(
                id=order.id,
                order_number=order.order_number,
                status=order.status,
                subtotal=order.subtotal,
                shipping_fee=order.shipping_fee,
                tax=order.tax,
                total=order.total,
                payment_method=order.payment_method,
                paid_at=order.paid_at,
                shipped_at=order.shipped_at,
                tracking_number=order.tracking_number,
                delivered_at=order.delivered_at,
                cancelled_at=order.cancelled_at,
                notes=order.notes,
                created_at=order.created_at,
            )
            for order in output_dto.orders
        ],
        total=output_dto.total,
        limit=output_dto.limit,
        offset=output_dto.offset,
    )


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

    return GetOrderResponse(
        order=OrderDetailResponse(
            id=output_dto.order.id,
            order_number=output_dto.order.order_number,
            status=output_dto.order.status,
            shipping_address_id=output_dto.order.shipping_address_id,
            subtotal=output_dto.order.subtotal,
            shipping_fee=output_dto.order.shipping_fee,
            tax=output_dto.order.tax,
            total=output_dto.order.total,
            payment_method=output_dto.order.payment_method,
            paid_at=output_dto.order.paid_at,
            shipped_at=output_dto.order.shipped_at,
            tracking_number=output_dto.order.tracking_number,
            delivered_at=output_dto.order.delivered_at,
            cancelled_at=output_dto.order.cancelled_at,
            cancel_reason=output_dto.order.cancel_reason,
            notes=output_dto.order.notes,
            created_at=output_dto.order.created_at,
            items=[
                OrderItemResponse(
                    id=item.id,
                    product_id=item.product_id,
                    product_name=item.product_name,
                    product_name_ja=item.product_name_ja,
                    quantity=item.quantity,
                    unit_price=item.unit_price,
                    options=item.options,
                    subtotal=item.subtotal,
                )
                for item in output_dto.order.items
            ],
        )
    )


@router.post('', response_model=CreateOrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    request: CreateOrderRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    order_usecase: OrderUsecase = Depends(get_order_usecase),
) -> CreateOrderResponse:
    """注文作成エンドポイント"""
    input_dto = CreateOrderInputDTO(
        shipping_address_id=request.shipping_address_id,
        payment_method=request.payment_method,
        notes=request.notes,
        items=(
            [
                CreateOrderItemInputDTO(
                    product_id=item.product_id,
                    quantity=item.quantity,
                    options=item.options,
                )
                for item in request.items
            ]
            if request.items
            else None
        ),
    )
    output_dto = order_usecase.create_order(current_user.id, input_dto)

    return CreateOrderResponse(
        order=OrderDetailResponse(
            id=output_dto.order.id,
            order_number=output_dto.order.order_number,
            status=output_dto.order.status,
            shipping_address_id=output_dto.order.shipping_address_id,
            subtotal=output_dto.order.subtotal,
            shipping_fee=output_dto.order.shipping_fee,
            tax=output_dto.order.tax,
            total=output_dto.order.total,
            payment_method=output_dto.order.payment_method,
            paid_at=output_dto.order.paid_at,
            shipped_at=output_dto.order.shipped_at,
            tracking_number=output_dto.order.tracking_number,
            delivered_at=output_dto.order.delivered_at,
            cancelled_at=output_dto.order.cancelled_at,
            cancel_reason=output_dto.order.cancel_reason,
            notes=output_dto.order.notes,
            created_at=output_dto.order.created_at,
            items=[
                OrderItemResponse(
                    id=item.id,
                    product_id=item.product_id,
                    product_name=item.product_name,
                    product_name_ja=item.product_name_ja,
                    quantity=item.quantity,
                    unit_price=item.unit_price,
                    options=item.options,
                    subtotal=item.subtotal,
                )
                for item in output_dto.order.items
            ],
        ),
        message=output_dto.message,
    )


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
    input_dto = CancelOrderInputDTO(cancel_reason=request.cancel_reason)
    output_dto = order_usecase.cancel_order(current_user.id, order_id, input_dto)

    return CancelOrderResponse(
        order=OrderResponse(
            id=output_dto.order.id,
            order_number=output_dto.order.order_number,
            status=output_dto.order.status,
            subtotal=output_dto.order.subtotal,
            shipping_fee=output_dto.order.shipping_fee,
            tax=output_dto.order.tax,
            total=output_dto.order.total,
            payment_method=output_dto.order.payment_method,
            paid_at=output_dto.order.paid_at,
            shipped_at=output_dto.order.shipped_at,
            tracking_number=output_dto.order.tracking_number,
            delivered_at=output_dto.order.delivered_at,
            cancelled_at=output_dto.order.cancelled_at,
            notes=output_dto.order.notes,
            created_at=output_dto.order.created_at,
        ),
        message=output_dto.message,
    )
