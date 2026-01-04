"""カートユースケース"""

from typing import Any

from fastapi import HTTPException, status

from app.application.schemas.cart_schemas import (
    AddToCartInputDTO,
    AddToCartOutputDTO,
    CartItemDTO,
    ClearCartOutputDTO,
    DeleteCartItemOutputDTO,
    GetCartOutputDTO,
    UpdateCartItemInputDTO,
    UpdateCartItemOutputDTO,
)
from app.domain.entities.cart_item import CartItem
from app.domain.repositories.cart_item_repository import ICartItemRepository
from app.domain.repositories.product_repository import IProductRepository


# 消費税率
TAX_RATE = 0.10


class CartUsecase:
    """カート管理ユースケース"""

    def __init__(
        self,
        cart_item_repository: ICartItemRepository,
        product_repository: IProductRepository,
    ):
        self.cart_item_repository = cart_item_repository
        self.product_repository = product_repository

    def get_cart(self, user_id: int) -> GetCartOutputDTO:
        """カート内容を取得"""
        cart_items = self.cart_item_repository.get_by_user_id(user_id)

        items: list[CartItemDTO] = []
        total_quantity = 0
        subtotal = 0

        for cart_item in cart_items:
            # 商品情報を取得
            product = self.product_repository.get_by_id(cart_item.product_id)

            if product is None:
                # 商品が削除されている場合はカートから除去
                self.cart_item_repository.delete(cart_item.id)
                continue

            # 小計計算
            item_subtotal = cart_item.calculate_subtotal(product.base_price)

            items.append(
                CartItemDTO(
                    id=cart_item.id,
                    product_id=cart_item.product_id,
                    product_name=product.name,
                    product_name_ja=product.name_ja,
                    product_image_url=product.main_image_url,
                    base_price=product.base_price,
                    quantity=cart_item.quantity,
                    options=cart_item.options,
                    subtotal=item_subtotal,
                    created_at=cart_item.created_at,
                    updated_at=cart_item.updated_at,
                )
            )

            total_quantity += cart_item.quantity
            subtotal += item_subtotal

        # 消費税計算
        tax = int(subtotal * TAX_RATE)
        total = subtotal + tax

        return GetCartOutputDTO(
            items=items,
            item_count=len(items),
            total_quantity=total_quantity,
            subtotal=subtotal,
            tax=tax,
            total=total,
        )

    def add_to_cart(
        self, user_id: int, input_dto: AddToCartInputDTO
    ) -> AddToCartOutputDTO:
        """カートに商品を追加"""
        # 商品の存在確認
        product = self.product_repository.get_by_id(input_dto.product_id)

        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='商品が見つかりません',
            )

        # 非公開商品はカートに追加できない
        if not product.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='この商品は現在購入できません',
            )

        # 既存のカートアイテムを確認
        existing_item = self.cart_item_repository.get_by_user_and_product(
            user_id, input_dto.product_id
        )

        if existing_item:
            # 既存アイテムがある場合は数量を加算
            existing_item.quantity += input_dto.quantity
            if input_dto.options:
                existing_item.options = input_dto.options

            updated_item = self.cart_item_repository.update(existing_item)
            item_subtotal = updated_item.calculate_subtotal(product.base_price)

            return AddToCartOutputDTO(
                item=CartItemDTO(
                    id=updated_item.id,
                    product_id=updated_item.product_id,
                    product_name=product.name,
                    product_name_ja=product.name_ja,
                    product_image_url=product.main_image_url,
                    base_price=product.base_price,
                    quantity=updated_item.quantity,
                    options=updated_item.options,
                    subtotal=item_subtotal,
                    created_at=updated_item.created_at,
                    updated_at=updated_item.updated_at,
                ),
                message='カートを更新しました',
            )
        else:
            # 新規追加
            cart_item = CartItem(
                user_id=user_id,
                product_id=input_dto.product_id,
                quantity=input_dto.quantity,
                options=input_dto.options,
            )

            created_item = self.cart_item_repository.create(cart_item)
            item_subtotal = created_item.calculate_subtotal(product.base_price)

            return AddToCartOutputDTO(
                item=CartItemDTO(
                    id=created_item.id,
                    product_id=created_item.product_id,
                    product_name=product.name,
                    product_name_ja=product.name_ja,
                    product_image_url=product.main_image_url,
                    base_price=product.base_price,
                    quantity=created_item.quantity,
                    options=created_item.options,
                    subtotal=item_subtotal,
                    created_at=created_item.created_at,
                    updated_at=created_item.updated_at,
                ),
                message='カートに追加しました',
            )

    def update_cart_item(
        self, user_id: int, item_id: int, input_dto: UpdateCartItemInputDTO
    ) -> UpdateCartItemOutputDTO:
        """カートアイテムを更新"""
        cart_item = self.cart_item_repository.get_by_id(item_id)

        if cart_item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='カートアイテムが見つかりません',
            )

        # 他人のカートアイテムへのアクセスを防止
        if cart_item.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='このカートアイテムを更新する権限がありません',
            )

        # 商品情報を取得
        product = self.product_repository.get_by_id(cart_item.product_id)

        if product is None:
            # 商品が削除されている場合
            self.cart_item_repository.delete(item_id)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='商品が見つかりません。カートから削除されました。',
            )

        # 更新処理
        if input_dto.quantity is not None:
            cart_item.quantity = input_dto.quantity
        if input_dto.options is not None:
            cart_item.options = input_dto.options

        updated_item = self.cart_item_repository.update(cart_item)
        item_subtotal = updated_item.calculate_subtotal(product.base_price)

        return UpdateCartItemOutputDTO(
            item=CartItemDTO(
                id=updated_item.id,
                product_id=updated_item.product_id,
                product_name=product.name,
                product_name_ja=product.name_ja,
                product_image_url=product.main_image_url,
                base_price=product.base_price,
                quantity=updated_item.quantity,
                options=updated_item.options,
                subtotal=item_subtotal,
                created_at=updated_item.created_at,
                updated_at=updated_item.updated_at,
            ),
            message='カートを更新しました',
        )

    def delete_cart_item(self, user_id: int, item_id: int) -> DeleteCartItemOutputDTO:
        """カートアイテムを削除"""
        cart_item = self.cart_item_repository.get_by_id(item_id)

        if cart_item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='カートアイテムが見つかりません',
            )

        # 他人のカートアイテムへのアクセスを防止
        if cart_item.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='このカートアイテムを削除する権限がありません',
            )

        success = self.cart_item_repository.delete(item_id)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail='カートアイテムの削除に失敗しました',
            )

        return DeleteCartItemOutputDTO(message='カートから削除しました')

    def clear_cart(self, user_id: int) -> ClearCartOutputDTO:
        """カートを空にする"""
        deleted_count = self.cart_item_repository.delete_all_by_user_id(user_id)

        return ClearCartOutputDTO(
            deleted_count=deleted_count,
            message=f'{deleted_count}件のアイテムを削除しました'
            if deleted_count > 0
            else 'カートは既に空です',
        )
