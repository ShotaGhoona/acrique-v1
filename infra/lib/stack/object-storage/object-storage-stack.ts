import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EnvironmentConfig } from '../../../config/environment';
import { ObjectStorageResource } from '../../resource/object-storage-resource';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { S3CorsConfig } from '../../construct/datastore/s3-construct';

export interface ObjectStorageStackProps extends cdk.StackProps {
  // 将来的に追加の設定が必要になった場合に備える
}

/**
 * レイヤー3: ObjectStorage Stack（オブジェクトストレージスタック）
 *
 * 責務: オブジェクトストレージの提供
 * - S3バケット（データバケット、アセット等）
 *
 * 含まれるResource: ObjectStorageResource
 *
 * 変更頻度: 低（バケット追加時のみ）
 * デプロイ時間: 約1-2分
 *
 * スタック分離の理由:
 * - S3バケットは変更頻度が低い
 * - データベースと独立してデプロイ可能
 * - 削除ポリシーが異なる可能性がある
 */
export class ObjectStorageStack extends cdk.Stack {
  public readonly dataBucket: s3.Bucket;

  constructor(
    scope: Construct,
    id: string,
    config: EnvironmentConfig,
    props?: ObjectStorageStackProps
  ) {
    super(scope, id, props);

    // バケット名生成：環境名 + プロジェクト名（アカウントIDは自動で追加される）
    const bucketPrefix = `${config.envName}-acrique-v1-data`;

    // CORS設定を構築（環境設定から取得）
    const corsConfig: S3CorsConfig | undefined = config.objectStorage?.corsOrigins
      ? {
          allowedOrigins: config.objectStorage.corsOrigins,
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
          ],
          allowedHeaders: ['*'],
          exposedHeaders: ['ETag'],
          maxAge: 3600,
        }
      : undefined;

    // オブジェクトストレージリソースの作成（Resource層を使用）
    const objectStorage = new ObjectStorageResource(this, 'ObjectStorage', {
      bucketName: bucketPrefix, // CDKが自動でユニークなサフィックスを追加
      removalPolicy: config.removalPolicy,
      cors: corsConfig,
    });

    this.dataBucket = objectStorage.bucket;

    // タグ付け
    cdk.Tags.of(this).add('Environment', config.envName);
    cdk.Tags.of(this).add('Project', config.tags.Project);
    cdk.Tags.of(this).add('ManagedBy', config.tags.ManagedBy);
    cdk.Tags.of(this).add('StackType', 'ObjectStorage');

    // Outputs
    new cdk.CfnOutput(this, 'DataBucketName', {
      value: this.dataBucket.bucketName,
      description: 'S3 Data Bucket Name',
      exportName: `${config.envName}-DataBucketName`,
    });

    new cdk.CfnOutput(this, 'DataBucketArn', {
      value: this.dataBucket.bucketArn,
      description: 'S3 Data Bucket ARN',
      exportName: `${config.envName}-DataBucketArn`,
    });
  }
}
