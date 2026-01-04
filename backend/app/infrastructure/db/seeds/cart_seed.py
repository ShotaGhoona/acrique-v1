"""カートシードデータ"""

# user_emailとproduct_idでカートアイテムを管理
CART_ITEMS = [
    # user@example.com のカート
    {
        'user_email': 'user@example.com',
        'product_id': 'qr-cube',
        'quantity': 2,
        'options': {
            'size': {
                'value': 'medium',
                'label': 'M（60mm）',
                'price_diff': 0,
            },
            'finish': {
                'value': 'mirror',
                'label': 'ミラー仕上げ',
                'price_diff': 1000,
            },
        },
    },
    {
        'user_email': 'user@example.com',
        'product_id': 'logo-cutout',
        'quantity': 1,
        'options': {
            'size': {
                'value': 'large',
                'label': 'L（200mm）',
                'price_diff': 5000,
            },
            'thickness': {
                'value': '15mm',
                'label': '15mm',
                'price_diff': 2000,
            },
        },
    },
    # admin@example.com のカート
    {
        'user_email': 'admin@example.com',
        'product_id': 'qr-cube',
        'quantity': 5,
        'options': {
            'size': {
                'value': 'large',
                'label': 'L（80mm）',
                'price_diff': 2000,
            },
            'finish': {
                'value': 'matte',
                'label': 'マット仕上げ',
                'price_diff': 0,
            },
        },
    },
]
