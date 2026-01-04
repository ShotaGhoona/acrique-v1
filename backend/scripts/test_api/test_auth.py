"""認証APIテスト"""

import psycopg2

from .client import TestResult, TestRunner
from .config import DB_CONFIG, TEST_USER


def get_verification_token(user_id: int) -> str | None:
    """DBからverification tokenを取得"""
    try:
        conn = psycopg2.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database=DB_CONFIG['database'],
        )
        cursor = conn.cursor()
        cursor.execute(
            'SELECT token FROM verification_tokens WHERE user_id = %s ORDER BY created_at DESC LIMIT 1',
            (user_id,),
        )
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        return row[0] if row else None
    except Exception as e:
        print(f'DB接続エラー: {e}')
        return None


def get_reset_token(email: str) -> str | None:
    """DBからpassword reset tokenを取得"""
    try:
        conn = psycopg2.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database=DB_CONFIG['database'],
        )
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT vt.token FROM verification_tokens vt
            JOIN users u ON vt.user_id = u.id
            WHERE u.email = %s AND vt.token_type = 'password_reset'
            ORDER BY vt.created_at DESC LIMIT 1
            """,
            (email,),
        )
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        return row[0] if row else None
    except Exception as e:
        print(f'DB接続エラー: {e}')
        return None


def cleanup_test_user(email: str):
    """テストユーザーとその関連データをDBから削除"""
    try:
        conn = psycopg2.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database=DB_CONFIG['database'],
        )
        cursor = conn.cursor()
        # ユーザーIDを取得
        cursor.execute('SELECT id FROM users WHERE email = %s', (email,))
        row = cursor.fetchone()
        if row:
            user_id = row[0]
            # 関連データを削除（外部キー制約順）
            cursor.execute(
                'DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = %s)',
                (user_id,),
            )
            cursor.execute('DELETE FROM orders WHERE user_id = %s', (user_id,))
            cursor.execute('DELETE FROM cart_items WHERE user_id = %s', (user_id,))
            cursor.execute('DELETE FROM addresses WHERE user_id = %s', (user_id,))
            cursor.execute(
                'DELETE FROM verification_tokens WHERE user_id = %s', (user_id,)
            )
            cursor.execute('DELETE FROM users WHERE id = %s', (user_id,))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f'クリーンアップエラー: {e}')


def run_auth_tests(runner: TestRunner) -> bool:
    """認証APIテストを実行"""
    client = runner.client
    email = TEST_USER['email']

    # クリーンアップ
    cleanup_test_user(email)

    # 1. 会員登録
    result = TestResult('会員登録', 'POST', '/api/auth/register')
    try:
        resp = client.post(
            '/api/auth/register',
            json={
                'email': email,
                'password': TEST_USER['password'],
                'name': f"{TEST_USER['last_name']} {TEST_USER['first_name']}",
                'phone': TEST_USER['phone'],
            },
        )
        result.set_result(resp.status_code, 201, resp.json())
        if result.success:
            runner.context['user_id'] = resp.json().get('user_id')
    except Exception as e:
        result.set_result(0, 201, error=str(e))
    runner.add_result(result)

    # 2. 会員登録（重複エラー）
    result = TestResult('会員登録（重複）', 'POST', '/api/auth/register')
    try:
        resp = client.post(
            '/api/auth/register',
            json={
                'email': email,
                'password': TEST_USER['password'],
                'name': 'Duplicate User',
            },
        )
        result.set_result(resp.status_code, 400, resp.json())
    except Exception as e:
        result.set_result(0, 400, error=str(e))
    runner.add_result(result)

    # 3. ログイン（メール未認証）
    result = TestResult('ログイン（未認証）', 'POST', '/api/auth/login')
    try:
        resp = client.post(
            '/api/auth/login',
            json={'email': email, 'password': TEST_USER['password']},
        )
        result.set_result(resp.status_code, 403, resp.json())
    except Exception as e:
        result.set_result(0, 403, error=str(e))
    runner.add_result(result)

    # 4. メール認証
    result = TestResult('メール認証', 'POST', '/api/auth/verify-email')
    try:
        user_id = runner.context.get('user_id')
        token = get_verification_token(user_id) if user_id else None
        if token:
            resp = client.post('/api/auth/verify-email', json={'token': token})
            result.set_result(resp.status_code, 200, resp.json())
        else:
            result.set_result(0, 200, error='トークン取得失敗')
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 5. ログイン（成功）
    result = TestResult('ログイン', 'POST', '/api/auth/login')
    try:
        resp = client.post(
            '/api/auth/login',
            json={'email': email, 'password': TEST_USER['password']},
        )
        result.set_result(resp.status_code, 200, resp.json())
        # Secure Cookie対策: レスポンスからトークンを取得して手動設定
        if result.success:
            access_token = resp.json().get('access_token')
            if access_token:
                client.set_auth_token(access_token)
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 6. 認証状態確認
    result = TestResult('認証状態確認', 'GET', '/api/auth/status')
    try:
        resp = client.get('/api/auth/status')
        result.set_result(resp.status_code, 200, resp.json())
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 7. ログアウト
    result = TestResult('ログアウト', 'POST', '/api/auth/logout')
    try:
        resp = client.post('/api/auth/logout')
        result.set_result(resp.status_code, 200, resp.json())
        # ログアウト後はCookieをクリア
        if result.success:
            client.clear_cookies()
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 8. 認証状態確認（未認証）
    result = TestResult('認証状態確認（未認証）', 'GET', '/api/auth/status')
    try:
        resp = client.get('/api/auth/status')
        result.set_result(resp.status_code, 401, resp.json())
    except Exception as e:
        result.set_result(0, 401, error=str(e))
    runner.add_result(result)

    # 9. パスワードリセット依頼
    result = TestResult('パスワードリセット依頼', 'POST', '/api/auth/password-reset')
    try:
        resp = client.post('/api/auth/password-reset', json={'email': email})
        result.set_result(resp.status_code, 200, resp.json())
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 10. パスワードリセット実行
    result = TestResult(
        'パスワードリセット実行', 'POST', '/api/auth/password-reset/confirm'
    )
    try:
        token = get_reset_token(email)
        if token:
            resp = client.post(
                '/api/auth/password-reset/confirm',
                json={'token': token, 'new_password': 'NewPass123!'},
            )
            result.set_result(resp.status_code, 200, resp.json())
        else:
            result.set_result(0, 200, error='リセットトークン取得失敗')
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 11. 新パスワードでログイン（後続テスト用にセッション維持）
    result = TestResult('新パスワードでログイン', 'POST', '/api/auth/login')
    try:
        resp = client.post(
            '/api/auth/login',
            json={'email': email, 'password': 'NewPass123!'},
        )
        result.set_result(resp.status_code, 200, resp.json())
        # 後続テストのためにトークンを設定
        if result.success:
            access_token = resp.json().get('access_token')
            if access_token:
                client.set_auth_token(access_token)
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    return runner.print_summary()


if __name__ == '__main__':
    runner = TestRunner('認証APIテスト')
    run_auth_tests(runner)
