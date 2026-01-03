"""認証トークンDBモデル"""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func

from app.infrastructure.db.models.base import Base


class VerificationTokenModel(Base):
    """認証トークンテーブル（メール認証・パスワードリセット共用）"""

    __tablename__ = 'verification_tokens'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    token = Column(String(255), unique=True, nullable=False, index=True)
    token_type = Column(String(50), nullable=False)  # email_verification / password_reset
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
