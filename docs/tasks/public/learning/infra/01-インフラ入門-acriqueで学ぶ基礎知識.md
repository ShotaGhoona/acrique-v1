# インフラ入門 - ACRIQUEで学ぶ基礎知識

フロントエンドエンジニアのための、日常例から始めるインフラストラクチャ入門。
ACRIQUEプロジェクトを具体例として、デプロイに必要な知識を身につけよう。

---

## 目次

1. [インフラってそもそも何？](#1-インフラってそもそも何)
2. [Webアプリの「登場人物」を理解する](#2-webアプリの登場人物を理解する)
3. [開発環境 vs 本番環境](#3-開発環境-vs-本番環境)
4. [ACRIQUEの全体像](#4-acriqueの全体像)
5. [AWSの主要サービス解説](#5-awsの主要サービス解説)
6. [次のステップ](#6-次のステップ)

---

## 1. インフラってそもそも何？

### 日常の例で考える

**レストラン経営**に例えてみよう。

```
あなたがシェフ（開発者）だとして、
お客さんに料理を届けるには何が必要？

1. 厨房（開発環境）    → 料理を試作する場所
2. 店舗（サーバー）    → 実際にお客さんが来る場所
3. 看板・地図（DNS）   → お店を見つけてもらう仕組み
4. 冷蔵庫（データベース）→ 食材（データ）を保存する場所
5. 配達システム（CDN） → 遠くのお客さんにも届ける仕組み
```

**インフラ = 料理（アプリ）を作る以外の、全ての「お店の設備」**

### プログラミングの世界では

```mermaid
graph TD
    subgraph "あなたの仕事"
        A[コードを書く]
    end

    subgraph "インフラの仕事"
        B[コードを動かす場所を用意]
        C[データを保存する場所を用意]
        D[ユーザーがアクセスできるようにする]
        E[安全に運用する]
    end

    A --> B
    B --> C
    C --> D
    D --> E
```

---

## 2. Webアプリの「登場人物」を理解する

### ACRIQUEで実際に使っている登場人物

```mermaid
graph LR
    subgraph "ユーザー側"
        User[ユーザー<br/>ブラウザ]
    end

    subgraph "フロントエンド"
        FE[Next.js<br/>画面表示担当]
    end

    subgraph "バックエンド"
        BE[FastAPI<br/>処理担当]
    end

    subgraph "データ保存"
        DB[(PostgreSQL<br/>データベース)]
        S3[S3<br/>画像・ファイル]
    end

    User -->|1. ページ要求| FE
    FE -->|2. データ要求| BE
    BE -->|3. データ取得| DB
    BE -->|4. ファイル取得| S3
    BE -->|5. データ返却| FE
    FE -->|6. 画面表示| User
```

### それぞれの役割（レストランに例えると）

| 登場人物 | ACRIQUEでの技術 | レストランでは |
|---------|----------------|---------------|
| **フロントエンド** | Next.js | ホール係（お客さんとやりとり） |
| **バックエンド** | FastAPI (Python) | 厨房（料理を作る） |
| **データベース** | PostgreSQL | 冷蔵庫・倉庫（食材を保管） |
| **オブジェクトストレージ** | S3 | ワインセラー（特別なものを保管） |
| **ロードバランサー** | ALB | 案内係（混雑時に席を振り分け） |

---

## 3. 開発環境 vs 本番環境

### なぜ2つの環境が必要？

```
開発環境 = 厨房の試作スペース
  → 失敗しても大丈夫
  → 自分だけが使う
  → 簡単に作り直せる

本番環境 = 実際の店舗
  → 失敗は許されない
  → 多くのお客さんが使う
  → 止まると売上に影響
```

### ACRIQUEの2つの環境

```mermaid
graph TB
    subgraph "開発環境（あなたのPC）"
        direction TB
        DC[docker-compose.yml]
        DC --> FE_DEV[Frontend<br/>localhost:3005]
        DC --> BE_DEV[Backend<br/>localhost:8005]
        DC --> DB_DEV[(PostgreSQL<br/>localhost:5437)]
    end

    subgraph "本番環境（AWS）"
        direction TB
        AWS[AWS Cloud]
        AWS --> FE_PROD[Amplify<br/>https://acrique.jp]
        AWS --> BE_PROD[ECS Fargate<br/>api.acrique.jp]
        AWS --> DB_PROD[(RDS PostgreSQL<br/>VPC内)]
    end

    style DC fill:#e1f5fe
    style AWS fill:#fff3e0
```

### 具体的な違い

| 項目 | 開発環境 | 本番環境 |
|-----|---------|---------|
| **どこで動く** | 自分のPC (Docker) | AWS (クラウド) |
| **アクセス** | localhost | https://acrique.jp |
| **データベース** | Docker内のPostgreSQL | AWS RDS |
| **コスト** | 無料 | 月額費用発生 |
| **信頼性** | 低い（PCの電源次第） | 高い（24時間稼働） |
| **スケール** | 1台のみ | 必要に応じて増減 |

---

## 4. ACRIQUEの全体像

### 本番環境のアーキテクチャ

```mermaid
graph TB
    subgraph "インターネット"
        User[ユーザー]
    end

    subgraph "AWS Cloud"
        subgraph "フロントエンド配信"
            Amplify[AWS Amplify<br/>Next.jsをホスティング]
        end

        subgraph "VPC（仮想ネットワーク）"
            subgraph "Public Subnet（外部公開OK）"
                ALB[ALB<br/>ロードバランサー]
                NAT[NAT Gateway<br/>外部通信用]
            end

            subgraph "Private Subnet（外部から隠す）"
                ECS[ECS Fargate<br/>Backendコンテナ]
                RDS[(RDS PostgreSQL<br/>データベース)]
            end
        end

        subgraph "その他サービス"
            S3[S3<br/>画像保存]
            ECR[ECR<br/>コンテナ保存]
            SM[Secrets Manager<br/>パスワード管理]
        end
    end

    User -->|HTTPS| Amplify
    User -->|HTTPS| ALB
    ALB --> ECS
    ECS --> RDS
    ECS --> S3
    ECS --> SM
    ECS --> NAT
    NAT -->|外部API| Internet[外部サービス]

    style Amplify fill:#ff9800
    style ECS fill:#ff9800
    style RDS fill:#9c27b0
    style S3 fill:#4caf50
```

### この図の重要ポイント

1. **VPC（仮想ネットワーク）** = 会社のビル
   - Public Subnet = 1階ロビー（外から入れる）
   - Private Subnet = オフィス階（社員しか入れない）

2. **なぜ分ける？**
   - データベースは直接外部からアクセスさせない
   - セキュリティを確保する

---

## 5. AWSの主要サービス解説

### ACRIQUEで使うサービス一覧

```mermaid
graph LR
    subgraph "コンピュート（計算）"
        ECS[ECS Fargate<br/>コンテナ実行]
        Amplify[Amplify<br/>フロント配信]
    end

    subgraph "ストレージ（保存）"
        S3[S3<br/>ファイル保存]
        RDS[(RDS<br/>データベース)]
        ECR[ECR<br/>イメージ保存]
    end

    subgraph "ネットワーク"
        VPC[VPC<br/>仮想ネットワーク]
        ALB[ALB<br/>負荷分散]
    end

    subgraph "セキュリティ"
        SM[Secrets Manager<br/>秘密情報管理]
        IAM[IAM<br/>権限管理]
    end
```

### 各サービスの役割（日常例で理解）

#### ECS Fargate（バックエンド実行環境）

```
コンテナ = 持ち運びできる厨房セット

ECS Fargate = 「厨房セットを置ける場所を貸してくれるサービス」

- コンテナを渡すと、自動で動かしてくれる
- サーバーの管理は不要（AWSがやってくれる）
- 使った分だけ課金
```

```mermaid
graph LR
    subgraph "あなたがやること"
        Code[コードを書く] --> Image[Dockerイメージを作る]
    end

    subgraph "AWSがやること"
        Image --> ECR[ECRに保存]
        ECR --> ECS[ECSが実行]
        ECS --> Scale[自動でスケール]
    end
```

#### RDS（データベース）

```
RDS = 「データベースのレンタル倉庫」

- PostgreSQL/MySQLを簡単に使える
- バックアップは自動
- 障害時は自動で復旧
```

**開発環境（Docker）との違い**

| 項目 | Docker PostgreSQL | RDS PostgreSQL |
|-----|-------------------|----------------|
| 起動 | `docker compose up` | AWSコンソール or CDK |
| バックアップ | 手動 | 自動（毎日） |
| 障害時 | 自分で対応 | AWSが自動復旧 |
| 料金 | 無料 | 月$15〜 |

#### S3（ファイルストレージ）

```
S3 = 「無限に拡張できるクラウドの押入れ」

ACRIQUEでの用途：
- 商品画像の保存
- ユーザーが入稿したデータの保存
- 設定ファイルの保存
```

#### ALB（ロードバランサー）

```
ALB = 「優秀な受付係」

仕事：
1. ユーザーからのリクエストを受け取る
2. 複数のECSコンテナに振り分ける
3. 1つが壊れても、他に振り分ける
```

```mermaid
graph LR
    User1[ユーザーA] --> ALB
    User2[ユーザーB] --> ALB
    User3[ユーザーC] --> ALB

    ALB --> ECS1[ECS #1]
    ALB --> ECS2[ECS #2]

    ECS1 -.->|#1が死んでも| ALB
    ALB -->|#2に振り分け| ECS2
```

#### Amplify（フロントエンド配信）

```
Amplify = 「Next.jsを簡単に公開できるサービス」

特徴：
- GitHubと連携して自動デプロイ
- HTTPSが自動で設定される
- 世界中のCDNで高速配信
```

---

## 6. 次のステップ

### 学習ロードマップ

```mermaid
graph TD
    A[今ここ<br/>インフラの全体像を理解] --> B[Docker基礎<br/>コンテナの仕組み]
    B --> C[AWS基礎<br/>コンソール操作]
    C --> D[CDKの理解<br/>コードでインフラ定義]
    D --> E[実際にデプロイ<br/>dev環境を作る]

    style A fill:#4caf50,color:#fff
```

### 次に読むべきドキュメント

1. **02-Docker入門** - コンテナの仕組みを理解
2. **03-AWS基礎** - AWSコンソールの操作方法
3. **04-CDK入門** - ACRIQUEのinfraフォルダの読み方
4. **05-デプロイ実践** - 実際にデプロイしてみる

### 今日のまとめ

```
1. インフラ = アプリを動かすための「設備全般」

2. ACRIQUEの構成
   - Frontend: Next.js → Amplifyで配信
   - Backend: FastAPI → ECS Fargateで実行
   - Database: PostgreSQL → RDSで管理

3. 開発環境と本番環境は全く別物
   - 開発: Docker Compose（ローカル）
   - 本番: AWS（クラウド）

4. AWSのサービスは「役割分担」
   - 計算する人（ECS）
   - 保存する人（S3, RDS）
   - 交通整理する人（ALB, VPC）
```

---

**作成日**: 2025-01-06
**対象**: フロントエンドエンジニア（インフラ初心者）
**所要時間**: 約15分
