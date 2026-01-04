"""配送先シードデータ"""

# user_idはシード実行時に動的に設定される
# ここではメールアドレスをキーにして管理
ADDRESSES = [
    # admin@example.com の配送先
    {
        'user_email': 'admin@example.com',
        'label': '本社',
        'name': '株式会社Acrique',
        'postal_code': '150-0001',
        'prefecture': '東京都',
        'city': '渋谷区',
        'address1': '神宮前1-2-3',
        'address2': 'Acriqueビル 10F',
        'phone': '03-1234-5678',
        'is_default': True,
    },
    {
        'user_email': 'admin@example.com',
        'label': '倉庫',
        'name': '株式会社Acrique 物流センター',
        'postal_code': '272-0001',
        'prefecture': '千葉県',
        'city': '市川市',
        'address1': '二俣1-1-1',
        'address2': '物流センター A棟',
        'phone': '047-123-4567',
        'is_default': False,
    },
    # user@example.com の配送先
    {
        'user_email': 'user@example.com',
        'label': '自宅',
        'name': '田中 太郎',
        'postal_code': '160-0022',
        'prefecture': '東京都',
        'city': '新宿区',
        'address1': '新宿3-4-5',
        'address2': 'サンプルマンション 301号室',
        'phone': '090-1234-5678',
        'is_default': True,
    },
    {
        'user_email': 'user@example.com',
        'label': '実家',
        'name': '田中 一郎',
        'postal_code': '530-0001',
        'prefecture': '大阪府',
        'city': '大阪市北区',
        'address1': '梅田1-2-3',
        'address2': None,
        'phone': '06-1234-5678',
        'is_default': False,
    },
]
