"""テスト設定"""

import os

# API Base URL
BASE_URL = os.getenv('TEST_API_BASE_URL', 'http://localhost:8000')

# テスト用ユーザー情報
TEST_USER = {
    'email': 'apitest_runner@example.com',
    'password': 'TestPass123!',
    'first_name': 'API',
    'last_name': 'Tester',
    'phone': '09000000000',
}

# テスト用配送先情報
TEST_ADDRESS = {
    'postal_code': '100-0001',
    'prefecture': '東京都',
    'city': '千代田区',
    'address_line1': '千代田1-1-1',
    'address_line2': 'テストビル101',
    'recipient_name': 'テスト太郎',
    'recipient_phone': '09011112222',
    'is_default': True,
}

# DB接続情報（トークン取得用）
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'postgres_acrique'),
    'port': os.getenv('DB_PORT', '5432'),
    'user': os.getenv('DB_USER', 'acrique_user'),
    'password': os.getenv('DB_PASSWORD', 'acrique_password'),
    'database': os.getenv('DB_NAME', 'acrique_db'),
}
