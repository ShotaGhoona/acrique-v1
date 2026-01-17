"""Admin商品管理リクエスト/レスポンススキーマ"""

from datetime import datetime

from pydantic import BaseModel, Field

from app.application.schemas.admin.admin_product_schemas import (
    AddProductImageInputDTO,
    AdminProductDetailDTO,
    AdminProductDTO,
    AdminProductFaqDTO,
    AdminProductFeatureDTO,
    AdminProductImageDTO,
    AdminProductOptionDTO,
    AdminProductOptionValueDTO,
    AdminProductSpecDTO,
    CreateProductInputDTO,
    GetPresignedUrlInputDTO,
    UpdateProductFaqsInputDTO,
    UpdateProductFeaturesInputDTO,
    UpdateProductImageInputDTO,
    UpdateProductInputDTO,
    UpdateProductOptionsInputDTO,
    UpdateProductSpecsInputDTO,
)

# ========== Response Models ==========


class AdminProductImageResponse(BaseModel):
    """商品画像レスポンス"""

    id: int
    s3_url: str
    alt: str | None
    is_main: bool
    sort_order: int

    @classmethod
    def from_dto(cls, dto: AdminProductImageDTO) -> 'AdminProductImageResponse':
        return cls(
            id=dto.id,
            s3_url=dto.s3_url,
            alt=dto.alt,
            is_main=dto.is_main,
            sort_order=dto.sort_order,
        )


class AdminProductOptionValueResponse(BaseModel):
    """オプション値レスポンス"""

    id: int | None
    label: str
    price_diff: int
    description: str | None
    sort_order: int


class AdminProductOptionResponse(BaseModel):
    """オプションレスポンス"""

    id: int | None
    name: str
    is_required: bool
    sort_order: int
    values: list[AdminProductOptionValueResponse]

    @classmethod
    def from_dto(cls, dto: AdminProductOptionDTO) -> 'AdminProductOptionResponse':
        return cls(
            id=dto.id,
            name=dto.name,
            is_required=dto.is_required,
            sort_order=dto.sort_order,
            values=[
                AdminProductOptionValueResponse(
                    id=v.id,
                    label=v.label,
                    price_diff=v.price_diff,
                    description=v.description,
                    sort_order=v.sort_order,
                )
                for v in dto.values
            ],
        )


class AdminProductSpecResponse(BaseModel):
    """スペックレスポンス"""

    id: int | None
    label: str
    value: str
    sort_order: int

    @classmethod
    def from_dto(cls, dto: AdminProductSpecDTO) -> 'AdminProductSpecResponse':
        return cls(
            id=dto.id,
            label=dto.label,
            value=dto.value,
            sort_order=dto.sort_order,
        )


class AdminProductFeatureResponse(BaseModel):
    """特長レスポンス"""

    id: int | None
    title: str
    description: str
    sort_order: int

    @classmethod
    def from_dto(cls, dto: AdminProductFeatureDTO) -> 'AdminProductFeatureResponse':
        return cls(
            id=dto.id,
            title=dto.title,
            description=dto.description,
            sort_order=dto.sort_order,
        )


class AdminProductFaqResponse(BaseModel):
    """FAQレスポンス"""

    id: int | None
    question: str
    answer: str
    sort_order: int

    @classmethod
    def from_dto(cls, dto: AdminProductFaqDTO) -> 'AdminProductFaqResponse':
        return cls(
            id=dto.id,
            question=dto.question,
            answer=dto.answer,
            sort_order=dto.sort_order,
        )


