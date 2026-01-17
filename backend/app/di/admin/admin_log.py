"""Admin操作ログの依存性注入"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.admin.admin_log_usecase import AdminLogUsecase
from app.di import get_db
from app.infrastructure.db.repositories.admin_repository_impl import (
    AdminLogRepositoryImpl,
    AdminRepositoryImpl,
)


def get_admin_log_usecase(
    session: Session = Depends(get_db),
) -> AdminLogUsecase:
    """AdminLogUsecaseを取得"""
    admin_log_repository = AdminLogRepositoryImpl(session)
    admin_repository = AdminRepositoryImpl(session)
    return AdminLogUsecase(
        admin_log_repository=admin_log_repository,
        admin_repository=admin_repository,
    )
