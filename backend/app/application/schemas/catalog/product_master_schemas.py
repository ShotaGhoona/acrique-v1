"""商品マスタアプリケーション層スキーマ（DTO）"""

from pydantic import BaseModel, Field

# ===================
# Output DTOs
# ===================


class ProductMasterDTO(BaseModel):
    """商品マスタDTO"""

    id: str = Field(..., description='マスタID')
    name: str = Field(..., description='日本語名')
    name_en: str | None = Field(None, description='英語名')
    model_category: str | None = Field(None, description='モデルカテゴリ')
    tagline: str | None = Field(None, description='キャッチコピー')
    description: str | None = Field(None, description='説明')
    base_lead_time_days: int | None = Field(None, description='基準納期（日数）')
    is_active: bool = Field(..., description='有効状態')
    sort_order: int = Field(..., description='並び順')


class ProductMasterListOutputDTO(BaseModel):
    """商品マスタ一覧出力DTO"""

    masters: list[ProductMasterDTO] = Field(..., description='マスタ一覧')
    total: int = Field(..., description='総件数')
