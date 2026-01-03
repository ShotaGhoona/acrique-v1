"""商品プレゼンテーション層スキーマ"""

from datetime import datetime

from pydantic import BaseModel, Field

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


class ProductOptionValueResponse(BaseModel):
    """商品オプション値レスポンス"""

    id: int
    label: str
    price_diff: int
    description: str | None
    sort_order: int


class ProductOptionResponse(BaseModel):
    """商品オプションレスポンス"""

    id: int
    name: str
    is_required: bool
    sort_order: int
    values: list[ProductOptionValueResponse]


class ProductSpecResponse(BaseModel):
    """商品スペックレスポンス"""

    id: int
    label: str
    value: str
    sort_order: int


class ProductFeatureResponse(BaseModel):
    """商品特長レスポンス"""

    id: int
    title: str
    description: str | None
    sort_order: int


class ProductFaqResponse(BaseModel):
    """商品FAQレスポンス"""

    id: int
    question: str
    answer: str
    sort_order: int


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


class ProductListResponse(BaseModel):
    """商品一覧レスポンス"""

    products: list[ProductListItemResponse]
    total: int
    limit: int
    offset: int


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


class RelatedProductResponse(BaseModel):
    """関連商品レスポンス"""

    id: str
    name: str
    name_ja: str
    slug: str | None
    base_price: int
    main_image_url: str | None


class ProductOptionsResponse(BaseModel):
    """商品オプションレスポンス"""

    product_id: str
    options: list[ProductOptionResponse]


class ProductRelatedResponse(BaseModel):
    """関連商品レスポンス"""

    product_id: str
    related_products: list[RelatedProductResponse]


class ProductSearchResponse(BaseModel):
    """商品検索レスポンス"""

    products: list[ProductListItemResponse]
    total: int
    keyword: str
    category_id: str | None
    limit: int
    offset: int


# ===================
# Request Schemas
# ===================


class ProductSearchRequest(BaseModel):
    """商品検索リクエスト"""

    keyword: str = Field(..., min_length=1, description='検索キーワード')
    category_id: str | None = Field(None, description='カテゴリID')
    limit: int = Field(20, ge=1, le=100, description='取得件数')
    offset: int = Field(0, ge=0, description='オフセット')