class AdminProductResponse(BaseModel):
    """商品レスポンス（一覧用）"""

    id: str
    name: str
    name_ja: str | None
    slug: str
    tagline: str | None
    base_price: int
    category_id: str
    is_active: bool
    is_featured: bool
    sort_order: int
    created_at: datetime | None
    updated_at: datetime | None
    main_image_url: str | None

    @classmethod
    def from_dto(cls, dto: AdminProductDTO) -> 'AdminProductResponse':
        return cls(
            id=dto.id,
            name=dto.name,
            name_ja=dto.name_ja,
            slug=dto.slug,
            tagline=dto.tagline,
            base_price=dto.base_price,
            category_id=dto.category_id,
            is_active=dto.is_active,
            is_featured=dto.is_featured,
            sort_order=dto.sort_order,
            created_at=dto.created_at,
            updated_at=dto.updated_at,
            main_image_url=dto.main_image_url,
        )


class AdminProductDetailResponse(AdminProductResponse):
    """商品詳細レスポンス"""

    description: str | None
    long_description: str | None
    price_note: str | None
    lead_time_days: int | None
    lead_time_note: str | None
    requires_upload: bool
    upload_type: str | None
    upload_note: str | None
    images: list[AdminProductImageResponse]
    options: list[AdminProductOptionResponse]
    specs: list[AdminProductSpecResponse]
    features: list[AdminProductFeatureResponse]
    faqs: list[AdminProductFaqResponse]

    @classmethod
    def from_dto(cls, dto: AdminProductDetailDTO) -> 'AdminProductDetailResponse':
        return cls(
            id=dto.id,
            name=dto.name,
            name_ja=dto.name_ja,
            slug=dto.slug,
            tagline=dto.tagline,
            description=dto.description,
            long_description=dto.long_description,
            base_price=dto.base_price,
            price_note=dto.price_note,
            category_id=dto.category_id,
            lead_time_days=dto.lead_time_days,
            lead_time_note=dto.lead_time_note,
            requires_upload=dto.requires_upload,
            upload_type=dto.upload_type,
            upload_note=dto.upload_note,
            is_active=dto.is_active,
            is_featured=dto.is_featured,
            sort_order=dto.sort_order,
            created_at=dto.created_at,
            updated_at=dto.updated_at,
            main_image_url=dto.main_image_url,
            images=[AdminProductImageResponse.from_dto(i) for i in dto.images],
            options=[AdminProductOptionResponse.from_dto(o) for o in dto.options],
            specs=[AdminProductSpecResponse.from_dto(s) for s in dto.specs],
            features=[AdminProductFeatureResponse.from_dto(f) for f in dto.features],
            faqs=[AdminProductFaqResponse.from_dto(f) for f in dto.faqs],
        )


class GetAdminProductsResponse(BaseModel):
    """商品一覧レスポンス"""

    products: list[AdminProductResponse]
    total: int
    limit: int
    offset: int


class GetAdminProductResponse(BaseModel):
    """商品詳細レスポンス"""

    product: AdminProductDetailResponse


class CreateProductResponse(BaseModel):
    """商品作成レスポンス"""

    product: AdminProductDetailResponse
    message: str


class UpdateProductResponse(BaseModel):
    """商品更新レスポンス"""

    product: AdminProductDetailResponse
    message: str


class DeleteProductResponse(BaseModel):
    """商品削除レスポンス"""

    message: str


# ========== 画像管理 ==========


class GetPresignedUrlResponse(BaseModel):
    """Presigned URL取得レスポンス"""

    upload_url: str
    file_url: str
    expires_in: int


class AddProductImageResponse(BaseModel):
    """画像追加レスポンス"""

    image: AdminProductImageResponse
    message: str


class UpdateProductImageResponse(BaseModel):
    """画像更新レスポンス"""

    image: AdminProductImageResponse
    message: str


class DeleteProductImageResponse(BaseModel):
    """画像削除レスポンス"""

    message: str


# ========== オプション・スペック・特長・FAQ ==========


class UpdateProductOptionsResponse(BaseModel):
    """オプション更新レスポンス"""

    options: list[AdminProductOptionResponse]
    message: str


class UpdateProductSpecsResponse(BaseModel):
    """スペック更新レスポンス"""

    specs: list[AdminProductSpecResponse]
    message: str


class UpdateProductFeaturesResponse(BaseModel):
    """特長更新レスポンス"""

    features: list[AdminProductFeatureResponse]
    message: str


