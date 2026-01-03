"""商品DI（依存性注入）"""

from collections.abc import Generator

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.product_usecase import ProductUsecase
from app.infrastructure.db.repositories.product_repository_impl import ProductRepositoryImpl
from app.infrastructure.db.session import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """DBセッションを取得"""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def get_product_usecase(session: Session = Depends(get_db)) -> ProductUsecase:
    """ProductUsecaseを取得（依存性注入）"""
    product_repository = ProductRepositoryImpl(session)

    return ProductUsecase(
        product_repository=product_repository,
    )
