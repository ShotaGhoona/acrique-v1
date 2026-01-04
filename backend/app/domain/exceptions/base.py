"""ドメイン例外の基底クラス"""


class DomainException(Exception):
    """ドメイン例外の基底クラス

    Attributes:
        message: エラーメッセージ
        code: エラーコード（APIレスポンスで使用）
    """

    def __init__(self, message: str, code: str = 'DOMAIN_ERROR'):
        self.message = message
        self.code = code
        super().__init__(message)

    def __str__(self) -> str:
        return self.message

    def __repr__(self) -> str:
        return f'{self.__class__.__name__}(message={self.message!r}, code={self.code!r})'
