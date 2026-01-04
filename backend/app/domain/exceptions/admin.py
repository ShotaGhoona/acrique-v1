"""管理者関連のドメイン例外"""

from app.domain.exceptions.base import DomainException


class AdminNotFoundError(DomainException):
    """管理者が見つからない"""

    def __init__(self) -> None:
        super().__init__(
            message='管理者が見つかりません',
            code='ADMIN_NOT_FOUND',
        )


class AdminEmailAlreadyExistsError(DomainException):
    """管理者のメールアドレスが既に存在する"""

    def __init__(self) -> None:
        super().__init__(
            message='このメールアドレスは既に登録されています',
            code='ADMIN_EMAIL_ALREADY_EXISTS',
        )


class AdminInactiveError(DomainException):
    """管理者アカウントが無効化されている"""

    def __init__(self) -> None:
        super().__init__(
            message='このアカウントは無効化されています',
            code='ADMIN_INACTIVE',
        )


class AdminInvalidCredentialsError(DomainException):
    """管理者の認証情報が無効"""

    def __init__(self) -> None:
        super().__init__(
            message='メールアドレスまたはパスワードが正しくありません',
            code='ADMIN_INVALID_CREDENTIALS',
        )


class AdminPermissionDeniedError(DomainException):
    """管理者の権限が不足"""

    def __init__(self, action: str = 'この操作を実行する') -> None:
        super().__init__(
            message=f'{action}権限がありません',
            code='ADMIN_PERMISSION_DENIED',
        )


class CannotDeleteSelfError(DomainException):
    """自分自身を削除しようとした"""

    def __init__(self) -> None:
        super().__init__(
            message='自分自身を削除することはできません',
            code='CANNOT_DELETE_SELF',
        )
