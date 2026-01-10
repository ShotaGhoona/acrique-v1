# 商品画像

シード実行時にS3にアップロードされる商品画像を配置するフォルダです。

## フォルダ構成

```
images/
├── {product_id}/
│   ├── main.jpg      # メイン画像（is_main: true）
│   ├── 02.jpg        # サブ画像
│   └── 03.jpg
└── ...
```

## 対応フォーマット

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

## 使い方

1. 商品IDと同じ名前のフォルダを作成
2. 画像を配置
3. `product_seed.py` の `PRODUCT_IMAGES` に `local_path` を設定
4. `python -m app.infrastructure.db.seeds.run_seed` を実行

## 例

```python
# product_seed.py
PRODUCT_IMAGES = [
    {
        'product_id': 'qr-cube',
        'local_path': 'images/qr-cube/main.jpg',
        'alt': 'QRコードキューブ メイン',
        'is_main': True,
        'sort_order': 1,
    },
]
```
