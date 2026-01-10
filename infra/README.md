# Infrastructure

AWS CDK (TypeScript) を使用したインフラストラクチャ定義です。

**4 層レイヤードアーキテクチャ**を採用し、再利用性と保守性に優れた設計になっています。

## 📚 ドキュメント

詳細なドキュメントは [`../docs/rules`](../docs/rules) を参照してください。

### アーキテクチャ

- **[アーキテクチャ設計](../docs/rules/architecture/INFRASTRUCTURE.md)** - 4 層レイヤードアーキテクチャ、スタック構成

### 運用ガイド

- **[デプロイガイド](../docs/rules/operations/DEPLOYMENT.md)** - デプロイ手順、環境別設定
- **[クイックスタート](../docs/rules/operations/QUICK_START.md)** - どの構成を選ぶか、初期セットアップ
- **[PoC セットアップ](../docs/rules/operations/POC_SETUP_GUIDE.md)** - PoC Stack（AllInOne 構成）

---

## ⚡ クイックスタート

### 🔧 前提条件

- **Node.js 18+**
- **AWS CLI** 設定済み
- **AWS CDK CLI** インストール済み

```bash
npm install -g aws-cdk
```

### 🚀 セットアップ

```bash
# 1. 依存関係のインストール
npm install

# 2. ビルド
npm run build

# 3. CDKブートストラップ（初回のみ）
cdk bootstrap
```

### デプロイ

#### 開発環境（dev）

```bash
# 全スタックを確認
cdk list --context env=dev

# CloudFormationテンプレートを生成
cdk synth --context env=dev

# 全スタックをデプロイ
cdk deploy --all --context env=dev

# 特定のスタックのみデプロイ
cdk deploy dev-ApplicationStack --context env=dev
```

#### 本番環境（prod）

```bash
cdk deploy --all --context env=prod
```

詳細は **[デプロイガイド](../docs/rules/operations/DEPLOYMENT.md)** を参照してください。

---

## 💻 開発コマンド

```bash
# スタック一覧を表示
cdk list --context env=dev

# CloudFormationテンプレートを表示
cdk synth --context env=dev

# デプロイ前の差分確認
cdk diff dev-BackendStack --context env=dev

# 特定スタックを削除
cdk destroy dev-BackendStack --context env=dev

# ビルド
npm run build

# ウォッチモード（コード変更を監視）
npm run watch

# テスト
npm test
```

---

## 📁 プロジェクト構造

**4 層レイヤードアーキテクチャ**

```
infra/
├── bin/              # レイヤー4: プロジェクト構成
├── lib/
│   ├── construct/    # レイヤー1: 単一AWSリソースの抽象化
│   ├── resource/     # レイヤー2: 機能単位の組み合わせ
│   └── stack/        # レイヤー3: デプロイ単位
├── config/           # 環境別設定
└── lambda/           # Lambda関数コード
```

詳細は **[アーキテクチャ設計](../docs/rules/architecture/INFRASTRUCTURE.md)** を参照してください。

---

### 詳細ガイド

- **[変更ログ](./CHANGELOG_DATABASE.md)** - v2.0.0 での変更内容

---

## 📖 関連ドキュメント

詳細は [`../docs/rules`](../docs/rules) を参照してください。

- **[アーキテクチャ](../docs/rules/architecture/INFRASTRUCTURE.md)** - システム設計
- **[デプロイガイド](../docs/rules/operations/DEPLOYMENT.md)** - デプロイ手順
- **[クイックスタート](../docs/rules/operations/QUICK_START.md)** - 初期セットアップ
- **[変更ログ](./CHANGELOG_DATABASE.md)** - データベース設定の変更履歴

---

## 💰 コスト管理（リソースの停止・起動）

開発環境では使用していない時間にリソースを停止することでコストを大幅に削減できます。

### 📊 コストがかかる主なリソース

| リソース | 概算コスト（東京リージョン） | 停止可否 |
|---------|--------------------------|---------|
| RDS (t3.micro) | ~$15-20/月 | ⭕ 停止可 |
| NAT Gateway | ~$45/月 + 通信料 | ❌ 削除のみ |
| ECS Fargate | ~$10-30/月（タスク数依存） | ⭕ タスク数0に |
| Bastion (t3.micro) | ~$8-10/月 | ⭕ 停止可 |
| CloudFront | リクエスト課金 | - 従量課金 |
| S3 | ストレージ課金 | - 従量課金 |