class UpdateProductFaqsResponse(BaseModel):
    """FAQ更新レスポンス"""

    faqs: list[AdminProductFaqResponse]
    message: str


# ========== Request Models ==========


class CreateProductRequest(BaseModel):
    """商品作成リクエスト"""

    id: str = Field(..., min_length=1, max_length=100, pattern=r'^[a-z0-9-]+$')
    name: str = Field(..., min_length=1, max_length=200)
    name_ja: str | None = Field(None, max_length=200)
    slug: str = Field(..., min_length=1, max_length=200, pattern=r'^[a-z0-9-]+$')
    tagline: str | None = Field(None, max_length=500)
    description: str | None = None
    long_description: str | None = None
    base_price: int = Field(..., ge=0)
    price_note: str | None = Field(None, max_length=200)
    category_id: str = Field(..., min_length=1, max_length=50)
    lead_time_days: int | None = Field(None, ge=0)
    lead_time_note: str | None = Field(None, max_length=200)
    requires_upload: bool = False
    upload_type: str | None = Field(None, max_length=50)
    upload_note: str | None = Field(None, max_length=500)
    is_active: bool = False
    is_featured: bool = False
    sort_order: int = 0

    def to_dto(self) -> CreateProductInputDTO:
        return CreateProductInputDTO(
            id=self.id,
            name=self.name,
            name_ja=self.name_ja,
            slug=self.slug,
            tagline=self.tagline,
            description=self.description,
            long_description=self.long_description,
            base_price=self.base_price,
            price_note=self.price_note,
            category_id=self.category_id,
            lead_time_days=self.lead_time_days,
            lead_time_note=self.lead_time_note,
            requires_upload=self.requires_upload,
            upload_type=self.upload_type,
            upload_note=self.upload_note,
            is_active=self.is_active,
            is_featured=self.is_featured,
            sort_order=self.sort_order,
        )


class UpdateProductRequest(BaseModel):
    """商品更新リクエスト"""

    name: str | None = Field(None, min_length=1, max_length=200)
    name_ja: str | None = Field(None, max_length=200)
    slug: str | None = Field(None, min_length=1, max_length=200, pattern=r'^[a-z0-9-]+$')
    tagline: str | None = Field(None, max_length=500)
    description: str | None = None
    long_description: str | None = None
    base_price: int | None = Field(None, ge=0)
    price_note: str | None = Field(None, max_length=200)
    category_id: str | None = Field(None, min_length=1, max_length=50)
    lead_time_days: int | None = Field(None, ge=0)
    lead_time_note: str | None = Field(None, max_length=200)
    requires_upload: bool | None = None
    upload_type: str | None = Field(None, max_length=50)
    upload_note: str | None = Field(None, max_length=500)
    is_active: bool | None = None
    is_featured: bool | None = None
    sort_order: int | None = None

    def to_dto(self) -> UpdateProductInputDTO:
        return UpdateProductInputDTO(
            name=self.name,
            name_ja=self.name_ja,
            slug=self.slug,
            tagline=self.tagline,
            description=self.description,
            long_description=self.long_description,
            base_price=self.base_price,
            price_note=self.price_note,
            category_id=self.category_id,
            lead_time_days=self.lead_time_days,
            lead_time_note=self.lead_time_note,
            requires_upload=self.requires_upload,
            upload_type=self.upload_type,
            upload_note=self.upload_note,
            is_active=self.is_active,
            is_featured=self.is_featured,
            sort_order=self.sort_order,
        )


# ========== 画像管理リクエスト ==========


class GetPresignedUrlRequest(BaseModel):
    """Presigned URL取得リクエスト"""

    file_name: str = Field(..., min_length=1, max_length=200)
    content_type: str = Field(..., min_length=1, max_length=100)

    def to_dto(self) -> GetPresignedUrlInputDTO:
        return GetPresignedUrlInputDTO(
            file_name=self.file_name,
            content_type=self.content_type,
        )


