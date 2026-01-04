"""HTTPクライアント（Cookie管理付き）"""

from typing import Any

import requests

from .config import BASE_URL


class APIClient:
    """APIテスト用HTTPクライアント"""

    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()

    def get(self, endpoint: str, **kwargs) -> requests.Response:
        return self.session.get(f'{self.base_url}{endpoint}', **kwargs)

    def post(
        self, endpoint: str, json: dict | None = None, **kwargs
    ) -> requests.Response:
        return self.session.post(f'{self.base_url}{endpoint}', json=json, **kwargs)

    def put(self, endpoint: str, json: dict | None = None, **kwargs) -> requests.Response:
        return self.session.put(f'{self.base_url}{endpoint}', json=json, **kwargs)

    def delete(self, endpoint: str, **kwargs) -> requests.Response:
        return self.session.delete(f'{self.base_url}{endpoint}', **kwargs)

    def clear_cookies(self):
        self.session.cookies.clear()

    def set_auth_token(self, token: str):
        """認証トークンをCookieに設定（Secure cookie対策）"""
        self.session.cookies.set('access_token', token)


class TestResult:
    """テスト結果"""

    def __init__(self, name: str, method: str, endpoint: str):
        self.name = name
        self.method = method
        self.endpoint = endpoint
        self.status_code: int | None = None
        self.expected_status: int | None = None
        self.success: bool = False
        self.error: str | None = None
        self.response_data: Any = None

    def set_result(
        self,
        status_code: int,
        expected_status: int,
        response_data: Any = None,
        error: str | None = None,
    ):
        self.status_code = status_code
        self.expected_status = expected_status
        self.success = status_code == expected_status
        self.response_data = response_data
        self.error = error

    def __str__(self) -> str:
        status = '✅' if self.success else '❌'
        code_info = f'{self.status_code}' if self.status_code else 'N/A'
        expected_info = f'(expected: {self.expected_status})' if not self.success else ''
        error_info = f' - {self.error}' if self.error else ''
        return f'{status} [{self.method}] {self.endpoint} -> {code_info} {expected_info}{error_info}'


class TestRunner:
    """テストランナー"""

    def __init__(self, name: str):
        self.name = name
        self.results: list[TestResult] = []
        self.client = APIClient()
        self.context: dict[str, Any] = {}

    def add_result(self, result: TestResult):
        self.results.append(result)

    def print_summary(self):
        print(f"\n{'=' * 60}")
        print(f'📋 {self.name}')
        print('=' * 60)

        for result in self.results:
            print(result)

        passed = sum(1 for r in self.results if r.success)
        total = len(self.results)
        print('-' * 60)
        print(f'結果: {passed}/{total} passed')

        return passed == total

    def get_stats(self) -> tuple[int, int]:
        passed = sum(1 for r in self.results if r.success)
        return passed, len(self.results)
