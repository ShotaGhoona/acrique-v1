"""顧客管理DI設定"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.admin.admin_user_usecase import AdminUserUsecase
from app.di import get_db
from app.infrastructure.db.repositories.order_repository_impl import OrderRepositoryImpl
from app.infrastructure.db.repositories.user_repository_impl import UserRepositoryImpl


def get_admin_user_usecase(session: Session = Depends(get_db)) -> AdminUserUsecase:
    """AdminUserUsecaseを取得（依存性注入）

    Args:
        session: DBセッション

    Returns:
        AdminUserUsecaseインスタンス
    """
    return AdminUserUsecase(
        user_repository=UserRepositoryImpl(session),
        order_repository=OrderRepositoryImpl(session),
    )
