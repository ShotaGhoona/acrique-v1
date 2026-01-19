"""Admin商品マスタ依存性注入設定"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.admin.admin_product_master_usecase import (
    AdminProductMasterUsecase,
)
from app.di import get_db
from app.infrastructure.db.repositories.product_master_repository_impl import (
    ProductMasterRepositoryImpl,
)


def get_admin_product_master_usecase(
    session: Session = Depends(get_db),
) -> AdminProductMasterUsecase:
    """AdminProductMasterUsecaseを取得（依存性注入）"""
    product_master_repository = ProductMasterRepositoryImpl(session)

    return AdminProductMasterUsecase(
        product_master_repository=product_master_repository,
    )
