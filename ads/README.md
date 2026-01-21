# ACRIQUE Ads CLI

Meta広告（Instagram/Facebook）とGoogle広告を **YAML設定ファイル** で管理するCLIツール。

Terraformのように `plan` → `apply` で広告キャンペーンをコード管理（IaC）する。

---

## 概要

```
┌─────────────────────────────────────────────────────────────┐
│  campaigns/meta/brand_awareness.yaml                        │
│  campaigns/google/search_brand.yaml                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  ads CLI                                                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │  plan   │→ │  apply  │→ │  list   │                     │
│  └─────────┘  └─────────┘  └─────────┘                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│   Meta Ads API  │     │ Google Ads API  │
│  (Instagram/FB) │     │    (Search)     │
└─────────────────┘     └─────────────────┘
```

---

## クイックスタート

> **Note**: コマンドはすべてプロジェクトルート（`acrique-v1/`）から実行します。

### 1. 環境設定

```bash
# 設定ファイルをコピー
cp ads/environments/sandbox.example.yaml ads/environments/sandbox.yaml

# 認証情報を記入（エディタで開いて編集）
vim ads/environments/sandbox.yaml
```

### 2. 認証テスト

```bash
# 接続確認
docker compose run ads auth test --env sandbox
```

### 3. キャンペーン操作

```bash
# 差分確認（dry-run）
docker compose run ads plan --env sandbox

# 反映
docker compose run ads apply --env sandbox

# 一覧表示
docker compose run ads list --env sandbox
```

---

## ディレクトリ構成

```
ads/
├── src/
│   ├── cli/                  # CLIコマンド定義
│   │   ├── main.py           # plan, apply, list, auth
│   │   ├── meta.py           # Meta広告サブコマンド
│   │   └── google.py         # Google広告サブコマンド
│   ├── platforms/            # プラットフォーム実装
│   │   ├── base.py           # 共通インターフェース
│   │   ├── meta.py           # Meta Ads SDK ラッパー
│   │   └── google.py         # Google Ads SDK ラッパー
│   └── models/               # pydanticスキーマ
│       ├── config.py         # 環境設定
│       └── campaign.py       # キャンペーン設定
│
├── environments/             # 環境別の認証設定
│   ├── sandbox.yaml          # テスト環境（※gitignore）
│   └── production.yaml       # 本番環境（※gitignore）
│
├── campaigns/                # キャンペーン定義（YAML）
│   ├── meta/
│   │   └── brand_awareness.yaml
│   └── google/
│       └── search_brand.yaml
│
├── assets/
│   └── creatives/            # 画像・動画アセット
│
├── Dockerfile
└── pyproject.toml
```

> **Note**: Docker Composeの設定はプロジェクトルートの `docker-compose.yml` に統合されています。

---

## コマンド一覧

### メインコマンド

| コマンド | 説明 |
|---------|------|
| `ads plan` | 変更の差分を確認（dry-run） |
| `ads apply` | YAMLの設定を広告プラットフォームに反映 |
| `ads list` | 現在のキャンペーン一覧を表示 |
| `ads auth test` | 認証情報のテスト |
| `ads auth google` | Google OAuth認証フロー |

### オプション

| オプション | 説明 | デフォルト |
|-----------|------|-----------|
| `--env`, `-e` | 環境（sandbox/production） | sandbox |
| `--yes`, `-y` | 確認をスキップ | false |

### 使用例

```bash
# sandbox環境で差分確認
docker compose run ads plan --env sandbox

# 特定のキャンペーンのみ反映
docker compose run ads apply --env sandbox campaigns/meta/brand_awareness.yaml

# 本番環境に反映（確認あり）
docker compose run ads apply --env production

# 本番環境に反映（確認スキップ）
docker compose run ads apply --env production --yes
```

### プラットフォーム別コマンド

```bash
# Meta広告
docker compose run ads meta campaigns --env sandbox
docker compose run ads meta create campaigns/meta/brand_awareness.yaml --env sandbox
docker compose run ads meta delete 123456789 --env sandbox

# Google広告
docker compose run ads google campaigns --env sandbox
docker compose run ads google keywords --env sandbox
docker compose run ads google search "SELECT campaign.id FROM campaign" --env sandbox
```

---

## キャンペーン設定（YAML）

### Meta広告の例

```yaml
# campaigns/meta/brand_awareness.yaml
name: CV_ACRIQUE_ブランド認知_2025Q1
status: PAUSED
objective: OUTCOME_SALES
daily_budget: 5000

adsets:
  - name: 30-54歳_店舗オーナー
    targeting:
      geo_locations:
        countries: ["JP"]
      age_min: 30
      age_max: 54
      interests:
        - id: "6003139266461"
          name: "小売業"
    ads:
      - name: 動画_店舗什器_1cmの厚み
        video_path: assets/creatives/store_display.mp4
        primary_text: "プロが選ぶ、1cmの存在感。"
        headline: "高級アクリル専門店 ACRIQUE"
        link_url: https://acrique.jp/
```

