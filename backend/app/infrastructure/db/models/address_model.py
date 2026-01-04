"""配送先DBモデル"""

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, func

from app.infrastructure.db.models.base import Base


class AddressModel(Base):
    """配送先テーブル"""

    __tablename__ = 'addresses'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    label = Column(String(50), nullable=True)
    name = Column(String(100), nullable=False)
    postal_code = Column(String(10), nullable=False)
    prefecture = Column(String(20), nullable=False)
    city = Column(String(100), nullable=False)
    address1 = Column(String(255), nullable=False)
    address2 = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=False)
    is_default = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