### 🛑 リソースを停止する

#### RDS を停止（最大7日間）

```bash
# RDSインスタンスを停止
aws rds stop-db-instance \
  --db-instance-identifier dev-acrique-postgres \
  --region ap-northeast-1

# 停止状態を確認
aws rds describe-db-instances \
  --db-instance-identifier dev-acrique-postgres \
  --query 'DBInstances[0].DBInstanceStatus' \
  --region ap-northeast-1
```

> ⚠️ **注意**: RDSは最大7日間停止可能。7日後に自動で再起動されます。

#### ECS タスクを0にする

```bash
# バックエンドのタスク数を0に
aws ecs update-service \
  --cluster dev-acrique-cluster \
  --service dev-acrique-backend \
  --desired-count 0 \
  --region ap-northeast-1

# サービス状態を確認
aws ecs describe-services \
  --cluster dev-acrique-cluster \
  --services dev-acrique-backend \
  --query 'services[0].{desired:desiredCount,running:runningCount}' \
  --region ap-northeast-1
```

#### Bastion（踏み台）を停止

```bash
# Bastionインスタンスを停止
aws ec2 stop-instances \
  --instance-ids $(aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=*bastion*" "Name=instance-state-name,Values=running" \
    --query 'Reservations[0].Instances[0].InstanceId' \
    --output text \
    --region ap-northeast-1) \
  --region ap-northeast-1
```

#### 全リソースを一括停止（開発終了時）

```bash
# 1. ECSタスクを0に
aws ecs update-service --cluster dev-acrique-cluster --service dev-acrique-backend --desired-count 0 --region ap-northeast-1

# 2. RDSを停止
aws rds stop-db-instance --db-instance-identifier dev-acrique-postgres --region ap-northeast-1

# 3. Bastionを停止（存在する場合）
BASTION_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=*bastion*" "Name=instance-state-name,Values=running" \
  --query 'Reservations[0].Instances[0].InstanceId' \
  --output text --region ap-northeast-1)
[ "$BASTION_ID" != "None" ] && aws ec2 stop-instances --instance-ids $BASTION_ID --region ap-northeast-1
```

### ▶️ リソースを起動する

#### RDS を起動

```bash
# RDSインスタンスを起動
aws rds start-db-instance \
  --db-instance-identifier dev-acrique-postgres \
  --region ap-northeast-1

# 起動状態を確認（availableになるまで数分かかる）
aws rds describe-db-instances \
  --db-instance-identifier dev-acrique-postgres \
  --query 'DBInstances[0].DBInstanceStatus' \
  --region ap-northeast-1
```

#### ECS タスクを起動

```bash
# バックエンドのタスク数を1に
aws ecs update-service \
  --cluster dev-acrique-cluster \
  --service dev-acrique-backend \
  --desired-count 1 \
  --region ap-northeast-1
```

#### Bastion を起動

```bash
# Bastionインスタンスを起動
aws ec2 start-instances \
  --instance-ids $(aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=*bastion*" "Name=instance-state-name,Values=stopped" \
    --query 'Reservations[0].Instances[0].InstanceId' \
    --output text \
    --region ap-northeast-1) \
  --region ap-northeast-1
```

#### 全リソースを一括起動（開発開始時）

```bash
# 1. RDSを起動（最初に起動、数分かかる）
aws rds start-db-instance --db-instance-identifier dev-acrique-postgres --region ap-northeast-1

# 2. RDSがavailableになるまで待機
echo "RDSの起動を待機中..."
aws rds wait db-instance-available --db-instance-identifier dev-acrique-postgres --region ap-northeast-1

# 3. ECSタスクを起動
aws ecs update-service --cluster dev-acrique-cluster --service dev-acrique-backend --desired-count 1 --region ap-northeast-1

# 4. Bastionを起動（必要な場合）
BASTION_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=*bastion*" "Name=instance-state-name,Values=stopped" \
  --query 'Reservations[0].Instances[0].InstanceId' \
  --output text --region ap-northeast-1)
[ "$BASTION_ID" != "None" ] && aws ec2 start-instances --instance-ids $BASTION_ID --region ap-northeast-1

echo "全リソースの起動が完了しました"
```

