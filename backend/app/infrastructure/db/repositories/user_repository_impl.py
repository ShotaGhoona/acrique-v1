from datetime import datetime

from sqlalchemy import extract, or_
from sqlalchemy.orm import Session

from app.domain.entities.user import User
from app.domain.repositories.user_repository import IUserRepository
from app.infrastructure.db.models.user_model import UserModel


class UserRepositoryImpl(IUserRepository):
    """ユーザーリポジトリの実装"""

    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, user_id: int) -> User | None:
        """IDでユーザーを取得"""
        user_model = self.session.query(UserModel).filter(UserModel.id == user_id).first()
        if user_model is None:
            return None
        return self._to_entity(user_model)

    def get_by_email(self, email: str) -> User | None:
        """メールアドレスでユーザーを取得"""
        user_model = (
            self.session.query(UserModel).filter(UserModel.email == email).first()
        )
        if user_model is None:
            return None
        return self._to_entity(user_model)

    def create(self, user: User) -> User:
        """ユーザーを作成"""
        user_model = UserModel(
            email=user.email,
            password_hash=user.password_hash,
            name=user.name,
            name_kana=user.name_kana,
            phone=user.phone,
            company=user.company,
        )
        self.session.add(user_model)
        self.session.flush()
        return self._to_entity(user_model)

    def update(self, user: User) -> User:
        """ユーザーを更新"""
        user_model = self.session.query(UserModel).filter(UserModel.id == user.id).first()
        if user_model is None:
            raise ValueError(f'User with id {user.id} not found')

        user_model.name = user.name
        user_model.name_kana = user.name_kana
        user_model.phone = user.phone
        user_model.company = user.company

        self.session.flush()
        return self._to_entity(user_model)

    def update_password(self, user_id: int, password_hash: str) -> bool:
        """パスワードを更新"""
        user_model = self.session.query(UserModel).filter(UserModel.id == user_id).first()
        if user_model is None:
            return False

        user_model.password_hash = password_hash
        self.session.flush()
        return True

    def verify_email(self, user_id: int, verified_at: datetime) -> bool:
        """メール認証を完了"""
        user_model = self.session.query(UserModel).filter(UserModel.id == user_id).first()
        if user_model is None:
            return False

        user_model.email_verified_at = verified_at
        self.session.flush()
        return True

    def delete(self, user_id: int) -> bool:
        """ユーザーを削除"""
        user_model = self.session.query(UserModel).filter(UserModel.id == user_id).first()
        if user_model is None:
            return False

        self.session.delete(user_model)
        self.session.flush()
        return True

    def get_all(
        self,
        search: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[User]:
        """ユーザー一覧を取得（検索・ページネーション対応）"""
        query = self.session.query(UserModel)

        if search:
            search_pattern = f'%{search}%'
            query = query.filter(
                or_(
                    UserModel.email.ilike(search_pattern),
                    UserModel.name.ilike(search_pattern),
                )
            )

        query = query.order_by(UserModel.created_at.desc())
        user_models = query.offset(offset).limit(limit).all()
        return [self._to_entity(m) for m in user_models]

    def count_all(self, search: str | None = None) -> int:
        """ユーザー数を取得"""
        query = self.session.query(UserModel)

        if search:
            search_pattern = f'%{search}%'
            query = query.filter(
                or_(
                    UserModel.email.ilike(search_pattern),
                    UserModel.name.ilike(search_pattern),
                )
            )

        return query.count()

    def count_new_this_month(self) -> int:
        """今月の新規ユーザー数を取得"""
        now = datetime.now()
        return (
            self.session.query(UserModel)
            .filter(
                extract('year', UserModel.created_at) == now.year,
                extract('month', UserModel.created_at) == now.month,
            )
            .count()
        )

    def _to_entity(self, user_model: UserModel) -> User:
        """DBモデルをエンティティに変換"""
        return User(
            id=user_model.id,
            email=user_model.email,
            password_hash=user_model.password_hash,
            name=user_model.name,
            name_kana=user_model.name_kana,
            phone=user_model.phone,
            company=user_model.company,
            stripe_customer_id=user_model.stripe_customer_id,
            email_verified_at=user_model.email_verified_at,
            created_at=user_model.created_at,
            updated_at=user_model.updated_at,
        )