### Google広告の例

```yaml
# campaigns/google/search_brand.yaml
name: 検索_ACRIQUE_2025Q1
status: PAUSED
advertising_channel_type: SEARCH
daily_budget: 5000
bidding_strategy: MAXIMIZE_CONVERSIONS

adgroups:
  - name: AG_アクリル板_オーダー
    keywords:
      - text: "アクリル板 オーダー"
        match_type: EXACT
      - text: "アクリル板 高級"
        match_type: PHRASE
    ads:
      - headlines:
          - "高級アクリル専門店 ACRIQUE"
          - "1cmの厚みが生む存在感"
          - "オーダーメイドで製作"
        descriptions:
          - "高級アクリル専門店ACRIQUEでは、1cm以上の厚みを持つ高品質なアクリル板をオーダーメイドで製作。"
        final_urls:
          - "https://acrique.jp/products/acrylic-plate"
```

---

## 環境設定

### sandbox.yaml の例

```yaml
meta:
  app_id: "123456789012345"
  app_secret: "abcdef1234567890..."
  access_token: "EAAG..."
  ad_account_id: "act_123456789"

google:
  developer_token: "ABCdEfGhI..."
  client_id: "123456789.apps.googleusercontent.com"
  client_secret: "GOCSPX-..."
  refresh_token: "1//0abc..."
  customer_id: "1234567890"
```

### 環境変数での設定（本番推奨）

```bash
export META_APP_ID="123456789012345"
export META_APP_SECRET="abcdef..."
export META_ACCESS_TOKEN="EAAG..."
export META_AD_ACCOUNT_ID="act_123456789"

export GOOGLE_DEVELOPER_TOKEN="ABCd..."
export GOOGLE_CLIENT_ID="123456789.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="GOCSPX-..."
export GOOGLE_REFRESH_TOKEN="1//0abc..."
export GOOGLE_CUSTOMER_ID="1234567890"
```

---

## セットアップ

### 前提条件

- Docker / Docker Compose
- Meta広告のAPI認証情報
- Google広告のAPI認証情報

### API認証情報の取得

詳細は [02-API認証セットアップ.md](../docs/tasks/public/strategy/02-ads-cli/02-API認証セットアップ.md) を参照。

#### Meta広告

1. [ビジネスマネージャ](https://business.facebook.com/) でアカウント作成
2. [Meta for Developers](https://developers.facebook.com/) でアプリ作成
3. システムユーザーを作成してアクセストークン取得

#### Google広告

1. [Google広告](https://ads.google.com/) でアカウント作成
2. [Google Cloud Console](https://console.cloud.google.com/) でOAuth設定
3. Developer Token を取得

---

## 開発

### ローカル開発

```bash
# 仮想環境作成
python -m venv .venv
source .venv/bin/activate

# 依存関係インストール
pip install -e ".[dev]"

# CLIを直接実行
python -m src.cli.main --help
```

### テスト

```bash
# テスト実行
pytest

# カバレッジ付き
pytest --cov=src
```

### コード品質

```bash
# リンター
ruff check src/

# フォーマッター
ruff format src/

# 型チェック
mypy src/
```

---

## 技術スタック

| 用途 | ライブラリ |
|------|-----------|
| CLI | [typer](https://typer.tiangolo.com/) |
| 設定管理 | [pydantic](https://docs.pydantic.dev/) + YAML |
| Meta広告 | [facebook-business](https://github.com/facebook/facebook-python-business-sdk) |
| Google広告 | [google-ads](https://github.com/googleads/google-ads-python) |
| ターミナル出力 | [rich](https://rich.readthedocs.io/) |

---

## ロードマップ

### Phase 1（現在）
- [x] ディレクトリ構造
- [ ] 認証・接続テスト
- [ ] キャンペーンCRUD
- [ ] plan / apply コマンド

### Phase 2
- [ ] パフォーマンスレポート
- [ ] クリエイティブ自動生成
- [ ] A/Bテスト管理

---

## 関連ドキュメント

- [広告の基礎](../docs/tasks/public/learning/ads/01-広告の基礎.md)
- [Meta広告の手順](../docs/tasks/public/learning/ads/02-Meta広告の手順.md)
- [Google広告の手順](../docs/tasks/public/learning/ads/03-Google広告の手順.md)
- [API認証セットアップ](../docs/tasks/public/strategy/02-ads-cli/02-API認証セットアップ.md)

---

## ライセンス

Private - ACRIQUE / 株式会社グーナ
