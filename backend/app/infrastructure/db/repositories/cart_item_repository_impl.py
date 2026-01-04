"""カートアイテムリポジトリ実装"""

from sqlalchemy.orm import Session

from app.domain.entities.cart_item import CartItem
from app.domain.repositories.cart_item_repository import ICartItemRepository
from app.infrastructure.db.models.cart_item_model import CartItemModel


class CartItemRepositoryImpl(ICartItemRepository):
    """カートアイテムリポジトリの実装"""

    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, item_id: int) -> CartItem | None:
        """IDでカートアイテムを取得"""
        cart_item_model = (
            self.session.query(CartItemModel)
            .filter(CartItemModel.id == item_id)
            .first()
        )
        if cart_item_model is None:
            return None
        return self._to_entity(cart_item_model)

    def get_by_user_id(self, user_id: int) -> list[CartItem]:
        """ユーザーIDでカートアイテム一覧を取得"""
        cart_item_models = (
            self.session.query(CartItemModel)
            .filter(CartItemModel.user_id == user_id)
            .order_by(CartItemModel.created_at.desc())
            .all()
        )
        return [self._to_entity(model) for model in cart_item_models]

    def get_by_user_and_product(
        self, user_id: int, product_id: str
    ) -> CartItem | None:
        """ユーザーIDと商品IDでカートアイテムを取得"""
        cart_item_model = (
            self.session.query(CartItemModel)
            .filter(
                CartItemModel.user_id == user_id,
                CartItemModel.product_id == product_id,
            )
            .first()
        )
        if cart_item_model is None:
            return None
        return self._to_entity(cart_item_model)

    def create(self, cart_item: CartItem) -> CartItem:
        """カートアイテムを作成"""
        cart_item_model = CartItemModel(
            user_id=cart_item.user_id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            options=cart_item.options,
        )
        self.session.add(cart_item_model)
        self.session.flush()
        return self._to_entity(cart_item_model)

    def update(self, cart_item: CartItem) -> CartItem:
        """カートアイテムを更新"""
        cart_item_model = (
            self.session.query(CartItemModel)
            .filter(CartItemModel.id == cart_item.id)
            .first()
        )
        if cart_item_model is None:
            raise ValueError(f'CartItem with id {cart_item.id} not found')

        cart_item_model.quantity = cart_item.quantity
        cart_item_model.options = cart_item.options

        self.session.flush()
        return self._to_entity(cart_item_model)

    def delete(self, item_id: int) -> bool:
        """カートアイテムを削除"""
        cart_item_model = (
            self.session.query(CartItemModel)
            .filter(CartItemModel.id == item_id)
            .first()
        )
        if cart_item_model is None:
            return False

        self.session.delete(cart_item_model)
        self.session.flush()
        return True

    def delete_all_by_user_id(self, user_id: int) -> int:
        """ユーザーのカートを全て削除"""
        deleted_count = (
            self.session.query(CartItemModel)
            .filter(CartItemModel.user_id == user_id)
            .delete()
        )
        self.session.flush()
        return deleted_count

    def count_by_user_id(self, user_id: int) -> int:
        """ユーザーのカートアイテム数を取得"""
        return (
            self.session.query(CartItemModel)
            .filter(CartItemModel.user_id == user_id)
            .count()
        )

    def _to_entity(self, cart_item_model: CartItemModel) -> CartItem:
        """DBモデルをエンティティに変換"""
        return CartItem(
            id=cart_item_model.id,
            user_id=cart_item_model.user_id,
            product_id=cart_item_model.product_id,
            quantity=cart_item_model.quantity,
            options=cart_item_model.options,
            created_at=cart_item_model.created_at,
            updated_at=cart_item_model.updated_at,
        )
