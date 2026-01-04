"""配送先関連のドメイン例外"""

from app.domain.exceptions.base import DomainException


class AddressNotFoundError(DomainException):
    """配送先が見つからない"""

    def __init__(self):
        super().__init__(
            message='配送先が見つかりません',
            code='ADDRESS_NOT_FOUND',
        )
