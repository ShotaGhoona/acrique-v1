"""Admin商品管理APIエンドポイント"""

from fastapi import APIRouter, Depends, Query, status

from app.application.schemas.admin.admin_product_schemas import GetAdminProductsInputDTO
from app.application.use_cases.admin.admin_product_usecase import AdminProductUsecase
from app.di.admin.admin_product import get_admin_product_usecase
from app.infrastructure.security.admin_security import (
    AdminAuth,
    get_current_admin_from_cookie,
)
from app.presentation.schemas.admin.admin_product_schemas import (
    AddProductImageRequest,
    AddProductImageResponse,
    AdminProductDetailResponse,
    AdminProductFaqResponse,
    AdminProductFeatureResponse,
    AdminProductImageResponse,
    AdminProductOptionResponse,
    AdminProductResponse,
    AdminProductSpecResponse,
    CreateProductRequest,
    CreateProductResponse,
    DeleteProductImageResponse,
    DeleteProductResponse,
    GetAdminProductResponse,
    GetAdminProductsResponse,
    GetPresignedUrlRequest,
    GetPresignedUrlResponse,
    UpdateProductFaqsRequest,
    UpdateProductFaqsResponse,
    UpdateProductFeaturesRequest,
    UpdateProductFeaturesResponse,
    UpdateProductImageRequest,
    UpdateProductImageResponse,
    UpdateProductOptionsRequest,
    UpdateProductOptionsResponse,
    UpdateProductRequest,
    UpdateProductResponse,
    UpdateProductSpecsRequest,
    UpdateProductSpecsResponse,
)

router = APIRouter(prefix='/admin/products', tags=['Admin Products'])


@router.get('', response_model=GetAdminProductsResponse)
async def get_products(
    search: str | None = Query(None, description='商品名で検索'),
    category_id: str | None = Query(None, description='カテゴリフィルタ'),
    is_active: bool | None = Query(None, description='公開状態フィルタ'),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductUsecase = Depends(get_admin_product_usecase),
) -> GetAdminProductsResponse:
    """商品一覧を取得"""
    input_dto = GetAdminProductsInputDTO(
        search=search,
        category_id=category_id,
        is_active=is_active,
        limit=limit,
        offset=offset,
    )
    output = usecase.get_products(input_dto)

    return GetAdminProductsResponse(
        products=[AdminProductResponse.from_dto(p) for p in output.products],
        total=output.total,
        limit=output.limit,
        offset=output.offset,
    )


@router.post(
    '', response_model=CreateProductResponse, status_code=status.HTTP_201_CREATED
)
async def create_product(
    request: CreateProductRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductUsecase = Depends(get_admin_product_usecase),
) -> CreateProductResponse:
    """商品を作成"""
    output = usecase.create_product(request.to_dto())

    return CreateProductResponse(
        product=AdminProductDetailResponse.from_dto(output.product),
        message=output.message,
    )


@router.get('/{product_id}', response_model=GetAdminProductResponse)
async def get_product(
    product_id: str,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductUsecase = Depends(get_admin_product_usecase),
) -> GetAdminProductResponse:
    """商品詳細を取得"""
    output = usecase.get_product(product_id)

    return GetAdminProductResponse(
        product=AdminProductDetailResponse.from_dto(output.product)
    )


@router.put('/{product_id}', response_model=UpdateProductResponse)
async def update_product(
    product_id: str,
    request: UpdateProductRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductUsecase = Depends(get_admin_product_usecase),
) -> UpdateProductResponse:
    """商品を更新"""
    output = usecase.update_product(product_id, request.to_dto())

    return UpdateProductResponse(
        product=AdminProductDetailResponse.from_dto(output.product),
        message=output.message,
    )


@router.delete('/{product_id}', response_model=DeleteProductResponse)
async def delete_product(
    product_id: str,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductUsecase = Depends(get_admin_product_usecase),
) -> DeleteProductResponse:
    """商品を削除"""
    output = usecase.delete_product(product_id)

    return DeleteProductResponse(message=output.message)


# ========== 画像管理 ==========


@router.post('/{product_id}/images/presigned', response_model=GetPresignedUrlResponse)
async def get_presigned_url(
    product_id: str,
    request: GetPresignedUrlRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductUsecase = Depends(get_admin_product_usecase),
) -> GetPresignedUrlResponse:
    """画像アップロード用のPresigned URLを取得"""
    output = usecase.get_presigned_url(product_id, request.to_dto())

    return GetPresignedUrlResponse(
        upload_url=output.upload_url,
        file_url=output.file_url,
        expires_in=output.expires_in,
    )


@router.post(
    '/{product_id}/images',
    response_model=AddProductImageResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_product_image(
    product_id: str,
    request: AddProductImageRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductUsecase = Depends(get_admin_product_usecase),
) -> AddProductImageResponse:
    """商品画像を追加"""
    output = usecase.add_image(product_id, request.to_dto())

    return AddProductImageResponse(
        image=AdminProductImageResponse.from_dto(output.image),
        message=output.message,
    )


@router.put('/{product_id}/images/{image_id}', response_model=UpdateProductImageResponse)
async def update_product_image(
    product_id: str,
    image_id: int,
    request: UpdateProductImageRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductUsecase = Depends(get_admin_product_usecase),
) -> UpdateProductImageResponse:
    """商品画像を更新"""
    output = usecase.update_image(product_id, image_id, request.to_dto())

    return UpdateProductImageResponse(
        image=AdminProductImageResponse.from_dto(output.image),
        message=output.message,
    )


@router.delete(
    '/{product_id}/images/{image_id}', response_model=DeleteProductImageResponse
)
async def delete_product_image(
    product_id: str,
    image_id: int,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductUsecase = Depends(get_admin_product_usecase),
) -> DeleteProductImageResponse:
    """商品画像を削除"""
    output = usecase.delete_image(product_id, image_id)

    return DeleteProductImageResponse(message=output.message)


# ========== オプション・スペック・特長・FAQ ==========


@router.put('/{product_id}/options', response_model=UpdateProductOptionsResponse)
async def update_product_options(
    product_id: str,
    request: UpdateProductOptionsRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductUsecase = Depends(get_admin_product_usecase),
) -> UpdateProductOptionsResponse:
    """商品オプションを更新"""
    output = usecase.update_options(product_id, request.to_dto())

    return UpdateProductOptionsResponse(
        options=[AdminProductOptionResponse.from_dto(o) for o in output.options],
        message=output.message,
    )


@router.put('/{product_id}/specs', response_model=UpdateProductSpecsResponse)
async def update_product_specs(
    product_id: str,
    request: UpdateProductSpecsRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductUsecase = Depends(get_admin_product_usecase),
) -> UpdateProductSpecsResponse:
    """商品スペックを更新"""
    output = usecase.update_specs(product_id, request.to_dto())

    return UpdateProductSpecsResponse(
        specs=[AdminProductSpecResponse.from_dto(s) for s in output.specs],
        message=output.message,
    )


@router.put('/{product_id}/features', response_model=UpdateProductFeaturesResponse)
async def update_product_features(
    product_id: str,
    request: UpdateProductFeaturesRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductUsecase = Depends(get_admin_product_usecase),
) -> UpdateProductFeaturesResponse:
    """商品特長を更新"""
    output = usecase.update_features(product_id, request.to_dto())

    return UpdateProductFeaturesResponse(
        features=[AdminProductFeatureResponse.from_dto(f) for f in output.features],
        message=output.message,
    )


@router.put('/{product_id}/faqs', response_model=UpdateProductFaqsResponse)
async def update_product_faqs(
    product_id: str,
    request: UpdateProductFaqsRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminProductUsecase = Depends(get_admin_product_usecase),
) -> UpdateProductFaqsResponse:
    """商品FAQを更新"""
    output = usecase.update_faqs(product_id, request.to_dto())

    return UpdateProductFaqsResponse(
        faqs=[AdminProductFaqResponse.from_dto(f) for f in output.faqs],
        message=output.message,
    )
