"""S3ストレージサービス実装"""

import uuid
from urllib.parse import urlparse

import boto3
from botocore.config import Config as BotoConfig
from botocore.exceptions import ClientError

from app.application.interfaces.storage_service import IStorageService, PresignedUrlResult
from app.config import get_settings

# 許可するContent-Type
ALLOWED_CONTENT_TYPES = frozenset(
    [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
    ]
)

# Presigned URLの有効期限（秒）
PRESIGNED_URL_EXPIRES_IN = 3600  # 1時間


class S3Service(IStorageService):
    """S3ストレージサービス

    AWS S3へのファイルアップロード・削除を行う。
    Presigned URLを使用してフロントエンドから直接S3にアップロードさせる方式。
    """

    def __init__(self) -> None:
        settings = get_settings()
        self._bucket_name = settings.aws_s3_bucket_name
        self._region = settings.aws_s3_region
        self._cdn_domain_name = settings.cdn_domain_name

        # boto3クライアント設定
        boto_config = BotoConfig(
            region_name=self._region,
            signature_version='s3v4',
            s3={
                'addressing_style': 'virtual',
            },
        )

        # リージョナルエンドポイントURL
        endpoint_url = f'https://s3.{self._region}.amazonaws.com'

        # 認証情報の設定
        # ECS環境ではIAMロールから自動取得されるため、明示的なキーは不要
        if settings.aws_access_key_id and settings.aws_secret_access_key:
            self._s3_client = boto3.client(
                's3',
                region_name=self._region,
                endpoint_url=endpoint_url,
                config=boto_config,
                aws_access_key_id=settings.aws_access_key_id,
                aws_secret_access_key=settings.aws_secret_access_key,
            )
        else:
            # IAMロールからの自動認証（ECS/EC2環境）
            self._s3_client = boto3.client(
                's3',
                region_name=self._region,
                endpoint_url=endpoint_url,
                config=boto_config,
            )

    def generate_presigned_url(
        self,
        file_name: str,
        content_type: str,
        folder: str = 'products',
    ) -> PresignedUrlResult:
        """アップロード用のPresigned URLを生成

        Args:
            file_name: ファイル名（拡張子含む）
            content_type: MIMEタイプ（例: 'image/jpeg'）
            folder: 保存先フォルダ（デフォルト: 'products'）

        Returns:
            PresignedUrlResult: アップロードURL、ファイルURL、有効期限

        Raises:
            ValueError: 許可されていないContent-Typeの場合
        """
        # Content-Typeのバリデーション
        if content_type not in ALLOWED_CONTENT_TYPES:
            raise ValueError(
                f'許可されていないファイル形式です: {content_type}. '
                f'許可されている形式: {", ".join(ALLOWED_CONTENT_TYPES)}'
            )

        # ユニークなファイル名を生成（UUIDを付与）
        unique_id = uuid.uuid4().hex[:12]
        # ファイル名から拡張子を取得
        extension = file_name.rsplit('.', 1)[-1].lower() if '.' in file_name else ''
        if extension:
            unique_file_name = f'{unique_id}.{extension}'
        else:
            unique_file_name = unique_id

        # S3キー（パス）を生成
        s3_key = f'{folder}/{unique_file_name}'

        # Presigned URL生成
        upload_url = self._s3_client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': self._bucket_name,
                'Key': s3_key,
                'ContentType': content_type,
            },
            ExpiresIn=PRESIGNED_URL_EXPIRES_IN,
        )

        # アップロード後のファイルURL
        # CloudFront CDNが設定されている場合はCloudFront経由のURLを返す
        if self._cdn_domain_name:
            file_url = f'https://{self._cdn_domain_name}/{s3_key}'
        else:
            file_url = (
                f'https://{self._bucket_name}.s3.{self._region}.amazonaws.com/{s3_key}'
            )

        return PresignedUrlResult(
            upload_url=upload_url,
            file_url=file_url,
            expires_in=PRESIGNED_URL_EXPIRES_IN,
        )

    def delete_object(self, file_url: str) -> bool:
        """オブジェクトを削除

        Args:
            file_url: 削除するファイルのURL

        Returns:
            bool: 削除成功時True、失敗時False
        """
        # URLからS3キーを抽出
        s3_key = self._extract_s3_key(file_url)
        if not s3_key:
            # S3のURLでない場合はスキップ（外部URLの可能性）
            return False

        try:
            self._s3_client.delete_object(
                Bucket=self._bucket_name,
                Key=s3_key,
            )
            return True
        except ClientError:
            return False

    def _extract_s3_key(self, file_url: str) -> str | None:
        """URLからS3キーを抽出

        Args:
            file_url: ファイルURL

        Returns:
            str | None: S3キー、またはS3/CloudFrontのURLでない場合はNone
        """
        parsed = urlparse(file_url)

        # CloudFront URLの場合（CDNドメインが設定されている場合）
        if self._cdn_domain_name and self._cdn_domain_name in parsed.netloc:
            # CloudFront URL: https://xxx.cloudfront.net/products/abc.jpg
            return parsed.path.lstrip('/')

        # S3のURL形式かチェック
        # 形式1: https://bucket-name.s3.region.amazonaws.com/key
        # 形式2: https://s3.region.amazonaws.com/bucket-name/key
        if 's3' not in parsed.netloc and 'amazonaws.com' not in parsed.netloc:
            return None

        # バケット名がホストに含まれているかチェック
        if self._bucket_name in parsed.netloc:
            # 形式1: パスがそのままキー
            return parsed.path.lstrip('/')

        # 形式2の場合はパスの最初の部分がバケット名
        path_parts = parsed.path.lstrip('/').split('/', 1)
        if len(path_parts) == 2 and path_parts[0] == self._bucket_name:
            return path_parts[1]

        return None
