"""カートアイテムリポジトリインターフェース"""

from abc import ABC, abstractmethod

from app.domain.entities.cart_item import CartItem


class ICartItemRepository(ABC):
    """カートアイテムリポジトリのインターフェース"""

    @abstractmethod
    def get_by_id(self, item_id: int) -> CartItem | None:
        """IDでカートアイテムを取得"""
        pass

    @abstractmethod
    def get_by_user_id(self, user_id: int) -> list[CartItem]:
        """ユーザーIDでカートアイテム一覧を取得"""
        pass

    @abstractmethod
    def get_by_user_and_product(self, user_id: int, product_id: str) -> CartItem | None:
        """ユーザーIDと商品IDでカートアイテムを取得（重複チェック用）"""
        pass

    @abstractmethod
    def create(self, cart_item: CartItem) -> CartItem:
        """カートアイテムを作成"""
        pass

    @abstractmethod
    def update(self, cart_item: CartItem) -> CartItem:
        """カートアイテムを更新"""
        pass

    @abstractmethod
    def delete(self, item_id: int) -> bool:
        """カートアイテムを削除"""
        pass

    @abstractmethod
    def delete_all_by_user_id(self, user_id: int) -> int:
        """ユーザーのカートを全て削除（削除件数を返す）"""
        pass

    @abstractmethod
    def count_by_user_id(self, user_id: int) -> int:
        """ユーザーのカートアイテム数を取得"""
        pass
