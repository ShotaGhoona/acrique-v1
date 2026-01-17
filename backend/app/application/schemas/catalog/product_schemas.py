"""商品アプリケーション層スキーマ（DTO）"""

from datetime import datetime

from pydantic import BaseModel, Field

# ===================
# Output DTOs
# ===================


class ProductImageDTO(BaseModel):
    """商品画像DTO"""

    id: int
    s3_url: str
    alt: str | None
    is_main: bool
    sort_order: int


class ProductOptionValueDTO(BaseModel):
    """商品オプション値DTO"""

    id: int
    label: str
    price_diff: int
    description: str | None
    sort_order: int


class ProductOptionDTO(BaseModel):
    """商品オプションDTO"""

    id: int
    name: str
    is_required: bool
    sort_order: int
    values: list[ProductOptionValueDTO]


class ProductSpecDTO(BaseModel):
    """商品スペックDTO"""

    id: int
    label: str
    value: str
    sort_order: int


class ProductFeatureDTO(BaseModel):
    """商品特長DTO"""

    id: int
    title: str
    description: str | None
    sort_order: int


class ProductFaqDTO(BaseModel):
    """商品FAQDTO"""

    id: int
    question: str
    answer: str
    sort_order: int


class ProductListItemDTO(BaseModel):
    """商品一覧アイテムDTO"""

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
    images: list[ProductImageDTO]


class ProductDetailDTO(BaseModel):
    """商品詳細DTO"""

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
    images: list[ProductImageDTO]
    options: list[ProductOptionDTO]
    specs: list[ProductSpecDTO]
    features: list[ProductFeatureDTO]
    faqs: list[ProductFaqDTO]
    created_at: datetime | None
    updated_at: datetime | None


class ProductListOutputDTO(BaseModel):
    """商品一覧出力DTO"""

    products: list[ProductListItemDTO]
    total: int
    limit: int
    offset: int


class RelatedProductDTO(BaseModel):
    """関連商品DTO"""

    id: str
    name: str
    name_ja: str
    slug: str | None
    base_price: int
    main_image_url: str | None


class ProductOptionsOutputDTO(BaseModel):
    """商品オプション出力DTO"""

    product_id: str
    options: list[ProductOptionDTO]


class ProductRelatedOutputDTO(BaseModel):
    """関連商品出力DTO"""

    product_id: str
    related_products: list[RelatedProductDTO]


class ProductSearchOutputDTO(BaseModel):
    """商品検索出力DTO"""

    products: list[ProductListItemDTO]
    total: int
    keyword: str
    category_id: str | None
    limit: int
    offset: int


# ===================
# Input DTOs
# ===================


class ProductListInputDTO(BaseModel):
    """商品一覧入力DTO"""

    category_id: str | None = Field(None, description='カテゴリID')
    is_featured: bool | None = Field(None, description='おすすめのみ')
    limit: int = Field(20, ge=1, le=100, description='取得件数')
    offset: int = Field(0, ge=0, description='オフセット')


class ProductSearchInputDTO(BaseModel):
    """商品検索入力DTO"""

    keyword: str = Field(..., min_length=1, description='検索キーワード')
    category_id: str | None = Field(None, description='カテゴリID')
    limit: int = Field(20, ge=1, le=100, description='取得件数')
    offset: int = Field(0, ge=0, description='オフセット')
