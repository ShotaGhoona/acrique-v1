# Acrique - アクリル製品ECサイト

アクリル製品のオーダーメイドECサイト

## 概要

店舗向け（For Shop）、オフィス向け（For Office）、個人向け（For You）の3カテゴリでアクリル製品を販売するECサイトです。

## 技術スタック

### Frontend
- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **shadcn/ui** + **Tailwind CSS**
- **TanStack React Query** (サーバー状態管理)

### Backend
- **FastAPI** + **Python 3.11**
- **PostgreSQL 15**
- **SQLAlchemy** (ORM)
- **JWT認証** (RS256)

### Infrastructure
- **Docker** + **Docker Compose**

---

## クイックスタート

### 1. 環境構築

```bash
# リポジトリをクローン
git clone <repository-url>
cd acrique-v1

# 環境変数ファイルをコピー
cp backend/.env.example backend/.env

# Docker起動
docker compose up -d
```

### 2. データベースセットアップ

```bash
# マイグレーション実行
docker compose exec backend alembic upgrade head

# シードデータ投入
docker compose exec backend python -m app.infrastructure.db.seeds.run_seed
```

### 3. アクセス

| サービス | URL |
|---------|-----|
| フロントエンド | http://localhost:3005 |
| バックエンドAPI | http://localhost:8005 |
| Swagger UI | http://localhost:8005/docs |

---

## テストユーザー

| メールアドレス | パスワード | 用途 |
|---------------|-----------|------|
| admin@example.com | password123 | 管理者 |
| user@example.com | password123 | 一般ユーザー |

---

## 開発コマンド

### Docker

```bash
# 起動
docker compose up -d

# 停止
docker compose down

# ログ確認
docker compose logs -f backend
```

### Backend

```bash
# テスト実行
docker compose exec backend python -m pytest

# マイグレーション作成
docker compose exec backend alembic revision --autogenerate -m "message"

# マイグレーション適用
docker compose exec backend alembic upgrade head

# シードデータ投入
docker compose exec backend python -m app.infrastructure.db.seeds.run_seed
```

### Frontend

```bash
cd frontend

npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run lint     # Lint実行
```

---

## ディレクトリ構成

```
acrique-v1/
├── frontend/              # Next.js フロントエンド
│   └── src/
│       ├── app/           # App Router
│       ├── features/      # 機能モジュール
│       ├── shared/        # 共通コンポーネント
│       └── widgets/       # ウィジェット
├── backend/               # FastAPI バックエンド
│   └── app/
│       ├── presentation/  # API層
│       ├── application/   # ユースケース層
│       ├── domain/        # ドメイン層
│       └── infrastructure/# インフラ層
├── docs/                  # ドキュメント
│   └── requirements/
│       └── api/           # API仕様書
└── docker-compose.yml
```

---

## API仕様

- [認証API](./docs/requirements/api/auth-api.md)
- [商品API](./docs/requirements/api/product-api.md)

---

## 商品カテゴリ

| カテゴリID | 名称 | 説明 |
|-----------|------|------|
| shop | For Shop | 店舗向け（QRキューブ、プライスタグ等） |
| office | For Office | オフィス向け（ウォールサイン、トロフィー等） |
| you | For You | 個人向け（トレカディスプレイ、フォトフレーム等） |
