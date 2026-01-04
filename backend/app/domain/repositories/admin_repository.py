"""管理者リポジトリインターフェース"""

from abc import ABC, abstractmethod
from datetime import datetime

from app.domain.entities.admin import Admin, AdminLog, AdminRole


class IAdminRepository(ABC):
    """管理者リポジトリインターフェース"""

    @abstractmethod
    def get_by_id(self, admin_id: int) -> Admin | None:
        """IDで管理者を取得"""
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> Admin | None:
        """メールアドレスで管理者を取得"""
        pass

    @abstractmethod
    def get_all(
        self,
        role: AdminRole | None = None,
        is_active: bool | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[Admin]:
        """管理者一覧を取得"""
        pass

    @abstractmethod
    def count_all(
        self,
        role: AdminRole | None = None,
        is_active: bool | None = None,
    ) -> int:
        """管理者数を取得"""
        pass

    @abstractmethod
    def create(self, admin: Admin) -> Admin:
        """管理者を作成"""
        pass

    @abstractmethod
    def update(self, admin: Admin) -> Admin:
        """管理者を更新"""
        pass

    @abstractmethod
    def update_last_login(self, admin_id: int, last_login_at: datetime) -> bool:
        """最終ログイン日時を更新"""
        pass

    @abstractmethod
    def delete(self, admin_id: int) -> bool:
        """管理者を削除"""
        pass


class IAdminLogRepository(ABC):
    """管理者操作ログリポジトリインターフェース"""

    @abstractmethod
    def create(self, log: AdminLog) -> AdminLog:
        """操作ログを作成"""
        pass

    @abstractmethod
    def get_by_admin_id(
        self,
        admin_id: int,
        limit: int = 50,
        offset: int = 0,
    ) -> list[AdminLog]:
        """管理者IDで操作ログを取得"""
        pass

    @abstractmethod
    def get_all(
        self,
        admin_id: int | None = None,
        action: str | None = None,
        target_type: str | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[AdminLog]:
        """操作ログ一覧を取得（フィルタリング対応）"""
        pass

    @abstractmethod
    def count_all(
        self,
        admin_id: int | None = None,
        action: str | None = None,
        target_type: str | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
    ) -> int:
        """操作ログ数を取得"""
        pass
