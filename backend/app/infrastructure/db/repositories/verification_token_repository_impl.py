from datetime import datetime

from sqlalchemy.orm import Session

from app.domain.entities.verification_token import TokenType, VerificationToken
from app.domain.repositories.verification_token_repository import (
    IVerificationTokenRepository,
)
from app.infrastructure.db.models.verification_token_model import (
    VerificationTokenModel,
)


class VerificationTokenRepositoryImpl(IVerificationTokenRepository):
    """認証トークンリポジトリの実装"""

    def __init__(self, session: Session):
        self.session = session

    def create(self, token: VerificationToken) -> VerificationToken:
        """トークンを作成"""
        token_model = VerificationTokenModel(
            user_id=token.user_id,
            token=token.token,
            token_type=token.token_type.value,
            expires_at=token.expires_at,
        )
        self.session.add(token_model)
        self.session.flush()
        return self._to_entity(token_model)

    def get_by_token(self, token: str, token_type: TokenType) -> VerificationToken | None:
        """トークン文字列で取得"""
        token_model = (
            self.session.query(VerificationTokenModel)
            .filter(
                VerificationTokenModel.token == token,
                VerificationTokenModel.token_type == token_type.value,
            )
            .first()
        )
        if token_model is None:
            return None
        return self._to_entity(token_model)

    def mark_as_used(self, token_id: int, used_at: datetime) -> bool:
        """トークンを使用済みにする"""
        token_model = (
            self.session.query(VerificationTokenModel)
            .filter(VerificationTokenModel.id == token_id)
            .first()
        )
        if token_model is None:
            return False

        token_model.used_at = used_at
        self.session.flush()
        return True

    def delete_expired(self) -> int:
        """期限切れトークンを削除"""
        now = datetime.utcnow()
        result = (
            self.session.query(VerificationTokenModel)
            .filter(VerificationTokenModel.expires_at < now)
            .delete()
        )
        self.session.flush()
        return result

    def delete_by_user_and_type(self, user_id: int, token_type: TokenType) -> int:
        """ユーザーの特定タイプのトークンを削除"""
        result = (
            self.session.query(VerificationTokenModel)
            .filter(
                VerificationTokenModel.user_id == user_id,
                VerificationTokenModel.token_type == token_type.value,
            )
            .delete()
        )
        self.session.flush()
        return result

    def _to_entity(self, model: VerificationTokenModel) -> VerificationToken:
        """DBモデルをエンティティに変換"""
        return VerificationToken(
            id=model.id,
            user_id=model.user_id,
            token=model.token,
            token_type=TokenType(model.token_type),
            expires_at=model.expires_at,
            used_at=model.used_at,
            created_at=model.created_at,
        )
