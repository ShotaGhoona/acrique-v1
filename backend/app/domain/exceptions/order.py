"""注文関連のドメイン例外"""

from app.domain.exceptions.base import DomainException


class OrderNotFoundError(DomainException):
    """注文が見つからない"""

    def __init__(self):
        super().__init__(
            message='注文が見つかりません',
            code='ORDER_NOT_FOUND',
        )


class OrderCannotCancelError(DomainException):
    """注文をキャンセルできない"""

    def __init__(self):
        super().__init__(
            message='この注文はキャンセルできません',
            code='ORDER_CANNOT_CANCEL',
        )
