"""入稿データリポジトリのインターフェース"""

from abc import ABC, abstractmethod
from datetime import datetime

from app.domain.entities.upload import Upload


class IUploadRepository(ABC):
    """入稿データリポジトリのインターフェース"""

    @abstractmethod
    def get_by_id(self, upload_id: int) -> Upload | None:
        """IDで入稿データを取得"""
        pass

    @abstractmethod
    def get_by_user_id(
        self,
        user_id: int,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Upload]:
        """ユーザーIDで入稿データ一覧を取得"""
        pass

    @abstractmethod
    def get_by_order_id(self, order_id: int) -> list[Upload]:
        """注文IDで入稿データ一覧を取得"""
        pass

    @abstractmethod
    def get_by_order_item_id(self, order_item_id: int) -> list[Upload]:
        """注文明細IDで入稿データ一覧を取得"""
        pass

    @abstractmethod
    def count_by_user_id(self, user_id: int) -> int:
        """ユーザーの入稿データ数を取得"""
        pass

    @abstractmethod
    def create(self, upload: Upload) -> Upload:
        """入稿データを作成"""
        pass

    @abstractmethod
    def update(self, upload: Upload) -> Upload:
        """入稿データを更新"""
        pass

    @abstractmethod
    def delete(self, upload_id: int) -> bool:
        """入稿データを削除"""
        pass

    @abstractmethod
    def link_to_order_item(
        self,
        upload_ids: list[int],
        order_id: int,
        order_item_id: int,
        quantity_index: int = 1,
    ) -> int:
        """入稿データを注文明細に紐付け

        Args:
            upload_ids: 紐付ける入稿データIDのリスト
            order_id: 注文ID
            order_item_id: 注文明細ID
            quantity_index: 何個目の入稿か（1始まり）

        Returns:
            int: 更新された件数
        """
        pass

    # === Admin用メソッド ===

    @abstractmethod
    def get_all_paginated(
        self,
        status: str | None = None,
        user_id: int | None = None,
        order_id: int | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[Upload]:
        """Admin用: 入稿データ一覧を取得（フィルタ・ページネーション対応）"""
        pass

    @abstractmethod
    def count_all_by_filters(
        self,
        status: str | None = None,
        user_id: int | None = None,
        order_id: int | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
    ) -> int:
        """Admin用: フィルタ条件に合致する件数を取得"""
        pass
