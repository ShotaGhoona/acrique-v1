"""認証関連のドメイン例外"""

from app.domain.exceptions.base import DomainException


class EmailAlreadyExistsError(DomainException):
    """メールアドレスが既に登録されている"""

    def __init__(self):
        super().__init__(
            message='このメールアドレスは既に登録されています',
            code='EMAIL_ALREADY_EXISTS',
        )


class InvalidCredentialsError(DomainException):
    """認証情報が無効"""

    def __init__(self):
        super().__init__(
            message='メールアドレスまたはパスワードが正しくありません',
            code='INVALID_CREDENTIALS',
        )


class EmailNotVerifiedError(DomainException):
    """メール認証が完了していない"""

    def __init__(self):
        super().__init__(
            message='メールアドレスが認証されていません。認証メールをご確認ください。',
            code='EMAIL_NOT_VERIFIED',
        )


class InvalidTokenError(DomainException):
    """トークンが無効または期限切れ"""

    def __init__(self):
        super().__init__(
            message='無効または期限切れのトークンです',
            code='INVALID_TOKEN',
        )


class EmailAlreadyVerifiedError(DomainException):
    """メールアドレスが既に認証済み"""

    def __init__(self):
        super().__init__(
            message='このメールアドレスは既に認証済みです',
            code='EMAIL_ALREADY_VERIFIED',
        )
