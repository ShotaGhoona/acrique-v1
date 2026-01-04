"""ユーザー関連のドメイン例外"""

from app.domain.exceptions.base import DomainException


class UserNotFoundError(DomainException):
    """ユーザーが見つからない"""

    def __init__(self):
        super().__init__(
            message='ユーザーが見つかりません',
            code='USER_NOT_FOUND',
        )


class InvalidPasswordError(DomainException):
    """パスワードが正しくない"""

    def __init__(self):
        super().__init__(
            message='現在のパスワードが正しくありません',
            code='INVALID_PASSWORD',
        )
