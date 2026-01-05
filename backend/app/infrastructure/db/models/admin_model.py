"""管理者DBモデル"""

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.infrastructure.db.models.base import Base


class AdminModel(Base):
    """管理者モデル"""

    __tablename__ = 'admins'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False)  # super_admin/admin/staff
    is_active = Column(Boolean, nullable=False, server_default='true')
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    # リレーション
    logs = relationship(
        'AdminLogModel', back_populates='admin', cascade='all, delete-orphan'
    )


class AdminLogModel(Base):
    """管理者操作ログモデル"""

    __tablename__ = 'admin_logs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey('admins.id'), nullable=False, index=True)
    action = Column(String(50), nullable=False)  # login/logout/create/update/delete
    target_type = Column(String(50), nullable=False)  # admin/user/product/order
    target_id = Column(String(100), nullable=True)
    details = Column(JSONB, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now(), index=True)

    # リレーション
    admin = relationship('AdminModel', back_populates='logs')