---

## 🔧 運用コマンド集

### リソース状態確認

```bash
# 全スタックの状態確認
aws cloudformation list-stacks \
  --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE \
  --query 'StackSummaries[?starts_with(StackName, `dev-`)].{Name:StackName,Status:StackStatus}' \
  --region ap-northeast-1

# RDS状態確認
aws rds describe-db-instances \
  --query 'DBInstances[*].{ID:DBInstanceIdentifier,Status:DBInstanceStatus,Class:DBInstanceClass}' \
  --region ap-northeast-1

# ECSサービス状態確認
aws ecs list-services --cluster dev-acrique-cluster --region ap-northeast-1
aws ecs describe-services \
  --cluster dev-acrique-cluster \
  --services dev-acrique-backend \
  --query 'services[0].{name:serviceName,desired:desiredCount,running:runningCount,status:status}' \
  --region ap-northeast-1

# EC2インスタンス状態確認
aws ec2 describe-instances \
  --filters "Name=tag:Project,Values=acrique" \
  --query 'Reservations[*].Instances[*].{ID:InstanceId,Name:Tags[?Key==`Name`].Value|[0],State:State.Name,Type:InstanceType}' \
  --output table \
  --region ap-northeast-1
```

### ログ確認

```bash
# ECSタスクのログを確認（直近30分）
aws logs filter-log-events \
  --log-group-name /ecs/dev-acrique-backend \
  --start-time $(( $(date +%s) - 1800 ))000 \
  --region ap-northeast-1

# RDSのログを確認
aws rds describe-db-log-files \
  --db-instance-identifier dev-acrique-postgres \
  --region ap-northeast-1
```

### データベース接続（Bastion経由）

```bash
# SSM Session Manager経由でBastionに接続
BASTION_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=*bastion*" "Name=instance-state-name,Values=running" \
  --query 'Reservations[0].Instances[0].InstanceId' \
  --output text \
  --region ap-northeast-1)

aws ssm start-session --target $BASTION_ID --region ap-northeast-1

# Bastion内でPostgreSQLに接続
# psql -h <RDS_ENDPOINT> -U postgres -d acrique
```

### S3操作

```bash
# バケット一覧
aws s3 ls | grep acrique

# バケット内のオブジェクト一覧
aws s3 ls s3://dev-acrique-storage/products/ --recursive

# ローカルからS3にアップロード
aws s3 cp ./image.jpg s3://dev-acrique-storage/products/

# S3からローカルにダウンロード
aws s3 cp s3://dev-acrique-storage/products/image.jpg ./
```

### デプロイ関連

```bash
# ECRにログイン
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com

# 最新イメージでECSサービスを強制デプロイ
aws ecs update-service \
  --cluster dev-acrique-cluster \
  --service dev-acrique-backend \
  --force-new-deployment \
  --region ap-northeast-1
```

---

## 🗑️ リソース削除

### 特定スタックの削除

```bash
# スタックを削除
cdk destroy dev-BackendStack --context env=dev

# 全スタックを削除（注意：データも削除される）
cdk destroy --all --context env=dev
```

### 手動でのリソースクリーンアップ

```bash
# S3バケットを空にする（削除前に必要）
aws s3 rm s3://dev-acrique-storage --recursive

# ECRイメージを削除
aws ecr batch-delete-image \
  --repository-name dev-acrique-backend \
  --image-ids "$(aws ecr list-images --repository-name dev-acrique-backend --query 'imageIds[*]' --output json)" \
  --region ap-northeast-1
```

---

## 📖 関連ドキュメント

詳細は [`../docs/rules`](../docs/rules) を参照してください。

- **[アーキテクチャ](../docs/rules/architecture/INFRASTRUCTURE.md)** - システム設計
- **[デプロイガイド](../docs/rules/operations/DEPLOYMENT.md)** - デプロイ手順
- **[クイックスタート](../docs/rules/operations/QUICK_START.md)** - 初期セットアップ
- **[変更ログ](./CHANGELOG_DATABASE.md)** - データベース設定の変更履歴

---

**最終更新**: 2026-01-10
**バージョン**: 2.3.0 (コスト管理・運用コマンド追加)
