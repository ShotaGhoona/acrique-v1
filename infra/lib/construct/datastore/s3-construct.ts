import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';

/**
 * CORS設定
 */
export interface S3CorsConfig {
  /**
   * 許可するオリジン
   * @example ['https://example.com', 'http://localhost:3000']
   */
  allowedOrigins: string[];
  /**
   * 許可するHTTPメソッド
   * @default [GET]
   */
  allowedMethods?: s3.HttpMethods[];
  /**
   * 許可するヘッダー
   * @default ['*']
   */
  allowedHeaders?: string[];
  /**
   * 公開するヘッダー
   * @default ['ETag']
   */
  exposedHeaders?: string[];
  /**
   * プリフライトキャッシュ時間（秒）
   * @default 3600
   */
  maxAge?: number;
}

export interface S3ConstructProps {
  /**
   * バケット名
   */
  bucketName: string;
  /**
   * バージョニング有効化
   * @default true
   */
  versioned?: boolean;
  /**
   * 削除ポリシー
   * @default RETAIN（本番環境推奨）
   */
  removalPolicy?: RemovalPolicy;
  /**
   * パブリックアクセス設定
   * @default すべてブロック（セキュア）
   */
  publicReadAccess?: boolean;
  /**
   * CORS設定
   * Presigned URLでのアップロードに必要
   */
  cors?: S3CorsConfig;
}

/**
 * レイヤー1: S3バケットConstruct（単一リソース）
 * 
 * 責務: 単一のS3バケットをセキュアなデフォルト設定で抽象化
 * - デフォルトでパブリックアクセス完全ブロック
 * - サーバーサイド暗号化強制
 * - 誤ったパブリック公開を防止
 * 
 * 変更頻度: ほぼなし（AWSベストプラクティスの更新時のみ）
 */
export class S3Construct extends Construct {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: S3ConstructProps) {
    super(scope, id);

    // CORS設定を構築
    const corsRules: s3.CorsRule[] | undefined = props.cors
      ? [
          {
            allowedOrigins: props.cors.allowedOrigins,
            allowedMethods: props.cors.allowedMethods ?? [s3.HttpMethods.GET],
            allowedHeaders: props.cors.allowedHeaders ?? ['*'],
            exposedHeaders: props.cors.exposedHeaders ?? ['ETag'],
            maxAge: props.cors.maxAge ?? 3600,
          },
        ]
      : undefined;

    // S3 Bucket（L2コンストラクト）
    this.bucket = new s3.Bucket(this, 'Bucket', {
      bucketName: props.bucketName,
      // セキュアなデフォルト設定
      encryption: s3.BucketEncryption.S3_MANAGED, // サーバーサイド暗号化
      blockPublicAccess: props.publicReadAccess
        ? s3.BlockPublicAccess.BLOCK_ACLS
        : s3.BlockPublicAccess.BLOCK_ALL, // パブリックアクセスブロック
      versioned: props.versioned ?? true, // デフォルトでバージョニング有効
      removalPolicy: props.removalPolicy || RemovalPolicy.RETAIN,
      autoDeleteObjects: props.removalPolicy === RemovalPolicy.DESTROY,
      enforceSSL: true, // HTTPS接続を強制
      cors: corsRules, // CORS設定
    });
  }
}

