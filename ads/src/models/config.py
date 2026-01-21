"""
環境設定のpydanticモデル

environments/*.yaml を読み込むためのスキーマ定義。
"""

from pydantic import BaseModel, Field
from pathlib import Path
import yaml


class MetaAuthConfig(BaseModel):
    """
    Meta広告の認証設定

    TODO: 仮置き - environments/sandbox.yaml の meta セクション
    """
    app_id: str = Field(..., description="Meta App ID")
    app_secret: str = Field(..., description="Meta App Secret")
    access_token: str = Field(..., description="システムユーザーのアクセストークン")
    ad_account_id: str = Field(..., description="広告アカウントID (act_xxxxx形式)")

    # TODO: 仮置き - オプション設定
    # api_version: str = Field(default="v19.0", description="Graph API バージョン")


class GoogleAuthConfig(BaseModel):
    """
    Google広告の認証設定

    TODO: 仮置き - environments/sandbox.yaml の google セクション
    """
    developer_token: str = Field(..., description="Developer Token")
    client_id: str = Field(..., description="OAuth Client ID")
    client_secret: str = Field(..., description="OAuth Client Secret")
    refresh_token: str = Field(..., description="OAuth Refresh Token")
    customer_id: str = Field(..., description="Customer ID (ハイフンなし)")
    login_customer_id: str | None = Field(None, description="MCC使用時のLogin Customer ID")

    # TODO: 仮置き - オプション設定
    # use_proto_plus: bool = Field(default=True)


class EnvironmentConfig(BaseModel):
    """
    環境設定の全体スキーマ

    TODO: 仮置き - environments/sandbox.yaml 全体
    """
    meta: MetaAuthConfig | None = None
    google: GoogleAuthConfig | None = None

    @classmethod
    def from_yaml(cls, path: str | Path) -> "EnvironmentConfig":
        """
        YAMLファイルから設定を読み込む

        TODO: 仮置き - 実装
            with open(path) as f:
                data = yaml.safe_load(f)
            return cls(**data)
        """
        raise NotImplementedError("TODO: from_yaml")

    @classmethod
    def from_env_name(cls, env: str) -> "EnvironmentConfig":
        """
        環境名から設定を読み込む

        TODO: 仮置き - 実装
            path = Path(__file__).parent.parent.parent / "environments" / f"{env}.yaml"
            return cls.from_yaml(path)
        """
        raise NotImplementedError("TODO: from_env_name")


# =============================================================================
# ユーティリティ関数
# =============================================================================

def load_environment(env: str) -> EnvironmentConfig:
    """
    環境設定をロード

    TODO: 仮置き - 実装
        1. 環境変数から読み込み（優先）
        2. environments/{env}.yaml から読み込み
        3. マージして返す
    """
    raise NotImplementedError("TODO: load_environment")
