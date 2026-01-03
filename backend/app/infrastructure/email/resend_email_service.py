import logging

import resend

from app.application.interfaces.email_service import IEmailService
from app.config import get_settings

logger = logging.getLogger(__name__)


class ResendEmailService(IEmailService):
    """Resendを使用したメール送信サービスの実装"""

    def __init__(self):
        settings = get_settings()
        resend.api_key = settings.resend_api_key
        self.from_email = settings.email_from
        self.frontend_url = settings.frontend_url

    def send_verification_email(self, to_email: str, verification_url: str) -> bool:
        """メール認証メールを送信"""
        try:
            resend.Emails.send(
                {
                    'from': self.from_email,
                    'to': [to_email],
                    'subject': '【ACRIQUE】メールアドレスの確認',
                    'html': self._verification_email_template(verification_url),
                }
            )
            logger.info(f'Verification email sent to {to_email}')
            return True
        except Exception as e:
            logger.error(f'Failed to send verification email to {to_email}: {e}')
            return False

    def send_password_reset_email(self, to_email: str, reset_url: str) -> bool:
        """パスワードリセットメールを送信"""
        try:
            resend.Emails.send(
                {
                    'from': self.from_email,
                    'to': [to_email],
                    'subject': '【ACRIQUE】パスワードリセットのご案内',
                    'html': self._password_reset_email_template(reset_url),
                }
            )
            logger.info(f'Password reset email sent to {to_email}')
            return True
        except Exception as e:
            logger.error(f'Failed to send password reset email to {to_email}: {e}')
            return False

    def send_welcome_email(self, to_email: str, user_name: str) -> bool:
        """ウェルカムメールを送信"""
        try:
            resend.Emails.send(
                {
                    'from': self.from_email,
                    'to': [to_email],
                    'subject': '【ACRIQUE】会員登録ありがとうございます',
                    'html': self._welcome_email_template(user_name),
                }
            )
            logger.info(f'Welcome email sent to {to_email}')
            return True
        except Exception as e:
            logger.error(f'Failed to send welcome email to {to_email}: {e}')
            return False

    def _verification_email_template(self, verification_url: str) -> str:
        """メール認証メールのHTMLテンプレート"""
        return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ text-align: center; padding: 20px 0; border-bottom: 1px solid #eee; }}
        .content {{ padding: 30px 0; }}
        .button {{ display: inline-block; padding: 12px 24px; background-color: #000; color: #fff !important; text-decoration: none; border-radius: 4px; }}
        .footer {{ text-align: center; padding: 20px 0; color: #888; font-size: 12px; border-top: 1px solid #eee; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ACRIQUE</h1>
        </div>
        <div class="content">
            <p>ACRIQUEへのご登録ありがとうございます。</p>
            <p>以下のボタンをクリックして、メールアドレスを確認してください。</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{verification_url}" class="button">メールアドレスを確認する</a>
            </p>
            <p>このリンクは24時間有効です。</p>
            <p>ボタンがクリックできない場合は、以下のURLをブラウザにコピー&ペーストしてください：</p>
            <p style="word-break: break-all; color: #666;">{verification_url}</p>
        </div>
        <div class="footer">
            <p>&copy; ACRIQUE All Rights Reserved.</p>
            <p>このメールに心当たりがない場合は、無視していただいて問題ありません。</p>
        </div>
    </div>
</body>
</html>
"""

    def _password_reset_email_template(self, reset_url: str) -> str:
        """パスワードリセットメールのHTMLテンプレート"""
        return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ text-align: center; padding: 20px 0; border-bottom: 1px solid #eee; }}
        .content {{ padding: 30px 0; }}
        .button {{ display: inline-block; padding: 12px 24px; background-color: #000; color: #fff !important; text-decoration: none; border-radius: 4px; }}
        .footer {{ text-align: center; padding: 20px 0; color: #888; font-size: 12px; border-top: 1px solid #eee; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ACRIQUE</h1>
        </div>
        <div class="content">
            <p>パスワードリセットのリクエストを受け付けました。</p>
            <p>以下のボタンをクリックして、新しいパスワードを設定してください。</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{reset_url}" class="button">パスワードを再設定する</a>
            </p>
            <p>このリンクは1時間有効です。</p>
            <p>ボタンがクリックできない場合は、以下のURLをブラウザにコピー&ペーストしてください：</p>
            <p style="word-break: break-all; color: #666;">{reset_url}</p>
        </div>
        <div class="footer">
            <p>&copy; ACRIQUE All Rights Reserved.</p>
            <p>このメールに心当たりがない場合は、無視していただいて問題ありません。</p>
        </div>
    </div>
</body>
</html>
"""

    def _welcome_email_template(self, user_name: str) -> str:
        """ウェルカムメールのHTMLテンプレート"""
        display_name = user_name if user_name else 'お客様'
        return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ text-align: center; padding: 20px 0; border-bottom: 1px solid #eee; }}
        .content {{ padding: 30px 0; }}
        .button {{ display: inline-block; padding: 12px 24px; background-color: #000; color: #fff !important; text-decoration: none; border-radius: 4px; }}
        .footer {{ text-align: center; padding: 20px 0; color: #888; font-size: 12px; border-top: 1px solid #eee; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ACRIQUE</h1>
        </div>
        <div class="content">
            <p>{display_name}様</p>
            <p>ACRIQUEへの会員登録が完了しました。</p>
            <p>ACRIQUEでは、極上のアクリル製品を1個からお作りしています。<br>
            店舗什器、オフィスサイン、記念品など、様々なシーンでご利用いただけます。</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{self.frontend_url}" class="button">商品を見る</a>
            </p>
        </div>
        <div class="footer">
            <p>&copy; ACRIQUE All Rights Reserved.</p>
        </div>
    </div>
</body>
</html>
"""
