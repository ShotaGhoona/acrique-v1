"""入稿データ依存性注入設定"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.upload_usecase import UploadUsecase
from app.di import get_db
from app.infrastructure.db.repositories.upload_repository_impl import (
    UploadRepositoryImpl,
)
from app.infrastructure.storage.s3_service import S3Service


def get_upload_usecase(session: Session = Depends(get_db)) -> UploadUsecase:
    """UploadUsecaseを取得（依存性注入）"""
    upload_repository = UploadRepositoryImpl(session)
    storage_service = S3Service()

    return UploadUsecase(
        upload_repository=upload_repository,
        storage_service=storage_service,
    )
