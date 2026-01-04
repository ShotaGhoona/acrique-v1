"""ドメイン例外モジュール"""

from app.domain.exceptions.address import AddressNotFoundError
from app.domain.exceptions.auth import (
    EmailAlreadyExistsError,
    EmailAlreadyVerifiedError,
    EmailNotVerifiedError,
    InvalidCredentialsError,
    InvalidTokenError,
)
from app.domain.exceptions.base import DomainException
from app.domain.exceptions.cart import (
    CartEmptyError,
    CartItemNotFoundError,
    NoAvailableProductsError,
)
from app.domain.exceptions.common import (
    NotFoundError,
    OperationFailedError,
    PermissionDeniedError,
    ValidationError,
)
from app.domain.exceptions.order import OrderCannotCancelError, OrderNotFoundError
from app.domain.exceptions.product import ProductNotActiveError, ProductNotFoundError
from app.domain.exceptions.user import InvalidPasswordError, UserNotFoundError

__all__ = [
    # Base
    'DomainException',
    # Common
    'NotFoundError',
    'PermissionDeniedError',
    'OperationFailedError',
    'ValidationError',
    # Auth
    'EmailAlreadyExistsError',
    'EmailAlreadyVerifiedError',
    'InvalidCredentialsError',
    'EmailNotVerifiedError',
    'InvalidTokenError',
    # User
    'UserNotFoundError',
    'InvalidPasswordError',
    # Product
    'ProductNotFoundError',
    'ProductNotActiveError',
    # Cart
    'CartItemNotFoundError',
    'CartEmptyError',
    'NoAvailableProductsError',
    # Order
    'OrderNotFoundError',
    'OrderCannotCancelError',
    # Address
    'AddressNotFoundError',
]
