"""Adminダッシュボードの依存性注入"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.admin.admin_dashboard_usecase import AdminDashboardUsecase
from app.di import get_db
from app.infrastructure.db.repositories.order_repository_impl import OrderRepositoryImpl
from app.infrastructure.db.repositories.user_repository_impl import UserRepositoryImpl


def get_admin_dashboard_usecase(
    session: Session = Depends(get_db),
) -> AdminDashboardUsecase:
    """AdminDashboardUsecaseを取得"""
    order_repository = OrderRepositoryImpl(session)
    user_repository = UserRepositoryImpl(session)
    return AdminDashboardUsecase(
        order_repository=order_repository,
        user_repository=user_repository,
    )
