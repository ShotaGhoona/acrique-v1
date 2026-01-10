"""決済関連のドメイン例外"""

from app.domain.exceptions.base import DomainException


class PaymentError(DomainException):
    """決済エラーの基底クラス"""

    def __init__(self, message: str = '決済処理でエラーが発生しました'):
        super().__init__(
            message=message,
            code='PAYMENT_ERROR',
        )


class PaymentIntentCreationError(PaymentError):
    """PaymentIntent作成エラー"""

    def __init__(self, detail: str = '決済の準備に失敗しました'):
        super().__init__(message=detail)
        self.code = 'PAYMENT_INTENT_CREATION_ERROR'


class OrderNotPendingError(PaymentError):
    """注文が支払い待ち状態でない"""

    def __init__(self):
        super().__init__(message='この注文は支払いできる状態ではありません')
        self.code = 'ORDER_NOT_PENDING'


class PaymentAlreadyProcessedError(PaymentError):
    """既に決済処理済み"""

    def __init__(self):
        super().__init__(message='この注文は既に決済済みです')
        self.code = 'PAYMENT_ALREADY_PROCESSED'


class WebhookSignatureError(PaymentError):
    """Webhook署名検証エラー"""

    def __init__(self):
        super().__init__(message='Webhookの署名検証に失敗しました')
        self.code = 'WEBHOOK_SIGNATURE_ERROR'
