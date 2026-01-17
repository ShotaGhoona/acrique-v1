"""Admin注文管理の依存性注入"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.admin.admin_order_usecase import AdminOrderUsecase
from app.di import get_db
from app.infrastructure.db.repositories.order_repository_impl import OrderRepositoryImpl


def get_admin_order_usecase(
    session: Session = Depends(get_db),
) -> AdminOrderUsecase:
    """AdminOrderUsecaseを取得"""
    order_repository = OrderRepositoryImpl(session)
    return AdminOrderUsecase(order_repository=order_repository)
