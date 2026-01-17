"""商品マスタリポジトリインターフェース"""

from abc import ABC, abstractmethod

from app.domain.entities.product_master import ProductMaster


class IProductMasterRepository(ABC):
    """商品マスタリポジトリのインターフェース"""

    @abstractmethod
    def get_all(
        self,
        model_category: str | None = None,
        is_active: bool | None = True,
        limit: int | None = None,
        offset: int = 0,
    ) -> list[ProductMaster]:
        """商品マスタ一覧を取得"""
        pass

    @abstractmethod
    def get_by_id(self, master_id: str) -> ProductMaster | None:
        """IDで商品マスタを取得"""
        pass

    @abstractmethod
    def count(
        self,
        model_category: str | None = None,
        is_active: bool | None = True,
    ) -> int:
        """商品マスタ数をカウント"""
        pass

    @abstractmethod
    def create(self, master: ProductMaster) -> ProductMaster:
        """商品マスタを作成"""
        pass

    @abstractmethod
    def update(self, master: ProductMaster) -> ProductMaster:
        """商品マスタを更新"""
        pass

    @abstractmethod
    def delete(self, master_id: str) -> bool:
        """商品マスタを削除"""
        pass