class AddProductImageRequest(BaseModel):
    """画像追加リクエスト"""

    s3_url: str = Field(..., min_length=1)
    alt: str | None = Field(None, max_length=500)
    is_main: bool = False
    sort_order: int = 0

    def to_dto(self) -> AddProductImageInputDTO:
        return AddProductImageInputDTO(
            s3_url=self.s3_url,
            alt=self.alt,
            is_main=self.is_main,
            sort_order=self.sort_order,
        )


class UpdateProductImageRequest(BaseModel):
    """画像更新リクエスト"""

    alt: str | None = Field(None, max_length=500)
    is_main: bool | None = None
    sort_order: int | None = None

    def to_dto(self) -> UpdateProductImageInputDTO:
        return UpdateProductImageInputDTO(
            alt=self.alt,
            is_main=self.is_main,
            sort_order=self.sort_order,
        )


# ========== オプション・スペック・特長・FAQリクエスト ==========


class ProductOptionValueRequest(BaseModel):
    """オプション値リクエスト"""

    label: str = Field(..., min_length=1, max_length=100)
    price_diff: int = 0
    description: str | None = Field(None, max_length=500)
    sort_order: int = 0


class ProductOptionRequest(BaseModel):
    """オプションリクエスト"""

    name: str = Field(..., min_length=1, max_length=100)
    is_required: bool = False
    sort_order: int = 0
    values: list[ProductOptionValueRequest] = []


class UpdateProductOptionsRequest(BaseModel):
    """オプション更新リクエスト"""

    options: list[ProductOptionRequest] = []

    def to_dto(self) -> UpdateProductOptionsInputDTO:
        return UpdateProductOptionsInputDTO(
            options=[
                AdminProductOptionDTO(
                    name=o.name,
                    is_required=o.is_required,
                    sort_order=o.sort_order,
                    values=[
                        AdminProductOptionValueDTO(
                            label=v.label,
                            price_diff=v.price_diff,
                            description=v.description,
                            sort_order=v.sort_order,
                        )
                        for v in o.values
                    ],
                )
                for o in self.options
            ]
        )


class ProductSpecRequest(BaseModel):
    """スペックリクエスト"""

    label: str = Field(..., min_length=1, max_length=100)
    value: str = Field(..., min_length=1, max_length=500)
    sort_order: int = 0


class UpdateProductSpecsRequest(BaseModel):
    """スペック更新リクエスト"""

    specs: list[ProductSpecRequest] = []

    def to_dto(self) -> UpdateProductSpecsInputDTO:
        return UpdateProductSpecsInputDTO(
            specs=[
                AdminProductSpecDTO(
                    label=s.label,
                    value=s.value,
                    sort_order=s.sort_order,
                )
                for s in self.specs
            ]
        )


class ProductFeatureRequest(BaseModel):
    """特長リクエスト"""

    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    sort_order: int = 0


class UpdateProductFeaturesRequest(BaseModel):
    """特長更新リクエスト"""

    features: list[ProductFeatureRequest] = []

    def to_dto(self) -> UpdateProductFeaturesInputDTO:
        return UpdateProductFeaturesInputDTO(
            features=[
                AdminProductFeatureDTO(
                    title=f.title,
                    description=f.description,
                    sort_order=f.sort_order,
                )
                for f in self.features
            ]
        )


class ProductFaqRequest(BaseModel):
    """FAQリクエスト"""

    question: str = Field(..., min_length=1, max_length=500)
    answer: str = Field(..., min_length=1)
    sort_order: int = 0


class UpdateProductFaqsRequest(BaseModel):
    """FAQ更新リクエスト"""

    faqs: list[ProductFaqRequest] = []

    def to_dto(self) -> UpdateProductFaqsInputDTO:
        return UpdateProductFaqsInputDTO(
            faqs=[
                AdminProductFaqDTO(
                    question=f.question,
                    answer=f.answer,
                    sort_order=f.sort_order,
                )
                for f in self.faqs
            ]
        )
