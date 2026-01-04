"""注文リポジトリインターフェース"""

from abc import ABC, abstractmethod

from app.domain.entities.order import Order, OrderItem, OrderStatus


class IOrderRepository(ABC):
    """注文リポジトリのインターフェース"""

    @abstractmethod
    def get_by_id(self, order_id: int) -> Order | None:
        """IDで注文を取得（明細含む）"""
        pass

    @abstractmethod
    def get_by_order_number(self, order_number: str) -> Order | None:
        """注文番号で注文を取得"""
        pass

    @abstractmethod
    def get_by_user_id(
        self,
        user_id: int,
        status: OrderStatus | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[Order]:
        """ユーザーIDで注文一覧を取得"""
        pass

    @abstractmethod
    def count_by_user_id(
        self,
        user_id: int,
        status: OrderStatus | None = None,
    ) -> int:
        """ユーザーの注文数を取得"""
        pass

    @abstractmethod
    def create(self, order: Order) -> Order:
        """注文を作成（明細含む）"""
        pass

    @abstractmethod
    def update(self, order: Order) -> Order:
        """注文を更新"""
        pass

    @abstractmethod
    def generate_order_number(self) -> str:
        """注文番号を生成（ACQ-YYMMDD-XXX形式）"""
        pass


class IOrderItemRepository(ABC):
    """注文明細リポジトリのインターフェース"""

    @abstractmethod
    def get_by_order_id(self, order_id: int) -> list[OrderItem]:
        """注文IDで明細一覧を取得"""
        pass

    @abstractmethod
    def create(self, order_item: OrderItem) -> OrderItem:
        """注文明細を作成"""
        pass

    @abstractmethod
    def create_many(self, order_items: list[OrderItem]) -> list[OrderItem]:
        """複数の注文明細を一括作成"""
        pass
