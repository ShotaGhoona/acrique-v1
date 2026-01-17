"""注文依存性注入設定"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.checkout.order_usecase import OrderUsecase
from app.di import get_db
from app.infrastructure.db.repositories.address_repository_impl import (
    AddressRepositoryImpl,
)
from app.infrastructure.db.repositories.cart_item_repository_impl import (
    CartItemRepositoryImpl,
)
from app.infrastructure.db.repositories.order_repository_impl import (
    OrderRepositoryImpl,
)
from app.infrastructure.db.repositories.product_repository_impl import (
    ProductRepositoryImpl,
)


def get_order_usecase(session: Session = Depends(get_db)) -> OrderUsecase:
    """OrderUsecaseを取得（依存性注入）"""
    order_repository = OrderRepositoryImpl(session)
    product_repository = ProductRepositoryImpl(session)
    cart_item_repository = CartItemRepositoryImpl(session)
    address_repository = AddressRepositoryImpl(session)

    return OrderUsecase(
        order_repository=order_repository,
        product_repository=product_repository,
        cart_item_repository=cart_item_repository,
        address_repository=address_repository,
    )
