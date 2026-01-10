"""決済依存性注入設定"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.payment_usecase import PaymentUsecase
from app.di import get_db
from app.infrastructure.db.repositories.order_repository_impl import (
    OrderRepositoryImpl,
)
from app.infrastructure.db.repositories.user_repository_impl import (
    UserRepositoryImpl,
)
from app.infrastructure.stripe.stripe_service_impl import StripeServiceImpl


def get_payment_usecase(session: Session = Depends(get_db)) -> PaymentUsecase:
    """PaymentUsecaseを取得（依存性注入）"""
    stripe_service = StripeServiceImpl()
    order_repository = OrderRepositoryImpl(session)
    user_repository = UserRepositoryImpl(session)

    return PaymentUsecase(
        stripe_service=stripe_service,
        order_repository=order_repository,
        user_repository=user_repository,
    )
