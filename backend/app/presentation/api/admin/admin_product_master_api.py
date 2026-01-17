"""Admin商品マスタAPIエンドポイント"""

from fastapi import APIRouter, Depends, Query, status

from app.application.use_cases.admin.admin_product_master_usecase import (
    AdminProductMasterUsecase,
)
from app.di.admin.admin_product_master import get_admin_product_master_usecase
from app.infrastructure.security.admin_security import (
    AdminAuth,
    get_current_admin_from_cookie,
)
from app.presentation.schemas.admin.admin_product_master_schemas import (
    AdminProductMasterListResponse,
    AdminProductMasterResponse,
    CreateProductMasterRequest,
    UpdateProductMasterRequest,
)

router = APIRouter(prefix='/admin/masters', tags=['Admin ProductMasters'])


@router.get(
    '',
    response_model=AdminProductMasterListResponse,
    status_code=status.HTTP_200_OK,
)
def get_product_masters(
    model_category: str | None = Query(None, description='モデルカテゴリフィルタ'),
    is_active: bool | None = Query(None, description='有効状態フィルタ'),
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductMasterUsecase = Depends(get_admin_product_master_usecase),
) -> AdminProductMasterListResponse:
    """商品マスタ一覧を取得"""
    output_dto = usecase.get_product_masters(
        model_category=model_category,
        is_active=is_active,
    )
    return AdminProductMasterListResponse.from_dto(output_dto)


@router.post(
    '',
    response_model=AdminProductMasterResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_product_master(
    request: CreateProductMasterRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductMasterUsecase = Depends(get_admin_product_master_usecase),
) -> AdminProductMasterResponse:
    """商品マスタを作成"""
    output_dto = usecase.create_product_master(request.to_dto())
    return AdminProductMasterResponse.from_dto(output_dto)


@router.put(
    '/{master_id}',
    response_model=AdminProductMasterResponse,
    status_code=status.HTTP_200_OK,
)
def update_product_master(
    master_id: str,
    request: UpdateProductMasterRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductMasterUsecase = Depends(get_admin_product_master_usecase),
) -> AdminProductMasterResponse:
    """商品マスタを更新"""
    output_dto = usecase.update_product_master(master_id, request.to_dto())
    return AdminProductMasterResponse.from_dto(output_dto)
