"""商品マスタ依存性注入設定（公開API用）"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.catalog.product_master_usecase import ProductMasterUsecase
from app.di import get_db
from app.infrastructure.db.repositories.product_master_repository_impl import (
    ProductMasterRepositoryImpl,
)


def get_product_master_usecase(
    session: Session = Depends(get_db),
) -> ProductMasterUsecase:
    """ProductMasterUsecaseを取得（依存性注入）"""
    product_master_repository = ProductMasterRepositoryImpl(session)

    return ProductMasterUsecase(
        product_master_repository=product_master_repository,
    )
