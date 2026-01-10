from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class OrderConfirmationData:
    """注文確認メール用データ"""

    order_number: str
    order_date: str
    total: int
    items: list[dict]  # [{"name": "商品名", "quantity": 1, "price": 1000}, ...]
    shipping_address: str
    user_name: str


class IEmailService(ABC):
    """メール送信サービスのインターフェース"""

    @abstractmethod
    def send_verification_email(self, to_email: str, verification_url: str) -> bool:
        """メール認証メールを送信"""
        pass

    @abstractmethod
    def send_password_reset_email(self, to_email: str, reset_url: str) -> bool:
        """パスワードリセットメールを送信"""
        pass

    @abstractmethod
    def send_welcome_email(self, to_email: str, user_name: str) -> bool:
        """ウェルカムメールを送信"""
        pass

    @abstractmethod
    def send_order_confirmation_email(
        self, to_email: str, order_data: OrderConfirmationData
    ) -> bool:
        """注文確認メールを送信"""
        pass
