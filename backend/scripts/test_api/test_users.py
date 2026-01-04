"""ユーザーAPIテスト"""

from .client import TestResult, TestRunner
from .config import TEST_USER


def run_user_tests(runner: TestRunner) -> bool:
    """ユーザーAPIテストを実行（認証済み状態で実行すること）"""
    client = runner.client

    # 1. 自分の情報取得
    result = TestResult('自分の情報取得', 'GET', '/api/users/me')
    try:
        resp = client.get('/api/users/me')
        result.set_result(resp.status_code, 200, resp.json())
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 2. 自分の情報更新
    result = TestResult('自分の情報更新', 'PUT', '/api/users/me')
    try:
        resp = client.put(
            '/api/users/me',
            json={
                'name': '更新太郎',
                'name_kana': 'コウシンタロウ',
                'phone': '09099998888',
                'company': 'テスト株式会社',
            },
        )
        result.set_result(resp.status_code, 200, resp.json())
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 3. 自分の情報取得（更新確認）
    result = TestResult('自分の情報取得（更新確認）', 'GET', '/api/users/me')
    try:
        resp = client.get('/api/users/me')
        data = resp.json()
        if resp.status_code == 200 and data.get('name') == '更新太郎':
            result.set_result(200, 200, data)
        else:
            result.set_result(resp.status_code, 200, data, error='更新が反映されていない')
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 4. パスワード変更
    result = TestResult('パスワード変更', 'PUT', '/api/users/me/password')
    try:
        # 認証テストでパスワードが NewPass123! に変更されている
        resp = client.put(
            '/api/users/me/password',
            json={
                'current_password': 'NewPass123!',
                'new_password': TEST_USER['password'],  # 元に戻す
            },
        )
        result.set_result(resp.status_code, 200, resp.json())
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 5. パスワード変更（現在のパスワードが違う）
    result = TestResult('パスワード変更（エラー）', 'PUT', '/api/users/me/password')
    try:
        resp = client.put(
            '/api/users/me/password',
            json={
                'current_password': 'WrongPassword123!',
                'new_password': 'AnotherPass123!',
            },
        )
        result.set_result(resp.status_code, 400, resp.json())
    except Exception as e:
        result.set_result(0, 400, error=str(e))
    runner.add_result(result)

    return runner.print_summary()


if __name__ == '__main__':
    runner = TestRunner('ユーザーAPIテスト')
    run_user_tests(runner)
