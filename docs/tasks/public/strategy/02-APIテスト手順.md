# APIテスト手順書

## 概要

バックエンドAPIが正常に動作しているかテストする際の手順をまとめる。

---

## 前提条件

- Docker環境が構築済み
- `docker compose up -d` でコンテナが起動している

---

## テスト手順

### 1. Dockerコンテナの状態確認

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

**確認ポイント:**
- 必要なコンテナ（backend, frontend, db等）がすべて `Up` 状態か
- ポートマッピングが正しいか

---

### 2. バックエンドのログ確認

```bash
docker logs <backend-container-name> --tail 50
```

**よくあるエラーと対処:**

| エラー | 原因 | 対処 |
|--------|------|------|
| `ImportError: xxx is not installed` | 依存パッケージ不足 | requirements.txtに追加してリビルド |
| `No matching distribution found for xxx==x.x.x` | パッケージバージョンが存在しない | 正しいバージョンに修正 |
| `relation "xxx" does not exist` | DBテーブルが存在しない | マイグレーション実行 |

---

### 3. 依存パッケージの問題解決

requirements.txtを修正した場合:

```bash
# Dockerイメージを再ビルド
docker compose build backend

# コンテナを再起動
docker compose up -d backend
```

---

### 4. DBマイグレーション

テーブルが存在しない場合:

```bash
# マイグレーションファイルの確認
ls backend/alembic/versions/

# マイグレーション生成（ファイルがない場合）
docker exec <backend-container> alembic revision --autogenerate -m "create tables"

# マイグレーション実行
docker exec <backend-container> alembic upgrade head
```

---

### 5. APIエンドポイントのテスト

#### 基本形式

```bash
curl -s -w "\nHTTP_CODE:%{http_code}" -X <METHOD> http://localhost:<PORT>/<ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '<JSON_BODY>'
```

#### Cookieを使う場合（認証系）

```bash
# ログイン時にCookieを保存
curl -s -c cookies.txt -X POST http://localhost:8005/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# 保存したCookieを使ってリクエスト
curl -s -b cookies.txt -X GET http://localhost:8005/api/auth/status
```

---

### 6. DBの直接確認

テスト用データの確認やトークン取得:

```bash
# DBコンテナでSQL実行
docker exec <db-container> psql -U <user> -d <database> -c "<SQL>"

# 例: ユーザー一覧
docker exec postgres_acrique psql -U acrique_user -d acrique_db -c "SELECT * FROM users;"

# 例: トークン取得
docker exec postgres_acrique psql -U acrique_user -d acrique_db -c "SELECT token FROM verification_tokens WHERE user_id = 1;"
```

---

## 認証APIテストの流れ

認証系APIは依存関係があるため、以下の順序でテストする:

```
1. POST /api/auth/register     → ユーザー作成
                                  ↓
2. DBからverification_token取得
                                  ↓
3. POST /api/auth/verify-email → メール認証
                                  ↓
4. POST /api/auth/login        → ログイン（JWT取得）
                                  ↓
5. GET /api/auth/status        → 認証状態確認（Cookie使用）
                                  ↓
6. POST /api/auth/logout       → ログアウト
                                  ↓
7. POST /api/auth/password-reset → パスワードリセット依頼
                                  ↓
8. DBからreset_token取得
                                  ↓
9. POST /api/auth/password-reset/confirm → パスワード再設定
```

---

## テスト結果の記録テンプレート

```markdown
## テスト結果

| Endpoint | Method | Status | 結果 |
|----------|--------|--------|------|
| /api/xxx | POST | 201 | 成功 |
| /api/yyy | GET | 200 | 成功 |
| /api/zzz | POST | 400 | 想定通りのエラー |
```

---

## トラブルシューティング

### コンテナに接続できない

```bash
# コンテナの状態確認
docker ps -a

# 停止しているコンテナのログ確認
docker logs <container-name>

# コンテナ再起動
docker compose restart <service-name>
```

### APIがInternal Server Error (500)を返す

1. バックエンドのログを確認
2. エラーの原因を特定（DB接続、依存関係、コードエラー等）
3. 必要に応じて修正・リビルド

### DBに接続できない

```bash
# DB接続情報の確認（docker-compose.yml または .env）
# ユーザー名、パスワード、DB名を確認

# ヘルスチェック
docker exec <db-container> pg_isready -U <user> -d <database>
```

---

## 補足

- テスト用のユーザー・データはテスト終了後に削除するか、開発用DBを使用する
- 本番環境では絶対にテストを実行しない
- APIドキュメント（`/docs`）が利用可能な場合は併用すると効率的
