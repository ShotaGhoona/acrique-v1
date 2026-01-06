# Infrastructure タスクチェックリスト

AWS CDK による ACRIQUE インフラ構築の進捗管理

---

## 凡例

- [ ] 未着手
- [x] 完了

---

# 初期セットアップ

| タスク | 状況 |
|--------|------|
| AWSアカウント作成 | [x] |
| IAMユーザー作成（acrique-deploy） | [x] |
| AWS CLI インストール | [x] |
| AWS CLI 設定（credentials） | [x] |
| CDK CLI インストール | [x] |
| CDK Bootstrap | [x] |

---

# CDK スタック

## FoundationStack（ネットワーク基盤）

| タスク | 状況 |
|--------|------|
| VPC作成 | [x] |
| パブリックサブネット | [x] |
| プライベートサブネット | [x] |
| NAT Gateway | [x] |
| Internet Gateway | [x] |
| Bastion Host（踏み台） | [x] |

---

## SecurityStack（セキュリティ）

| タスク | 状況 |
|--------|------|
| IAMロール | [x] |
| Cognito User Pool | [x] |
| Secrets Manager | [x] |

---

## DataStorageStack（データベース）

| タスク | 状況 |
|--------|------|
| RDS PostgreSQL | [x] |
| DB認証情報（Secrets Manager） | [x] |
| セキュリティグループ | [x] |
| マイグレーション実行 | [x] |
| 初期データ投入 | [x] |

---

## ObjectStorageStack（オブジェクトストレージ）

| タスク | 状況 |
|--------|------|
| S3バケット作成 | [x] |
| ライフサイクルポリシー | [x] |
| CORS設定 | [ ] |
| CloudFront連携 | [ ] |

---

## IntegrationStack（統合）

| タスク | 状況 |
|--------|------|
| SQS キュー | [x] |
| SNS トピック | [x] |
| Dead Letter Queue | [x] |

---

## BackendStack（バックエンドAPI）

| タスク | 状況 |
|--------|------|
| ECRリポジトリ | [x] |
| ECSクラスター | [x] |
| ECS Fargateサービス | [x] |
| タスク定義 | [x] |
| ALB（ロードバランサー） | [x] |
| ヘルスチェック設定 | [x] |
| 環境変数設定（POSTGRES_*） | [x] |
| CORS設定（Amplify URL追加） | [x] |
| Auto Scaling | [ ] |
| WAF設定 | [ ] |

---

## FrontendStack（フロントエンド）

| タスク | 状況 | 備考 |
|--------|------|------|
| Amplify App作成（CDK） | [ ] | GitHub連携の認証が必要 |
| Amplify App作成（コンソール） | [x] | 手動設定で対応 |
| GitHub連携 | [x] |
| 環境変数設定 | [x] |
| 自動ビルド＆デプロイ | [x] |
| カスタムドメイン | [ ] |

---

## ObservabilityStack（監視）

| タスク | 状況 |
|--------|------|
| CloudWatch Dashboard | [x] |
| ECS CPU アラーム | [x] |
| RDS CPU アラーム | [x] |
| ALB メトリクス | [x] |
| SNS通知設定 | [ ] |

---

# 運用タスク

## CI/CD

| タスク | 状況 |
|--------|------|
| GitHub Actions（バックエンド） | [ ] |
| GitHub Actions（インフラ） | [ ] |
| 自動テスト | [ ] |
| 自動デプロイ | [ ] |

---

## セキュリティ

| タスク | 状況 |
|--------|------|
| HTTPS化（ACM証明書） | [ ] |
| カスタムドメイン設定 | [ ] |
| WAF有効化 | [ ] |
| セキュリティグループ見直し | [ ] |

---

## 本番環境準備

| タスク | 状況 |
|--------|------|
| prod環境設定ファイル作成 | [ ] |
| Multi-AZ RDS | [ ] |
| Auto Scaling設定 | [ ] |
| バックアップ設定 | [ ] |
| 災害復旧計画 | [ ] |

---

# 学習ドキュメント

| ドキュメント | 状況 |
|-------------|------|
| 01-インフラ入門 | [x] |
| 02-Docker入門 | [x] |
| 03-AWS基礎 | [x] |
| 04-CDK入門 | [x] |
| 04-1-CDKデプロイログの読み方 | [x] |
| 12-AWSの制約と落とし穴 | [x] |
| 13-AWSコスト最適化 | [x] |
| 14-セキュリティベストプラクティス | [x] |
| 15-CloudFormation | [x] |
| 16-CloudFront | [x] |
| 17-Route53 | [x] |
| 18-Lambda | [x] |
| 19-API Gateway | [x] |
| 21-AWSサービス全体マップ | [x] |
| 21-1-Dockerマルチアーキテクチャ問題 | [x] |
| 22-RDSマイグレーション手順 | [x] |

---

# URL一覧

| リソース | URL |
|---------|-----|
| バックエンドAPI | http://dev-acrique-v1-alb-1256355443.ap-northeast-1.elb.amazonaws.com |
| フロントエンド | https://main.d17fbeoc59o61t.amplifyapp.com |
| CloudWatch Dashboard | https://console.aws.amazon.com/cloudwatch/home?region=ap-northeast-1#dashboards:name=dev-acrique-v1-dashboard |

---

# 次のマイルストーン

1. [x] RDSマイグレーション実行
2. [x] 初期データ投入
3. [x] フロントエンド動作確認（CORS修正済み）
4. [ ] CI/CD構築
5. [ ] カスタムドメイン＆HTTPS化
