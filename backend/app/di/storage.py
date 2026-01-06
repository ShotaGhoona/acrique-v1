"""ストレージサービスの依存性注入"""

from app.application.interfaces.storage_service import IStorageService
from app.infrastructure.storage.s3_storage_service import S3StorageService


def get_storage_service() -> IStorageService:
    """StorageServiceを取得"""
    return S3StorageService()
