"""Admin入稿データ管理の依存性注入設定"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.admin.admin_upload_usecase import AdminUploadUsecase
from app.di import get_db
from app.infrastructure.db.repositories.order_repository_impl import (
    OrderRepositoryImpl,
)
from app.infrastructure.db.repositories.upload_repository_impl import (
    UploadRepositoryImpl,
)


def get_admin_upload_usecase(session: Session = Depends(get_db)) -> AdminUploadUsecase:
    """AdminUploadUsecaseを取得（依存性注入）"""
    upload_repository = UploadRepositoryImpl(session)
    order_repository = OrderRepositoryImpl(session)

    return AdminUploadUsecase(
        upload_repository=upload_repository,
        order_repository=order_repository,
    )
