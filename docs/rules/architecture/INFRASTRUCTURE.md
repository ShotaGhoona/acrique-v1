# インフラストラクチャアーキテクチャ設計書

## 目次

1. [概要](#概要)
2. [4層レイヤードアーキテクチャ](#4層レイヤードアーキテクチャ)
3. [プロジェクト構造](#プロジェクト構造)
4. [スタック構成](#スタック構成)
5. [各レイヤーの詳細](#各レイヤーの詳細)
6. [ネットワーク設計](#ネットワーク設計)
7. [セキュリティ設計](#セキュリティ設計)
8. [運用機能](#運用機能)
9. [CI/CDパイプライン](#cicdパイプライン)

---

## 概要

AWS CDK（Cloud Development Kit）を使用した、**完全な4層レイヤードアーキテクチャ**のインフラストラクチャ設計です。

### プロジェクトの特徴

- **完全な4層構造**: Construct層 → Resource層 → Stack層 → bin/層
- **L2コンストラクトのみ使用**: AWSベストプラクティスに準拠
- **セキュアバイデフォルト**: すべてのリソースにセキュアな設定を適用
- **環境別設定**: dev/stg/prod環境を簡単に切り替え可能
- **スケーラブル**: 小規模から大規模プロジェクトまで対応

---

## 4層レイヤードアーキテクチャ

### アーキテクチャ概要

```
レイヤー4: bin/app.ts                    ← どのスタックを使うか選択
    ↓
レイヤー3: lib/stack/                    ← デプロイ単位（CloudFormation Stack）
    ↓
レイヤー2: lib/resource/                 ← 機能単位（複数AWSサービスの組み合わせ）
    ↓
レイヤー1: lib/construct/                ← 単一AWSリソースの抽象化
    ↓
レイヤー0: aws-cdk-lib                   ← AWS公式CDKライブラリ
```

---

## プロジェクト構造

```
infra/
├── bin/
│   ├── app.ts                           # レイヤー4: アプリケーションエントリーポイント
│   └── poc-app.ts                       # POC用エントリーポイント
│
├── lib/
│   ├── construct/                       # レイヤー1: 単一AWSリソースの抽象化
│   │   ├── compute/
│   │   │   ├── lambda-construct.ts      # Lambda関数
│   │   │   ├── ecs-construct.ts         # ECSクラスター、Fargateサービス
│   │   │   ├── ecr-construct.ts         # ECRリポジトリ
│   │   │   ├── bastion-construct.ts     # 踏み台サーバー（EC2 Bastion）
│   │   │   └── scheduled-task-construct.ts # ECS Scheduled Task
│   │   ├── datastore/
│   │   │   ├── dynamodb-construct.ts    # DynamoDB
│   │   │   ├── rds-construct.ts         # RDS PostgreSQL/MySQL
│   │   │   ├── aurora-construct.ts      # Aurora PostgreSQL
│   │   │   └── s3-construct.ts          # S3バケット
│   │   ├── networking/
│   │   │   ├── vpc-construct.ts         # VPC
│   │   │   ├── alb-construct.ts         # ALB
│   │   │   ├── security-group-construct.ts # セキュリティグループ
│   │   │   ├── isolation-security-group-construct.ts # 分離用セキュリティグループ
│   │   │   └── isolation-nacl-construct.ts # 分離用NACL
│   │   ├── messaging/
│   │   │   ├── sns-construct.ts         # SNS
│   │   │   └── sqs-construct.ts         # SQS
│   │   ├── security/
│   │   │   ├── cognito-construct.ts     # Cognito（SMS認証対応）
│   │   │   ├── secrets-manager-construct.ts # Secrets Manager
│   │   │   └── waf-construct.ts         # WAF（Web Application Firewall）
│   │   ├── api/
│   │   │   ├── api-gateway-construct.ts # API Gateway
│   │   │   └── cloudfront-construct.ts  # CloudFront
│   │   └── hosting/
│   │       └── amplify-construct.ts     # AWS Amplify
│   │
│   ├── resource/                        # レイヤー2: 機能単位の組み合わせ
│   │   ├── network-resource.ts          # ネットワーク基盤
│   │   ├── data-storage-resource.ts     # データベースストレージ
│   │   ├── database-resource.ts         # データベース（RDS/Aurora）
│   │   ├── object-storage-resource.ts   # オブジェクトストレージ
│   │   ├── api-resource.ts              # API基盤
│   │   ├── frontend-resource.ts         # フロントエンド
│   │   ├── messaging-resource.ts        # メッセージング
│   │   └── security-resource.ts         # セキュリティ
│   │
│   └── stack/                           # レイヤー3: デプロイ単位
│       ├── foundation/
│       │   └── foundation-stack.ts      # ネットワーク基盤スタック
│       ├── data-storage/
│       │   └── data-storage-stack.ts    # データベースストレージスタック
│       ├── object-storage/
│       │   └── object-storage-stack.ts  # オブジェクトストレージスタック
│       ├── security/
│       │   └── security-stack.ts        # セキュリティスタック
│       ├── backend/
│       │   └── backend-stack.ts         # バックエンドスタック
│       ├── frontend/
│       │   └── frontend-stack.ts        # フロントエンドスタック
│       ├── integration/
│       │   └── integration-stack.ts     # 統合スタック
│       ├── batch/
│       │   └── batch-stack.ts           # バッチ処理スタック（オプション）
│       ├── observability/
│       │   └── observability-stack.ts   # 監視スタック
│       └── poc/
│           └── poc-stack.ts             # POCスタック（検証用）
│
├── config/                              # 環境別設定
│   ├── environment.ts                   # 環境設定インターフェース
│   ├── dev.ts                           # 開発環境設定
│   ├── stg.ts                           # ステージング環境設定
│   ├── prod.ts                          # 本番環境設定
│   └── index.ts                         # 設定エクスポート
│
└── lambda/                              # Lambda関数コード
    └── index.js
```

---

## スタック構成

### 実装されているスタック（10スタック）

#### 1. FoundationStack（基盤）

**責務**: ネットワーク基盤の提供

- VPC（マルチAZ、`/20`サブネット）
- パブリック/プライベートサブネット
- インターネットゲートウェイ
- NATゲートウェイ
- VPC Endpoints（Gateway: S3, DynamoDB / Interface: ECR, CloudWatch Logs, Secrets Manager）

**変更頻度**: 年1回以下
**デプロイ時間**: 約3-5分

---

#### 2. DataStorageStack（データベース）

**責務**: データベースストレージの提供

- DynamoDB（オプション、`enableDynamo: true`で有効化）
- RDS PostgreSQL/MySQL（デフォルト、`enableRds: true`）
- Aurora PostgreSQL/MySQL（オプション、`enableAurora: true`で有効化）
- Bastion Host（オプション、`bastion.enabled: true`で有効化）

**設定オプション**:
- `autoMinorVersionUpgrade`: 自動マイナーバージョンアップ（dev/stg: true、prod: false）
- `bastion.enabled`: 踏み台サーバーの有効化
- `bastion.enableSsm`: SSM Session Manager経由の接続（推奨）
- `bastion.allowSshFrom`: SSH接続を許可するCIDR（オプション）

**変更頻度**: 月1回
**デプロイ時間**: 約5-10分（RDS: 5-7分、Aurora: 7-10分）

---

#### 3. ObjectStorageStack（オブジェクトストレージ）

**責務**: オブジェクトストレージの提供

- S3バケット（パブリックアクセスブロック、バージョニング有効）

**変更頻度**: 低頻度（バケット追加時のみ）
**デプロイ時間**: 約1-2分

---

#### 4. SecurityStack（セキュリティ）

**責務**: 認証・認可・シークレット管理

- Cognito User Pool（ユーザー認証）
- User Pool Client
- Secrets Manager（シークレット管理）

**変更頻度**: 月1回
**デプロイ時間**: 約3-5分

---

#### 5. BackendStack（バックエンドAPI）

**責務**: バックエンドAPI実行環境の提供

- Lambda関数（軽量API、オプション）
- API Gateway（Lambda統合、REST API）
- ECSクラスター（コンテナAPI）
- Fargate Service
- Application Load Balancer（ECS統合）
- セキュリティグループ（ECS用、Lambda用を分離）

**変更頻度**: 週1-2回（API機能追加・修正）
**デプロイ時間**: 約5-7分

**分離理由**: バックエンドチームが独立して作業できるように

---

#### 6. FrontendStack（フロントエンド配信）

**責務**: フロントエンド配信環境の提供

2つのデプロイ方式をサポート:
- **Amplify**（デフォルト）: Git連携自動デプロイ、ビルドパイプライン内蔵
- **S3 + CloudFront**: OAC（Origin Access Control）使用、カスタマイズ性が高い

**変更頻度**: 日次変更（フロントエンドデプロイ）
**デプロイ時間**: 約3-5分

**分離理由**: フロントエンド更新時のデプロイ時間を短縮

---

#### 7. IntegrationStack（統合）

**責務**: システム間連携の提供

- SNS Topic（イベント通知）
- SQS Queue（メッセージキュー）
- Dead Letter Queue（失敗メッセージ処理）

**変更頻度**: 月1回
**デプロイ時間**: 約2-3分

---

#### 8. BatchStack（バッチ処理）※オプション

**責務**: 定期実行・バッチ処理の提供

- ECS Scheduled Task（Fargate）
- EventBridge Rule（スケジュール管理）
- CloudWatch Log Group（バッチログ）
- セキュリティグループ（データベースアクセス用）

**設定オプション**:
- `batch.enabled`: バッチ機能の有効化（デフォルト: false）
- `batch.cpu`: タスクのCPU（デフォルト: 256）
- `batch.memory`: タスクのメモリ（デフォルト: 512MB）
- `batch.useExistingCluster`: BackendStackのECSクラスターを共有（デフォルト: true）

**スケジュール設定**:
```typescript
import { CommonSchedules } from './lib/construct/compute/scheduled-task-construct';

// よく使うスケジュール（JST対応）
CommonSchedules.dailyAt3amJst()        // 毎日03:00 JST
CommonSchedules.dailyAtMidnightJst()   // 毎日00:00 JST
CommonSchedules.hourly()               // 毎時
CommonSchedules.every5Minutes()        // 5分ごと
CommonSchedules.weeklyMondayAt3amJst() // 毎週月曜03:00 JST
CommonSchedules.monthlyFirstDayAt3amJst() // 毎月1日03:00 JST
```

**変更頻度**: 月1回（バッチ追加・変更）
**デプロイ時間**: 約3-5分

**有効化方法**:
```typescript
// config/dev.ts
batch: {
  enabled: true,
  cpu: 256,
  memory: 512,
  useExistingCluster: true,
},
```

---

#### 9. ObservabilityStack（監視）

**責務**: システム監視・運用の提供

- CloudWatch Alarms（アラート）
- CloudWatch Dashboard（可視化）
- メトリクス監視（ECS、RDS、Lambda、ALB）

**変更頻度**: 月1回
**デプロイ時間**: 約2-3分

---

#### 10. PocStack（POC・検証用）

**責務**: 新機能の検証・プロトタイピング

- 本番環境に影響を与えずに新機能を検証
- 独立したリソースでテスト可能
- `poc-app.ts` から起動

**用途**:
- 新しいAWSサービスの検証
- アーキテクチャの実験
- コスト見積もりのためのプロトタイプ

**変更頻度**: 随時
**デプロイ時間**: 構成による

---

### デプロイ時間の目安

| スタック | 初回デプロイ | 更新デプロイ | 変更頻度 |
|---------|------------|------------|----------|
| FoundationStack | 3-5分 | 3-5分 | 年1回以下 |
| DataStorageStack | 5-10分 | 5-7分 | 月1回 |
| ObjectStorageStack | 1-2分 | 1-2分 | 低頻度 |
| SecurityStack | 3-5分 | 2-3分 | 月1回 |
| BackendStack | 5-7分 | 3-5分 | 週1-2回 |
| FrontendStack | 3-5分 | 3-5分 | 日次 |
| IntegrationStack | 2-3分 | 1-2分 | 月1回 |
| BatchStack（オプション） | 3-5分 | 2-3分 | 月1回 |
| ObservabilityStack | 2-3分 | 1-2分 | 月1回 |
| PocStack（検証用） | 構成による | 構成による | 随時 |
| **全体** | **27-45分** | **22-33分** | - |

### 分離のメリット

- **データベースとS3を独立管理**: 変更頻度・削除ポリシーが異なるリソースを分離
- **フロントエンド更新が高速**: 3-5分
- **バックエンド変更の影響なし**: API更新時にフロントエンドは影響を受けない
- **独立デプロイ**: 各チームが並行作業可能

---

## 各レイヤーの詳細

### レイヤー1: Construct層（単一リソース）

**目的**: 単一のAWSリソースをセキュアなデフォルト設定で抽象化

**例**: DynamoDBテーブルを作成

```typescript
import { DynamoDbConstruct } from '../construct/datastore/dynamodb-construct';

const dynamo = new DynamoDbConstruct(this, 'MyTable', {
  tableName: 'my-table',
  // デフォルトで暗号化、バックアップ、オンデマンド課金が有効
});
```

**特徴**:
- セキュアバイデフォルト
- 変更頻度: ほぼなし
- 全プロジェクトで再利用可能

---

### レイヤー2: Resource層（機能単位）

**目的**: 複数のConstructを組み合わせて1つの機能を提供

**例**: データベース基盤を構築

```typescript
import { DataStorageResource } from '../resource/data-storage-resource';

const database = new DataStorageResource(this, 'Database', {
  enableRds: true,
  rdsInstanceName: 'my-rds',
  vpc: props.vpc,
  autoMinorVersionUpgrade: false, // 本番環境では手動管理
});
```

**特徴**:
- 機能が完結
- 変更頻度: まれ
- StarUPでよく使う構築パターンを定義

---

### レイヤー3: Stack層（デプロイ単位）

**目的**: CloudFormationスタック単位でデプロイ

**例**: データスタックを定義

```typescript
import { DataStorageStack } from '../lib/stack/data-storage/data-storage-stack';

const dataStorageStack = new DataStorageStack(app, 'dev-DataStorageStack', config, {
  vpc: foundationStack.vpc,
});
```

**特徴**:
- 変更頻度に応じた分離
- 影響範囲の最小化
- 個別デプロイ可能

---

### レイヤー4: bin/層（プロジェクト構成）

**目的**: このプロジェクトで使用するスタックを選択

**例**: プロジェクト全体の構成を宣言

```typescript
const foundationStack = new FoundationStack(app, 'dev-FoundationStack', config);
const dataStorageStack = new DataStorageStack(app, 'dev-DataStorageStack', config, {
  vpc: foundationStack.vpc,
});

// セキュリティグループ接続
dataStorageStack.allowConnectionsFrom(backendStack.ecsSecurityGroup);
```

**特徴**:
- プロジェクト固有
- 段階的成長に対応
- 宣言的な構成

---

## ネットワーク設計

### VPCサブネット構成

```
10.0.0.0/16 (VPC)
├── 10.0.0.0/20   - Public Subnet (AZ-a)   ← ALB, NAT Gateway
├── 10.0.16.0/20  - Public Subnet (AZ-c)   ← ALB, NAT Gateway
├── 10.0.32.0/20  - Private Subnet (AZ-a)  ← ECS, Lambda, RDS
└── 10.0.48.0/20  - Private Subnet (AZ-c)  ← ECS, Lambda, RDS
```

**設計ポイント**:
- `/20`サブネット: 各サブネットに約4,000 IPアドレスを確保
- 2層構成（Public/Private）: シンプルで管理しやすい
- RDSはPrivateサブネットに配置（VPC内からのみアクセス可能）

### VPC Endpoints

NAT Gatewayのコストを削減するため、以下のVPC Endpointsを設定:

| タイプ | サービス | 料金 |
|--------|----------|------|
| Gateway | S3 | 無料 |
| Gateway | DynamoDB | 無料 |
| Interface | ECR API | 有料 |
| Interface | ECR Docker | 有料 |
| Interface | CloudWatch Logs | 有料 |
| Interface | Secrets Manager | 有料 |

**NAT Gateway経由の通信**:
- 外部APIへのアクセス
- 上記以外のAWSサービスへのアクセス

### 環境別ネットワーク設定

| 環境 | AZ数 | NAT Gateway数 | 用途 |
|------|------|---------------|------|
| dev | 1 | 1 | コスト削減（開発用） |
| stg | 2 | 2 | 本番同等構成でテスト |
| prod | 2 | 2 | 高可用性構成 |

---

## セキュリティ設計

### セキュリティグループ分離

```
Internet
    │
    ▼
┌─────────────┐
│     ALB     │ ← HTTP/HTTPS (0.0.0.0/0)
│   (SG-ALB)  │
└─────────────┘
    │ port 80
    ▼
┌─────────────┐
│     ECS     │ ← ALB-SG からのみ許可
│   (SG-ECS)  │
└─────────────┘
    │ port 5432
    ▼
┌─────────────┐
│     RDS     │ ← ECS-SG, Lambda-SG からのみ許可
│   (SG-RDS)  │
└─────────────┘
```

**セキュリティグループ一覧**:
- `SG-ALB`: インターネットからのHTTP/HTTPSを許可
- `SG-ECS`: ALBからのトラフィックのみ許可
- `SG-Lambda`: VPC Lambda用（RDSアクセス用）
- `SG-RDS`: ECS/LambdaからのDBポートのみ許可

### WAF（Web Application Firewall）

ALBとCloudFrontにWAFを適用し、以下の攻撃を防御:

| ルール | 対策内容 |
|--------|----------|
| AWSManagedRulesCommonRuleSet | OWASP Top 10対策（XSS、LFI等） |
| AWSManagedRulesKnownBadInputsRuleSet | 既知の悪意あるパターン |
| AWSManagedRulesSQLiRuleSet | SQLインジェクション |
| AWSManagedRulesAmazonIpReputationList | 悪意のあるIPブロック |
| RateLimitRule | DDoS対策（5分間2000リクエスト） |

**有効化方法**（本番環境推奨）:

```typescript
// config/prod.ts
waf: {
  enabled: true,
  rateLimit: 2000,
  enableBotControl: false, // 追加コスト発生
},
```

**注意事項**:
- ALB用WAF: `REGIONAL`スコープで作成
- CloudFront用WAF: `us-east-1`リージョンに`CLOUDFRONT`スコープで作成が必要
- Bot Control有効化時は追加コストが発生

### S3セキュリティ

- パブリックアクセス完全ブロック（`BLOCK_ALL`）
- サーバーサイド暗号化（S3-Managed）
- HTTPS接続強制（`enforceSSL: true`）
- バージョニング有効（デフォルト）
- CloudFront経由のアクセスはOAC（Origin Access Control）を使用

### RDS/Auroraセキュリティ

- ストレージ暗号化
- VPCプライベートサブネット配置
- 自動バックアップ有効
- 自動マイナーバージョンアップ: dev/stg有効、prod無効

### ECS環境変数管理

```typescript
// 非機密情報: S3の.envファイルから読み込み
environmentFiles: [
  ecs.EnvironmentFile.fromBucket(configBucket, 'config/app.env'),
],

// 機密情報: Secrets Managerから読み込み
secrets: {
  DATABASE_URL: ecs.Secret.fromSecretsManager(dbSecret),
  API_KEY: ecs.Secret.fromSecretsManager(apiKeySecret, 'api_key'),
},
```

### Lambda/ECS共通

- VPC内配置
- プライベートサブネット配置
- CloudWatch Logs自動設定

### Cognito

- MFA対応（TOTP / SMS）
- セキュアなパスワードポリシー
- メール検証
- SMS認証（オプション）

**SMS認証の有効化**:
```typescript
// config/prod.ts
cognito: {
  enableSmsAuth: true,
  smsExternalId: 'MyApp', // SMSの送信元として表示される名前
},
```

**SMS認証有効時の機能**:
- 電話番号でのサインイン
- SMS MFA
- 電話番号でのアカウント回復
- SNS経由でのSMS送信（課金発生）

---

## 運用機能

### Bastion Host（踏み台サーバー）

RDS/Auroraへの接続用踏み台サーバー。

**接続方式**:
| 方式 | 特徴 | 推奨環境 |
|------|------|----------|
| SSM Session Manager | SSH不要、IAM認証、監査ログ | 全環境（推奨） |
| SSH | 従来型、キー管理が必要 | 開発環境のみ |

**設定例**:
```typescript
// config/dev.ts
bastion: {
  enabled: true,
  enableSsm: true,  // SSM Session Manager経由
  // allowSshFrom: '203.0.113.0/24',  // SSH接続が必要な場合
},
```

**セキュリティ設定**:
- IMDSv2強制（メタデータサービスのセキュリティ強化）
- t3.micro（最小インスタンス）
- 自動PostgreSQL/MySQLアクセス許可

**DB接続方法**:
```bash
# SSM経由でポートフォワーディング
aws ssm start-session \
  --target i-xxxxxxxxxx \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters '{"host":["your-rds-endpoint"],"portNumber":["5432"],"localPortNumber":["5432"]}'
```

---

## CI/CDパイプライン

### GitHub Actions認証

OIDC（OpenID Connect）を使用したセキュアな認証:

```yaml
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
    aws-region: ap-northeast-1
```

**メリット**:
- 長期的なアクセスキーが不要
- IAMロールベースの一時認証情報
- 最小権限の原則を適用

### ECRデプロイ戦略

```yaml
- name: Build, tag, and push Docker image
  env:
    IMAGE_TAG: ${{ github.sha }}
  run: |
    docker build -t $ECR_REPO:$IMAGE_TAG .
    docker push $ECR_REPO:$IMAGE_TAG
```

**設計ポイント**:
- **コミットSHAのみをタグとして使用**（`latest`タグは使用しない）
- イミュータブルなイメージ管理
- ロールバックが容易（過去のコミットSHAを指定するだけ）
- 監査性の向上（どのコミットが本番稼働中か明確）

### デプロイフロー

```
develop ブランチ → Staging環境（自動デプロイ）
main ブランチ    → Production環境（自動デプロイ or 承認後デプロイ）
```

**ワークフロー**:
- `deploy-auto.yml`: 自動デプロイ
- `deploy-manual.yml`: 手動承認付きデプロイ（GitHub Environments使用）

---

## 環境別設定

環境ごとに異なる設定は `config/` で管理します。

### 開発環境（dev）

```typescript
// config/dev.ts
export const devConfig: EnvironmentConfig = {
  envName: 'dev',
  removalPolicy: RemovalPolicy.DESTROY,
  vpc: {
    cidr: '10.0.0.0/16',
    maxAzs: 1,           // コスト削減
    natGateways: 1,
  },
  database: {
    enableRds: true,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
    multiAz: false,
    autoMinorVersionUpgrade: true,  // 自動アップグレード有効
  },
  ecs: {
    backend: {
      desiredCount: 1,
      cpu: 256,
      memory: 512,
    },
  },
};
```

### 本番環境（prod）

```typescript
// config/prod.ts
export const prodConfig: EnvironmentConfig = {
  envName: 'prod',
  removalPolicy: RemovalPolicy.RETAIN,
  vpc: {
    cidr: '10.1.0.0/16',
    maxAzs: 2,           // 高可用性
    natGateways: 2,      // AZごとにNAT Gateway
  },
  database: {
    enableAurora: true,  // 本番はAurora
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.R6G, ec2.InstanceSize.LARGE),
    readerCount: 2,
    autoMinorVersionUpgrade: false,  // 手動でバージョン管理
  },
  ecs: {
    backend: {
      desiredCount: 4,
      cpu: 1024,
      memory: 2048,
    },
  },
};
```

---

**最終更新日**: 2025-12-23
**バージョン**: 3.3.0

---

## 変更履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|----------|
| 3.3.0 | 2025-12-23 | PocStack追加、ECR/WAF/Amplify Construct追加、分離用SG/NACL追加、database-resource追加 |
| 3.2.0 | 2025-12-22 | BatchStack追加、Bastion追加、ロギング機能追加、SMS認証対応 |
| 3.1.0 | 2025-12-16 | 4層アーキテクチャ完成 |
