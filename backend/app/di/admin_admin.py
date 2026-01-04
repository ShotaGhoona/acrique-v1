"""管理者管理DI設定"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.admin_admin_usecase import AdminAdminUsecase
from app.di import get_db
from app.infrastructure.db.repositories.admin_repository_impl import (
    AdminLogRepositoryImpl,
    AdminRepositoryImpl,
)
from app.infrastructure.security.security_service_impl import SecurityServiceImpl


def get_admin_admin_usecase(session: Session = Depends(get_db)) -> AdminAdminUsecase:
    """AdminAdminUsecaseを取得（依存性注入）

    Args:
        session: DBセッション

    Returns:
        AdminAdminUsecaseインスタンス
    """
    return AdminAdminUsecase(
        admin_repository=AdminRepositoryImpl(session),
        admin_log_repository=AdminLogRepositoryImpl(session),
        security_service=SecurityServiceImpl(),
    )
