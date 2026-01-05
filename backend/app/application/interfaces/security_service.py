from abc import ABC, abstractmethod
from datetime import timedelta


class ISecurityService(ABC):
    """セキュリティサービスのインターフェース"""

    @abstractmethod
    def create_access_token(
        self, user_id: int, expires_delta: timedelta | None = None
    ) -> str:
        """アクセストークンを生成"""
        pass

    @abstractmethod
    def create_admin_access_token(
        self,
        admin_id: int,
        role: str,
        expires_delta: timedelta | None = None,
    ) -> str:
        """管理者用アクセストークンを生成"""
        pass

    @abstractmethod
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """パスワードを検証"""
        pass

    @abstractmethod
    def hash_password(self, password: str) -> str:
        """パスワードをハッシュ化"""
        pass
