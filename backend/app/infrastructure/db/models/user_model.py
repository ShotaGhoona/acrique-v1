"""ユーザーDBモデル"""

from sqlalchemy import Column, DateTime, Integer, String, func

from app.infrastructure.db.models.base import Base


class UserModel(Base):
    """ユーザーテーブル"""

    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(100), nullable=True)
    name_kana = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    company = Column(String(200), nullable=True)
    stripe_customer_id = Column(String(255), nullable=True)
    email_verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )
