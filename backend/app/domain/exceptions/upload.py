"""入稿データ関連の例外"""

from app.domain.exceptions.base import DomainException


class UploadNotFoundError(DomainException):
    """入稿データが見つからない"""

    def __init__(self) -> None:
        super().__init__(
            message='入稿データが見つかりません',
            code='UPLOAD_NOT_FOUND',
        )


class UploadNotOwnedError(DomainException):
    """入稿データが自分のものではない"""

    def __init__(self) -> None:
        super().__init__(
            message='この入稿データにアクセスする権限がありません',
            code='UPLOAD_NOT_OWNED',
        )


class UploadNotDeletableError(DomainException):
    """入稿データが削除不可"""

    def __init__(self) -> None:
        super().__init__(
            message='注文に紐付けられた入稿データは削除できません',
            code='UPLOAD_NOT_DELETABLE',
        )


class InvalidUploadTypeError(DomainException):
    """無効なアップロード種別"""

    def __init__(self, upload_type: str) -> None:
        super().__init__(
            message=f'無効なアップロード種別です: {upload_type}',
            code='INVALID_UPLOAD_TYPE',
        )


class FileSizeTooLargeError(DomainException):
    """ファイルサイズが大きすぎる"""

    def __init__(self, max_size_mb: int = 20) -> None:
        super().__init__(
            message=f'ファイルサイズは{max_size_mb}MB以下にしてください',
            code='FILE_SIZE_TOO_LARGE',
        )


class InvalidContentTypeError(DomainException):
    """無効なContent-Type"""

    def __init__(self, content_type: str) -> None:
        super().__init__(
            message=f'許可されていないファイル形式です: {content_type}',
            code='INVALID_CONTENT_TYPE',
        )


class UploadAlreadyLinkedError(DomainException):
    """入稿データが既に注文に紐付けられている"""

    def __init__(self) -> None:
        super().__init__(
            message='この入稿データは既に注文に紐付けられています',
            code='UPLOAD_ALREADY_LINKED',
        )
