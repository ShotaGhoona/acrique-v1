"""Admin商品マスタアプリケーション層スキーマ（DTO）"""

from datetime import datetime

from pydantic import BaseModel, Field

# ===================
# Output DTOs
# ===================


class AdminProductMasterDTO(BaseModel):
    """Admin商品マスタDTO"""

    id: str = Field(..., description='マスタID')
    name: str = Field(..., description='日本語名')
    name_en: str | None = Field(None, description='英語名')
    model_category: str | None = Field(None, description='モデルカテゴリ')
    tagline: str | None = Field(None, description='キャッチコピー')
    description: str | None = Field(None, description='説明')
    base_lead_time_days: int | None = Field(None, description='基準納期（日数）')
    is_active: bool = Field(..., description='有効状態')
    sort_order: int = Field(..., description='並び順')
    created_at: datetime | None = Field(None, description='作成日時')
    updated_at: datetime | None = Field(None, description='更新日時')


class AdminProductMasterListOutputDTO(BaseModel):
    """Admin商品マスタ一覧出力DTO"""

    masters: list[AdminProductMasterDTO] = Field(..., description='マスタ一覧')
    total: int = Field(..., description='総件数')


# ===================
# Input DTOs
# ===================


class AdminProductMasterCreateInputDTO(BaseModel):
    """Admin商品マスタ作成入力DTO"""

    id: str = Field(..., description='マスタID')
    name: str = Field(..., description='日本語名')
    name_en: str | None = Field(None, description='英語名')
    model_category: str | None = Field(None, description='モデルカテゴリ')
    tagline: str | None = Field(None, description='キャッチコピー')
    description: str | None = Field(None, description='説明')
    base_lead_time_days: int | None = Field(None, description='基準納期（日数）')
    is_active: bool = Field(True, description='有効状態')
    sort_order: int = Field(0, description='並び順')


class AdminProductMasterUpdateInputDTO(BaseModel):
    """Admin商品マスタ更新入力DTO"""

    name: str | None = Field(None, description='日本語名')
    name_en: str | None = Field(None, description='英語名')
    model_category: str | None = Field(None, description='モデルカテゴリ')
    tagline: str | None = Field(None, description='キャッチコピー')
    description: str | None = Field(None, description='説明')
    base_lead_time_days: int | None = Field(None, description='基準納期（日数）')
    is_active: bool | None = Field(None, description='有効状態')
    sort_order: int | None = Field(None, description='並び順')
