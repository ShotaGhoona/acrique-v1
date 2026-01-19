"""商品マスタAPIスキーマ（公開API用）"""

from pydantic import BaseModel, Field

from app.application.schemas.catalog.product_master_schemas import (
    ProductMasterDTO,
    ProductMasterListOutputDTO,
)


class ProductMasterResponse(BaseModel):
    """商品マスタレスポンス"""

    id: str = Field(..., description='マスタID')
    name: str = Field(..., description='日本語名')
    name_en: str | None = Field(None, description='英語名')
    model_category: str | None = Field(None, description='モデルカテゴリ')
    tagline: str | None = Field(None, description='キャッチコピー')
    description: str | None = Field(None, description='説明')
    base_lead_time_days: int | None = Field(None, description='基準納期（日数）')

    @classmethod
    def from_dto(cls, dto: ProductMasterDTO) -> 'ProductMasterResponse':
        """DTOからレスポンスを生成"""
        return cls(
            id=dto.id,
            name=dto.name,
            name_en=dto.name_en,
            model_category=dto.model_category,
            tagline=dto.tagline,
            description=dto.description,
            base_lead_time_days=dto.base_lead_time_days,
        )


class ProductMasterListResponse(BaseModel):
    """商品マスタ一覧レスポンス"""

    masters: list[ProductMasterResponse] = Field(..., description='マスタ一覧')
    total: int = Field(..., description='総件数')

    @classmethod
    def from_dto(cls, dto: ProductMasterListOutputDTO) -> 'ProductMasterListResponse':
        """DTOからレスポンスを生成"""
        return cls(
            masters=[ProductMasterResponse.from_dto(m) for m in dto.masters],
            total=dto.total,
        )
