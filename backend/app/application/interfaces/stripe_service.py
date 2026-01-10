"""Stripeサービスインターフェース"""

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class PaymentIntentResult:
    """PaymentIntent作成結果"""

    payment_intent_id: str
    client_secret: str
    amount: int
    status: str


class IStripeService(ABC):
    """Stripeサービスインターフェース"""

    @abstractmethod
    def create_payment_intent(
        self,
        amount: int,
        currency: str = 'jpy',
        customer_id: str | None = None,
        metadata: dict | None = None,
    ) -> PaymentIntentResult:
        """PaymentIntentを作成

        Args:
            amount: 金額（日本円の場合は整数）
            currency: 通貨コード
            customer_id: Stripe顧客ID
            metadata: メタデータ（注文IDなど）

        Returns:
            PaymentIntentResult
        """
        pass

    @abstractmethod
    def retrieve_payment_intent(
        self,
        payment_intent_id: str,
    ) -> PaymentIntentResult:
        """PaymentIntentを取得

        Args:
            payment_intent_id: PaymentIntent ID

        Returns:
            PaymentIntentResult
        """
        pass

    @abstractmethod
    def create_customer(
        self,
        email: str,
        name: str | None = None,
        metadata: dict | None = None,
    ) -> str:
        """Stripe顧客を作成してIDを返す

        Args:
            email: メールアドレス
            name: 顧客名
            metadata: メタデータ

        Returns:
            Stripe顧客ID
        """
        pass

    @abstractmethod
    def construct_webhook_event(
        self,
        payload: bytes,
        sig_header: str,
    ) -> dict:
        """Webhookイベントを構築・検証

        Args:
            payload: リクエストボディ
            sig_header: Stripe-Signatureヘッダー

        Returns:
            Stripeイベントオブジェクト
        """
        pass
