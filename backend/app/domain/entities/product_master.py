"""商品マスタエンティティ"""

from datetime import datetime

from pydantic import BaseModel, Field


class ProductMaster(BaseModel):
    """商品マスタエンティティ

    商品の形状・基本仕様を定義するマスタデータ。
    複数の商品バリエーションがこのマスタを参照する。
    """

    id: str = Field(..., description='マスタID (例: qr-cube-base)')
    name: str = Field(..., description='日本語名')
    name_en: str | None = Field(None, description='英語名')
    model_category: str | None = Field(None, description='モデルカテゴリ (cube/stand/plate等)')
    tagline: str | None = Field(None, description='キャッチコピー')
    description: str | None = Field(None, description='説明')
    base_lead_time_days: int | None = Field(None, description='基本納期（日数）')
    is_active: bool = Field(default=True, description='有効状態')
    sort_order: int = Field(default=0, description='並び順')
    created_at: datetime | None = Field(None, description='作成日時')
    updated_at: datetime | None = Field(None, description='更新日時')

    class Config:
        """Pydantic設定"""

        from_attributes = True
