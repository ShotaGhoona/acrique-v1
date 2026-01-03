from abc import ABC, abstractmethod
from datetime import datetime

from app.domain.entities.verification_token import TokenType, VerificationToken


class IVerificationTokenRepository(ABC):
    """認証トークンリポジトリのインターフェース"""

    @abstractmethod
    def create(self, token: VerificationToken) -> VerificationToken:
        """トークンを作成"""
        pass

    @abstractmethod
    def get_by_token(self, token: str, token_type: TokenType) -> VerificationToken | None:
        """トークン文字列で取得"""
        pass

    @abstractmethod
    def mark_as_used(self, token_id: int, used_at: datetime) -> bool:
        """トークンを使用済みにする"""
        pass

    @abstractmethod
    def delete_expired(self) -> int:
        """期限切れトークンを削除"""
        pass

    @abstractmethod
    def delete_by_user_and_type(self, user_id: int, token_type: TokenType) -> int:
        """ユーザーの特定タイプのトークンを削除"""
        pass
