"""商品API"""

from fastapi import APIRouter, Depends, Query, status

from app.application.schemas.product_schemas import (
    ProductListInputDTO,
    ProductSearchInputDTO,
)
from app.application.use_cases.product_usecase import ProductUsecase
from app.di.product import get_product_usecase
from app.presentation.schemas.product_schemas import (
    ProductDetailResponse,
    ProductListResponse,
    ProductOptionsResponse,
    ProductRelatedResponse,
    ProductSearchResponse,
)

router = APIRouter(prefix='/products', tags=['商品'])


@router.get('', response_model=ProductListResponse, status_code=status.HTTP_200_OK)
def get_products(
    category_id: str | None = Query(None, description='カテゴリID (shop/office/you)'),
    is_featured: bool | None = Query(None, description='おすすめ商品のみ'),
    limit: int = Query(20, ge=1, le=100, description='取得件数'),
    offset: int = Query(0, ge=0, description='オフセット'),
    product_usecase: ProductUsecase = Depends(get_product_usecase),
) -> ProductListResponse:
    """商品一覧を取得"""
    input_dto = ProductListInputDTO(
        category_id=category_id,
        is_featured=is_featured,
        limit=limit,
        offset=offset,
    )
    output_dto = product_usecase.get_products(input_dto)
    return ProductListResponse.from_dto(output_dto)


@router.get(
    '/featured', response_model=ProductListResponse, status_code=status.HTTP_200_OK
)
def get_featured_products(
    limit: int = Query(10, ge=1, le=50, description='取得件数'),
    product_usecase: ProductUsecase = Depends(get_product_usecase),
) -> ProductListResponse:
    """おすすめ商品を取得"""
    output_dto = product_usecase.get_featured_products(limit=limit)
    return ProductListResponse.from_dto(output_dto)


@router.get(
    '/search', response_model=ProductSearchResponse, status_code=status.HTTP_200_OK
)
def search_products(
    keyword: str = Query(..., min_length=1, description='検索キーワード'),
    category_id: str | None = Query(None, description='カテゴリID'),
    limit: int = Query(20, ge=1, le=100, description='取得件数'),
    offset: int = Query(0, ge=0, description='オフセット'),
    product_usecase: ProductUsecase = Depends(get_product_usecase),
) -> ProductSearchResponse:
    """商品を検索"""
    input_dto = ProductSearchInputDTO(
        keyword=keyword,
        category_id=category_id,
        limit=limit,
        offset=offset,
    )
    output_dto = product_usecase.search_products(input_dto)
    return ProductSearchResponse.from_dto(output_dto)


@router.get(
    '/{product_id}', response_model=ProductDetailResponse, status_code=status.HTTP_200_OK
)
def get_product(
    product_id: str,
    product_usecase: ProductUsecase = Depends(get_product_usecase),
) -> ProductDetailResponse:
    """商品詳細を取得"""
    output_dto = product_usecase.get_product_by_id(product_id)
    return ProductDetailResponse.from_dto(output_dto)


@router.get(
    '/{product_id}/options',
    response_model=ProductOptionsResponse,
    status_code=status.HTTP_200_OK,
)
def get_product_options(
    product_id: str,
    product_usecase: ProductUsecase = Depends(get_product_usecase),
) -> ProductOptionsResponse:
    """商品オプションを取得"""
    output_dto = product_usecase.get_product_options(product_id)
    return ProductOptionsResponse.from_dto(output_dto)


@router.get(
    '/{product_id}/related',
    response_model=ProductRelatedResponse,
    status_code=status.HTTP_200_OK,
)
def get_related_products(
    product_id: str,
    product_usecase: ProductUsecase = Depends(get_product_usecase),
) -> ProductRelatedResponse:
    """関連商品を取得"""
    output_dto = product_usecase.get_related_products(product_id)
    return ProductRelatedResponse.from_dto(output_dto)
