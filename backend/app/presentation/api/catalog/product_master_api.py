"""商品マスタAPI（公開API）"""

from fastapi import APIRouter, Depends, status

from app.application.use_cases.catalog.product_master_usecase import ProductMasterUsecase
from app.di.catalog.product_master import get_product_master_usecase
from app.presentation.schemas.catalog.product_master_schemas import (
    ProductMasterListResponse,
)

router = APIRouter(prefix='/masters', tags=['商品マスタ'])


@router.get(
    '',
    response_model=ProductMasterListResponse,
    status_code=status.HTTP_200_OK,
)
def get_product_masters(
    usecase: ProductMasterUsecase = Depends(get_product_master_usecase),
) -> ProductMasterListResponse:
    """商品マスタ一覧を取得"""
    output_dto = usecase.get_product_masters()
    return ProductMasterListResponse.from_dto(output_dto)
