"""カートアイテムDBモデル"""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import JSONB

from app.infrastructure.db.models.base import Base


class CartItemModel(Base):
    """カートアイテムテーブル"""

    __tablename__ = 'cart_items'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    product_id = Column(
        String(100), ForeignKey('products.id'), nullable=False, index=True
    )
    quantity = Column(Integer, nullable=False, default=1)
    options = Column(JSONB, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )
