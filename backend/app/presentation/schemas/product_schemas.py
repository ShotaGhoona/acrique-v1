"""商品プレゼンテーション層スキーマ"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.application.schemas.product_schemas import (
    ProductDetailDTO,
    ProductFaqDTO,
    ProductFeatureDTO,
    ProductImageDTO,
    ProductListItemDTO,
    ProductListOutputDTO,
    ProductOptionDTO,
    ProductOptionsOutputDTO,
    ProductOptionValueDTO,
    ProductRelatedOutputDTO,
    ProductSearchInputDTO,
    ProductSearchOutputDTO,
    ProductSpecDTO,
    RelatedProductDTO,
)

# ===================
# Response Schemas
# ===================


class ProductImageResponse(BaseModel):
    """商品画像レスポンス"""

    id: int
    url: str
    alt: str | None
    is_main: bool
    sort_order: int

    @classmethod
    def from_dto(cls, dto: ProductImageDTO) -> ProductImageResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


class ProductOptionValueResponse(BaseModel):
    """商品オプション値レスポンス"""

    id: int
    label: str
    price_diff: int
    description: str | None
    sort_order: int

    @classmethod
    def from_dto(cls, dto: ProductOptionValueDTO) -> ProductOptionValueResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


class ProductOptionResponse(BaseModel):
    """商品オプションレスポンス"""

    id: int
    name: str
    is_required: bool
    sort_order: int
    values: list[ProductOptionValueResponse]

    @classmethod
    def from_dto(cls, dto: ProductOptionDTO) -> ProductOptionResponse:
        """DTO → Response 変換"""
        return cls(
            id=dto.id,
            name=dto.name,
            is_required=dto.is_required,
            sort_order=dto.sort_order,
            values=[ProductOptionValueResponse.from_dto(v) for v in dto.values],
        )


class ProductSpecResponse(BaseModel):
    """商品スペックレスポンス"""

    id: int
    label: str
    value: str
    sort_order: int

    @classmethod
    def from_dto(cls, dto: ProductSpecDTO) -> ProductSpecResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


class ProductFeatureResponse(BaseModel):
    """商品特長レスポンス"""

    id: int
    title: str
    description: str | None
    sort_order: int

    @classmethod
    def from_dto(cls, dto: ProductFeatureDTO) -> ProductFeatureResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


class ProductFaqResponse(BaseModel):
    """商品FAQレスポンス"""

    id: int
    question: str
    answer: str
    sort_order: int

    @classmethod
    def from_dto(cls, dto: ProductFaqDTO) -> ProductFaqResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


class ProductListItemResponse(BaseModel):
    """商品一覧アイテムレスポンス"""

    id: str
    category_id: str
    name: str
    name_ja: str
    slug: str | None
    tagline: str | None
    base_price: int
    price_note: str | None
    is_featured: bool
    main_image_url: str | None
    images: list[ProductImageResponse]

    @classmethod
    def from_dto(cls, dto: ProductListItemDTO) -> ProductListItemResponse:
        """DTO → Response 変換"""
        return cls(
            id=dto.id,
            category_id=dto.category_id,
            name=dto.name,
            name_ja=dto.name_ja,
            slug=dto.slug,
            tagline=dto.tagline,
            base_price=dto.base_price,
            price_note=dto.price_note,
            is_featured=dto.is_featured,
            main_image_url=dto.main_image_url,
            images=[ProductImageResponse.from_dto(img) for img in dto.images],
        )


class ProductListResponse(BaseModel):
    """商品一覧レスポンス"""

    products: list[ProductListItemResponse]
    total: int
    limit: int
    offset: int

    @classmethod
    def from_dto(cls, dto: ProductListOutputDTO) -> ProductListResponse:
        """DTO → Response 変換"""
        return cls(
            products=[ProductListItemResponse.from_dto(p) for p in dto.products],
            total=dto.total,
            limit=dto.limit,
            offset=dto.offset,
        )


class ProductDetailResponse(BaseModel):
    """商品詳細レスポンス"""

    id: str
    category_id: str
    name: str
    name_ja: str
    slug: str | None
    tagline: str | None
    description: str | None
    long_description: str | None
    base_price: int
    price_note: str | None
    lead_time_days: int | None
    lead_time_note: str | None
    requires_upload: bool
    upload_type: str | None
    upload_note: str | None
    is_featured: bool
    images: list[ProductImageResponse]
    options: list[ProductOptionResponse]
    specs: list[ProductSpecResponse]
    features: list[ProductFeatureResponse]
    faqs: list[ProductFaqResponse]
    created_at: datetime | None
    updated_at: datetime | None

    @classmethod
    def from_dto(cls, dto: ProductDetailDTO) -> ProductDetailResponse:
        """DTO → Response 変換"""
        return cls(
            id=dto.id,
            category_id=dto.category_id,
            name=dto.name,
            name_ja=dto.name_ja,
            slug=dto.slug,
            tagline=dto.tagline,
            description=dto.description,
            long_description=dto.long_description,
            base_price=dto.base_price,
            price_note=dto.price_note,
            lead_time_days=dto.lead_time_days,
            lead_time_note=dto.lead_time_note,
            requires_upload=dto.requires_upload,
            upload_type=dto.upload_type,
            upload_note=dto.upload_note,
            is_featured=dto.is_featured,
            images=[ProductImageResponse.from_dto(img) for img in dto.images],
            options=[ProductOptionResponse.from_dto(opt) for opt in dto.options],
            specs=[ProductSpecResponse.from_dto(spec) for spec in dto.specs],
            features=[ProductFeatureResponse.from_dto(f) for f in dto.features],
            faqs=[ProductFaqResponse.from_dto(faq) for faq in dto.faqs],
            created_at=dto.created_at,
            updated_at=dto.updated_at,
        )


class RelatedProductResponse(BaseModel):
    """関連商品レスポンス"""

    id: str
    name: str
    name_ja: str
    slug: str | None
    base_price: int
    main_image_url: str | None

    @classmethod
    def from_dto(cls, dto: RelatedProductDTO) -> RelatedProductResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


class ProductOptionsResponse(BaseModel):
    """商品オプションレスポンス"""

    product_id: str
    options: list[ProductOptionResponse]

    @classmethod
    def from_dto(cls, dto: ProductOptionsOutputDTO) -> ProductOptionsResponse:
        """DTO → Response 変換"""
        return cls(
            product_id=dto.product_id,
            options=[ProductOptionResponse.from_dto(opt) for opt in dto.options],
        )


class ProductRelatedResponse(BaseModel):
    """関連商品レスポンス"""

    product_id: str
    related_products: list[RelatedProductResponse]

    @classmethod
    def from_dto(cls, dto: ProductRelatedOutputDTO) -> ProductRelatedResponse:
        """DTO → Response 変換"""
        return cls(
            product_id=dto.product_id,
            related_products=[
                RelatedProductResponse.from_dto(p) for p in dto.related_products
            ],
        )


class ProductSearchResponse(BaseModel):
    """商品検索レスポンス"""

    products: list[ProductListItemResponse]
    total: int
    keyword: str
    category_id: str | None
    limit: int
    offset: int

    @classmethod
    def from_dto(cls, dto: ProductSearchOutputDTO) -> ProductSearchResponse:
        """DTO → Response 変換"""
        return cls(
            products=[ProductListItemResponse.from_dto(p) for p in dto.products],
            total=dto.total,
            keyword=dto.keyword,
            category_id=dto.category_id,
            limit=dto.limit,
            offset=dto.offset,
        )


# ===================
# Request Schemas
# ===================


class ProductSearchRequest(BaseModel):
    """商品検索リクエスト"""

    keyword: str = Field(..., min_length=1, description='検索キーワード')
    category_id: str | None = Field(None, description='カテゴリID')
    limit: int = Field(20, ge=1, le=100, description='取得件数')
    offset: int = Field(0, ge=0, description='オフセット')

    def to_dto(self) -> ProductSearchInputDTO:
        """Request → DTO 変換"""
        return ProductSearchInputDTO(**self.model_dump())
