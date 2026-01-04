"""注文DBモデル"""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.infrastructure.db.models.base import Base


class OrderModel(Base):
    """注文テーブル"""

    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    order_number = Column(String(20), unique=True, nullable=False, index=True)
    status = Column(String(30), nullable=False, default='pending', index=True)
    shipping_address_id = Column(Integer, ForeignKey('addresses.id'), nullable=True)
    subtotal = Column(Integer, nullable=False, default=0)
    shipping_fee = Column(Integer, nullable=False, default=0)
    tax = Column(Integer, nullable=False, default=0)
    total = Column(Integer, nullable=False, default=0)
    payment_method = Column(String(30), nullable=True)
    stripe_payment_intent_id = Column(String(255), nullable=True)
    paid_at = Column(DateTime, nullable=True)
    confirmed_at = Column(DateTime, nullable=True)
    shipped_at = Column(DateTime, nullable=True)
    tracking_number = Column(String(100), nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)
    cancel_reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now(), index=True)
    updated_at = Column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )

    # リレーション
    items = relationship(
        'OrderItemModel', back_populates='order', cascade='all, delete-orphan'
    )
    user = relationship('UserModel', backref='orders')
    shipping_address = relationship('AddressModel', backref='orders')


class OrderItemModel(Base):
    """注文明細テーブル"""

    __tablename__ = 'order_items'

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=False, index=True)
    product_id = Column(
        String(100), ForeignKey('products.id'), nullable=False, index=True
    )
    product_name = Column(String(200), nullable=False)
    product_name_ja = Column(String(200), nullable=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Integer, nullable=False)
    options = Column(JSONB, nullable=True)
    subtotal = Column(Integer, nullable=False)

    # リレーション
    order = relationship('OrderModel', back_populates='items')
    product = relationship('ProductModel', backref='order_items')
