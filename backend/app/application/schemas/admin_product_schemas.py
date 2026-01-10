"""Admin商品管理DTOスキーマ"""

from datetime import datetime

from pydantic import BaseModel, Field

# ========== 共通DTO ==========


class AdminProductImageDTO(BaseModel):
    """商品画像DTO"""

    id: int
    s3_url: str
    alt: str | None
    is_main: bool
    sort_order: int


class AdminProductOptionValueDTO(BaseModel):
    """商品オプション値DTO"""

    id: int | None = None
    label: str
    price_diff: int
    description: str | None
    sort_order: int


class AdminProductOptionDTO(BaseModel):
    """商品オプションDTO"""

    id: int | None = None
    name: str
    is_required: bool
    sort_order: int
    values: list[AdminProductOptionValueDTO]


class AdminProductSpecDTO(BaseModel):
    """商品スペックDTO"""

    id: int | None = None
    label: str
    value: str
    sort_order: int


class AdminProductFeatureDTO(BaseModel):
    """商品特長DTO"""

    id: int | None = None
    title: str
    description: str
    sort_order: int


class AdminProductFaqDTO(BaseModel):
    """商品FAQDTO"""

    id: int | None = None
    question: str
    answer: str
    sort_order: int


class AdminProductDTO(BaseModel):
    """商品DTO（一覧用）"""

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
    main_image_url: str | None = None


class AdminProductDetailDTO(AdminProductDTO):
    """商品詳細DTO"""

    description: str | None
    long_description: str | None
    price_note: str | None
    lead_time_days: int | None
    lead_time_note: str | None
    requires_upload: bool
    upload_type: str | None
    upload_note: str | None
    images: list[AdminProductImageDTO]
    options: list[AdminProductOptionDTO]
    specs: list[AdminProductSpecDTO]
    features: list[AdminProductFeatureDTO]
    faqs: list[AdminProductFaqDTO]


# ========== 商品一覧 ==========


class GetAdminProductsInputDTO(BaseModel):
    """商品一覧取得入力DTO"""

    search: str | None = None
    category_id: str | None = None
    is_active: bool | None = None
    limit: int = Field(default=20, ge=1, le=100)
    offset: int = Field(default=0, ge=0)


class GetAdminProductsOutputDTO(BaseModel):
    """商品一覧取得出力DTO"""

    products: list[AdminProductDTO]
    total: int
    limit: int
    offset: int


# ========== 商品詳細 ==========


class GetAdminProductOutputDTO(BaseModel):
    """商品詳細取得出力DTO"""

    product: AdminProductDetailDTO


# ========== 商品作成 ==========


class CreateProductInputDTO(BaseModel):
    """商品作成入力DTO"""

    id: str
    name: str
    name_ja: str | None = None
    slug: str
    tagline: str | None = None
    description: str | None = None
    long_description: str | None = None
    base_price: int
    price_note: str | None = None
    category_id: str
    lead_time_days: int | None = None
    lead_time_note: str | None = None
    requires_upload: bool = False
    upload_type: str | None = None
    upload_note: str | None = None
    is_active: bool = False
    is_featured: bool = False
    sort_order: int = 0


class CreateProductOutputDTO(BaseModel):
    """商品作成出力DTO"""

    product: AdminProductDetailDTO
    message: str


# ========== 商品更新 ==========


class UpdateProductInputDTO(BaseModel):
    """商品更新入力DTO"""

    name: str | None = None
    name_ja: str | None = None
    slug: str | None = None
    tagline: str | None = None
    description: str | None = None
    long_description: str | None = None
    base_price: int | None = None
    price_note: str | None = None
    category_id: str | None = None
    lead_time_days: int | None = None
    lead_time_note: str | None = None
    requires_upload: bool | None = None
    upload_type: str | None = None
    upload_note: str | None = None
    is_active: bool | None = None
    is_featured: bool | None = None
    sort_order: int | None = None


class UpdateProductOutputDTO(BaseModel):
    """商品更新出力DTO"""

    product: AdminProductDetailDTO
    message: str


# ========== 商品削除 ==========


class DeleteProductOutputDTO(BaseModel):
    """商品削除出力DTO"""

    message: str


# ========== 画像管理（TODO: S3アップロード対応で新規実装予定） ==========


# ========== オプション更新 ==========


class UpdateProductOptionsInputDTO(BaseModel):
    """オプション更新入力DTO"""

    options: list[AdminProductOptionDTO]


class UpdateProductOptionsOutputDTO(BaseModel):
    """オプション更新出力DTO"""

    options: list[AdminProductOptionDTO]
    message: str


# ========== スペック更新 ==========


class UpdateProductSpecsInputDTO(BaseModel):
    """スペック更新入力DTO"""

    specs: list[AdminProductSpecDTO]


class UpdateProductSpecsOutputDTO(BaseModel):
    """スペック更新出力DTO"""

    specs: list[AdminProductSpecDTO]
    message: str


# ========== 特長更新 ==========


class UpdateProductFeaturesInputDTO(BaseModel):
    """特長更新入力DTO"""

    features: list[AdminProductFeatureDTO]


class UpdateProductFeaturesOutputDTO(BaseModel):
    """特長更新出力DTO"""

    features: list[AdminProductFeatureDTO]
    message: str


# ========== FAQ更新 ==========


class UpdateProductFaqsInputDTO(BaseModel):
    """FAQ更新入力DTO"""

    faqs: list[AdminProductFaqDTO]


class UpdateProductFaqsOutputDTO(BaseModel):
    """FAQ更新出力DTO"""

    faqs: list[AdminProductFaqDTO]
    message: str
