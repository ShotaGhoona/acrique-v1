"""カート関連のドメイン例外"""

from app.domain.exceptions.base import DomainException


class CartItemNotFoundError(DomainException):
    """カートアイテムが見つからない"""

    def __init__(self):
        super().__init__(
            message='カートアイテムが見つかりません',
            code='CART_ITEM_NOT_FOUND',
        )


class CartEmptyError(DomainException):
    """カートが空"""

    def __init__(self):
        super().__init__(
            message='カートが空です',
            code='CART_EMPTY',
        )


class NoAvailableProductsError(DomainException):
    """購入可能な商品がない"""

    def __init__(self):
        super().__init__(
            message='購入可能な商品がありません',
            code='NO_AVAILABLE_PRODUCTS',
        )
