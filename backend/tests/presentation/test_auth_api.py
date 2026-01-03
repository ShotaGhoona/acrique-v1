"""Auth APIエンドポイントのテスト"""

import pytest
from fastapi import status
from fastapi.testclient import TestClient


class TestAuthAPI:
    """Auth APIエンドポイントのテストクラス"""

    def test_login_missing_email(self, test_client: TestClient):
        """ログイン失敗のテスト（emailが欠落）"""
        response = test_client.post('/api/auth/login', json={'password': 'pass'})

        # バリデーションエラー
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_login_missing_password(self, test_client: TestClient):
        """ログイン失敗のテスト（passwordが欠落）"""
        response = test_client.post('/api/auth/login', json={'email': 'test@example.com'})

        # バリデーションエラー
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_login_invalid_email_format(self, test_client: TestClient):
        """ログイン失敗のテスト（無効なメールアドレス形式）"""
        response = test_client.post(
            '/api/auth/login', json={'email': 'invalid-email', 'password': 'password'}
        )

        # バリデーションエラー
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_login_user_not_found(self, test_client: TestClient):
        """ログイン失敗のテスト（ユーザーが存在しない）"""
        response = test_client.post(
            '/api/auth/login',
            json={'email': 'nonexistent@example.com', 'password': 'password123'},
        )

        # 認証エラー
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        data = response.json()
        assert 'detail' in data

    def test_logout_success(self, test_client: TestClient):
        """ログアウト成功のテスト（認証なしでも可能な場合）"""
        response = test_client.post('/api/auth/logout')

        # ログアウトは認証なしでも成功する（ENABLE_AUTH=falseの場合）
        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        assert 'message' in data
        assert data['message'] == 'ログアウトしました'

    @pytest.mark.skip(reason='Requires integration test setup with DB')
    def test_get_status_success(self, test_client: TestClient):
        """認証状態取得のテスト（ENABLE_AUTH=falseの場合）"""
        response = test_client.get('/api/auth/status')

        # 認証が無効な場合は成功する
        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        assert 'is_authenticated' in data

    def test_register_missing_email(self, test_client: TestClient):
        """会員登録失敗のテスト（emailが欠落）"""
        response = test_client.post(
            '/api/auth/register', json={'password': 'password123'}
        )

        # バリデーションエラー
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_missing_password(self, test_client: TestClient):
        """会員登録失敗のテスト（passwordが欠落）"""
        response = test_client.post(
            '/api/auth/register', json={'email': 'test@example.com'}
        )

        # バリデーションエラー
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_short_password(self, test_client: TestClient):
        """会員登録失敗のテスト（パスワードが短すぎる）"""
        response = test_client.post(
            '/api/auth/register',
            json={'email': 'test@example.com', 'password': 'short'},
        )

        # バリデーションエラー（8文字以上が必要）
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_verify_email_missing_token(self, test_client: TestClient):
        """メール認証失敗のテスト（tokenが欠落）"""
        response = test_client.post('/api/auth/verify-email', json={})

        # バリデーションエラー
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_password_reset_missing_email(self, test_client: TestClient):
        """パスワードリセット依頼失敗のテスト（emailが欠落）"""
        response = test_client.post('/api/auth/password-reset', json={})

        # バリデーションエラー
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_password_reset_request_success(self, test_client: TestClient):
        """パスワードリセット依頼のテスト（存在しないユーザーでも成功として返す）"""
        response = test_client.post(
            '/api/auth/password-reset',
            json={'email': 'nonexistent@example.com'},
        )

        # セキュリティ対策：ユーザーが存在しなくても成功として返す
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert 'message' in data

    def test_password_reset_confirm_missing_token(self, test_client: TestClient):
        """パスワードリセット実行失敗のテスト（tokenが欠落）"""
        response = test_client.post(
            '/api/auth/password-reset/confirm',
            json={'new_password': 'newpassword123'},
        )

        # バリデーションエラー
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_resend_verification_missing_email(self, test_client: TestClient):
        """メール認証再送信失敗のテスト（emailが欠落）"""
        response = test_client.post('/api/auth/resend-verification', json={})

        # バリデーションエラー
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_resend_verification_success(self, test_client: TestClient):
        """メール認証再送信のテスト（存在しないユーザーでも成功として返す）"""
        response = test_client.post(
            '/api/auth/resend-verification',
            json={'email': 'nonexistent@example.com'},
        )

        # セキュリティ対策：ユーザーが存在しなくても成功として返す
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert 'message' in data
