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
    ProductFaqResponse,
    ProductFeatureResponse,
    ProductImageResponse,
    ProductListItemResponse,
    ProductListResponse,
    ProductOptionResponse,
    ProductOptionsResponse,
    ProductOptionValueResponse,
    ProductRelatedResponse,
    ProductSearchResponse,
    ProductSpecResponse,
    RelatedProductResponse,
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

    return ProductListResponse(
        products=[
            ProductListItemResponse(
                id=p.id,
                category_id=p.category_id,
                name=p.name,
                name_ja=p.name_ja,
                slug=p.slug,
                tagline=p.tagline,
                base_price=p.base_price,
                price_note=p.price_note,
                is_featured=p.is_featured,
                main_image_url=p.main_image_url,
                images=[
                    ProductImageResponse(
                        id=img.id,
                        url=img.url,
                        alt=img.alt,
                        is_main=img.is_main,
                        sort_order=img.sort_order,
                    )
                    for img in p.images
                ],
            )
            for p in output_dto.products
        ],
        total=output_dto.total,
        limit=output_dto.limit,
        offset=output_dto.offset,
    )


@router.get(
    '/featured', response_model=ProductListResponse, status_code=status.HTTP_200_OK
)
def get_featured_products(
    limit: int = Query(10, ge=1, le=50, description='取得件数'),
    product_usecase: ProductUsecase = Depends(get_product_usecase),
) -> ProductListResponse:
    """おすすめ商品を取得"""
    output_dto = product_usecase.get_featured_products(limit=limit)

    return ProductListResponse(
        products=[
            ProductListItemResponse(
                id=p.id,
                category_id=p.category_id,
                name=p.name,
                name_ja=p.name_ja,
                slug=p.slug,
                tagline=p.tagline,
                base_price=p.base_price,
                price_note=p.price_note,
                is_featured=p.is_featured,
                main_image_url=p.main_image_url,
                images=[
                    ProductImageResponse(
                        id=img.id,
                        url=img.url,
                        alt=img.alt,
                        is_main=img.is_main,
                        sort_order=img.sort_order,
                    )
                    for img in p.images
                ],
            )
            for p in output_dto.products
        ],
        total=output_dto.total,
        limit=output_dto.limit,
        offset=output_dto.offset,
    )


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

    return ProductSearchResponse(
        products=[
            ProductListItemResponse(
                id=p.id,
                category_id=p.category_id,
                name=p.name,
                name_ja=p.name_ja,
                slug=p.slug,
                tagline=p.tagline,
                base_price=p.base_price,
                price_note=p.price_note,
                is_featured=p.is_featured,
                main_image_url=p.main_image_url,
                images=[
                    ProductImageResponse(
                        id=img.id,
                        url=img.url,
                        alt=img.alt,
                        is_main=img.is_main,
                        sort_order=img.sort_order,
                    )
                    for img in p.images
                ],
            )
            for p in output_dto.products
        ],
        total=output_dto.total,
        keyword=output_dto.keyword,
        category_id=output_dto.category_id,
        limit=output_dto.limit,
        offset=output_dto.offset,
    )


@router.get(
    '/{product_id}', response_model=ProductDetailResponse, status_code=status.HTTP_200_OK
)
def get_product(
    product_id: str,
    product_usecase: ProductUsecase = Depends(get_product_usecase),
) -> ProductDetailResponse:
    """商品詳細を取得"""
    output_dto = product_usecase.get_product_by_id(product_id)

    return ProductDetailResponse(
        id=output_dto.id,
        category_id=output_dto.category_id,
        name=output_dto.name,
        name_ja=output_dto.name_ja,
        slug=output_dto.slug,
        tagline=output_dto.tagline,
        description=output_dto.description,
        long_description=output_dto.long_description,
        base_price=output_dto.base_price,
        price_note=output_dto.price_note,
        lead_time_days=output_dto.lead_time_days,
        lead_time_note=output_dto.lead_time_note,
        requires_upload=output_dto.requires_upload,
        upload_type=output_dto.upload_type,
        upload_note=output_dto.upload_note,
        is_featured=output_dto.is_featured,
        images=[
            ProductImageResponse(
                id=img.id,
                url=img.url,
                alt=img.alt,
                is_main=img.is_main,
                sort_order=img.sort_order,
            )
            for img in output_dto.images
        ],
        options=[
            ProductOptionResponse(
                id=opt.id,
                name=opt.name,
                is_required=opt.is_required,
                sort_order=opt.sort_order,
                values=[
                    ProductOptionValueResponse(
                        id=v.id,
                        label=v.label,
                        price_diff=v.price_diff,
                        description=v.description,
                        sort_order=v.sort_order,
                    )
                    for v in opt.values
                ],
            )
            for opt in output_dto.options
        ],
        specs=[
            ProductSpecResponse(
                id=spec.id,
                label=spec.label,
                value=spec.value,
                sort_order=spec.sort_order,
            )
            for spec in output_dto.specs
        ],
        features=[
            ProductFeatureResponse(
                id=feature.id,
                title=feature.title,
                description=feature.description,
                sort_order=feature.sort_order,
            )
            for feature in output_dto.features
        ],
        faqs=[
            ProductFaqResponse(
                id=faq.id,
                question=faq.question,
                answer=faq.answer,
                sort_order=faq.sort_order,
            )
            for faq in output_dto.faqs
        ],
        created_at=output_dto.created_at,
        updated_at=output_dto.updated_at,
    )


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

    return ProductOptionsResponse(
        product_id=output_dto.product_id,
        options=[
            ProductOptionResponse(
                id=opt.id,
                name=opt.name,
                is_required=opt.is_required,
                sort_order=opt.sort_order,
                values=[
                    ProductOptionValueResponse(
                        id=v.id,
                        label=v.label,
                        price_diff=v.price_diff,
                        description=v.description,
                        sort_order=v.sort_order,
                    )
                    for v in opt.values
                ],
            )
            for opt in output_dto.options
        ],
    )


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

    return ProductRelatedResponse(
        product_id=output_dto.product_id,
        related_products=[
            RelatedProductResponse(
                id=p.id,
                name=p.name,
                name_ja=p.name_ja,
                slug=p.slug,
                base_price=p.base_price,
                main_image_url=p.main_image_url,
            )
            for p in output_dto.related_products
        ],
    )
