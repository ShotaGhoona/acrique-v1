"""商品マスタDBモデル"""

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.infrastructure.db.models.base import Base


class ProductMasterModel(Base):
    """商品マスタテーブル"""

    __tablename__ = 'product_masters'

    id = Column(String(100), primary_key=True)
    name = Column(String(200), nullable=False)
    name_en = Column(String(200), nullable=True)
    model_category = Column(String(50), nullable=True, index=True)
    tagline = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    base_lead_time_days = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # リレーション（商品がこのマスタを参照）
    products = relationship('ProductModel', back_populates='master')
