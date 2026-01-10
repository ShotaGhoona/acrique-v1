import { Construct } from 'constructs';
import { S3Construct, S3CorsConfig } from '../construct/datastore/s3-construct';
import { DataCdnConstruct } from '../construct/api/data-cdn-construct';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { RemovalPolicy } from 'aws-cdk-lib';

export interface ObjectStorageResourceProps {
  /**
   * S3バケット名
   */
  bucketName: string;
  /**
   * 削除ポリシー
   * @default DESTROY（開発環境）
   */
  removalPolicy?: RemovalPolicy;
  /**
   * バージョニングを有効化
   * @default true
   */
  versioned?: boolean;
  /**
   * 暗号化を有効化
   * @default true
   */
  encrypted?: boolean;
  /**
   * CORS設定
   * Presigned URLでのアップロードに必要
   */
  cors?: S3CorsConfig;
  /**
   * CDN（CloudFront）を有効化
   * 有効にするとS3への直接アクセスではなくCloudFront経由でのアクセスになる
   * @default false
   */
  enableCdn?: boolean;
  /**
   * CDNのCORS許可オリジン
   * enableCdn: true の場合に使用
   */
  cdnCorsAllowedOrigins?: string[];
}

/**
 * レイヤー2: オブジェクトストレージResource（機能単位）
 *
 * 責務: オブジェクトストレージの提供
 * - S3バケット（データバケット、アセット等）
 * - CloudFront CDN（オプション、enableCdn: true で有効化）
 *
 * 含まれるConstruct: S3Construct, DataCdnConstruct
 *
 * 変更頻度: まれ（バケット追加時）
 */
export class ObjectStorageResource extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly distribution?: cloudfront.Distribution;
  public readonly cdnDomainName?: string;

  constructor(scope: Construct, id: string, props: ObjectStorageResourceProps) {
    super(scope, id);

    // S3バケットの作成
    const s3Construct = new S3Construct(this, 'S3Construct', {
      bucketName: props.bucketName,
      removalPolicy: props.removalPolicy,
      versioned: props.versioned,
      cors: props.cors,
    });
    this.bucket = s3Construct.bucket;

    // CDN（CloudFront）の作成（有効な場合）
    if (props.enableCdn) {
      const cdnConstruct = new DataCdnConstruct(this, 'DataCdn', {
        originBucket: this.bucket,
        comment: `CDN for ${props.bucketName}`,
        corsAllowedOrigins: props.cdnCorsAllowedOrigins,
      });
      this.distribution = cdnConstruct.distribution;
      this.cdnDomainName = cdnConstruct.distribution.distributionDomainName;
      console.log(`✅ CloudFront CDN created for: ${props.bucketName}`);
    }

    console.log(`✅ S3 bucket created: ${props.bucketName}`);
  }
}

