"""商品リポジトリ実装"""

from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.domain.entities.product import (
    Product,
    ProductFaq,
    ProductFeature,
    ProductImage,
    ProductOption,
    ProductOptionValue,
    ProductRelation,
    ProductSpec,
)
from app.domain.repositories.product_repository import IProductRepository
from app.infrastructure.db.models.product_model import (
    ProductFaqModel,
    ProductFeatureModel,
    ProductImageModel,
    ProductModel,
    ProductOptionModel,
    ProductOptionValueModel,
    ProductRelationModel,
    ProductSpecModel,
)


class ProductRepositoryImpl(IProductRepository):
    """商品リポジトリの実装"""

    def __init__(self, session: Session):
        self.session = session

    # ===================
    # 商品 (Products)
    # ===================

    def get_all(
        self,
        category_id: str | None = None,
        is_active: bool | None = True,
        is_featured: bool | None = None,
        limit: int | None = None,
        offset: int = 0,
    ) -> list[Product]:
        """商品一覧を取得"""
        query = self.session.query(ProductModel)

        if category_id is not None:
            query = query.filter(ProductModel.category_id == category_id)
        if is_active is not None:
            query = query.filter(ProductModel.is_active == is_active)
        if is_featured is not None:
            query = query.filter(ProductModel.is_featured == is_featured)

        query = query.order_by(ProductModel.sort_order, ProductModel.created_at.desc())
        query = query.offset(offset)

        if limit is not None:
            query = query.limit(limit)

        # 画像は一覧でも必要なのでeager load
        query = query.options(joinedload(ProductModel.images))

        products = query.all()
        return [self._to_entity(p, include_relations=False) for p in products]

    def get_by_id(
        self, product_id: str, include_relations: bool = True
    ) -> Product | None:
        """IDで商品を取得"""
        query = self.session.query(ProductModel).filter(ProductModel.id == product_id)

        if include_relations:
            query = self._add_relation_loads(query)

        product_model = query.first()
        if product_model is None:
            return None

        return self._to_entity(product_model, include_relations=include_relations)

    def get_by_slug(self, slug: str, include_relations: bool = True) -> Product | None:
        """スラッグで商品を取得"""
        query = self.session.query(ProductModel).filter(ProductModel.slug == slug)

        if include_relations:
            query = self._add_relation_loads(query)

        product_model = query.first()
        if product_model is None:
            return None

        return self._to_entity(product_model, include_relations=include_relations)

    def get_featured(self, limit: int = 10) -> list[Product]:
        """おすすめ商品を取得"""
        return self.get_all(is_active=True, is_featured=True, limit=limit)

    def search(
        self,
        keyword: str,
        category_id: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[Product]:
        """商品を検索"""
        query = self.session.query(ProductModel).filter(ProductModel.is_active == True)  # noqa: E712

        # キーワード検索（名前、説明）
        search_filter = or_(
            ProductModel.name.ilike(f'%{keyword}%'),
            ProductModel.name_ja.ilike(f'%{keyword}%'),
            ProductModel.tagline.ilike(f'%{keyword}%'),
            ProductModel.description.ilike(f'%{keyword}%'),
        )
        query = query.filter(search_filter)

        if category_id is not None:
            query = query.filter(ProductModel.category_id == category_id)

        query = query.order_by(ProductModel.sort_order, ProductModel.created_at.desc())
        query = query.offset(offset).limit(limit)
        query = query.options(joinedload(ProductModel.images))

        products = query.all()
        return [self._to_entity(p, include_relations=False) for p in products]

    def count(
        self,
        category_id: str | None = None,
        is_active: bool | None = True,
        keyword: str | None = None,
    ) -> int:
        """商品数をカウント"""
        query = self.session.query(ProductModel)

        if category_id is not None:
            query = query.filter(ProductModel.category_id == category_id)
        if is_active is not None:
            query = query.filter(ProductModel.is_active == is_active)
        if keyword is not None:
            search_filter = or_(
                ProductModel.name.ilike(f'%{keyword}%'),
                ProductModel.name_ja.ilike(f'%{keyword}%'),
                ProductModel.tagline.ilike(f'%{keyword}%'),
                ProductModel.description.ilike(f'%{keyword}%'),
            )
            query = query.filter(search_filter)

        return query.count()

    def create(self, product: Product) -> Product:
        """商品を作成"""
        product_model = ProductModel(
            id=product.id,
            category_id=product.category_id,
            name=product.name,
            name_ja=product.name_ja,
            slug=product.slug,
            tagline=product.tagline,
            description=product.description,
            long_description=product.long_description,
            base_price=product.base_price,
            price_note=product.price_note,
            lead_time_days=product.lead_time_days,
            lead_time_note=product.lead_time_note,
            requires_upload=product.requires_upload,
            upload_type=product.upload_type,
            upload_note=product.upload_note,
            is_active=product.is_active,
            is_featured=product.is_featured,
            sort_order=product.sort_order,
        )
        self.session.add(product_model)
        self.session.flush()
        return self._to_entity(product_model, include_relations=False)

    def update(self, product: Product) -> Product:
        """商品を更新"""
        product_model = (
            self.session.query(ProductModel).filter(ProductModel.id == product.id).first()
        )
        if product_model is None:
            raise ValueError(f'Product with id {product.id} not found')

        product_model.category_id = product.category_id
        product_model.name = product.name
        product_model.name_ja = product.name_ja
        product_model.slug = product.slug
        product_model.tagline = product.tagline
        product_model.description = product.description
        product_model.long_description = product.long_description
        product_model.base_price = product.base_price
        product_model.price_note = product.price_note
        product_model.lead_time_days = product.lead_time_days
        product_model.lead_time_note = product.lead_time_note
        product_model.requires_upload = product.requires_upload
        product_model.upload_type = product.upload_type
        product_model.upload_note = product.upload_note
        product_model.is_active = product.is_active
        product_model.is_featured = product.is_featured
        product_model.sort_order = product.sort_order

        self.session.flush()
        return self._to_entity(product_model, include_relations=False)

    def delete(self, product_id: str) -> bool:
        """商品を削除"""
        product_model = (
            self.session.query(ProductModel).filter(ProductModel.id == product_id).first()
        )
        if product_model is None:
            return False

        self.session.delete(product_model)
        self.session.flush()
        return True

    # ===================
    # 商品画像 (Product Images)
    # ===================

    def get_images(self, product_id: str) -> list[ProductImage]:
        """商品の画像一覧を取得"""
        images = (
            self.session.query(ProductImageModel)
            .filter(ProductImageModel.product_id == product_id)
            .order_by(ProductImageModel.sort_order)
            .all()
        )
        return [self._image_to_entity(img) for img in images]

    def get_image(self, image_id: int) -> ProductImage | None:
        """画像をIDで取得"""
        image_model = (
            self.session.query(ProductImageModel)
            .filter(ProductImageModel.id == image_id)
            .first()
        )
        if image_model is None:
            return None
        return self._image_to_entity(image_model)

    def add_image(self, image: ProductImage) -> ProductImage:
        """商品画像を追加"""
        image_model = ProductImageModel(
            product_id=image.product_id,
            url=image.url,
            alt=image.alt,
            is_main=image.is_main,
            sort_order=image.sort_order,
        )
        self.session.add(image_model)
        self.session.flush()
        return self._image_to_entity(image_model)

    def update_image(self, image: ProductImage) -> ProductImage:
        """商品画像を更新（メタデータのみ: alt, is_main, sort_order）"""
        image_model = (
            self.session.query(ProductImageModel)
            .filter(ProductImageModel.id == image.id)
            .first()
        )
        if image_model is None:
            raise ValueError(f'Image with id {image.id} not found')

        image_model.alt = image.alt
        image_model.is_main = image.is_main
        image_model.sort_order = image.sort_order

        self.session.flush()
        return self._image_to_entity(image_model)

    def delete_image(self, image_id: int) -> bool:
        """商品画像を削除"""
        image_model = (
            self.session.query(ProductImageModel)
            .filter(ProductImageModel.id == image_id)
            .first()
        )
        if image_model is None:
            return False

        self.session.delete(image_model)
        self.session.flush()
        return True

    # ===================
    # 商品オプション (Product Options)
    # ===================

    def get_options(self, product_id: str) -> list[ProductOption]:
        """商品のオプション一覧を取得"""
        options = (
            self.session.query(ProductOptionModel)
            .options(joinedload(ProductOptionModel.values))
            .filter(ProductOptionModel.product_id == product_id)
            .order_by(ProductOptionModel.sort_order)
            .all()
        )
        return [self._option_to_entity(opt) for opt in options]

    def update_options(
        self, product_id: str, options: list[ProductOption]
    ) -> list[ProductOption]:
        """商品オプションを一括更新（既存を削除して新規作成）"""
        # 既存のオプションを削除
        self.session.query(ProductOptionModel).filter(
            ProductOptionModel.product_id == product_id
        ).delete()

        # 新しいオプションを作成
        result = []
        for option in options:
            option_model = ProductOptionModel(
                product_id=product_id,
                name=option.name,
                is_required=option.is_required,
                sort_order=option.sort_order,
            )
            self.session.add(option_model)
            self.session.flush()

            # オプション値を作成
            for value in option.values:
                value_model = ProductOptionValueModel(
                    option_id=option_model.id,
                    label=value.label,
                    price_diff=value.price_diff,
                    description=value.description,
                    sort_order=value.sort_order,
                )
                self.session.add(value_model)

            self.session.flush()
            result.append(self._option_to_entity(option_model))

        return result

    # ===================
    # 商品スペック (Product Specs)
    # ===================

    def get_specs(self, product_id: str) -> list[ProductSpec]:
        """商品のスペック一覧を取得"""
        specs = (
            self.session.query(ProductSpecModel)
            .filter(ProductSpecModel.product_id == product_id)
            .order_by(ProductSpecModel.sort_order)
            .all()
        )
        return [self._spec_to_entity(spec) for spec in specs]

    def update_specs(
        self, product_id: str, specs: list[ProductSpec]
    ) -> list[ProductSpec]:
        """商品スペックを一括更新"""
        # 既存のスペックを削除
        self.session.query(ProductSpecModel).filter(
            ProductSpecModel.product_id == product_id
        ).delete()

        # 新しいスペックを作成
        result = []
        for spec in specs:
            spec_model = ProductSpecModel(
                product_id=product_id,
                label=spec.label,
                value=spec.value,
                sort_order=spec.sort_order,
            )
            self.session.add(spec_model)
            self.session.flush()
            result.append(self._spec_to_entity(spec_model))

        return result

    # ===================
    # 商品特長 (Product Features)
    # ===================

    def get_features(self, product_id: str) -> list[ProductFeature]:
        """商品の特長一覧を取得"""
        features = (
            self.session.query(ProductFeatureModel)
            .filter(ProductFeatureModel.product_id == product_id)
            .order_by(ProductFeatureModel.sort_order)
            .all()
        )
        return [self._feature_to_entity(feature) for feature in features]

    def update_features(
        self, product_id: str, features: list[ProductFeature]
    ) -> list[ProductFeature]:
        """商品特長を一括更新"""
        # 既存の特長を削除
        self.session.query(ProductFeatureModel).filter(
            ProductFeatureModel.product_id == product_id
        ).delete()

        # 新しい特長を作成
        result = []
        for feature in features:
            feature_model = ProductFeatureModel(
                product_id=product_id,
                title=feature.title,
                description=feature.description,
                sort_order=feature.sort_order,
            )
            self.session.add(feature_model)
            self.session.flush()
            result.append(self._feature_to_entity(feature_model))

        return result

    # ===================
    # 商品FAQ (Product FAQs)
    # ===================

    def get_faqs(self, product_id: str) -> list[ProductFaq]:
        """商品のFAQ一覧を取得"""
        faqs = (
            self.session.query(ProductFaqModel)
            .filter(ProductFaqModel.product_id == product_id)
            .order_by(ProductFaqModel.sort_order)
            .all()
        )
        return [self._faq_to_entity(faq) for faq in faqs]

    def update_faqs(self, product_id: str, faqs: list[ProductFaq]) -> list[ProductFaq]:
        """商品FAQを一括更新"""
        # 既存のFAQを削除
        self.session.query(ProductFaqModel).filter(
            ProductFaqModel.product_id == product_id
        ).delete()

        # 新しいFAQを作成
        result = []
        for faq in faqs:
            faq_model = ProductFaqModel(
                product_id=product_id,
                question=faq.question,
                answer=faq.answer,
                sort_order=faq.sort_order,
            )
            self.session.add(faq_model)
            self.session.flush()
            result.append(self._faq_to_entity(faq_model))

        return result

    # ===================
    # 関連商品 (Product Relations)
    # ===================

    def get_related_products(self, product_id: str) -> list[Product]:
        """関連商品を取得"""
        relations = (
            self.session.query(ProductRelationModel)
            .filter(ProductRelationModel.product_id == product_id)
            .order_by(ProductRelationModel.sort_order)
            .all()
        )

        related_products = []
        for relation in relations:
            product = self.get_by_id(relation.related_product_id, include_relations=False)
            if product and product.is_active:
                related_products.append(product)

        return related_products

    def update_relations(
        self, product_id: str, relations: list[ProductRelation]
    ) -> list[ProductRelation]:
        """関連商品を一括更新"""
        # 既存の関連を削除
        self.session.query(ProductRelationModel).filter(
            ProductRelationModel.product_id == product_id
        ).delete()

        # 新しい関連を作成
        result = []
        for relation in relations:
            relation_model = ProductRelationModel(
                product_id=product_id,
                related_product_id=relation.related_product_id,
                sort_order=relation.sort_order,
            )
            self.session.add(relation_model)
            self.session.flush()
            result.append(self._relation_to_entity(relation_model))

        return result

    # ===================
    # Private methods
    # ===================

    def _add_relation_loads(self, query):
        """関連データのeager loadを追加"""
        return query.options(
            joinedload(ProductModel.images),
            joinedload(ProductModel.options).joinedload(ProductOptionModel.values),
            joinedload(ProductModel.specs),
            joinedload(ProductModel.features),
            joinedload(ProductModel.faqs),
            joinedload(ProductModel.relations),
        )

    def _to_entity(self, model: ProductModel, include_relations: bool = True) -> Product:
        """DBモデルをエンティティに変換"""
        images = []
        options = []
        specs = []
        features = []
        faqs = []
        relations = []

        if include_relations:
            images = [self._image_to_entity(img) for img in model.images]
            options = [self._option_to_entity(opt) for opt in model.options]
            specs = [self._spec_to_entity(spec) for spec in model.specs]
            features = [self._feature_to_entity(feature) for feature in model.features]
            faqs = [self._faq_to_entity(faq) for faq in model.faqs]
            relations = [self._relation_to_entity(rel) for rel in model.relations]
        else:
            # 一覧取得時は画像のみ
            images = [self._image_to_entity(img) for img in model.images]

        return Product(
            id=model.id,
            category_id=model.category_id,
            name=model.name,
            name_ja=model.name_ja,
            slug=model.slug,
            tagline=model.tagline,
            description=model.description,
            long_description=model.long_description,
            base_price=model.base_price,
            price_note=model.price_note,
            lead_time_days=model.lead_time_days,
            lead_time_note=model.lead_time_note,
            requires_upload=model.requires_upload,
            upload_type=model.upload_type,
            upload_note=model.upload_note,
            is_active=model.is_active,
            is_featured=model.is_featured,
            sort_order=model.sort_order,
            created_at=model.created_at,
            updated_at=model.updated_at,
            images=images,
            options=options,
            specs=specs,
            features=features,
            faqs=faqs,
            related_products=relations,
        )

    def _image_to_entity(self, model: ProductImageModel) -> ProductImage:
        """画像モデルをエンティティに変換"""
        return ProductImage(
            id=model.id,
            product_id=model.product_id,
            url=model.url,
            alt=model.alt,
            is_main=model.is_main,
            sort_order=model.sort_order,
        )

    def _option_to_entity(self, model: ProductOptionModel) -> ProductOption:
        """オプションモデルをエンティティに変換"""
        values = [self._option_value_to_entity(v) for v in model.values]
        return ProductOption(
            id=model.id,
            product_id=model.product_id,
            name=model.name,
            is_required=model.is_required,
            sort_order=model.sort_order,
            values=values,
        )

    def _option_value_to_entity(
        self, model: ProductOptionValueModel
    ) -> ProductOptionValue:
        """オプション値モデルをエンティティに変換"""
        return ProductOptionValue(
            id=model.id,
            option_id=model.option_id,
            label=model.label,
            price_diff=model.price_diff,
            description=model.description,
            sort_order=model.sort_order,
        )

    def _spec_to_entity(self, model: ProductSpecModel) -> ProductSpec:
        """スペックモデルをエンティティに変換"""
        return ProductSpec(
            id=model.id,
            product_id=model.product_id,
            label=model.label,
            value=model.value,
            sort_order=model.sort_order,
        )

    def _feature_to_entity(self, model: ProductFeatureModel) -> ProductFeature:
        """特長モデルをエンティティに変換"""
        return ProductFeature(
            id=model.id,
            product_id=model.product_id,
            title=model.title,
            description=model.description,
            sort_order=model.sort_order,
        )

    def _faq_to_entity(self, model: ProductFaqModel) -> ProductFaq:
        """FAQモデルをエンティティに変換"""
        return ProductFaq(
            id=model.id,
            product_id=model.product_id,
            question=model.question,
            answer=model.answer,
            sort_order=model.sort_order,
        )

    def _relation_to_entity(self, model: ProductRelationModel) -> ProductRelation:
        """関連商品モデルをエンティティに変換"""
        return ProductRelation(
            id=model.id,
            product_id=model.product_id,
            related_product_id=model.related_product_id,
            sort_order=model.sort_order,
        )
