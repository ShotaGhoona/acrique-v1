# 22: RDSマイグレーション手順

## なぜ必要？

```
ローカル開発: Docker PostgreSQL → テーブルあり → データあり
AWS本番:     RDS PostgreSQL     → テーブルなし → データなし
```

**AWS上のRDSにテーブルを作成しないと、アプリが動かない**

---

## 全体の流れ

```
Step 1: SSMポートフォワーディング開始
            ↓
Step 2: マイグレーション実行（テーブル作成）
            ↓
Step 3: シードデータ投入（商品データなど）
            ↓
Step 4: フロントエンドで動作確認
```

---

## 事前準備

### 必要なもの

| 項目 | 値 |
|------|-----|
| BastionインスタンスID | `i-00908cf0dc527920c` |
| RDSエンドポイント | `dev-acrique-v1-rds.chygo4242w97.ap-northeast-1.rds.amazonaws.com` |
| DBユーザー | `postgres` |
| DBパスワード | Secrets Managerから取得 |
| DB名 | `main` |
| ポート | `5432` |

### SSM Session Managerプラグイン

インストール（初回のみ）：

```bash
# Mac (Apple Silicon)
curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/mac_arm64/session-manager-plugin.pkg" -o "session-manager-plugin.pkg"
sudo installer -pkg session-manager-plugin.pkg -target /
rm session-manager-plugin.pkg

# シンボリックリンク作成
sudo ln -sf /usr/local/sessionmanagerplugin/bin/session-manager-plugin /usr/local/bin/session-manager-plugin
```

---

## Step 1: SSMポートフォワーディング開始

### なぜ必要？

```
RDSはプライベートサブネットにある
  → 直接接続できない
  → Bastion経由で接続する
```

### コマンド（ターミナル1で実行）

```bash
aws ssm start-session \
  --target i-00908cf0dc527920c \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters '{"host":["dev-acrique-v1-rds.chygo4242w97.ap-northeast-1.rds.amazonaws.com"],"portNumber":["5432"],"localPortNumber":["15432"]}'
```

### 成功時の表示

```
Starting session with SessionId: ...
Port 15432 opened for sessionId ...
Waiting for connections...
```

**このターミナルは開いたまま！**

---

## Step 2: マイグレーション実行

### 方法A: 通常のAlembicマイグレーション（推奨）

```bash
cd /Users/yamashitashota/Doc/ghoona/starup/dev/ec-site/acrique-v1

# AWS RDSに対してマイグレーション実行
DATABASE_URL="postgresql://postgres:<パスワード>@host.docker.internal:15432/main" \
docker compose run --rm -e DATABASE_URL migrator alembic upgrade head
```

### 成功時の表示

```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> xxxx, initial
...
```

---

### 方法B: マイグレーションエラー時の対処法

#### エラー例：「relation already exists」

```
psycopg2.errors.DuplicateTable: relation "products" already exists
```

**原因**: マイグレーションファイルが重複してテーブルを作成しようとしている

#### 解決手順

**Step 2-1: DBをリセット**

```bash
DATABASE_URL="postgresql://postgres:<パスワード>@host.docker.internal:15432/main" \
docker compose run --rm -e DATABASE_URL migrator python -c "from sqlalchemy import create_engine, text; import os; engine = create_engine(os.environ['DATABASE_URL']); conn = engine.connect(); conn.execute(text('DROP SCHEMA public CASCADE')); conn.execute(text('CREATE SCHEMA public')); conn.commit(); print('Database reset complete!')"
```

**Step 2-2: SQLAlchemyモデルから直接テーブル作成**

```bash
DATABASE_URL="postgresql://postgres:<パスワード>@host.docker.internal:15432/main" \
docker compose run --rm -e DATABASE_URL migrator python -c "from app.infrastructure.db.models import Base; from sqlalchemy import create_engine; import os; engine = create_engine(os.environ['DATABASE_URL']); Base.metadata.create_all(engine); print('Tables created!')"
```

**Step 2-3: Alembicに最新状態をマーク**

```bash
DATABASE_URL="postgresql://postgres:<パスワード>@host.docker.internal:15432/main" \
docker compose run --rm -e DATABASE_URL migrator alembic stamp head
```

#### なぜこの方法？

```
通常のマイグレーション:
  alembic upgrade head → 差分を適用

今回の方法:
  1. DBリセット → 空っぽに
  2. create_all → モデル定義から全テーブル作成
  3. alembic stamp head → 「最新状態」とマーク
```

マイグレーションファイルに問題がある場合、モデルから直接作成する方が確実。

---

## Step 3: シードデータ投入

```bash
cd /Users/yamashitashota/Doc/ghoona/starup/dev/ec-site/acrique-v1

# シードデータ投入
DATABASE_URL="postgresql://postgres:Sdek=i^sT4Y3oP18FGEtXmq1RGkq7O@host.docker.internal:15432/main" \
docker compose run --rm -e DATABASE_URL migrator python -m app.infrastructure.db.seeds.run_seed
```

---

## Step 4: 動作確認

フロントエンドにアクセスして、商品が表示されることを確認：

https://main.d17fbeoc59o61t.amplifyapp.com/shop

---

## トラブルシューティング

### SSMが見つからない

```bash
sudo ln -sf /usr/local/sessionmanagerplugin/bin/session-manager-plugin /usr/local/bin/session-manager-plugin
```

### 接続が拒否される

SSMポートフォワーディングが動いているか確認（ターミナル1）

### Poetryが壊れている

docker compose経由で実行する（Poetryを使わない）

---

## 認証情報の取得方法

```bash
# Secrets Managerから取得
aws secretsmanager get-secret-value \
  --secret-id "DataStorageRdsConstructInst-Xd9CjUnACU0v" \
  --query 'SecretString' --output text | jq '.'
```

---

## AWSコンソールで確認できる場所

| 確認項目 | コンソールの場所 |
|---------|-----------------|
| Bastionインスタンス | EC2 → インスタンス |
| RDSエンドポイント | RDS → データベース |
| DB認証情報 | Secrets Manager → シークレット |
| SSMセッション | Systems Manager → セッションマネージャー |

---

## 次のステップ

- [23: CI/CD構築](./23-CICD構築.md)（作成予定）
