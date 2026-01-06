import logging
import uuid
from datetime import datetime

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

from app.application.interfaces.storage_service import IStorageService, PresignedUrlResult
from app.config import get_settings

logger = logging.getLogger(__name__)


class S3StorageService(IStorageService):
    """S3を使用したストレージサービスの実装"""

    def __init__(self):
        settings = get_settings()
        self.bucket_name = settings.s3_bucket_name
        self.region = settings.aws_region
        self.expiration = settings.s3_presigned_url_expiration

        # S3クライアントの初期化
        self.s3_client = boto3.client(
            's3',
            region_name=self.region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
            config=Config(signature_version='s3v4'),
        )

    def generate_presigned_upload_url(
        self,
        file_name: str,
        content_type: str,
        folder: str = 'uploads',
    ) -> PresignedUrlResult:
        """署名付きアップロードURLを生成"""
        # ユニークなキーを生成
        timestamp = datetime.now().strftime('%Y%m%d')
        unique_id = uuid.uuid4().hex[:8]
        extension = file_name.split('.')[-1] if '.' in file_name else ''
        key = f'{folder}/{timestamp}/{unique_id}.{extension}' if extension else f'{folder}/{timestamp}/{unique_id}'

        try:
            # 署名付きアップロードURLを生成
            upload_url = self.s3_client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': key,
                    'ContentType': content_type,
                },
                ExpiresIn=self.expiration,
            )

            # 公開URL（アップロード完了後にアクセスできるURL）
            file_url = f'https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{key}'

            logger.info(f'Generated presigned URL for key: {key}')

            return PresignedUrlResult(
                upload_url=upload_url,
                file_url=file_url,
                key=key,
            )

        except ClientError as e:
            logger.error(f'Failed to generate presigned URL: {e}')
            raise

    def delete_file(self, key: str) -> bool:
        """ファイルを削除"""
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=key,
            )
            logger.info(f'Deleted file: {key}')
            return True
        except ClientError as e:
            logger.error(f'Failed to delete file {key}: {e}')
            return False
