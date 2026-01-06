# 13: HTTPS化とCORS問題の解決

## 現在の状況（2026-01-06）

### 問題の発端

```
フロントエンド: https://main.d17fbeoc59o61t.amplifyapp.com (HTTPS)
バックエンド:   http://dev-acrique-v1-alb-...elb.amazonaws.com (HTTP)

→ Mixed Content エラーでブラウザがブロック
```

**ブラウザはHTTPSページからHTTPへのリクエストをブロックする**

---

## 解決のために行ったこと

### Step 1: CloudFront作成（コンソール）

ALBの前段にCloudFrontを配置してHTTPS化

| 項目 | 値 |
|------|-----|
| Distribution domain | `d3nwschzt6djdp.cloudfront.net` |
| Origin | `dev-acrique-v1-alb-1256355443.ap-northeast-1.elb.amazonaws.com` |
| Origin Protocol | HTTP only（**重要: https-onlyだと504エラー**）|
| Viewer Protocol Policy | Redirect HTTP to HTTPS |
| Cache Policy | CachingDisabled |
| Origin Request Policy | AllViewerExceptHostHeader |
| WAF | Rate limiting有効 |

### Step 2: Amplify環境変数更新

| 変数名 | 値 |
|--------|-----|
| `NEXT_PUBLIC_API_URL` | `https://d3nwschzt6djdp.cloudfront.net` |
| `SERVER_API_URL` | `https://d3nwschzt6djdp.cloudfront.net` |

---

## 発生した問題と対処

### 問題1: 504 Gateway Timeout

**症状:**
```bash
curl https://d3nwschzt6djdp.cloudfront.net/health
# → 504 Gateway Timeout
```

**原因:**
CloudFrontのOrigin Protocol Policyが`https-only`になっていた。
ALBはHTTPのみ（HTTPSリスナーなし）なので接続失敗。

**解決:**
CloudFront → オリジン → 編集 → プロトコルを`HTTP only`に変更

---

### 問題2: CORSエラー

**症状:**
```
Access to XMLHttpRequest at 'https://d3nwschzt6djdp.cloudfront.net/api/cart'
from origin 'https://main.d17fbeoc59o61t.amplifyapp.com' has been blocked by CORS policy
```

**確認済み:**
```bash
curl -I -X OPTIONS \
  -H "Origin: https://main.d17fbeoc59o61t.amplifyapp.com" \
  https://d3nwschzt6djdp.cloudfront.net/api/auth/status

# → access-control-allow-origin: https://main.d17fbeoc59o61t.amplifyapp.com
# CORSは正しく設定されている
```

**バックエンドのCORS設定（backend/app/main.py）:**
```python
allowed_origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3005',
    'http://127.0.0.1:3005',
    # 本番環境
    'https://main.d17fbeoc59o61t.amplifyapp.com',
]
```

---

### 問題3: ログインページのチカチカ（リダイレクトループ）

**症状:**
- `/`にアクセスすると`/login`にリダイレクト
- `/login`と別のページを行き来してチカチカする

**原因（推測）:**
`frontend/src/middleware.ts`のサーバーサイド認証チェックで問題発生

```typescript
const API_BASE_URL =
  process.env.SERVER_API_URL ||      // ← これが未設定だった
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000';
```

ミドルウェアはAmplifyサーバー側で実行される。
`SERVER_API_URL`が未設定だと、ミドルウェアからのAPIリクエストが失敗する可能性。

**対処:**
Amplifyの環境変数に`SERVER_API_URL`を追加（実施中）

---

## 現在のステータス

| 項目 | 状態 |
|------|------|
| CloudFront作成 | ✅ 完了 |
| Origin Protocol修正 | ✅ 完了（HTTP only） |
| NEXT_PUBLIC_API_URL | ✅ 設定済み |
| SERVER_API_URL | ✅ 設定済み |
| Amplify再デプロイ | ⏳ 待機中（前のジョブ完了待ち） |
| 動作確認 | ❌ 未完了 |

---

## 明日やること

1. **Amplifyの再デプロイ完了を確認**

2. **フロントエンド動作確認**
   - https://main.d17fbeoc59o61t.amplifyapp.com/shop
   - チカチカが解消されたか確認

3. **もしまだ問題がある場合:**
   - 一時的に認証を無効化してテスト
   ```
   NEXT_PUBLIC_ENABLE_AUTH=false
   ```

4. **シードデータの再投入**（商品が0件のため）
   ```bash
   # SSMポートフォワーディング開始
   aws ssm start-session \
     --target i-00908cf0dc527920c \
     --document-name AWS-StartPortForwardingSessionToRemoteHost \
     --parameters '{"host":["dev-acrique-v1-rds.chygo4242w97.ap-northeast-1.rds.amazonaws.com"],"portNumber":["5432"],"localPortNumber":["15432"]}'

   # シード実行
   cd /Users/yamashitashota/Doc/ghoona/starup/dev/ec-site/acrique-v1
   DATABASE_URL="postgresql://postgres:Sdek=i^sT4Y3oP18FGEtXmq1RGkq7O@host.docker.internal:15432/main" \
   docker compose run --rm -e DATABASE_URL migrator python -m app.infrastructure.db.seeds.run_seed
   ```

---

## URL一覧

| リソース | URL |
|---------|-----|
| フロントエンド | https://main.d17fbeoc59o61t.amplifyapp.com |
| バックエンドAPI（HTTPS） | https://d3nwschzt6djdp.cloudfront.net |
| バックエンドAPI（HTTP/内部） | http://dev-acrique-v1-alb-1256355443.ap-northeast-1.elb.amazonaws.com |
| CloudFrontコンソール | https://console.aws.amazon.com/cloudfront/ |
| Amplifyコンソール | https://console.aws.amazon.com/amplify/ |

---

## テストコマンド

```bash
# CloudFront → ALB接続テスト
curl -s -o /dev/null -w "%{http_code}" https://d3nwschzt6djdp.cloudfront.net/health
# 期待: 200

# CORSテスト
curl -I -X OPTIONS \
  -H "Origin: https://main.d17fbeoc59o61t.amplifyapp.com" \
  -H "Access-Control-Request-Method: GET" \
  https://d3nwschzt6djdp.cloudfront.net/api/auth/status

# 商品API
curl -s https://d3nwschzt6djdp.cloudfront.net/api/products
```

---

## 学んだこと

1. **ALBのデフォルトドメインはHTTPのみ**
   - HTTPS化にはCloudFrontまたはACM証明書+独自ドメインが必要

2. **CloudFrontのOrigin Protocol設定**
   - ALBがHTTPのみの場合、`HTTP only`を選択
   - `https-only`だと504エラー

3. **Next.jsミドルウェアの環境変数**
   - `NEXT_PUBLIC_*`はクライアント側
   - サーバー側（ミドルウェア）には別途`SERVER_*`が必要な場合がある

4. **Amplifyのデプロイ**
   - 環境変数変更後は再デプロイが必要
   - 実行中のジョブがあると新規デプロイは待機

---

## 関連ドキュメント

- [22-RDSマイグレーション手順](../learning/infra/22-RDSマイグレーション手順.md)
- [infra-checklist](../infra-checklist.md)
