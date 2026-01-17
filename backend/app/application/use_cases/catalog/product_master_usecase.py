"""商品マスタユースケース（公開API用）"""

from app.application.schemas.catalog.product_master_schemas import (
    ProductMasterDTO,
    ProductMasterListOutputDTO,
)
from app.domain.repositories.product_master_repository import IProductMasterRepository


class ProductMasterUsecase:
    """商品マスタユースケース"""

    def __init__(self, product_master_repository: IProductMasterRepository):
        self.product_master_repository = product_master_repository

    def get_product_masters(self) -> ProductMasterListOutputDTO:
        """商品マスタ一覧を取得（有効なもののみ）"""
        masters = self.product_master_repository.get_all(is_active=True)
        total = len(masters)

        return ProductMasterListOutputDTO(
            masters=[
                ProductMasterDTO(
                    id=m.id,
                    name=m.name,
                    name_en=m.name_en,
                    model_category=m.model_category,
                    tagline=m.tagline,
                    description=m.description,
                    base_lead_time_days=m.base_lead_time_days,
                    is_active=m.is_active,
                    sort_order=m.sort_order,
                )
                for m in masters
            ],
            total=total,
        )
