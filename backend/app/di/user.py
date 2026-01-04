from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.user_usecase import UserUsecase
from app.di.auth import get_db
from app.infrastructure.db.repositories.user_repository_impl import UserRepositoryImpl
from app.infrastructure.security.security_service_impl import SecurityServiceImpl


def get_user_usecase(session: Session = Depends(get_db)) -> UserUsecase:
    """UserUsecaseを取得（依存性注入）"""
    user_repository = UserRepositoryImpl(session)
    security_service = SecurityServiceImpl()

    return UserUsecase(
        user_repository=user_repository,
        security_service=security_service,
    )
