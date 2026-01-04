"""商品依存性注入設定"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.product_usecase import ProductUsecase
from app.di import get_db
from app.infrastructure.db.repositories.product_repository_impl import (
    ProductRepositoryImpl,
)


def get_product_usecase(session: Session = Depends(get_db)) -> ProductUsecase:
    """ProductUsecaseを取得（依存性注入）"""
    product_repository = ProductRepositoryImpl(session)

    return ProductUsecase(
        product_repository=product_repository,
    )
