# Docker入門 - コンテナの仕組み

ACRIQUEの開発環境はDockerで動いている。
「なんとなくdocker compose upで動く」から卒業して、仕組みを理解しよう。

---

## 目次

1. [Dockerって何？なぜ使う？](#1-dockerって何なぜ使う)
2. [コンテナを理解する](#2-コンテナを理解する)
3. [ACRIQUEのDocker構成を読む](#3-acriqueのdocker構成を読む)
4. [よく使うDockerコマンド](#4-よく使うdockerコマンド)
5. [本番環境との関係](#5-本番環境との関係)

---

## 1. Dockerって何？なぜ使う？

### 日常の例で理解する

```
引っ越しを想像してみて。

【Dockerなしの世界】
荷物をバラバラに運ぶ
→ 家具の配置が前と違う
→ 「あの本どこいった？」
→ 新しい家で同じ環境を再現するのが大変

【Dockerありの世界】
部屋ごと段ボール（コンテナ）に詰めて運ぶ
→ 開けたら前と同じ配置
→ どこに運んでも同じ環境
→ 「僕のPCでは動いたのに」がなくなる
```

### プログラミングでの問題

```
【よくある悲劇】

開発者A: 「僕のMacでは動くよ？」
開発者B: 「私のWindowsでは動かない...」
本番環境: 「エラー出てます」

原因：
- Pythonのバージョンが違う
- ライブラリのバージョンが違う
- OSの設定が違う
```

### Dockerが解決すること

```mermaid
graph LR
    subgraph "Dockerなし"
        A[開発者AのPC<br/>Python 3.9] -.->|動く| Code
        B[開発者BのPC<br/>Python 3.11] -.->|動かない| Code
        C[本番サーバー<br/>Python 3.10] -.->|エラー| Code
    end
```

```mermaid
graph LR
    subgraph "Dockerあり"
        Container[Dockerコンテナ<br/>Python 3.11<br/>全ライブラリ入り]

        A2[開発者AのPC] -->|同じコンテナ| Container
        B2[開発者BのPC] -->|同じコンテナ| Container
        C2[本番サーバー] -->|同じコンテナ| Container
    end
```

**Dockerコンテナ = 「環境ごと持ち運べる箱」**

---

## 2. コンテナを理解する

### イメージとコンテナの関係

```
たい焼きで例えると：

Dockerイメージ = たい焼きの「型」
  → 設計図。これ自体は食べられない。

Dockerコンテナ = 焼いた「たい焼き」
  → 型から作った実物。実際に動くもの。
  → 1つの型から何個でも作れる
```

```mermaid
graph TD
    subgraph "Dockerfile（レシピ）"
        Recipe[FROM python:3.11<br/>COPY requirements.txt<br/>RUN pip install<br/>...]
    end

    subgraph "Dockerイメージ（型）"
        Image[acrique-backend:latest<br/>Python + ライブラリ入り]
    end

    subgraph "Dockerコンテナ（実物）"
        C1[コンテナ #1<br/>実際に動いてる]
        C2[コンテナ #2<br/>実際に動いてる]
        C3[コンテナ #3<br/>実際に動いてる]
    end

    Recipe -->|docker build| Image
    Image -->|docker run| C1
    Image -->|docker run| C2
    Image -->|docker run| C3
```

### ACRIQUEのDockerfile解説

**backend/Dockerfile**

```dockerfile
# 1. ベースイメージ（既製品の型を使う）
FROM python:3.11-slim
# → Python 3.11が入った軽量Linuxを土台にする

# 2. 作業ディレクトリを設定
WORKDIR /app
# → コンテナ内の /app フォルダで作業する

# 3. 依存関係をインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# → 必要なライブラリを全部入れる

# 4. アプリケーションコードをコピー
COPY ./app ./app
# → あなたが書いたコードを入れる

# 5. ポートを公開
EXPOSE 8000
# → 「このコンテナは8000番ポートを使うよ」と宣言

# 6. 起動コマンド
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
# → コンテナ起動時に実行されるコマンド
```

**レイヤー構造を理解する**

```mermaid
graph TB
    subgraph "Dockerイメージのレイヤー"
        L1[Layer 1: python:3.11-slim<br/>約150MB]
        L2[Layer 2: pip install<br/>約50MB]
        L3[Layer 3: COPY app<br/>約5MB]

        L1 --> L2 --> L3
    end

    Note[各レイヤーはキャッシュされる<br/>変更があったレイヤーだけ再ビルド]
```

**だから requirements.txt を先にCOPYする！**

```dockerfile
# 良い書き方（キャッシュ効率良い）
COPY requirements.txt .     # 依存関係だけ先にコピー
RUN pip install -r ...      # ライブラリインストール
COPY ./app ./app            # コードは後でコピー

# → コードだけ変えた場合、pip install はスキップされる
```

---

## 3. ACRIQUEのDocker構成を読む

### docker-compose.yml の全体像

```yaml
services:
  backend:    # バックエンドAPI
  frontend:   # フロントエンド
  db:         # PostgreSQLデータベース
  pgadmin:    # DB管理ツール（おまけ）
  migrator:   # DBマイグレーション実行
```

```mermaid
graph TB
    subgraph "docker-compose.yml"
        FE[frontend<br/>:3005]
        BE[backend<br/>:8005]
        DB[(db<br/>PostgreSQL<br/>:5437)]
        PGA[pgadmin<br/>:8085]
        MIG[migrator<br/>一回だけ実行]
    end

    FE -->|API呼び出し| BE
    BE -->|データ保存| DB
    PGA -->|管理| DB
    MIG -->|テーブル作成| DB

    User[ブラウザ] -->|localhost:3005| FE
    User -->|localhost:8005| BE
```

### 各サービスの詳細解説

#### backend サービス

```yaml
backend:
  build: ./backend                    # ./backend/Dockerfile を使ってビルド
  command: uvicorn app.main:app ...   # 起動コマンド（Dockerfileのを上書き）
  ports:
    - "8005:8000"                      # ホストの8005番 → コンテナの8000番
  env_file: ./backend/.env            # 環境変数を読み込む
  volumes:
    - ./backend:/app                  # ホストのコードをコンテナにマウント
  depends_on:
    db:
      condition: service_healthy      # DBが起動してから起動
```

**ポートマッピングを理解する**

```
ports:
  - "8005:8000"
      ↑      ↑
   ホスト  コンテナ

ブラウザで localhost:8005 にアクセスすると
→ コンテナ内の 8000番ポートに転送される
```

```mermaid
graph LR
    Browser[ブラウザ<br/>localhost:8005] -->|転送| Container[コンテナ内<br/>:8000で待機]
```

**ボリュームマウントを理解する**

```
volumes:
  - ./backend:/app

./backend（ホスト） ←→ /app（コンテナ）が同期

メリット：
- コードを変更すると即座にコンテナに反映
- ホットリロードが効く
```

```mermaid
graph LR
    subgraph "ホスト（あなたのPC）"
        Host[./backend/app/main.py]
    end

    subgraph "コンテナ"
        Container[/app/app/main.py]
    end

    Host <-->|リアルタイム同期| Container
```

#### db サービス

```yaml
db:
  image: postgres:15                  # 公式イメージをそのまま使う
  container_name: postgres_acrique
  env_file: ./backend/.env            # POSTGRES_USER等を設定
  ports:
    - "5437:5432"                      # ホストの5437 → コンテナの5432
  volumes:
    - ./db_data:/var/lib/postgresql/data   # データを永続化
  healthcheck:                        # ヘルスチェック設定
    test: ["CMD-SHELL", "pg_isready -U acrique_user -d acrique_db"]
```

**volumes でデータを永続化**

```
volumes:
  - ./db_data:/var/lib/postgresql/data

なぜ必要？
→ コンテナを消してもデータが残る
→ db_data フォルダにデータが保存される
```

```mermaid
graph TB
    subgraph "コンテナを削除しても..."
        C1[PostgreSQLコンテナ] --> V[db_dataフォルダ<br/>ホストに保存]
    end

    subgraph "新しいコンテナを起動"
        C2[新PostgreSQLコンテナ] --> V
    end

    V -->|データは残る| Persist[全データ保持]
```

#### depends_on と healthcheck

```yaml
backend:
  depends_on:
    db:
      condition: service_healthy

db:
  healthcheck:
    test: ["CMD-SHELL", "pg_isready ..."]
```

```mermaid
sequenceDiagram
    participant DC as docker-compose
    participant DB as db (PostgreSQL)
    participant BE as backend (FastAPI)

    DC->>DB: 起動開始
    loop ヘルスチェック
        DC->>DB: pg_isready?
        DB-->>DC: まだ準備中...
    end
    DB-->>DC: 準備完了！
    DC->>BE: DBが準備できたので起動
    BE->>DB: 接続成功
```

**condition: service_healthy がないと？**

```
DBがまだ起動中なのにbackendが接続しようとして
→ "Connection refused" エラー
→ backendが起動失敗
```

---

## 4. よく使うDockerコマンド

### 基本コマンド

```bash
# 全サービスを起動（バックグラウンド）
docker compose up -d

# 全サービスを起動（ログを見ながら）
docker compose up

# 全サービスを停止
docker compose down

# 停止 + ボリューム削除（DBデータも消える！）
docker compose down -v
```

### 状態確認

```bash
# 動いているコンテナを確認
docker compose ps

# 出力例：
# NAME                 STATUS
# acrique-backend-1    Up 2 minutes
# acrique-frontend-1   Up 2 minutes
# postgres_acrique     Up 2 minutes (healthy)
```

### ログを見る

```bash
# 全サービスのログ
docker compose logs

# 特定サービスのログ
docker compose logs backend

# リアルタイムで追いかける
docker compose logs -f backend
```

### コンテナの中に入る

```bash
# backendコンテナに入る
docker compose exec backend bash

# 中でコマンド実行
root@container:/app# python --version
root@container:/app# pip list
root@container:/app# exit  # 出る
```

### 再ビルド

```bash
# Dockerfileを変更した後
docker compose build

# キャッシュを使わずに完全再ビルド
docker compose build --no-cache

# ビルドして起動
docker compose up --build
```

### トラブルシューティング

```bash
# コンテナが起動しない時
docker compose logs backend

# ポートが使われている時
lsof -i :8005
# → 別のプロセスが使っていたら止める

# 完全にリセット（最終手段）
docker compose down -v
docker system prune -a
docker compose up --build
```

---

## 5. 本番環境との関係

### 開発と本番の違い

```mermaid
graph TB
    subgraph "開発環境（ローカル）"
        DC[docker-compose.yml]
        DC --> FE_DEV[frontend コンテナ]
        DC --> BE_DEV[backend コンテナ]
        DC --> DB_DEV[db コンテナ]
    end

    subgraph "本番環境（AWS）"
        ECR[ECR<br/>イメージ保存]
        ECR --> ECS[ECS Fargate<br/>backend実行]
        Amplify[Amplify<br/>frontend配信]
        RDS[(RDS<br/>PostgreSQL)]
    end

    BE_DEV -.->|同じDockerfile| ECR
```

### 同じDockerfileを使う

```
開発：docker compose up
  → Dockerfileからイメージをビルド
  → ローカルで実行

本番：
  1. docker build で イメージ作成
  2. ECR（AWSのイメージ置き場）にpush
  3. ECS Fargateがpullして実行
```

```mermaid
sequenceDiagram
    participant Dev as 開発者
    participant GH as GitHub
    participant GA as GitHub Actions
    participant ECR as ECR
    participant ECS as ECS Fargate

    Dev->>GH: git push
    GH->>GA: CI/CD開始
    GA->>GA: docker build
    GA->>ECR: docker push
    GA->>ECS: 新イメージで再起動
    ECS->>ECR: docker pull
    ECS->>ECS: 新バージョンで起動
```

### 環境変数の違い

**開発環境（.env）**
```env
DATABASE_URL=postgresql://acrique_user:password@db:5432/acrique_db
#                                              ↑
#                                         コンテナ名で指定
```

**本番環境（Secrets Manager）**
```env
DATABASE_URL=postgresql://acrique_user:xxx@xxx.rds.amazonaws.com:5432/acrique_db
#                                          ↑
#                                     RDSのエンドポイント
```

---

## まとめ

### 今日学んだこと

```
1. Docker = 環境ごと持ち運べる箱
   → 「僕のPCでは動く」問題を解決

2. イメージとコンテナ
   → イメージ = 型（設計図）
   → コンテナ = 実物（動いてるやつ）

3. docker-compose.yml
   → 複数コンテナをまとめて管理
   → ACRIQUEは5つのサービスで構成

4. 本番環境との関係
   → 同じDockerfileを使う
   → 「ローカルで動く = 本番でも動く」
```

### よく使うコマンドチートシート

```bash
docker compose up -d      # 起動
docker compose down       # 停止
docker compose ps         # 状態確認
docker compose logs -f    # ログ監視
docker compose exec backend bash  # 中に入る
docker compose build      # 再ビルド
```

---

**作成日**: 2025-01-06
**前提知識**: 01-インフラ入門
**次のステップ**: 03-AWS基礎
