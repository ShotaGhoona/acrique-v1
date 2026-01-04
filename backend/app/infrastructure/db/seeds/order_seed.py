"""注文シードデータ"""

from datetime import datetime, timedelta

# 注文データ
ORDERS = [
    # user@example.com の注文（支払い済み・発送済み）
    {
        'user_email': 'user@example.com',
        'order_number': 'ORD-20250101-0001',
        'status': 'delivered',
        'shipping_address_index': 0,  # 最初の配送先
        'subtotal': 15000,
        'shipping_fee': 500,
        'tax': 1500,
        'total': 17000,
        'payment_method': 'stripe',
        'paid_at': datetime.utcnow() - timedelta(days=10),
        'shipped_at': datetime.utcnow() - timedelta(days=8),
        'tracking_number': '1234-5678-9012',
        'delivered_at': datetime.utcnow() - timedelta(days=5),
        'notes': '配達時間は午後でお願いします',
        'items': [
            {
                'product_id': 'qr-cube',
                'product_name': 'QR Cube',
                'product_name_ja': 'QRキューブ',
                'quantity': 2,
                'unit_price': 5000,
                'options': {
                    'size': {'value': 'medium', 'label': 'M（60mm）', 'price_diff': 0},
                    'finish': {'value': 'mirror', 'label': 'ミラー仕上げ', 'price_diff': 1000},
                },
                'subtotal': 10000,
            },
            {
                'product_id': 'logo-cutout',
                'product_name': 'Logo Cutout',
                'product_name_ja': 'ロゴ切り抜き',
                'quantity': 1,
                'unit_price': 5000,
                'options': {
                    'size': {'value': 'small', 'label': 'S（100mm）', 'price_diff': 0},
                },
                'subtotal': 5000,
            },
        ],
    },
    # user@example.com の注文（支払い待ち）
    {
        'user_email': 'user@example.com',
        'order_number': 'ORD-20250103-0002',
        'status': 'awaiting_payment',
        'shipping_address_index': 0,
        'subtotal': 8000,
        'shipping_fee': 500,
        'tax': 800,
        'total': 9300,
        'payment_method': 'bank_transfer',
        'notes': None,
        'items': [
            {
                'product_id': 'price-tag',
                'product_name': 'Price Tag',
                'product_name_ja': '価格表示プレート',
                'quantity': 4,
                'unit_price': 2000,
                'options': None,
                'subtotal': 8000,
            },
        ],
    },
    # admin@example.com の注文（処理中）
    {
        'user_email': 'admin@example.com',
        'order_number': 'ORD-20250102-0003',
        'status': 'processing',
        'shipping_address_index': 0,
        'subtotal': 25000,
        'shipping_fee': 0,
        'tax': 2500,
        'total': 27500,
        'payment_method': 'stripe',
        'paid_at': datetime.utcnow() - timedelta(days=2),
        'notes': '領収書を同封してください',
        'items': [
            {
                'product_id': 'menu-stand',
                'product_name': 'Menu Stand',
                'product_name_ja': 'メニュースタンド',
                'quantity': 5,
                'unit_price': 3000,
                'options': {
                    'size': {'value': 'a4', 'label': 'A4サイズ', 'price_diff': 0},
                },
                'subtotal': 15000,
            },
            {
                'product_id': 'sign-holder',
                'product_name': 'Sign Holder',
                'product_name_ja': 'サインホルダー',
                'quantity': 2,
                'unit_price': 5000,
                'options': None,
                'subtotal': 10000,
            },
        ],
    },
    # admin@example.com の注文（キャンセル済み）
    {
        'user_email': 'admin@example.com',
        'order_number': 'ORD-20250101-0004',
        'status': 'cancelled',
        'shipping_address_index': 0,
        'subtotal': 12000,
        'shipping_fee': 500,
        'tax': 1200,
        'total': 13700,
        'payment_method': 'stripe',
        'cancelled_at': datetime.utcnow() - timedelta(days=7),
        'cancel_reason': '商品を間違えて注文してしまったため',
        'notes': None,
        'items': [
            {
                'product_id': 'display-riser',
                'product_name': 'Display Riser',
                'product_name_ja': 'ディスプレイライザー',
                'quantity': 3,
                'unit_price': 4000,
                'options': None,
                'subtotal': 12000,
            },
        ],
    },
]
