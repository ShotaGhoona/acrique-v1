"""Stripeクライアント初期化"""

import stripe

from app.config import get_settings


def get_stripe_client() -> stripe:
    """Stripeクライアントを取得（APIキー設定済み）"""
    settings = get_settings()
    stripe.api_key = settings.stripe_secret_key
    return stripe
