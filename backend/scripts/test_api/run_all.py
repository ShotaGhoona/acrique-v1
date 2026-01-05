#!/usr/bin/env python3
"""全APIテスト実行スクリプト"""

import sys
from collections.abc import Callable

from .client import APIClient, TestRunner
from .config import TEST_USER
from .test_addresses import run_address_tests
from .test_auth import cleanup_test_user, run_auth_tests
from .test_cart import run_cart_clear_test, run_cart_tests
from .test_orders import run_order_tests
from .test_products import run_product_tests
from .test_users import run_user_tests


def main():
    """全テストを実行"""
    print('\n' + '=' * 60)
    print('🚀 API テスト開始')
    print('=' * 60)

    all_passed = True
    total_passed = 0
    total_tests = 0

    # 共有クライアント（セッション・Cookie を維持）
    shared_client = APIClient()

    # 共有コンテキスト（テスト間でデータを共有）
    shared_context: dict = {}

    # テスト定義：(名前, テスト関数)
    test_suites: list[tuple[str, Callable[[TestRunner], bool]]] = [
        ('認証API', run_auth_tests),
        ('ユーザーAPI', run_user_tests),
        ('配送先API', run_address_tests),
        ('商品API', run_product_tests),
        ('カートAPI', run_cart_tests),
        ('注文API', run_order_tests),
        ('カート全削除', run_cart_clear_test),
    ]

    for name, test_func in test_suites:
        runner = TestRunner(name)

        # 共有クライアントとコンテキストを引き継ぐ
        runner.client = shared_client
        runner.context = shared_context.copy()

        # テスト実行
        try:
            passed = test_func(runner)
        except Exception as e:
            print(f'\n❌ {name} でエラーが発生: {e}')
            passed = False

        # 結果を集計
        suite_passed, suite_total = runner.get_stats()
        total_passed += suite_passed
        total_tests += suite_total

        if not passed:
            all_passed = False

        # コンテキストを更新（次のテストに引き継ぐ）
        shared_context.update(runner.context)

    # 最終結果
    print('\n' + '=' * 60)
    print('📊 最終結果')
    print('=' * 60)
    print(f'合計: {total_passed}/{total_tests} passed')

    if all_passed:
        print('\n✅ すべてのテストが成功しました！')
    else:
        print('\n❌ 一部のテストが失敗しました')

    # クリーンアップ
    print('\n🧹 テストデータをクリーンアップ中...')
    cleanup_test_user(TEST_USER['email'])
    print('クリーンアップ完了')

    return 0 if all_passed else 1


if __name__ == '__main__':
    sys.exit(main())
