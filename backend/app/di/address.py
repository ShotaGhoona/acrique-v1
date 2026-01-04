"""配送先依存性注入設定"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.address_usecase import AddressUsecase
from app.di import get_db
from app.infrastructure.db.repositories.address_repository_impl import (
    AddressRepositoryImpl,
)


def get_address_usecase(session: Session = Depends(get_db)) -> AddressUsecase:
    """AddressUsecaseを取得（依存性注入）"""
    address_repository = AddressRepositoryImpl(session)

    return AddressUsecase(address_repository=address_repository)
