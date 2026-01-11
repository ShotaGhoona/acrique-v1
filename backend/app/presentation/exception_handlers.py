"""例外ハンドラー

ドメイン例外をHTTPレスポンスに変換する
"""

import logging

from fastapi import Request
from fastapi.responses import JSONResponse

from app.domain.exceptions.address import AddressNotFoundError
from app.domain.exceptions.admin import (
    AdminEmailAlreadyExistsError,
    AdminInactiveError,
    AdminInvalidCredentialsError,
    AdminNotFoundError,
    AdminPermissionDeniedError,
    CannotDeleteSelfError,
)
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
from app.domain.exceptions.payment import (
    OrderNotPendingError,
    PaymentAlreadyProcessedError,
    PaymentIntentCreationError,
    WebhookSignatureError,
)
from app.domain.exceptions.product import ProductNotActiveError, ProductNotFoundError
from app.domain.exceptions.upload import (
    FileSizeTooLargeError,
    InvalidContentTypeError,
    InvalidUploadTypeError,
    UploadAlreadyLinkedError,
    UploadNotDeletableError,
    UploadNotFoundError,
    UploadNotOwnedError,
)
from app.domain.exceptions.user import InvalidPasswordError, UserNotFoundError

logger = logging.getLogger(__name__)

# 例外クラスとHTTPステータスコードのマッピング
EXCEPTION_STATUS_MAP: dict[type[DomainException], int] = {
    # 400 Bad Request - バリデーションエラー、ビジネスルール違反
    EmailAlreadyExistsError: 400,
    EmailAlreadyVerifiedError: 400,
    InvalidPasswordError: 400,
    InvalidTokenError: 400,
    ProductNotActiveError: 400,
    CartEmptyError: 400,
    NoAvailableProductsError: 400,
    OrderCannotCancelError: 400,
    OrderNotPendingError: 400,
    PaymentAlreadyProcessedError: 400,
    PaymentIntentCreationError: 400,
    WebhookSignatureError: 400,
    ValidationError: 400,
    AdminEmailAlreadyExistsError: 400,
    CannotDeleteSelfError: 400,
    InvalidContentTypeError: 400,
    InvalidUploadTypeError: 400,
    FileSizeTooLargeError: 400,
    UploadNotDeletableError: 400,
    UploadAlreadyLinkedError: 400,
    # 401 Unauthorized - 認証失敗
    InvalidCredentialsError: 401,
    AdminInvalidCredentialsError: 401,
    # 403 Forbidden - 権限なし
    EmailNotVerifiedError: 403,
    PermissionDeniedError: 403,
    AdminInactiveError: 403,
    AdminPermissionDeniedError: 403,
    UploadNotOwnedError: 403,
    # 404 Not Found - リソースが見つからない
    NotFoundError: 404,
    UserNotFoundError: 404,
    ProductNotFoundError: 404,
    CartItemNotFoundError: 404,
    OrderNotFoundError: 404,
    AddressNotFoundError: 404,
    AdminNotFoundError: 404,
    UploadNotFoundError: 404,
    # 500 Internal Server Error - 操作失敗
    OperationFailedError: 500,
}


async def domain_exception_handler(
    request: Request, exc: DomainException
) -> JSONResponse:
    """ドメイン例外をJSONレスポンスに変換

    Args:
        request: FastAPIリクエスト
        exc: ドメイン例外

    Returns:
        JSONResponse: エラーレスポンス
    """
    # ステータスコードを取得（デフォルトは400）
    status_code = EXCEPTION_STATUS_MAP.get(type(exc), 400)

    # エラーログを出力（500エラーの場合はerror、それ以外はwarning）
    if status_code >= 500:
        logger.error(f'Domain exception: {exc.code} - {exc.message}')
    else:
        logger.warning(f'Domain exception: {exc.code} - {exc.message}')

    return JSONResponse(
        status_code=status_code,
        content={
            'detail': exc.message,
            'code': exc.code,
        },
    )


def register_exception_handlers(app) -> None:
    """FastAPIアプリケーションに例外ハンドラーを登録

    Args:
        app: FastAPIアプリケーション
    """
    app.add_exception_handler(DomainException, domain_exception_handler)
