"""商品ユースケース"""

from app.application.schemas.product_schemas import (
    ProductDetailDTO,
    ProductFaqDTO,
    ProductFeatureDTO,
    ProductImageDTO,
    ProductListInputDTO,
    ProductListItemDTO,
    ProductListOutputDTO,
    ProductOptionDTO,
    ProductOptionsOutputDTO,
    ProductOptionValueDTO,
    ProductRelatedOutputDTO,
    ProductSearchInputDTO,
    ProductSearchOutputDTO,
    ProductSpecDTO,
    RelatedProductDTO,
)
from app.domain.entities.product import (
    Product,
    ProductFaq,
    ProductFeature,
    ProductImage,
    ProductOption,
    ProductSpec,
)
from app.domain.exceptions.product import ProductNotActiveError, ProductNotFoundError
from app.domain.repositories.product_repository import IProductRepository


class ProductUsecase:
    """商品ユースケース"""

    def __init__(self, product_repository: IProductRepository):
        self.product_repository = product_repository

    def get_products(self, input_dto: ProductListInputDTO) -> ProductListOutputDTO:
        """商品一覧を取得"""
        products = self.product_repository.get_all(
            category_id=input_dto.category_id,
            is_active=True,
            is_featured=input_dto.is_featured,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )

        total = self.product_repository.count(
            category_id=input_dto.category_id,
            is_active=True,
        )

        return ProductListOutputDTO(
            products=[self._to_list_item_dto(p) for p in products],
            total=total,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )

    def get_product_by_id(self, product_id: str) -> ProductDetailDTO:
        """商品詳細を取得（IDで）"""
        product = self.product_repository.get_by_id(product_id, include_relations=True)

        if product is None:
            raise ProductNotFoundError()

        if not product.is_active:
            raise ProductNotActiveError()

        return self._to_detail_dto(product)

    def get_product_by_slug(self, slug: str) -> ProductDetailDTO:
        """商品詳細を取得（スラッグで）"""
        product = self.product_repository.get_by_slug(slug, include_relations=True)

        if product is None:
            raise ProductNotFoundError()

        if not product.is_active:
            raise ProductNotActiveError()

        return self._to_detail_dto(product)

    def get_product_options(self, product_id: str) -> ProductOptionsOutputDTO:
        """商品オプションを取得"""
        product = self.product_repository.get_by_id(product_id, include_relations=False)

        if product is None:
            raise ProductNotFoundError()

        options = self.product_repository.get_options(product_id)

        return ProductOptionsOutputDTO(
            product_id=product_id,
            options=[self._to_option_dto(opt) for opt in options],
        )

    def get_related_products(self, product_id: str) -> ProductRelatedOutputDTO:
        """関連商品を取得"""
        product = self.product_repository.get_by_id(product_id, include_relations=False)

        if product is None:
            raise ProductNotFoundError()

        related = self.product_repository.get_related_products(product_id)

        return ProductRelatedOutputDTO(
            product_id=product_id,
            related_products=[self._to_related_dto(p) for p in related],
        )

    def get_featured_products(self, limit: int = 10) -> ProductListOutputDTO:
        """おすすめ商品を取得"""
        products = self.product_repository.get_featured(limit=limit)

        return ProductListOutputDTO(
            products=[self._to_list_item_dto(p) for p in products],
            total=len(products),
            limit=limit,
            offset=0,
        )

    def search_products(self, input_dto: ProductSearchInputDTO) -> ProductSearchOutputDTO:
        """商品を検索"""
        products = self.product_repository.search(
            keyword=input_dto.keyword,
            category_id=input_dto.category_id,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )

        total = self.product_repository.count(
            category_id=input_dto.category_id,
            is_active=True,
            keyword=input_dto.keyword,
        )

        return ProductSearchOutputDTO(
            products=[self._to_list_item_dto(p) for p in products],
            total=total,
            keyword=input_dto.keyword,
            category_id=input_dto.category_id,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )

    # ===================
    # Private methods
    # ===================

    def _to_list_item_dto(self, product: Product) -> ProductListItemDTO:
        """商品エンティティを一覧アイテムDTOに変換"""
        return ProductListItemDTO(
            id=product.id,
            category_id=product.category_id,
            name=product.name,
            name_ja=product.name_ja,
            slug=product.slug,
            tagline=product.tagline,
            base_price=product.base_price,
            price_note=product.price_note,
            is_featured=product.is_featured,
            main_image_url=product.main_image_url,
            images=[self._to_image_dto(img) for img in product.images],
        )

    def _to_detail_dto(self, product: Product) -> ProductDetailDTO:
        """商品エンティティを詳細DTOに変換"""
        return ProductDetailDTO(
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
            is_featured=product.is_featured,
            images=[self._to_image_dto(img) for img in product.images],
            options=[self._to_option_dto(opt) for opt in product.options],
            specs=[self._to_spec_dto(spec) for spec in product.specs],
            features=[self._to_feature_dto(feature) for feature in product.features],
            faqs=[self._to_faq_dto(faq) for faq in product.faqs],
            created_at=product.created_at,
            updated_at=product.updated_at,
        )

    def _to_related_dto(self, product: Product) -> RelatedProductDTO:
        """商品エンティティを関連商品DTOに変換"""
        return RelatedProductDTO(
            id=product.id,
            name=product.name,
            name_ja=product.name_ja,
            slug=product.slug,
            base_price=product.base_price,
            main_image_url=product.main_image_url,
        )

    def _to_image_dto(self, image: ProductImage) -> ProductImageDTO:
        """画像エンティティをDTOに変換"""
        return ProductImageDTO(
            id=image.id,
            s3_url=image.s3_url,
            alt=image.alt,
            is_main=image.is_main,
            sort_order=image.sort_order,
        )

    def _to_option_dto(self, option: ProductOption) -> ProductOptionDTO:
        """オプションエンティティをDTOに変換"""
        return ProductOptionDTO(
            id=option.id,
            name=option.name,
            is_required=option.is_required,
            sort_order=option.sort_order,
            values=[
                ProductOptionValueDTO(
                    id=v.id,
                    label=v.label,
                    price_diff=v.price_diff,
                    description=v.description,
                    sort_order=v.sort_order,
                )
                for v in option.values
            ],
        )

    def _to_spec_dto(self, spec: ProductSpec) -> ProductSpecDTO:
        """スペックエンティティをDTOに変換"""
        return ProductSpecDTO(
            id=spec.id,
            label=spec.label,
            value=spec.value,
            sort_order=spec.sort_order,
        )

    def _to_feature_dto(self, feature: ProductFeature) -> ProductFeatureDTO:
        """特長エンティティをDTOに変換"""
        return ProductFeatureDTO(
            id=feature.id,
            title=feature.title,
            description=feature.description,
            sort_order=feature.sort_order,
        )

    def _to_faq_dto(self, faq: ProductFaq) -> ProductFaqDTO:
        """FAQエンティティをDTOに変換"""
        return ProductFaqDTO(
            id=faq.id,
            question=faq.question,
            answer=faq.answer,
            sort_order=faq.sort_order,
        )
