"""ユーザーシードデータ"""

from datetime import datetime

# パスワード: password123 をbcryptでハッシュ化したもの
# 実際の運用では環境変数等で管理する
HASHED_PASSWORD = '$2b$12$cmsmE0rT7sCvJU3jMOePguOo9VnhyD2VI.6QbTBpXKbrHnqqeaGWW'

USERS = [
    {
        'email': 'admin@example.com',
        'password_hash': HASHED_PASSWORD,
        'name': '管理者',
        'name_kana': 'カンリシャ',
        'phone': '03-1234-5678',
        'company': '株式会社Acrique',
        'email_verified_at': datetime.utcnow(),
    },
    {
        'email': 'user@example.com',
        'password_hash': HASHED_PASSWORD,
        'name': '田中 太郎',
        'name_kana': 'タナカ タロウ',
        'phone': '090-1234-5678',
        'company': None,
        'email_verified_at': datetime.utcnow(),
    },
]
