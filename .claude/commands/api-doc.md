---
description: APIをテストして資料を生成
argument-hint: [エンドポイント] [HTTPメソッド]
---

# API Documentation Generator

## 引数
- `$1`: エンドポイント（例: `/api/products`）
- `$2`: HTTPメソッド（省略時: GET）

## 手順

1. **ポート確認**
   - `docker compose ps --format json` でbackendのポートを確認
   - docker-compose.ymlの `ports` を見て `ホスト:コンテナ` のホスト側を使う

2. **APIを実行**
   - `curl -sL http://localhost:[ホストポート]$1 | jq .`
   - `-L`: リダイレクト追従（末尾スラッシュで307が返る場合あり）
   - ホストマシンから実行（コンテナ内にcurlがないため）

3. **レスポンスを保存**
   - `curl ... | jq . > response.json` で整形して保存（`jq .` を通さないと1行になる）
   - 保存先: `docs/api-responses/[エンドポイント名]/[HTTPメソッド]/response.json`
   - POST/PUTの場合は `request.json` も一緒に保存

4. **ドキュメント生成**
   - 同ディレクトリに `README.md` を作成
   - 内容: エンドポイント、メソッド、レスポンス構造、フィールド説明

5. **Notion用に整形して出力**
   - マークダウン形式でコンソールに表示

---

## 完了時の返信

途中経過は報告せず、完了後に以下の形式で1回だけ返信:

```
✅ API Doc Generated

- Endpoint: [メソッド] [パス]
- Saved: docs/api-responses/[パス]/[メソッド]/

```
