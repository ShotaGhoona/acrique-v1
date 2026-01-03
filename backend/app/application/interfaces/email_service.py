from abc import ABC, abstractmethod


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
