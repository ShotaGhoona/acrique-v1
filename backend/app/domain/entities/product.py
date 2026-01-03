"""商品エンティティ"""

from datetime import datetime

from pydantic import BaseModel, Field


class Product(BaseModel):
    """商品エンティティ"""

    id: str = Field(..., description='商品ID (例: qr-cube)')
    category_id: str = Field(..., description='カテゴリID (shop/office/you)')
    name: str = Field(..., description='英語名')
    name_ja: str = Field(..., description='日本語名')
    slug: str | None = Field(None, description='URL用スラッグ')
    tagline: str | None = Field(None, description='キャッチコピー')
    description: str | None = Field(None, description='短い説明')
    long_description: str | None = Field(None, description='詳細説明')
    base_price: int = Field(..., description='税抜基本価格')
    price_note: str | None = Field(None, description='価格補足')
    lead_time_days: int | None = Field(None, description='標準納期（日数）')
    lead_time_note: str | None = Field(None, description='納期補足')
    requires_upload: bool = Field(default=False, description='入稿必須')
    upload_type: str | None = Field(None, description='入稿タイプ (logo/qr/photo/text)')
    upload_note: str | None = Field(None, description='入稿時の注意')
    is_active: bool = Field(default=True, description='公開状態')
    is_featured: bool = Field(default=False, description='おすすめ商品')
    sort_order: int = Field(default=0, description='並び順')
    created_at: datetime | None = Field(None, description='作成日時')
    updated_at: datetime | None = Field(None, description='更新日時')

    # 関連データ（リポジトリで取得時にセット）
    images: list['ProductImage'] = Field(default_factory=list, description='商品画像')
    options: list['ProductOption'] = Field(default_factory=list, description='商品オプション')
    specs: list['ProductSpec'] = Field(default_factory=list, description='商品スペック')
    features: list['ProductFeature'] = Field(default_factory=list, description='商品特長')
    faqs: list['ProductFaq'] = Field(default_factory=list, description='よくある質問')
    related_products: list['ProductRelation'] = Field(
        default_factory=list, description='関連商品'
    )

    class Config:
        """Pydantic設定"""

        from_attributes = True

    @property
    def main_image_url(self) -> str | None:
        """メイン画像のURLを取得"""
        for image in self.images:
            if image.is_main:
                return image.url
        return self.images[0].url if self.images else None


class ProductImage(BaseModel):
    """商品画像エンティティ"""

    id: int | None = Field(None, description='画像ID')
    product_id: str = Field(..., description='商品ID')
    url: str = Field(..., description='画像URL')
    alt: str | None = Field(None, description='代替テキスト')
    is_main: bool = Field(default=False, description='メイン画像')
    sort_order: int = Field(default=0, description='並び順')

    class Config:
        """Pydantic設定"""

        from_attributes = True


class ProductOption(BaseModel):
    """商品オプションエンティティ"""

    id: int | None = Field(None, description='オプションID')
    product_id: str = Field(..., description='商品ID')
    name: str = Field(..., description='オプション名 (サイズ/厚み等)')
    is_required: bool = Field(default=True, description='必須')
    sort_order: int = Field(default=0, description='並び順')

    # 関連データ
    values: list['ProductOptionValue'] = Field(
        default_factory=list, description='オプション値'
    )

    class Config:
        """Pydantic設定"""

        from_attributes = True


class ProductOptionValue(BaseModel):
    """商品オプション値エンティティ"""

    id: int | None = Field(None, description='オプション値ID')
    option_id: int = Field(..., description='オプションID')
    label: str = Field(..., description='ラベル (50mm角)')
    price_diff: int = Field(default=0, description='価格差分')
    description: str | None = Field(None, description='説明')
    sort_order: int = Field(default=0, description='並び順')

    class Config:
        """Pydantic設定"""

        from_attributes = True


class ProductSpec(BaseModel):
    """商品スペックエンティティ"""

    id: int | None = Field(None, description='スペックID')
    product_id: str = Field(..., description='商品ID')
    label: str = Field(..., description='ラベル')
    value: str = Field(..., description='値')
    sort_order: int = Field(default=0, description='並び順')

    class Config:
        """Pydantic設定"""

        from_attributes = True


class ProductFeature(BaseModel):
    """商品特長エンティティ"""

    id: int | None = Field(None, description='特長ID')
    product_id: str = Field(..., description='商品ID')
    title: str = Field(..., description='タイトル')
    description: str | None = Field(None, description='説明')
    sort_order: int = Field(default=0, description='並び順')

    class Config:
        """Pydantic設定"""

        from_attributes = True


class ProductFaq(BaseModel):
    """商品FAQエンティティ"""

    id: int | None = Field(None, description='FAQ ID')
    product_id: str = Field(..., description='商品ID')
    question: str = Field(..., description='質問')
    answer: str = Field(..., description='回答')
    sort_order: int = Field(default=0, description='並び順')

    class Config:
        """Pydantic設定"""

        from_attributes = True


class ProductRelation(BaseModel):
    """関連商品エンティティ"""

    id: int | None = Field(None, description='関連ID')
    product_id: str = Field(..., description='商品ID')
    related_product_id: str = Field(..., description='関連商品ID')
    sort_order: int = Field(default=0, description='並び順')

    class Config:
        """Pydantic設定"""

        from_attributes = True
