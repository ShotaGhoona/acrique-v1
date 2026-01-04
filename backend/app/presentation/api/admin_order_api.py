"""Admin注文管理APIエンドポイント"""

from datetime import datetime

from fastapi import APIRouter, Depends, Query

from app.application.schemas.admin_order_schemas import GetAdminOrdersInputDTO
from app.application.use_cases.admin_order_usecase import AdminOrderUsecase
from app.di.admin_order import get_admin_order_usecase
from app.domain.entities.order import OrderStatus
from app.infrastructure.security.admin_security import (
    AdminAuth,
    get_current_admin_from_cookie,
)
from app.presentation.schemas.admin_order_schemas import (
    AdminOrderDetailResponse,
    AdminOrderResponse,
    GetAdminOrderResponse,
    GetAdminOrdersResponse,
    ShipOrderRequest,
    ShipOrderResponse,
    UpdateAdminOrderRequest,
    UpdateAdminOrderResponse,
    UpdateOrderStatusRequest,
    UpdateOrderStatusResponse,
)

router = APIRouter(prefix='/admin/orders', tags=['Admin Orders'])


@router.get('', response_model=GetAdminOrdersResponse)
async def get_orders(
    search: str | None = Query(None, description='注文番号/顧客名/メールで検索'),
    status: list[str] | None = Query(None, description='ステータスフィルタ'),
    date_from: datetime | None = Query(None, description='開始日'),
    date_to: datetime | None = Query(None, description='終了日'),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminOrderUsecase = Depends(get_admin_order_usecase),
) -> GetAdminOrdersResponse:
    """注文一覧を取得"""
    status_list = [OrderStatus(s) for s in status] if status else None

    input_dto = GetAdminOrdersInputDTO(
        search=search,
        status=status_list,
        date_from=date_from,
        date_to=date_to,
        limit=limit,
        offset=offset,
    )
    output = usecase.get_orders(input_dto)

    return GetAdminOrdersResponse(
        orders=[AdminOrderResponse.from_dto(order) for order in output.orders],
        total=output.total,
        limit=output.limit,
        offset=output.offset,
    )


@router.get('/{order_id}', response_model=GetAdminOrderResponse)
async def get_order(
    order_id: int,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminOrderUsecase = Depends(get_admin_order_usecase),
) -> GetAdminOrderResponse:
    """注文詳細を取得"""
    output = usecase.get_order(order_id)

    return GetAdminOrderResponse(order=AdminOrderDetailResponse.from_dto(output.order))


@router.put('/{order_id}', response_model=UpdateAdminOrderResponse)
async def update_order(
    order_id: int,
    request: UpdateAdminOrderRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminOrderUsecase = Depends(get_admin_order_usecase),
) -> UpdateAdminOrderResponse:
    """注文を更新"""
    output = usecase.update_order(order_id, request.to_dto())

    return UpdateAdminOrderResponse(
        order=AdminOrderDetailResponse.from_dto(output.order),
        message=output.message,
    )


@router.put('/{order_id}/status', response_model=UpdateOrderStatusResponse)
async def update_order_status(
    order_id: int,
    request: UpdateOrderStatusRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminOrderUsecase = Depends(get_admin_order_usecase),
) -> UpdateOrderStatusResponse:
    """ステータスを更新"""
    output = usecase.update_status(order_id, request.to_dto())

    return UpdateOrderStatusResponse(
        order=AdminOrderDetailResponse.from_dto(output.order),
        message=output.message,
    )


@router.post('/{order_id}/ship', response_model=ShipOrderResponse)
async def ship_order(
    order_id: int,
    request: ShipOrderRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminOrderUsecase = Depends(get_admin_order_usecase),
) -> ShipOrderResponse:
    """発送処理"""
    output = usecase.ship_order(order_id, request.to_dto())

    return ShipOrderResponse(
        order=AdminOrderDetailResponse.from_dto(output.order),
        message=output.message,
    )
