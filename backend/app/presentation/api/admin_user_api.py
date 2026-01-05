"""顧客管理APIエンドポイント"""

from fastapi import APIRouter, Depends, Query, status

from app.application.schemas.admin_user_schemas import (
    GetCustomerOrdersInputDTO,
    GetCustomersInputDTO,
)
from app.application.use_cases.admin_user_usecase import AdminUserUsecase
from app.di.admin_user import get_admin_user_usecase
from app.infrastructure.security.admin_security import (
    AdminAuth,
    get_current_admin_from_cookie,
)
from app.presentation.schemas.admin_user_schemas import (
    GetCustomerOrdersResponse,
    GetCustomerResponse,
    GetCustomersResponse,
)

router = APIRouter(prefix='/admin/users', tags=['顧客管理'])


@router.get('', response_model=GetCustomersResponse, status_code=status.HTTP_200_OK)
def get_customers(
    search: str | None = Query(None, description='検索キーワード（email/name）'),
    limit: int = Query(20, ge=1, le=100, description='取得件数'),
    offset: int = Query(0, ge=0, description='オフセット'),
    current_admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminUserUsecase = Depends(get_admin_user_usecase),
) -> GetCustomersResponse:
    """顧客一覧取得

    顧客の一覧を取得する。検索キーワードでメールアドレス・氏名を絞り込み可能。
    """
    input_dto = GetCustomersInputDTO(search=search, limit=limit, offset=offset)
    output_dto = usecase.get_customers(input_dto)
    return GetCustomersResponse.from_dto(output_dto)


@router.get(
    '/{user_id}', response_model=GetCustomerResponse, status_code=status.HTTP_200_OK
)
def get_customer(
    user_id: int,
    current_admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminUserUsecase = Depends(get_admin_user_usecase),
) -> GetCustomerResponse:
    """顧客詳細取得

    指定したユーザーIDの顧客詳細を取得する。
    注文数・累計購入金額を含む。
    """
    output_dto = usecase.get_customer(user_id)
    return GetCustomerResponse.from_dto(output_dto)


@router.get(
    '/{user_id}/orders',
    response_model=GetCustomerOrdersResponse,
    status_code=status.HTTP_200_OK,
)
def get_customer_orders(
    user_id: int,
    limit: int = Query(20, ge=1, le=100, description='取得件数'),
    offset: int = Query(0, ge=0, description='オフセット'),
    current_admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminUserUsecase = Depends(get_admin_user_usecase),
) -> GetCustomerOrdersResponse:
    """顧客の注文履歴取得

    指定したユーザーIDの注文履歴を取得する。
    """
    input_dto = GetCustomerOrdersInputDTO(limit=limit, offset=offset)
    output_dto = usecase.get_customer_orders(user_id, input_dto)
    return GetCustomerOrdersResponse.from_dto(output_dto)
