import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { RemovalPolicy } from 'aws-cdk-lib';
import { EnvironmentConfig } from './environment';

/**
 * 本番環境設定
 */
export const prodConfig: EnvironmentConfig = {
  envName: 'prod',
  account: process.env.CDK_DEFAULT_ACCOUNT || '',
  region: process.env.CDK_DEFAULT_REGION || 'ap-northeast-1',
  removalPolicy: RemovalPolicy.RETAIN, // 本番環境は保持

  vpc: {
    cidr: '10.1.0.0/16',
    maxAzs: 2,
    natGateways: 2, // AZごとにNAT Gateway
  },

  network: {
    cidr: '10.1.0.0/16',
    maxAzs: 2,
    natGateways: 2, // AZごとにNAT Gateway
  },

  database: {
    // 💡 本番環境: Auroraを使用（高可用性）
    enableDynamo: false, // DynamoDBが必要な場合はtrue
    enableAurora: true, // 本番: Auroraを使用
    enableRds: false, // Auroraを使うのでRDSは無効
    engine: 'postgres',
    instanceType: ec2.InstanceType.of(
      ec2.InstanceClass.R6G,
      ec2.InstanceSize.LARGE // 本番環境は高性能
    ),
    multiAz: true, // 本番環境はマルチAZ
    allocatedStorageGb: 500, // 本番環境は大容量
    readerCount: 2, // Reader 2台（Auroraのみ）
    backupRetentionDays: 30,
    autoMinorVersionUpgrade: false, // 本番環境は手動でバージョン管理
  },

  ecs: {
    backend: {
      cpu: 1024,
      memory: 2048,
      desiredCount: 4, // 本番環境は冗長構成
      minCount: 2,
      maxCount: 10,
    },
    frontend: {
      cpu: 512,
      memory: 1024,
      desiredCount: 4,
      minCount: 2,
      maxCount: 10,
    },
  },

  frontend: {
    type: 'amplify', // 💡 本番: Amplifyで簡単運用
    // GitHubリポジトリを設定する場合はコメントを外す
    // githubRepo: 'owner/repo-name',
    // githubBranch: 'main',
  },

  // 💡 本番環境でもLambdaを無効化（ECSで統一）
  // Lambda が必要な場合は、この設定を有効化してください
  // lambda: {
  //   memorySize: 512,
  //   timeout: 60,
  //   reservedConcurrency: 100,
  // },

  // 💡 WAF設定（本番環境推奨）
  // ALBとCloudFrontにAWS WAFを適用し、以下の攻撃を防御:
  // - OWASP Top 10（SQLインジェクション、XSS等）
  // - 既知の悪意あるIPからのアクセス
  // - DDoS攻撃（レートリミット）
  //
  // 有効化する場合は以下のコメントを解除してください:
  // waf: {
  //   enabled: true,
  //   rateLimit: 2000, // 5分間あたりのリクエスト数
  //   enableBotControl: false, // Bot Control（追加コスト発生）
  // },

  // 💡 Cognito設定
  // SMS認証を有効にすると電話番号でのサインイン・MFA・アカウント回復が可能
  // 注意: SMS送信にはSNS経由での課金が発生します
  //
  // 有効化する場合は以下のコメントを解除してください:
  // cognito: {
  //   enableSmsAuth: true,
  //   smsExternalId: 'MyApp', // SMSの送信元として表示される名前
  // },

  // 💡 ロギング設定（本番環境推奨）
  // コンプライアンス対応・障害調査のためログを長期保存
  logging: {
    enableAlbLogs: true, // ALBアクセスログ
    retentionDays: 90, // 90日間保持（コンプライアンス要件に応じて調整）
    glacierTransitionDays: 30, // 30日後にGlacierへ移行（コスト最適化）
  },

  // 💡 Bastion（踏み台サーバー）設定
  // 本番環境ではセキュリティ上の理由でデフォルト無効
  // 必要な場合のみ有効化し、SSH接続元を制限することを推奨
  // bastion: {
  //   enabled: true,
  //   enableSsm: true,
  //   allowSshFrom: '203.0.113.0/24', // オフィスIPのみ許可
  // },

  // 💡 Batch（バッチ処理）設定
  // 本番環境のバッチ処理
  // batch: {
  //   enabled: true,
  //   cpu: 1024, // 1 vCPU
  //   memory: 2048, // 2 GB
  //   useExistingCluster: false, // Batch専用クラスターを作成（リソース分離）
  // },

  tags: {
    Environment: 'prod',
    Project: 'cdk-template',
    ManagedBy: 'CDK',
    CostCenter: 'production',
  },
};

