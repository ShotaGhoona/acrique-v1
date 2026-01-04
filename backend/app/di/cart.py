"""カート依存性注入設定"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.cart_usecase import CartUsecase
from app.di import get_db
from app.infrastructure.db.repositories.cart_item_repository_impl import (
    CartItemRepositoryImpl,
)
from app.infrastructure.db.repositories.product_repository_impl import (
    ProductRepositoryImpl,
)


def get_cart_usecase(session: Session = Depends(get_db)) -> CartUsecase:
    """CartUsecaseを取得（依存性注入）"""
    cart_item_repository = CartItemRepositoryImpl(session)
    product_repository = ProductRepositoryImpl(session)

    return CartUsecase(
        cart_item_repository=cart_item_repository,
        product_repository=product_repository,
    )
