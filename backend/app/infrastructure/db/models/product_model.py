"""商品DBモデル"""

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.infrastructure.db.models.base import Base


class ProductModel(Base):
    """商品テーブル"""

    __tablename__ = 'products'

    id = Column(String(100), primary_key=True)  # qr-cube等
    category_id = Column(String(50), nullable=False, index=True)  # shop/office/you
    name = Column(String(200), nullable=False)  # 英語名
    name_ja = Column(String(200), nullable=False)  # 日本語名
    slug = Column(String(200), unique=True, nullable=True, index=True)  # URL用
    tagline = Column(String(255), nullable=True)  # キャッチコピー
    description = Column(Text, nullable=True)  # 短い説明
    long_description = Column(Text, nullable=True)  # 詳細説明
    base_price = Column(Integer, nullable=False)  # 税抜基本価格
    price_note = Column(String(255), nullable=True)  # 価格補足
    lead_time_days = Column(Integer, nullable=True)  # 標準納期
    lead_time_note = Column(String(255), nullable=True)  # 納期補足
    requires_upload = Column(Boolean, default=False)  # 入稿必須
    upload_type = Column(String(50), nullable=True)  # logo/qr/photo/text
    upload_note = Column(Text, nullable=True)  # 入稿時の注意
    is_active = Column(Boolean, default=True, index=True)  # 公開状態
    is_featured = Column(Boolean, default=False, index=True)  # おすすめ
    sort_order = Column(Integer, default=0)  # 並び順
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # リレーション
    images = relationship(
        'ProductImageModel', back_populates='product', cascade='all, delete-orphan'
    )
    options = relationship(
        'ProductOptionModel', back_populates='product', cascade='all, delete-orphan'
    )
    specs = relationship(
        'ProductSpecModel', back_populates='product', cascade='all, delete-orphan'
    )
    features = relationship(
        'ProductFeatureModel', back_populates='product', cascade='all, delete-orphan'
    )
    faqs = relationship(
        'ProductFaqModel', back_populates='product', cascade='all, delete-orphan'
    )
    relations = relationship(
        'ProductRelationModel',
        foreign_keys='ProductRelationModel.product_id',
        back_populates='product',
        cascade='all, delete-orphan',
    )


class ProductImageModel(Base):
    """商品画像テーブル"""

    __tablename__ = 'product_images'

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(
        String(100), ForeignKey('products.id'), nullable=False, index=True
    )
    s3_url = Column(String(500), nullable=False)
    alt = Column(String(255), nullable=True)
    is_main = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)

    # リレーション
    product = relationship('ProductModel', back_populates='images')


class ProductOptionModel(Base):
    """商品オプションテーブル"""

    __tablename__ = 'product_options'

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(
        String(100), ForeignKey('products.id'), nullable=False, index=True
    )
    name = Column(String(100), nullable=False)  # サイズ/厚み等
    is_required = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)

    # リレーション
    product = relationship('ProductModel', back_populates='options')
    values = relationship(
        'ProductOptionValueModel', back_populates='option', cascade='all, delete-orphan'
    )


class ProductOptionValueModel(Base):
    """商品オプション値テーブル"""

    __tablename__ = 'product_option_values'

    id = Column(Integer, primary_key=True, autoincrement=True)
    option_id = Column(
        Integer, ForeignKey('product_options.id'), nullable=False, index=True
    )
    label = Column(String(100), nullable=False)  # 50mm角
    price_diff = Column(Integer, default=0)  # 価格差分
    description = Column(String(255), nullable=True)  # コンパクト等
    sort_order = Column(Integer, default=0)

    # リレーション
    option = relationship('ProductOptionModel', back_populates='values')


class ProductSpecModel(Base):
    """商品スペックテーブル"""

    __tablename__ = 'product_specs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(
        String(100), ForeignKey('products.id'), nullable=False, index=True
    )
    label = Column(String(100), nullable=False)  # サイズ
    value = Column(String(255), nullable=False)  # 50mm〜80mm角
    sort_order = Column(Integer, default=0)

    # リレーション
    product = relationship('ProductModel', back_populates='specs')


class ProductFeatureModel(Base):
    """商品特長テーブル"""

    __tablename__ = 'product_features'

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(
        String(100), ForeignKey('products.id'), nullable=False, index=True
    )
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0)

    # リレーション
    product = relationship('ProductModel', back_populates='features')


class ProductFaqModel(Base):
    """商品FAQテーブル"""

    __tablename__ = 'product_faqs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(
        String(100), ForeignKey('products.id'), nullable=False, index=True
    )
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    sort_order = Column(Integer, default=0)

    # リレーション
    product = relationship('ProductModel', back_populates='faqs')


class ProductRelationModel(Base):
    """関連商品テーブル"""

    __tablename__ = 'product_relations'

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(
        String(100), ForeignKey('products.id'), nullable=False, index=True
    )
    related_product_id = Column(
        String(100), ForeignKey('products.id'), nullable=False, index=True
    )
    sort_order = Column(Integer, default=0)

    # リレーション
    product = relationship(
        'ProductModel', foreign_keys=[product_id], back_populates='relations'
    )
    related_product = relationship('ProductModel', foreign_keys=[related_product_id])
