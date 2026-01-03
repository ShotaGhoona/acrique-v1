from abc import ABC, abstractmethod
from datetime import datetime

from app.domain.entities.user import User


class IUserRepository(ABC):
    """ユーザーリポジトリのインターフェース"""

    @abstractmethod
    def get_by_id(self, user_id: int) -> User | None:
        """IDでユーザーを取得"""
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> User | None:
        """メールアドレスでユーザーを取得"""
        pass

    @abstractmethod
    def create(self, user: User) -> User:
        """ユーザーを作成"""
        pass

    @abstractmethod
    def update(self, user: User) -> User:
        """ユーザーを更新"""
        pass

    @abstractmethod
    def update_password(self, user_id: int, password_hash: str) -> bool:
        """パスワードを更新"""
        pass

    @abstractmethod
    def verify_email(self, user_id: int, verified_at: datetime) -> bool:
        """メール認証を完了"""
        pass

    @abstractmethod
    def delete(self, user_id: int) -> bool:
        """ユーザーを削除"""
        pass
