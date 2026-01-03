"""商品リポジトリインターフェース"""

from abc import ABC, abstractmethod

from app.domain.entities.product import (
    Product,
    ProductFaq,
    ProductFeature,
    ProductImage,
    ProductOption,
    ProductRelation,
    ProductSpec,
)


class IProductRepository(ABC):
    """商品リポジトリのインターフェース"""

    # ===================
    # 商品 (Products)
    # ===================

    @abstractmethod
    def get_all(
        self,
        category_id: str | None = None,
        is_active: bool | None = True,
        is_featured: bool | None = None,
        limit: int | None = None,
        offset: int = 0,
    ) -> list[Product]:
        """商品一覧を取得"""
        pass

    @abstractmethod
    def get_by_id(
        self, product_id: str, include_relations: bool = True
    ) -> Product | None:
        """IDで商品を取得"""
        pass

    @abstractmethod
    def get_by_slug(self, slug: str, include_relations: bool = True) -> Product | None:
        """スラッグで商品を取得"""
        pass

    @abstractmethod
    def get_featured(self, limit: int = 10) -> list[Product]:
        """おすすめ商品を取得"""
        pass

    @abstractmethod
    def search(
        self,
        keyword: str,
        category_id: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[Product]:
        """商品を検索"""
        pass

    @abstractmethod
    def count(
        self,
        category_id: str | None = None,
        is_active: bool | None = True,
        keyword: str | None = None,
    ) -> int:
        """商品数をカウント"""
        pass

    @abstractmethod
    def create(self, product: Product) -> Product:
        """商品を作成"""
        pass

    @abstractmethod
    def update(self, product: Product) -> Product:
        """商品を更新"""
        pass

    @abstractmethod
    def delete(self, product_id: str) -> bool:
        """商品を削除"""
        pass

    # ===================
    # 商品画像 (Product Images)
    # ===================

    @abstractmethod
    def get_images(self, product_id: str) -> list[ProductImage]:
        """商品の画像一覧を取得"""
        pass

    @abstractmethod
    def add_image(self, image: ProductImage) -> ProductImage:
        """商品画像を追加"""
        pass

    @abstractmethod
    def delete_image(self, image_id: int) -> bool:
        """商品画像を削除"""
        pass

    # ===================
    # 商品オプション (Product Options)
    # ===================

    @abstractmethod
    def get_options(self, product_id: str) -> list[ProductOption]:
        """商品のオプション一覧を取得"""
        pass

    @abstractmethod
    def update_options(
        self, product_id: str, options: list[ProductOption]
    ) -> list[ProductOption]:
        """商品オプションを一括更新（既存を削除して新規作成）"""
        pass

    # ===================
    # 商品スペック (Product Specs)
    # ===================

    @abstractmethod
    def get_specs(self, product_id: str) -> list[ProductSpec]:
        """商品のスペック一覧を取得"""
        pass

    @abstractmethod
    def update_specs(
        self, product_id: str, specs: list[ProductSpec]
    ) -> list[ProductSpec]:
        """商品スペックを一括更新"""
        pass

    # ===================
    # 商品特長 (Product Features)
    # ===================

    @abstractmethod
    def get_features(self, product_id: str) -> list[ProductFeature]:
        """商品の特長一覧を取得"""
        pass

    @abstractmethod
    def update_features(
        self, product_id: str, features: list[ProductFeature]
    ) -> list[ProductFeature]:
        """商品特長を一括更新"""
        pass

    # ===================
    # 商品FAQ (Product FAQs)
    # ===================

    @abstractmethod
    def get_faqs(self, product_id: str) -> list[ProductFaq]:
        """商品のFAQ一覧を取得"""
        pass

    @abstractmethod
    def update_faqs(self, product_id: str, faqs: list[ProductFaq]) -> list[ProductFaq]:
        """商品FAQを一括更新"""
        pass

    # ===================
    # 関連商品 (Product Relations)
    # ===================

    @abstractmethod
    def get_related_products(self, product_id: str) -> list[Product]:
        """関連商品を取得"""
        pass

    @abstractmethod
    def update_relations(
        self, product_id: str, relations: list[ProductRelation]
    ) -> list[ProductRelation]:
        """関連商品を一括更新"""
        pass
