"""Userエンティティのテスト"""

import pytest
from pydantic import ValidationError

from app.domain.entities.user import User


class TestUserEntity:
    """Userエンティティのテストクラス"""

    def test_create_user_with_all_fields(self):
        """全フィールドを指定してUserを作成"""
        user = User(
            id=1,
            email='test@example.com',
            password_hash='hashed_password',
            name='Test User',
            name_kana='テスト ユーザー',
            phone='090-1234-5678',
            company='株式会社テスト',
        )

        assert user.id == 1
        assert user.email == 'test@example.com'
        assert user.password_hash == 'hashed_password'
        assert user.name == 'Test User'
        assert user.name_kana == 'テスト ユーザー'
        assert user.phone == '090-1234-5678'
        assert user.company == '株式会社テスト'

    def test_create_user_with_required_fields_only(self):
        """必須フィールドのみでUserを作成"""
        user = User(email='test@example.com', password_hash='hashed_password')

        assert user.id is None
        assert user.email == 'test@example.com'
        assert user.password_hash == 'hashed_password'
        assert user.name is None
        assert user.name_kana is None
        assert user.phone is None
        assert user.company is None

    def test_create_user_without_email_raises_error(self):
        """emailなしでUserを作成するとエラー"""
        with pytest.raises(ValidationError) as exc_info:
            User(password_hash='hashed_password')

        errors = exc_info.value.errors()
        assert any(error['loc'] == ('email',) for error in errors)

    def test_create_user_without_password_hash_raises_error(self):
        """password_hashなしでUserを作成するとエラー"""
        with pytest.raises(ValidationError) as exc_info:
            User(email='test@example.com')

        errors = exc_info.value.errors()
        assert any(error['loc'] == ('password_hash',) for error in errors)

    def test_create_user_with_invalid_email_raises_error(self):
        """無効なメールアドレスでUserを作成するとエラー"""
        with pytest.raises(ValidationError) as exc_info:
            User(email='invalid-email', password_hash='hashed_password')

        errors = exc_info.value.errors()
        assert any('email' in str(error['loc']) for error in errors)

    def test_user_from_attributes_config(self):
        """from_attributes設定が有効であることを確認"""

        # SQLAlchemyモデル風のオブジェクトを作成
        class MockDBModel:
            def __init__(self):
                self.id = 1
                self.email = 'test@example.com'
                self.password_hash = 'hashed_password'
                self.name = 'Test User'
                self.name_kana = None
                self.phone = None
                self.company = None
                self.stripe_customer_id = None
                self.email_verified_at = None
                self.created_at = None
                self.updated_at = None

        mock_db_obj = MockDBModel()

        # from_attributesがTrueなので、オブジェクトの属性から作成可能
        user = User.model_validate(mock_db_obj)

        assert user.id == 1
        assert user.email == 'test@example.com'
        assert user.password_hash == 'hashed_password'
        assert user.name == 'Test User'

    def test_user_dict_conversion(self):
        """Userを辞書に変換できる"""
        user = User(
            id=1,
            email='test@example.com',
            password_hash='hashed_password',
            name='Test User',
        )

        user_dict = user.model_dump()

        assert user_dict['id'] == 1
        assert user_dict['email'] == 'test@example.com'
        assert user_dict['password_hash'] == 'hashed_password'
        assert user_dict['name'] == 'Test User'

    def test_user_json_conversion(self):
        """UserをJSONに変換できる"""
        user = User(
            id=1,
            email='test@example.com',
            password_hash='hashed_password',
            name='Test User',
        )

        user_json = user.model_dump_json()

        assert isinstance(user_json, str)
        assert '"id":1' in user_json or '"id": 1' in user_json
        assert 'test@example.com' in user_json

    def test_is_email_verified_false_when_not_verified(self):
        """メール未認証の場合is_email_verifiedがFalse"""
        user = User(
            email='test@example.com',
            password_hash='hashed_password',
            email_verified_at=None,
        )

        assert user.is_email_verified is False

    def test_is_email_verified_true_when_verified(self):
        """メール認証済みの場合is_email_verifiedがTrue"""
        from datetime import datetime

        user = User(
            email='test@example.com',
            password_hash='hashed_password',
            email_verified_at=datetime.utcnow(),
        )

        assert user.is_email_verified is True
