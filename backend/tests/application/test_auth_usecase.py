"""AuthUsecaseのテスト"""

from datetime import datetime
from unittest.mock import MagicMock

import pytest
from fastapi import HTTPException

from app.application.interfaces.email_service import IEmailService
from app.application.interfaces.security_service import ISecurityService
from app.application.schemas.auth_schemas import (
    LoginInputDTO,
    LoginOutputDTO,
    LogoutOutputDTO,
    StatusOutputDTO,
)
from app.application.use_cases.auth_usecase import AuthUsecase
from app.domain.entities.user import User
from app.domain.repositories.user_repository import IUserRepository
from app.domain.repositories.verification_token_repository import (
    IVerificationTokenRepository,
)


@pytest.fixture
def mock_user_repository():
    """モックUserRepository"""
    return MagicMock(spec=IUserRepository)


@pytest.fixture
def mock_token_repository():
    """モックTokenRepository"""
    return MagicMock(spec=IVerificationTokenRepository)


@pytest.fixture
def mock_email_service():
    """モックEmailService"""
    return MagicMock(spec=IEmailService)


@pytest.fixture
def auth_usecase(mock_security_service, mock_user_repository, mock_token_repository, mock_email_service):
    """AuthUsecaseインスタンス"""
    return AuthUsecase(
        security_service=mock_security_service,
        user_repository=mock_user_repository,
        token_repository=mock_token_repository,
        email_service=mock_email_service,
    )


class TestAuthUsecase:
    """AuthUsecaseのテストクラス"""

    def test_login_success(
        self, auth_usecase, mock_security_service, mock_user_repository
    ):
        """ログイン成功のテスト"""
        # テスト用ユーザー
        test_user = User(
            id=1,
            email='test@example.com',
            password_hash='hashed_password',
            name='Test User',
            email_verified_at=datetime.utcnow(),
        )

        # モックの設定
        mock_user_repository.get_by_email.return_value = test_user
        mock_security_service.verify_password.return_value = True
        mock_security_service.create_access_token.return_value = 'test_token_12345'

        # 入力DTOの作成
        input_dto = LoginInputDTO(email='test@example.com', password='password123')

        # テスト実行
        result = auth_usecase.login(input_dto)

        # 検証
        assert isinstance(result, LoginOutputDTO)
        assert result.access_token == 'test_token_12345'
        assert result.user_id == 1

        # モックが正しく呼ばれたか確認
        mock_user_repository.get_by_email.assert_called_once_with('test@example.com')
        mock_security_service.verify_password.assert_called_once_with(
            'password123', 'hashed_password'
        )
        mock_security_service.create_access_token.assert_called_once_with(user_id=1)

    def test_login_failure_user_not_found(
        self, auth_usecase, mock_user_repository
    ):
        """ログイン失敗のテスト（ユーザーが見つからない）"""
        mock_user_repository.get_by_email.return_value = None

        input_dto = LoginInputDTO(email='nonexistent@example.com', password='password')

        with pytest.raises(HTTPException) as exc_info:
            auth_usecase.login(input_dto)

        assert exc_info.value.status_code == 401
        assert 'メールアドレスまたはパスワードが正しくありません' in exc_info.value.detail

    def test_login_failure_wrong_password(
        self, auth_usecase, mock_security_service, mock_user_repository
    ):
        """ログイン失敗のテスト（パスワードが間違っている）"""
        test_user = User(
            id=1,
            email='test@example.com',
            password_hash='hashed_password',
            email_verified_at=datetime.utcnow(),
        )
        mock_user_repository.get_by_email.return_value = test_user
        mock_security_service.verify_password.return_value = False

        input_dto = LoginInputDTO(email='test@example.com', password='wrong_password')

        with pytest.raises(HTTPException) as exc_info:
            auth_usecase.login(input_dto)

        assert exc_info.value.status_code == 401
        assert 'メールアドレスまたはパスワードが正しくありません' in exc_info.value.detail

    def test_login_failure_email_not_verified(
        self, auth_usecase, mock_security_service, mock_user_repository
    ):
        """ログイン失敗のテスト（メール未認証）"""
        test_user = User(
            id=1,
            email='test@example.com',
            password_hash='hashed_password',
            email_verified_at=None,  # 未認証
        )
        mock_user_repository.get_by_email.return_value = test_user
        mock_security_service.verify_password.return_value = True

        input_dto = LoginInputDTO(email='test@example.com', password='password')

        with pytest.raises(HTTPException) as exc_info:
            auth_usecase.login(input_dto)

        assert exc_info.value.status_code == 403
        assert 'メールアドレスが認証されていません' in exc_info.value.detail

    def test_logout(self, auth_usecase):
        """ログアウトのテスト"""
        result = auth_usecase.logout()

        assert isinstance(result, LogoutOutputDTO)
        assert result.message == 'ログアウトしました'

    def test_get_auth_status(self, auth_usecase, mock_user_repository):
        """認証状態取得のテスト"""
        test_user = User(
            id=123,
            email='test@example.com',
            password_hash='hashed_password',
            name='Test User',
            email_verified_at=datetime.utcnow(),
        )
        mock_user_repository.get_by_id.return_value = test_user

        result = auth_usecase.get_auth_status(user_id=123)

        assert isinstance(result, StatusOutputDTO)
        assert result.is_authenticated is True
        assert result.user_id == 123
        assert result.email == 'test@example.com'
        assert result.name == 'Test User'
        assert result.is_email_verified is True

    def test_get_auth_status_user_not_found(self, auth_usecase, mock_user_repository):
        """認証状態取得失敗のテスト（ユーザーが見つからない）"""
        mock_user_repository.get_by_id.return_value = None

        with pytest.raises(HTTPException) as exc_info:
            auth_usecase.get_auth_status(user_id=999)

        assert exc_info.value.status_code == 401
        assert 'ユーザーが見つかりません' in exc_info.value.detail
