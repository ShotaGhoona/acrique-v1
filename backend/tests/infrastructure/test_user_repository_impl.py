"""UserRepositoryImplのテスト"""

from datetime import datetime

from app.domain.entities.user import User
from app.infrastructure.db.repositories.user_repository_impl import UserRepositoryImpl


class TestUserRepositoryImpl:
    """UserRepositoryImplのテストクラス"""

    def test_get_by_email_existing_user(self, db_session):
        """既存ユーザーをメールアドレスで取得"""
        from app.infrastructure.db.models.user_model import UserModel

        user_model = UserModel(
            email='test@example.com',
            password_hash='hashed_password',
            name='Test User',
        )
        db_session.add(user_model)
        db_session.commit()

        repository = UserRepositoryImpl(session=db_session)
        user = repository.get_by_email('test@example.com')

        assert user is not None
        assert user.email == 'test@example.com'
        assert user.name == 'Test User'

    def test_get_by_email_non_existing_user(self, db_session):
        """存在しないユーザーをメールアドレスで取得"""
        repository = UserRepositoryImpl(session=db_session)
        user = repository.get_by_email('nonexistent@example.com')
        assert user is None

    def test_get_by_id_existing_user(self, db_session):
        """既存ユーザーをIDで取得"""
        from app.infrastructure.db.models.user_model import UserModel

        user_model = UserModel(
            email='test_id@example.com',
            password_hash='hashed_password',
            name='Test User By ID',
        )
        db_session.add(user_model)
        db_session.commit()

        repository = UserRepositoryImpl(session=db_session)
        user = repository.get_by_id(user_model.id)

        assert user is not None
        assert user.id == user_model.id

    def test_create_user(self, db_session):
        """ユーザーを作成"""
        repository = UserRepositoryImpl(session=db_session)

        new_user = User(
            email='new@example.com',
            password_hash='hashed_password',
            name='New User',
        )

        created_user = repository.create(new_user)

        assert created_user.id is not None
        assert created_user.id > 0
        assert created_user.email == 'new@example.com'

    def test_update_user(self, db_session):
        """ユーザーを更新"""
        from app.infrastructure.db.models.user_model import UserModel

        user_model = UserModel(
            email='test_update@example.com',
            password_hash='hashed_password',
            name='Test User Update',
        )
        db_session.add(user_model)
        db_session.commit()

        repository = UserRepositoryImpl(session=db_session)

        updated_user = User(
            id=user_model.id,
            email='test_update@example.com',
            password_hash='new_hashed_password',
            name='Updated User',
        )

        result = repository.update(updated_user)

        assert result.name == 'Updated User'

    def test_delete_user(self, db_session):
        """ユーザーを削除"""
        from app.infrastructure.db.models.user_model import UserModel

        user_model = UserModel(
            email='test_delete@example.com',
            password_hash='hashed_password',
            name='Test User Delete',
        )
        db_session.add(user_model)
        db_session.commit()
        user_id = user_model.id

        repository = UserRepositoryImpl(session=db_session)
        result = repository.delete(user_id)

        assert result is True

        # 削除されたことを確認
        user = repository.get_by_id(user_id)
        assert user is None

    def test_update_password(self, db_session):
        """パスワードを更新"""
        from app.infrastructure.db.models.user_model import UserModel

        user_model = UserModel(
            email='test_password@example.com',
            password_hash='old_hashed_password',
            name='Test User Password',
        )
        db_session.add(user_model)
        db_session.commit()

        repository = UserRepositoryImpl(session=db_session)
        result = repository.update_password(user_model.id, 'new_hashed_password')

        assert result is True

        # パスワードが更新されたことを確認
        db_session.refresh(user_model)
        assert user_model.password_hash == 'new_hashed_password'

    def test_verify_email(self, db_session):
        """メール認証を完了"""
        from app.infrastructure.db.models.user_model import UserModel

        user_model = UserModel(
            email='test_verify@example.com',
            password_hash='hashed_password',
            name='Test User Verify',
            email_verified_at=None,
        )
        db_session.add(user_model)
        db_session.commit()

        repository = UserRepositoryImpl(session=db_session)
        verified_at = datetime.utcnow()
        result = repository.verify_email(user_model.id, verified_at)

        assert result is True

        # メール認証が完了したことを確認
        db_session.refresh(user_model)
        assert user_model.email_verified_at is not None
