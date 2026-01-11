# Infrastructure タスクチェックリスト

AWS CDK による ACRIQUE インフラ構築の進捗管理

---

## 凡例

- ⬜ 未着手
- ✅ 完了

---

# 初期セットアップ

| 状況 | タスク |
|------|--------|
| ✅ | AWSアカウント作成 |
| ✅ | IAMユーザー作成（acrique-deploy） |
| ✅ | AWS CLI インストール |
| ✅ | AWS CLI 設定（credentials） |
| ✅ | CDK CLI インストール |
| ✅ | CDK Bootstrap |

---

# CDK スタック

## FoundationStack（ネットワーク基盤）

| 状況 | タスク |
|------|--------|
| ✅ | VPC作成 |
| ✅ | パブリックサブネット |
| ✅ | プライベートサブネット |
| ✅ | NAT Gateway |
| ✅ | Internet Gateway |
| ✅ | Bastion Host（踏み台） |

---

## SecurityStack（セキュリティ）

| 状況 | タスク |
|------|--------|
| ✅ | IAMロール |
| ✅ | Cognito User Pool |
| ✅ | Secrets Manager |

---

## DataStorageStack（データベース）

| 状況 | タスク |
|------|--------|
| ✅ | RDS PostgreSQL |
| ✅ | DB認証情報（Secrets Manager） |
| ✅ | セキュリティグループ |
| ✅ | マイグレーション実行 |
| ✅ | 初期データ投入 |

---

## ObjectStorageStack（オブジェクトストレージ）

| 状況 | タスク |
|------|--------|
| ✅ | S3バケット作成 |
| ✅ | ライフサイクルポリシー |
| ✅ | CORS設定 |
| ✅ | CloudFront連携（OAC） |

---

## IntegrationStack（統合）

| 状況 | タスク |
|------|--------|
| ✅ | SQS キュー |
| ✅ | SNS トピック |
| ✅ | Dead Letter Queue |

---

## BackendStack（バックエンドAPI）

| 状況 | タスク |
|------|--------|
| ✅ | ECRリポジトリ |
| ✅ | ECSクラスター |
| ✅ | ECS Fargateサービス |
| ✅ | タスク定義 |
| ✅ | ALB（ロードバランサー） |
| ✅ | ヘルスチェック設定 |
| ✅ | 環境変数設定（POSTGRES_*） |
| ✅ | CORS設定（Amplify URL追加） |
| ⬜ | Auto Scaling |
| ⬜ | WAF設定 |

---

## FrontendStack（フロントエンド）

| 状況 | タスク | 備考 |
|------|--------|------|
| ⬜ | Amplify App作成（CDK） | GitHub連携の認証が必要 |
| ✅ | Amplify App作成（コンソール） | 手動設定で対応 |
| ✅ | GitHub連携 |  |
| ✅ | 環境変数設定 |  |
| ✅ | 自動ビルド＆デプロイ |  |
| ⬜ | カスタムドメイン |  |

---

## ObservabilityStack（監視）

| 状況 | タスク |
|------|--------|
| ✅ | CloudWatch Dashboard |
| ✅ | ECS CPU アラーム |
| ✅ | RDS CPU アラーム |
| ✅ | ALB メトリクス |
| ⬜ | SNS通知設定 |

---

# 運用タスク

## CI/CD

| 状況 | タスク |
|------|--------|
| ⬜ | GitHub Actions（バックエンド） |
| ⬜ | GitHub Actions（インフラ） |
| ⬜ | 自動テスト |
| ⬜ | 自動デプロイ |

---

## セキュリティ

| 状況 | タスク |
|------|--------|
| ⬜ | HTTPS化（ACM証明書） |
| ⬜ | カスタムドメイン設定 |
| ⬜ | WAF有効化 |
| ⬜ | セキュリティグループ見直し |

---

## 本番環境準備

| 状況 | タスク |
|------|--------|
| ⬜ | prod環境設定ファイル作成 |
| ⬜ | Multi-AZ RDS |
| ⬜ | Auto Scaling設定 |
| ⬜ | バックアップ設定 |
| ⬜ | 災害復旧計画 |

---

# 学習ドキュメント

| 状況 | ドキュメント |
|------|-------------|
| ✅ | 01-インフラ入門 |
| ✅ | 02-Docker入門 |
| ✅ | 03-AWS基礎 |
| ✅ | 04-CDK入門 |
| ✅ | 04-1-CDKデプロイログの読み方 |
| ✅ | 12-AWSの制約と落とし穴 |
| ✅ | 13-AWSコスト最適化 |
| ✅ | 14-セキュリティベストプラクティス |
| ✅ | 15-CloudFormation |
| ✅ | 16-CloudFront |
| ✅ | 17-Route53 |
| ✅ | 18-Lambda |
| ✅ | 19-API Gateway |
| ✅ | 21-AWSサービス全体マップ |
| ✅ | 21-1-Dockerマルチアーキテクチャ問題 |
| ✅ | 22-RDSマイグレーション手順 |

---

# URL一覧

| リソース | URL |
|---------|-----|
| バックエンドAPI | http://dev-acrique-v1-alb-1256355443.ap-northeast-1.elb.amazonaws.com |
| フロントエンド | https://main.d17fbeoc59o61t.amplifyapp.com |
| CloudWatch Dashboard | https://console.aws.amazon.com/cloudwatch/home?region=ap-northeast-1#dashboards:name=dev-acrique-v1-dashboard |

---

# 次のマイルストーン

1. ✅ RDSマイグレーション実行
2. ✅ 初期データ投入
3. ✅ フロントエンド動作確認（CORS修正済み）
4. ⬜ CI/CD構築
5. ⬜ カスタムドメイン＆HTTPS化
