"""Admin商品マスタAPIスキーマ"""

from datetime import datetime

from pydantic import BaseModel, Field

from app.application.schemas.admin.admin_product_master_schemas import (
    AdminProductMasterCreateInputDTO,
    AdminProductMasterDTO,
    AdminProductMasterListOutputDTO,
    AdminProductMasterUpdateInputDTO,
)

# ===================
# Response
# ===================


class AdminProductMasterResponse(BaseModel):
    """Admin商品マスタレスポンス"""

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

    @classmethod
    def from_dto(cls, dto: AdminProductMasterDTO) -> 'AdminProductMasterResponse':
        """DTOからレスポンスを生成"""
        return cls(
            id=dto.id,
            name=dto.name,
            name_en=dto.name_en,
            model_category=dto.model_category,
            tagline=dto.tagline,
            description=dto.description,
            base_lead_time_days=dto.base_lead_time_days,
            is_active=dto.is_active,
            sort_order=dto.sort_order,
            created_at=dto.created_at,
            updated_at=dto.updated_at,
        )


class AdminProductMasterListResponse(BaseModel):
    """Admin商品マスタ一覧レスポンス"""

    masters: list[AdminProductMasterResponse] = Field(..., description='マスタ一覧')
    total: int = Field(..., description='総件数')

    @classmethod
    def from_dto(
        cls, dto: AdminProductMasterListOutputDTO
    ) -> 'AdminProductMasterListResponse':
        """DTOからレスポンスを生成"""
        return cls(
            masters=[AdminProductMasterResponse.from_dto(m) for m in dto.masters],
            total=dto.total,
        )


# ===================
# Request
# ===================


class CreateProductMasterRequest(BaseModel):
    """商品マスタ作成リクエスト"""

    id: str = Field(..., description='マスタID')
    name: str = Field(..., description='日本語名')
    name_en: str | None = Field(None, description='英語名')
    model_category: str | None = Field(None, description='モデルカテゴリ')
    tagline: str | None = Field(None, description='キャッチコピー')
    description: str | None = Field(None, description='説明')
    base_lead_time_days: int | None = Field(None, description='基準納期（日数）')
    is_active: bool = Field(True, description='有効状態')
    sort_order: int = Field(0, description='並び順')

    def to_dto(self) -> AdminProductMasterCreateInputDTO:
        """リクエストをDTOに変換"""
        return AdminProductMasterCreateInputDTO(
            id=self.id,
            name=self.name,
            name_en=self.name_en,
            model_category=self.model_category,
            tagline=self.tagline,
            description=self.description,
            base_lead_time_days=self.base_lead_time_days,
            is_active=self.is_active,
            sort_order=self.sort_order,
        )


class UpdateProductMasterRequest(BaseModel):
    """商品マスタ更新リクエスト"""

    name: str | None = Field(None, description='日本語名')
    name_en: str | None = Field(None, description='英語名')
    model_category: str | None = Field(None, description='モデルカテゴリ')
    tagline: str | None = Field(None, description='キャッチコピー')
    description: str | None = Field(None, description='説明')
    base_lead_time_days: int | None = Field(None, description='基準納期（日数）')
    is_active: bool | None = Field(None, description='有効状態')
    sort_order: int | None = Field(None, description='並び順')

    def to_dto(self) -> AdminProductMasterUpdateInputDTO:
        """リクエストをDTOに変換"""
        return AdminProductMasterUpdateInputDTO(
            name=self.name,
            name_en=self.name_en,
            model_category=self.model_category,
            tagline=self.tagline,
            description=self.description,
            base_lead_time_days=self.base_lead_time_days,
            is_active=self.is_active,
            sort_order=self.sort_order,
        )
