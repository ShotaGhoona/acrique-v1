from abc import ABC, abstractmethod

from app.domain.entities.address import Address


class IAddressRepository(ABC):
    """配送先リポジトリのインターフェース"""

    @abstractmethod
    def get_by_id(self, address_id: int) -> Address | None:
        """IDで配送先を取得"""
        pass

    @abstractmethod
    def get_by_user_id(self, user_id: int) -> list[Address]:
        """ユーザーIDで配送先一覧を取得"""
        pass

    @abstractmethod
    def get_default_by_user_id(self, user_id: int) -> Address | None:
        """ユーザーのデフォルト配送先を取得"""
        pass

    @abstractmethod
    def create(self, address: Address) -> Address:
        """配送先を作成"""
        pass

    @abstractmethod
    def update(self, address: Address) -> Address:
        """配送先を更新"""
        pass

    @abstractmethod
    def delete(self, address_id: int) -> bool:
        """配送先を削除"""
        pass

    @abstractmethod
    def set_default(self, user_id: int, address_id: int) -> bool:
        """デフォルト配送先を設定"""
        pass

    @abstractmethod
    def clear_default(self, user_id: int) -> bool:
        """ユーザーのデフォルト配送先をクリア"""
        pass
