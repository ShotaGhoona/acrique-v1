"""Admin商品マスタユースケース"""

from app.application.schemas.admin.admin_product_master_schemas import (
    AdminProductMasterCreateInputDTO,
    AdminProductMasterDTO,
    AdminProductMasterListOutputDTO,
    AdminProductMasterUpdateInputDTO,
)
from app.domain.entities.product_master import ProductMaster
from app.domain.repositories.product_master_repository import IProductMasterRepository


class AdminProductMasterUsecase:
    """Admin商品マスタユースケース"""

    def __init__(self, product_master_repository: IProductMasterRepository):
        self.product_master_repository = product_master_repository

    def get_product_masters(
        self,
        model_category: str | None = None,
        is_active: bool | None = None,
    ) -> AdminProductMasterListOutputDTO:
        """商品マスタ一覧を取得"""
        masters = self.product_master_repository.get_all(
            model_category=model_category,
            is_active=is_active,
        )
        total = self.product_master_repository.count(
            model_category=model_category,
            is_active=is_active,
        )

        return AdminProductMasterListOutputDTO(
            masters=[self._to_dto(m) for m in masters],
            total=total,
        )

    def create_product_master(
        self, input_dto: AdminProductMasterCreateInputDTO
    ) -> AdminProductMasterDTO:
        """商品マスタを作成"""
        # 既存チェック
        existing = self.product_master_repository.get_by_id(input_dto.id)
        if existing:
            raise ValueError(f'ProductMaster with id {input_dto.id} already exists')

        master = ProductMaster(
            id=input_dto.id,
            name=input_dto.name,
            name_en=input_dto.name_en,
            model_category=input_dto.model_category,
            tagline=input_dto.tagline,
            description=input_dto.description,
            base_lead_time_days=input_dto.base_lead_time_days,
            is_active=input_dto.is_active,
            sort_order=input_dto.sort_order,
        )
        created = self.product_master_repository.create(master)
        return self._to_dto(created)

    def update_product_master(
        self, master_id: str, input_dto: AdminProductMasterUpdateInputDTO
    ) -> AdminProductMasterDTO:
        """商品マスタを更新"""
        existing = self.product_master_repository.get_by_id(master_id)
        if not existing:
            raise ValueError(f'ProductMaster with id {master_id} not found')

        # 更新対象のフィールドのみ更新
        updated_master = ProductMaster(
            id=existing.id,
            name=input_dto.name if input_dto.name is not None else existing.name,
            name_en=input_dto.name_en
            if input_dto.name_en is not None
            else existing.name_en,
            model_category=input_dto.model_category
            if input_dto.model_category is not None
            else existing.model_category,
            tagline=input_dto.tagline
            if input_dto.tagline is not None
            else existing.tagline,
            description=input_dto.description
            if input_dto.description is not None
            else existing.description,
            base_lead_time_days=input_dto.base_lead_time_days
            if input_dto.base_lead_time_days is not None
            else existing.base_lead_time_days,
            is_active=input_dto.is_active
            if input_dto.is_active is not None
            else existing.is_active,
            sort_order=input_dto.sort_order
            if input_dto.sort_order is not None
            else existing.sort_order,
            created_at=existing.created_at,
            updated_at=existing.updated_at,
        )

        updated = self.product_master_repository.update(updated_master)
        return self._to_dto(updated)

    def _to_dto(self, master: ProductMaster) -> AdminProductMasterDTO:
        """エンティティをDTOに変換"""
        return AdminProductMasterDTO(
            id=master.id,
            name=master.name,
            name_en=master.name_en,
            model_category=master.model_category,
            tagline=master.tagline,
            description=master.description,
            base_lead_time_days=master.base_lead_time_days,
            is_active=master.is_active,
            sort_order=master.sort_order,
            created_at=master.created_at,
            updated_at=master.updated_at,
        )
