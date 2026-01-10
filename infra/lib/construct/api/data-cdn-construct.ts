import { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Duration } from 'aws-cdk-lib';

export interface DataCdnConstructProps {
  /**
   * オリジンとなるS3バケット
   */
  originBucket: s3.IBucket;
  /**
   * コメント
   */
  comment?: string;
  /**
   * CORS許可オリジン
   * @example ['https://example.com', 'http://localhost:3000']
   */
  corsAllowedOrigins?: string[];
}

/**
 * レイヤー1: データ配信用CloudFront Construct（単一リソース）
 *
 * 責務: S3データバケット（画像等）のCDN配信
 * - OAC（Origin Access Control）でS3へのセキュアなアクセス
 * - CORS対応（クロスオリジンからの画像読み込み）
 * - キャッシュ最適化
 *
 * SPAフロントエンド用のCloudFrontConstructとは異なり：
 * - デフォルトルートオブジェクトなし
 * - 403/404のSPAリダイレクトなし
 * - CORSヘッダーを付与
 *
 * 変更頻度: ほぼなし
 */
export class DataCdnConstruct extends Construct {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: DataCdnConstructProps) {
    super(scope, id);

    // CORS対応のレスポンスヘッダーポリシー
    const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(
      this,
      'CorsHeadersPolicy',
      {
        responseHeadersPolicyName: `${props.originBucket.bucketName}-cors-policy`,
        comment: 'CORS headers for data CDN',
        corsBehavior: {
          accessControlAllowCredentials: false,
          accessControlAllowHeaders: ['*'],
          accessControlAllowMethods: ['GET', 'HEAD'],
          accessControlAllowOrigins: props.corsAllowedOrigins || ['*'],
          accessControlMaxAge: Duration.seconds(86400),
          originOverride: true,
        },
      }
    );

    // CloudFront Distribution（OACを使用）
    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(
          props.originBucket
        ),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        responseHeadersPolicy: responseHeadersPolicy,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
      },
      comment: props.comment || 'Data CDN Distribution',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200, // 日本を含むエッジロケーション
    });
  }
}
