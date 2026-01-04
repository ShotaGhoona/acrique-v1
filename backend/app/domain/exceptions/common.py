"""共通ドメイン例外"""

from app.domain.exceptions.base import DomainException


class NotFoundError(DomainException):
    """リソースが見つからない"""

    def __init__(self, resource: str = 'リソース', message: str | None = None):
        super().__init__(
            message=message or f'{resource}が見つかりません',
            code='NOT_FOUND',
        )


class PermissionDeniedError(DomainException):
    """権限がない"""

    def __init__(self, action: str = 'この操作', message: str | None = None):
        super().__init__(
            message=message or f'{action}を行う権限がありません',
            code='PERMISSION_DENIED',
        )


class OperationFailedError(DomainException):
    """操作に失敗した"""

    def __init__(self, operation: str = '操作', message: str | None = None):
        super().__init__(
            message=message or f'{operation}に失敗しました',
            code='OPERATION_FAILED',
        )


class ValidationError(DomainException):
    """バリデーションエラー"""

    def __init__(self, message: str):
        super().__init__(
            message=message,
            code='VALIDATION_ERROR',
        )
