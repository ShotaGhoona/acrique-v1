"""Admin商品管理の依存性注入"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.admin.admin_product_usecase import AdminProductUsecase
from app.di import get_db
from app.infrastructure.db.repositories.product_repository_impl import (
    ProductRepositoryImpl,
)
from app.infrastructure.storage.s3_service import S3Service


def get_admin_product_usecase(
    session: Session = Depends(get_db),
) -> AdminProductUsecase:
    """AdminProductUsecaseを取得"""
    product_repository = ProductRepositoryImpl(session)
    storage_service = S3Service()
    return AdminProductUsecase(
        product_repository=product_repository,
        storage_service=storage_service,
    )
