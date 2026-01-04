"""Admin商品管理ユースケース"""

from app.application.schemas.admin_product_schemas import (
    AddProductImageInputDTO,
    AddProductImageOutputDTO,
    AdminProductDetailDTO,
    AdminProductDTO,
    AdminProductFaqDTO,
    AdminProductFeatureDTO,
    AdminProductImageDTO,
    AdminProductOptionDTO,
    AdminProductOptionValueDTO,
    AdminProductSpecDTO,
    CreateProductInputDTO,
    CreateProductOutputDTO,
    DeleteProductImageOutputDTO,
    DeleteProductOutputDTO,
    GetAdminProductOutputDTO,
    GetAdminProductsInputDTO,
    GetAdminProductsOutputDTO,
    UpdateProductFaqsInputDTO,
    UpdateProductFaqsOutputDTO,
    UpdateProductFeaturesInputDTO,
    UpdateProductFeaturesOutputDTO,
    UpdateProductInputDTO,
    UpdateProductOptionsInputDTO,
    UpdateProductOptionsOutputDTO,
    UpdateProductOutputDTO,
    UpdateProductSpecsInputDTO,
    UpdateProductSpecsOutputDTO,
)
from app.domain.entities.product import (
    Product,
    ProductFaq,
    ProductFeature,
    ProductImage,
    ProductOption,
    ProductOptionValue,
    ProductSpec,
)
from app.domain.exceptions.product import ProductNotFoundError
from app.domain.repositories.product_repository import IProductRepository


