"""商品マスタリポジトリ実装"""

from sqlalchemy.orm import Session

from app.domain.entities.product_master import ProductMaster
from app.domain.repositories.product_master_repository import IProductMasterRepository
from app.infrastructure.db.models.product_master_model import ProductMasterModel


class ProductMasterRepositoryImpl(IProductMasterRepository):
    """商品マスタリポジトリの実装"""

    def __init__(self, session: Session):
        self.session = session

    def get_all(
        self,
        model_category: str | None = None,
        is_active: bool | None = True,
        limit: int | None = None,
        offset: int = 0,
    ) -> list[ProductMaster]:
        """商品マスタ一覧を取得"""
        query = self.session.query(ProductMasterModel)

        if model_category is not None:
            query = query.filter(ProductMasterModel.model_category == model_category)
        if is_active is not None:
            query = query.filter(ProductMasterModel.is_active == is_active)

        query = query.order_by(
            ProductMasterModel.sort_order, ProductMasterModel.created_at.desc()
        )
        query = query.offset(offset)

        if limit is not None:
            query = query.limit(limit)

        masters = query.all()
        return [self._to_entity(m) for m in masters]

    def get_by_id(self, master_id: str) -> ProductMaster | None:
        """IDで商品マスタを取得"""
        master_model = (
            self.session.query(ProductMasterModel)
            .filter(ProductMasterModel.id == master_id)
            .first()
        )
        if master_model is None:
            return None
        return self._to_entity(master_model)

    def count(
        self,
        model_category: str | None = None,
        is_active: bool | None = True,
    ) -> int:
        """商品マスタ数をカウント"""
        query = self.session.query(ProductMasterModel)

        if model_category is not None:
            query = query.filter(ProductMasterModel.model_category == model_category)
        if is_active is not None:
            query = query.filter(ProductMasterModel.is_active == is_active)

        return query.count()

    def create(self, master: ProductMaster) -> ProductMaster:
        """商品マスタを作成"""
        master_model = ProductMasterModel(
            id=master.id,
            name=master.name,
            name_en=master.name_en,
            model_category=master.model_category,
            tagline=master.tagline,
            description=master.description,
            base_lead_time_days=master.base_lead_time_days,
            is_active=master.is_active,
            sort_order=master.sort_order,
        )
        self.session.add(master_model)
        self.session.flush()
        return self._to_entity(master_model)

    def update(self, master: ProductMaster) -> ProductMaster:
        """商品マスタを更新"""
        master_model = (
            self.session.query(ProductMasterModel)
            .filter(ProductMasterModel.id == master.id)
            .first()
        )
        if master_model is None:
            raise ValueError(f'ProductMaster with id {master.id} not found')

        master_model.name = master.name
        master_model.name_en = master.name_en
        master_model.model_category = master.model_category
        master_model.tagline = master.tagline
        master_model.description = master.description
        master_model.base_lead_time_days = master.base_lead_time_days
        master_model.is_active = master.is_active
        master_model.sort_order = master.sort_order

        self.session.flush()
        return self._to_entity(master_model)

    def delete(self, master_id: str) -> bool:
        """商品マスタを削除"""
        master_model = (
            self.session.query(ProductMasterModel)
            .filter(ProductMasterModel.id == master_id)
            .first()
        )
        if master_model is None:
            return False

        self.session.delete(master_model)
        self.session.flush()
        return True

    def _to_entity(self, model: ProductMasterModel) -> ProductMaster:
        """DBモデルをエンティティに変換"""
        return ProductMaster(
            id=model.id,
            name=model.name,
            name_en=model.name_en,
            model_category=model.model_category,
            tagline=model.tagline,
            description=model.description,
            base_lead_time_days=model.base_lead_time_days,
            is_active=model.is_active,
            sort_order=model.sort_order,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
