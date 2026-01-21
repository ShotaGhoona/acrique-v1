# AWS基礎 - クラウドの仕組み

ACRIQUEの本番環境はAWS上で動く。
「クラウド」の正体と、ACRIQUEで使うAWSサービスを理解しよう。

---

## 目次

1. [クラウドって何？](#1-クラウドって何)
2. [AWSの基本概念](#2-awsの基本概念)
3. [ACRIQUEで使うサービス詳解](#3-acriqueで使うサービス詳解)
4. [ネットワークの仕組み（VPC）](#4-ネットワークの仕組みvpc)
5. [セキュリティの基礎](#5-セキュリティの基礎)
6. [料金の仕組み](#6-料金の仕組み)

---

## 1. クラウドって何？

### 日常の例で理解する

```
【自家発電 vs 電力会社】

自家発電（オンプレミス）：
- 自分で発電機を買う
- 自分でメンテナンスする
- 使わなくても維持費がかかる
- 急に電力が必要になっても増やせない

電力会社（クラウド）：
- コンセントにつなぐだけ
- メンテナンスは電力会社がやる
- 使った分だけ払う
- 必要な時に必要なだけ使える
```

**クラウド = 「必要な時に必要なだけ借りられるITリソース」**

### なぜクラウドを使う？

```mermaid
graph LR
    subgraph "自前サーバー（オンプレミス）"
        A1[サーバー購入]
        A2[設置工事]
        A3[24時間監視]
        A4[障害対応]
        A5[セキュリティ管理]
    end

    subgraph "クラウド（AWS）"
        B1[クリックで起動]
        B2[すぐ使える]
        B3[AWSが監視]
        B4[AWSが復旧]
        B5[AWSが管理]
    end
```

| 項目 | 自前サーバー | AWS |
|-----|------------|-----|
| 初期費用 | 数十〜数百万円 | 0円 |
| 使用開始 | 数週間〜数ヶ月 | 数分 |
| スケール | 追加購入が必要 | クリックで増減 |
| 障害対応 | 自分で対応 | AWSが対応 |
| 支払い | 固定費 | 従量課金 |

---

## 2. AWSの基本概念

### リージョンとアベイラビリティゾーン

```
AWS = 世界中にデータセンターを持つ会社

リージョン = 地域（東京、大阪、シンガポール、etc.）
AZ（アベイラビリティゾーン）= リージョン内の独立したデータセンター
```

```mermaid
graph TB
    subgraph "ap-northeast-1（東京リージョン）"
        AZ_A[AZ-a<br/>データセンター群A]
        AZ_C[AZ-c<br/>データセンター群C]
        AZ_D[AZ-d<br/>データセンター群D]
    end

    subgraph "ap-northeast-3（大阪リージョン）"
        AZ_O1[AZ-a]
        AZ_O2[AZ-b]
        AZ_O3[AZ-c]
    end
```

**なぜ複数AZを使う？**

```
AZ-aのデータセンターが火事になっても
→ AZ-cで動いているから大丈夫

ACRIQUEの本番環境：
- 2つのAZ（a と c）を使用
- どちらかが死んでもサービス継続
```

### ACRIQUEが使うリージョン

```
ap-northeast-1（東京リージョン）

理由：
- 日本のユーザーに近い = 速い
- 日本の法律に準拠しやすい
```

---

## 3. ACRIQUEで使うサービス詳解

### サービス一覧と役割

```mermaid
graph TB
    subgraph "コンピュート（計算する）"
        ECS[ECS Fargate<br/>コンテナ実行]
        Amplify[Amplify<br/>フロント配信]
    end

    subgraph "ストレージ（保存する）"
        S3[S3<br/>ファイル保存]
        RDS[(RDS<br/>データベース)]
        ECR[ECR<br/>Dockerイメージ]
    end

    subgraph "ネットワーク（つなぐ）"
        VPC[VPC<br/>仮想ネットワーク]
        ALB[ALB<br/>負荷分散]
    end

    subgraph "セキュリティ（守る）"
        SM[Secrets Manager<br/>秘密情報管理]
        SG[Security Group<br/>ファイアウォール]
    end

    subgraph "監視（見る）"
        CW[CloudWatch<br/>ログ・監視]
    end
```

---

### ECS Fargate（バックエンドの実行環境）

**何をするサービス？**

```
Dockerコンテナを動かす場所を提供する

Fargate = サーバーレスコンテナ
→ サーバーの管理は不要
→ コンテナを渡すだけで動く
```

```mermaid
graph LR
    subgraph "あなたがやること"
        Image[Dockerイメージ]
        Config[CPU/メモリの指定]
    end

    subgraph "AWSがやること"
        Server[サーバー用意]
        Run[コンテナ実行]
        Scale[スケール管理]
        Monitor[監視]
    end

    Image --> Run
    Config --> Server
```

**ACRIQUEでの使い方**

```yaml
# config/dev.ts より
ecs: {
  backend: {
    desiredCount: 1,    # コンテナの数
    cpu: 256,           # CPU（0.25 vCPU）
    memory: 512,        # メモリ（512MB）
  }
}
```

**EC2との違い**

| 項目 | EC2 | ECS Fargate |
|-----|-----|-------------|
| 管理対象 | サーバー全体 | コンテナのみ |
| OS更新 | 自分で | AWS |
| スケール | 手動 | 自動対応 |
| 課金 | 起動中ずっと | タスク実行中のみ |
| 向いている | 細かい制御が必要 | コンテナを動かすだけ |

---

### RDS（データベース）

**何をするサービス？**

```
マネージド（管理された）データベース

「PostgreSQLを使いたい」
→ 自分でインストール不要
→ バックアップ自動
→ 障害時は自動復旧
```

```mermaid
graph TB
    subgraph "自分でPostgreSQLを立てる場合"
        A1[EC2を起動]
        A2[PostgreSQLインストール]
        A3[設定ファイル編集]
        A4[バックアップ設定]
        A5[監視設定]
        A6[障害対応]

        A1 --> A2 --> A3 --> A4 --> A5 --> A6
    end

    subgraph "RDSを使う場合"
        B1[RDSを起動]
        B2[接続文字列をコピー]

        B1 --> B2
    end
```

**ACRIQUEでの設定**

```typescript
// config/dev.ts より
database: {
  enableRds: true,
  instanceType: 't3.micro',  // 最小サイズ
  multiAz: false,            // 開発環境は1AZでOK
  autoMinorVersionUpgrade: true,
}

// config/prod.ts より
database: {
  enableAurora: true,        // 本番はAurora
  readerCount: 2,            // 読み取り専用レプリカ2台
  multiAz: true,             // 複数AZで冗長化
}
```

**RDS vs Aurora**

| 項目 | RDS | Aurora |
|-----|-----|--------|
| 価格 | 安い | 高い |
| 性能 | 標準 | 高性能（3倍速い） |
| 可用性 | 標準 | 非常に高い |
| 向いている | 開発・小規模 | 本番・大規模 |

---

### S3（オブジェクトストレージ）

**何をするサービス？**

```
ファイルを保存するサービス

特徴：
- 容量無制限
- 99.999999999%の耐久性（11個の9）
- 安い（1GB/月 約3円）
```

**ACRIQUEでの用途**

```mermaid
graph LR
    subgraph "S3に保存するもの"
        A[商品画像]
        B[入稿データ<br/>ロゴ、写真等]
        C[設定ファイル<br/>.envなど]
    end

    subgraph "S3バケット"
        Bucket[acrique-assets]
    end

    A --> Bucket
    B --> Bucket
    C --> Bucket
```

**バケットとオブジェクト**

```
バケット = フォルダのようなもの（グローバルで一意の名前）
オブジェクト = ファイル

例：
s3://acrique-assets/products/qr-cube/main.jpg
     ↑ バケット名    ↑ パス        ↑ ファイル名
```

---

### ECR（コンテナレジストリ）

**何をするサービス？**

```
Dockerイメージの保管場所

Docker Hub のAWS版
→ プライベートで安全
→ ECSとの連携が簡単
```

```mermaid
sequenceDiagram
    participant Dev as 開発者
    participant GA as GitHub Actions
    participant ECR as ECR
    participant ECS as ECS

    Dev->>GA: git push
    GA->>GA: docker build
    GA->>ECR: docker push
    ECS->>ECR: docker pull
    ECS->>ECS: コンテナ起動
```

---

### ALB（ロードバランサー）

**何をするサービス？**

```
リクエストを複数のサーバーに分散する

例：
100人が同時アクセス
→ ECSコンテナが3台
→ ALBが33人ずつ振り分け
```

```mermaid
graph TD
    Users[100人のユーザー]

    ALB[ALB<br/>ロードバランサー]

    ECS1[ECS #1<br/>33人処理]
    ECS2[ECS #2<br/>33人処理]
    ECS3[ECS #3<br/>34人処理]

    Users --> ALB
    ALB --> ECS1
    ALB --> ECS2
    ALB --> ECS3
```

**ヘルスチェック**

```
ALBは定期的に「生きてる？」と確認する

ECS #2 が応答しない
→ ALBはECS #2にリクエストを送らない
→ ECS #1 と #3 で処理を継続
```

---

### Amplify（フロントエンド配信）

**何をするサービス？**

```
Next.jsアプリを簡単にデプロイ・配信

特徴：
- GitHubと連携（pushで自動デプロイ）
- HTTPSが自動
- CDN経由で高速配信
```

```mermaid
graph LR
    subgraph "開発"
        Dev[開発者]
        GH[GitHub]
    end

    subgraph "Amplify"
        Build[ビルド]
        Host[ホスティング]
        CDN[CDN配信]
    end

    subgraph "ユーザー"
        User[ブラウザ]
    end

    Dev -->|push| GH
    GH -->|webhook| Build
    Build --> Host
    Host --> CDN
    CDN -->|高速配信| User
```

**Vercelとの比較**

| 項目 | Amplify | Vercel |
|-----|---------|--------|
| 提供元 | AWS | Vercel |
| AWS連携 | ネイティブ | 設定必要 |
| 料金 | 従量課金 | プランベース |
| 向いている | AWS環境と統合 | Next.js単独 |

---

## 4. ネットワークの仕組み（VPC）

### VPCとは

```
VPC = Virtual Private Cloud
    = AWS上に作る「自分専用のネットワーク」

イメージ：
会社のビルを建てる
→ 中のフロア配置は自由
→ 誰を入れるか自分で決める
```

### ACRIQUEのVPC構成

```mermaid
graph TB
    subgraph "VPC 10.0.0.0/16"
        subgraph "Public Subnet（1階ロビー）"
            ALB[ALB<br/>受付]
            NAT[NAT Gateway<br/>外出用]
        end

        subgraph "Private Subnet（オフィス階）"
            ECS[ECS Fargate<br/>従業員]
            RDS[(RDS<br/>金庫)]
        end
    end

    Internet[インターネット] -->|入ってくる| ALB
    ECS -->|出ていく| NAT
    NAT --> Internet

    style ALB fill:#ff9800
    style RDS fill:#9c27b0
```

**Public Subnet と Private Subnet**

| 種類 | 特徴 | 置くもの |
|-----|------|---------|
| Public | インターネットから直接アクセス可能 | ALB, NAT Gateway |
| Private | インターネットから直接アクセス不可 | ECS, RDS, Lambda |

**なぜ分ける？**

```
RDSをPublicに置くと：
→ インターネットから誰でもアクセス可能
→ パスワードが漏れたら終わり
→ 危険！

RDSをPrivateに置くと：
→ VPC内からしかアクセスできない
→ ECS経由でしかアクセスできない
→ 安全！
```

### NAT Gatewayの役割

```
Private Subnetからインターネットに出る時の「代理人」

ECSが外部API（Stripe等）を呼ぶ時：
ECS → NAT Gateway → インターネット → Stripe
       ↑
    ここで送信元IPを変換
```

---

## 5. セキュリティの基礎

### Security Group（ファイアウォール）

```
Security Group = 「誰を通すか」のルール

イメージ：
マンションのオートロック
→ 「宅配業者OK」「営業NG」みたいなルール
```

**ACRIQUEのSecurity Group**

```mermaid
graph LR
    Internet[インターネット]

    subgraph "SG-ALB"
        ALB[ALB]
    end

    subgraph "SG-ECS"
        ECS[ECS]
    end

    subgraph "SG-RDS"
        RDS[(RDS)]
    end

    Internet -->|443/tcp OK| ALB
    ALB -->|8000/tcp OK| ECS
    ECS -->|5432/tcp OK| RDS
    Internet -.->|拒否| ECS
    Internet -.->|拒否| RDS
```

**ルール例**

```
SG-ALB:
- インバウンド: 443/tcp from 0.0.0.0/0 (誰でもHTTPS可)
- アウトバウンド: 8000/tcp to SG-ECS

SG-ECS:
- インバウンド: 8000/tcp from SG-ALB (ALBからのみ)
- アウトバウンド: 5432/tcp to SG-RDS

SG-RDS:
- インバウンド: 5432/tcp from SG-ECS (ECSからのみ)
```

### Secrets Manager

```
パスワードや秘密情報を安全に管理するサービス

NG例：
DATABASE_URL=postgresql://user:password123@... をコードに書く
→ GitHubに公開される
→ 誰でも見れる
→ 危険！

OK例：
Secrets Managerに保存
→ ECSが起動時に取得
→ 環境変数として使用
```

```mermaid
sequenceDiagram
    participant ECS as ECS Fargate
    participant SM as Secrets Manager
    participant RDS as RDS

    ECS->>SM: DATABASE_URLください
    SM->>SM: IAMで認可確認
    SM->>ECS: postgresql://user:xxx@...
    ECS->>RDS: 接続
```

---

## 6. 料金の仕組み

### 従量課金の基本

```
AWS = 使った分だけ払う

電気代と同じ：
- 使わなければ0円に近い
- 使いすぎると高くなる
```

### ACRIQUEの主要コスト

| サービス | 課金単位 | 開発環境目安 | 本番環境目安 |
|---------|---------|-------------|-------------|
| ECS Fargate | vCPU時間 + メモリ時間 | $5〜10/月 | $50〜100/月 |
| RDS | インスタンス時間 | $15〜20/月 | $100〜200/月 |
| ALB | 時間 + 処理量 | $20〜30/月 | $20〜50/月 |
| NAT Gateway | 時間 + データ転送 | $30〜50/月 | $50〜100/月 |
| S3 | 保存量 + リクエスト | $1〜5/月 | $5〜20/月 |
| Amplify | ビルド時間 + 転送量 | $0〜5/月 | $5〜20/月 |

**開発環境の月額目安: $70〜120**
**本番環境の月額目安: $230〜490**

### コスト削減のポイント

```mermaid
graph TD
    A[コスト削減] --> B[開発環境]
    A --> C[本番環境]

    B --> B1[使わない時は停止]
    B --> B2[最小インスタンス]
    B --> B3[1AZで十分]

    C --> C1[リザーブドインスタンス<br/>1年契約で30%OFF]
    C --> C2[Savings Plans]
    C --> C3[適切なサイジング]
```

### 無料枠を活用

```
AWS無料枠（12ヶ月）：
- EC2: 750時間/月（t2.micro）
- RDS: 750時間/月（db.t2.micro）
- S3: 5GB
- Lambda: 100万リクエスト/月
```

---

## まとめ

### 今日学んだこと

```
1. クラウド = 必要な時に必要なだけ借りるITリソース

2. AWSの構造
   - リージョン（東京）
   - AZ（データセンター群）

3. ACRIQUEで使うサービス
   - ECS Fargate: バックエンド実行
   - RDS: データベース
   - S3: ファイル保存
   - ALB: 負荷分散
   - Amplify: フロントエンド配信

4. VPC
   - Public Subnet: 外部公開OK
   - Private Subnet: 内部のみ

5. セキュリティ
   - Security Group: ファイアウォール
   - Secrets Manager: 秘密情報管理
```

### ACRIQUEのAWSアーキテクチャ（復習）

```mermaid
graph TB
    User[ユーザー] -->|HTTPS| Amplify[Amplify<br/>Frontend]
    User -->|HTTPS| ALB[ALB]

    subgraph VPC
        ALB --> ECS[ECS Fargate<br/>Backend]
        ECS --> RDS[(RDS<br/>PostgreSQL)]
        ECS --> NAT[NAT Gateway]
    end

    ECS --> SM[Secrets Manager]
    ECS --> S3[S3]
    NAT --> Stripe[Stripe API]
```

---

**作成日**: 2025-01-06
**前提知識**: 01-インフラ入門, 02-Docker入門
**次のステップ**: 04-CDK入門
