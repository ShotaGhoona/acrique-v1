"""商品関連のドメイン例外"""

from app.domain.exceptions.base import DomainException


class ProductNotFoundError(DomainException):
    """商品が見つからない"""

    def __init__(
        self, product_id: str | int | None = None, message: str | None = None
    ):
        if message:
            error_message = message
        elif product_id:
            error_message = f'商品が見つかりません: {product_id}'
        else:
            error_message = '商品が見つかりません'
        super().__init__(
            message=error_message,
            code='PRODUCT_NOT_FOUND',
        )


class ProductNotActiveError(DomainException):
    """商品が非公開"""

    def __init__(self, product_name: str | None = None):
        if product_name:
            message = f'この商品は現在購入できません: {product_name}'
        else:
            message = 'この商品は現在購入できません'
        super().__init__(
            message=message,
            code='PRODUCT_NOT_ACTIVE',
        )
