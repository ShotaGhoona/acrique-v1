"""認証依存性注入設定"""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.auth_usecase import AuthUsecase
from app.di import get_db
from app.infrastructure.db.repositories.user_repository_impl import UserRepositoryImpl
from app.infrastructure.db.repositories.verification_token_repository_impl import (
    VerificationTokenRepositoryImpl,
)
from app.infrastructure.email.resend_email_service import ResendEmailService
from app.infrastructure.security.security_service_impl import SecurityServiceImpl


def get_auth_usecase(session: Session = Depends(get_db)) -> AuthUsecase:
    """AuthUsecaseを取得（依存性注入）"""
    security_service = SecurityServiceImpl()
    user_repository = UserRepositoryImpl(session)
    token_repository = VerificationTokenRepositoryImpl(session)
    email_service = ResendEmailService()

    return AuthUsecase(
        security_service=security_service,
        user_repository=user_repository,
        token_repository=token_repository,
        email_service=email_service,
    )