class AdminProductUsecase:
    """Admin商品管理ユースケース"""

    def __init__(self, product_repository: IProductRepository):
        self.product_repository = product_repository

    def get_products(
        self, input_dto: GetAdminProductsInputDTO
    ) -> GetAdminProductsOutputDTO:
        """商品一覧を取得"""
        # Adminの場合はis_active=Noneで全商品取得可能
        if input_dto.search:
            products = self.product_repository.search(
                keyword=input_dto.search,
                category_id=input_dto.category_id,
                limit=input_dto.limit,
                offset=input_dto.offset,
            )
            total = self.product_repository.count(
                category_id=input_dto.category_id,
                is_active=input_dto.is_active,
                keyword=input_dto.search,
            )
        else:
            products = self.product_repository.get_all(
                category_id=input_dto.category_id,
                is_active=input_dto.is_active,
                limit=input_dto.limit,
                offset=input_dto.offset,
            )
            total = self.product_repository.count(
                category_id=input_dto.category_id,
                is_active=input_dto.is_active,
            )

        return GetAdminProductsOutputDTO(
            products=[self._to_product_dto(p) for p in products],
            total=total,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )

    def get_product(self, product_id: str) -> GetAdminProductOutputDTO:
        """商品詳細を取得"""
        product = self.product_repository.get_by_id(product_id, include_relations=True)
        if product is None:
            raise ProductNotFoundError()

        return GetAdminProductOutputDTO(product=self._to_product_detail_dto(product))

    def create_product(
        self, input_dto: CreateProductInputDTO
    ) -> CreateProductOutputDTO:
        """商品を作成"""
        product = Product(
            id=input_dto.id,
            name=input_dto.name,
            name_ja=input_dto.name_ja,
            slug=input_dto.slug,
            tagline=input_dto.tagline,
            description=input_dto.description,
            long_description=input_dto.long_description,
            base_price=input_dto.base_price,
            price_note=input_dto.price_note,
            category_id=input_dto.category_id,
            lead_time_days=input_dto.lead_time_days,
            lead_time_note=input_dto.lead_time_note,
            requires_upload=input_dto.requires_upload,
            upload_type=input_dto.upload_type,
            upload_note=input_dto.upload_note,
            is_active=input_dto.is_active,
            is_featured=input_dto.is_featured,
            sort_order=input_dto.sort_order,
        )

        created_product = self.product_repository.create(product)
        # リレーションを含めて再取得
        product_with_relations = self.product_repository.get_by_id(
            created_product.id, include_relations=True
        )

        return CreateProductOutputDTO(
            product=self._to_product_detail_dto(product_with_relations),
            message='商品を作成しました',
        )

    def update_product(
        self, product_id: str, input_dto: UpdateProductInputDTO
    ) -> UpdateProductOutputDTO:
        """商品を更新"""
        product = self.product_repository.get_by_id(product_id, include_relations=False)
        if product is None:
            raise ProductNotFoundError()

        # 指定されたフィールドのみ更新
        if input_dto.name is not None:
            product.name = input_dto.name
        if input_dto.name_ja is not None:
            product.name_ja = input_dto.name_ja
        if input_dto.slug is not None:
            product.slug = input_dto.slug
        if input_dto.tagline is not None:
            product.tagline = input_dto.tagline
        if input_dto.description is not None:
            product.description = input_dto.description
        if input_dto.long_description is not None:
            product.long_description = input_dto.long_description
        if input_dto.base_price is not None:
            product.base_price = input_dto.base_price
        if input_dto.price_note is not None:
            product.price_note = input_dto.price_note
        if input_dto.category_id is not None:
            product.category_id = input_dto.category_id
        if input_dto.lead_time_days is not None:
            product.lead_time_days = input_dto.lead_time_days
        if input_dto.lead_time_note is not None:
            product.lead_time_note = input_dto.lead_time_note
        if input_dto.requires_upload is not None:
            product.requires_upload = input_dto.requires_upload
        if input_dto.upload_type is not None:
            product.upload_type = input_dto.upload_type
        if input_dto.upload_note is not None:
            product.upload_note = input_dto.upload_note
        if input_dto.is_active is not None:
            product.is_active = input_dto.is_active
        if input_dto.is_featured is not None:
            product.is_featured = input_dto.is_featured
        if input_dto.sort_order is not None:
            product.sort_order = input_dto.sort_order

        self.product_repository.update(product)
        # リレーションを含めて再取得
        updated_product = self.product_repository.get_by_id(
            product_id, include_relations=True
        )

        return UpdateProductOutputDTO(
            product=self._to_product_detail_dto(updated_product),
            message='商品を更新しました',
        )

    def delete_product(self, product_id: str) -> DeleteProductOutputDTO:
        """商品を削除"""
        product = self.product_repository.get_by_id(product_id, include_relations=False)
        if product is None:
            raise ProductNotFoundError()

        self.product_repository.delete(product_id)

        return DeleteProductOutputDTO(message='商品を削除しました')

    def add_image(
        self, product_id: str, input_dto: AddProductImageInputDTO
    ) -> AddProductImageOutputDTO:
        """商品画像を追加"""
        product = self.product_repository.get_by_id(product_id, include_relations=False)
        if product is None:
            raise ProductNotFoundError()

        image = ProductImage(
            product_id=product_id,
            url=input_dto.url,
            alt=input_dto.alt,
            is_main=input_dto.is_main,
            sort_order=input_dto.sort_order,
        )

        created_image = self.product_repository.add_image(image)

        return AddProductImageOutputDTO(
            image=self._to_image_dto(created_image),
            message='画像を追加しました',
        )

    def delete_image(
        self, product_id: str, image_id: int
    ) -> DeleteProductImageOutputDTO:
        """商品画像を削除"""
        product = self.product_repository.get_by_id(product_id, include_relations=False)
        if product is None:
            raise ProductNotFoundError()

        self.product_repository.delete_image(image_id)

        return DeleteProductImageOutputDTO(message='画像を削除しました')

    def update_options(
        self, product_id: str, input_dto: UpdateProductOptionsInputDTO
    ) -> UpdateProductOptionsOutputDTO:
        """オプションを更新"""
        product = self.product_repository.get_by_id(product_id, include_relations=False)
        if product is None:
            raise ProductNotFoundError()

        options = [
            ProductOption(
                product_id=product_id,
                name=opt.name,
                is_required=opt.is_required,
                sort_order=opt.sort_order,
                values=[
                    ProductOptionValue(
                        label=v.label,
                        price_diff=v.price_diff,
                        description=v.description,
                        sort_order=v.sort_order,
                    )
                    for v in opt.values
                ],
            )
            for opt in input_dto.options
        ]

        updated_options = self.product_repository.update_options(product_id, options)

        return UpdateProductOptionsOutputDTO(
            options=[self._to_option_dto(opt) for opt in updated_options],
            message='オプションを更新しました',
        )

    def update_specs(
        self, product_id: str, input_dto: UpdateProductSpecsInputDTO
    ) -> UpdateProductSpecsOutputDTO:
        """スペックを更新"""
        product = self.product_repository.get_by_id(product_id, include_relations=False)
        if product is None:
            raise ProductNotFoundError()

        specs = [
            ProductSpec(
                product_id=product_id,
                label=s.label,
                value=s.value,
                sort_order=s.sort_order,
            )
            for s in input_dto.specs
        ]

        updated_specs = self.product_repository.update_specs(product_id, specs)

        return UpdateProductSpecsOutputDTO(
            specs=[self._to_spec_dto(s) for s in updated_specs],
            message='スペックを更新しました',
        )

    def update_features(
        self, product_id: str, input_dto: UpdateProductFeaturesInputDTO
    ) -> UpdateProductFeaturesOutputDTO:
        """特長を更新"""
        product = self.product_repository.get_by_id(product_id, include_relations=False)
        if product is None:
            raise ProductNotFoundError()

        features = [
            ProductFeature(
                product_id=product_id,
                title=f.title,
                description=f.description,
                sort_order=f.sort_order,
            )
            for f in input_dto.features
        ]

        updated_features = self.product_repository.update_features(product_id, features)

        return UpdateProductFeaturesOutputDTO(
            features=[self._to_feature_dto(f) for f in updated_features],
            message='特長を更新しました',
        )

    def update_faqs(
        self, product_id: str, input_dto: UpdateProductFaqsInputDTO
    ) -> UpdateProductFaqsOutputDTO:
        """FAQを更新"""
        product = self.product_repository.get_by_id(product_id, include_relations=False)
        if product is None:
            raise ProductNotFoundError()

        faqs = [
            ProductFaq(
                product_id=product_id,
                question=f.question,
                answer=f.answer,
                sort_order=f.sort_order,
            )
            for f in input_dto.faqs
        ]

        updated_faqs = self.product_repository.update_faqs(product_id, faqs)

        return UpdateProductFaqsOutputDTO(
            faqs=[self._to_faq_dto(f) for f in updated_faqs],
            message='FAQを更新しました',
        )

    def _to_product_dto(self, product: Product) -> AdminProductDTO:
        """商品をDTOに変換"""
        main_image_url = None
        if product.images:
            main_image = next((img for img in product.images if img.is_main), None)
            if main_image:
                main_image_url = main_image.url
            elif product.images:
                main_image_url = product.images[0].url

        return AdminProductDTO(
            id=product.id,
            name=product.name,
            name_ja=product.name_ja,
            slug=product.slug,
            tagline=product.tagline,
            base_price=product.base_price,
            category_id=product.category_id,
            is_active=product.is_active,
            is_featured=product.is_featured,
            sort_order=product.sort_order,
            created_at=product.created_at,
            updated_at=product.updated_at,
            main_image_url=main_image_url,
        )

    def _to_product_detail_dto(self, product: Product) -> AdminProductDetailDTO:
        """商品を詳細DTOに変換"""
        main_image_url = None
        if product.images:
            main_image = next((img for img in product.images if img.is_main), None)
            if main_image:
                main_image_url = main_image.url
            elif product.images:
                main_image_url = product.images[0].url

        return AdminProductDetailDTO(
            id=product.id,
            name=product.name,
            name_ja=product.name_ja,
            slug=product.slug,
            tagline=product.tagline,
            description=product.description,
            long_description=product.long_description,
            base_price=product.base_price,
            price_note=product.price_note,
            category_id=product.category_id,
            lead_time_days=product.lead_time_days,
            lead_time_note=product.lead_time_note,
            requires_upload=product.requires_upload,
            upload_type=product.upload_type,
            upload_note=product.upload_note,
            is_active=product.is_active,
            is_featured=product.is_featured,
            sort_order=product.sort_order,
            created_at=product.created_at,
            updated_at=product.updated_at,
            main_image_url=main_image_url,
            images=[self._to_image_dto(img) for img in product.images or []],
            options=[self._to_option_dto(opt) for opt in product.options or []],
            specs=[self._to_spec_dto(s) for s in product.specs or []],
            features=[self._to_feature_dto(f) for f in product.features or []],
            faqs=[self._to_faq_dto(f) for f in product.faqs or []],
        )

    def _to_image_dto(self, image: ProductImage) -> AdminProductImageDTO:
        return AdminProductImageDTO(
            id=image.id,
            url=image.url,
            alt=image.alt,
            is_main=image.is_main,
            sort_order=image.sort_order,
        )

    def _to_option_dto(self, option: ProductOption) -> AdminProductOptionDTO:
        return AdminProductOptionDTO(
            id=option.id,
            name=option.name,
            is_required=option.is_required,
            sort_order=option.sort_order,
            values=[
                AdminProductOptionValueDTO(
                    id=v.id,
                    label=v.label,
                    price_diff=v.price_diff,
                    description=v.description,
                    sort_order=v.sort_order,
                )
                for v in option.values or []
            ],
        )

    def _to_spec_dto(self, spec: ProductSpec) -> AdminProductSpecDTO:
        return AdminProductSpecDTO(
            id=spec.id,
            label=spec.label,
            value=spec.value,
            sort_order=spec.sort_order,
        )

    def _to_feature_dto(self, feature: ProductFeature) -> AdminProductFeatureDTO:
        return AdminProductFeatureDTO(
            id=feature.id,
            title=feature.title,
            description=feature.description,
            sort_order=feature.sort_order,
        )

    def _to_faq_dto(self, faq: ProductFaq) -> AdminProductFaqDTO:
        return AdminProductFaqDTO(
            id=faq.id,
            question=faq.question,
            answer=faq.answer,
            sort_order=faq.sort_order,
        )
