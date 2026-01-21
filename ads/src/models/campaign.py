"""
キャンペーン設定のpydanticモデル

campaigns/*.yaml を読み込むためのスキーマ定義。
"""

from pydantic import BaseModel, Field
from typing import Literal
from pathlib import Path
import yaml


# =============================================================================
# Meta広告 キャンペーン設定
# =============================================================================

class MetaTargeting(BaseModel):
    """
    Meta広告のターゲティング設定

    TODO: 仮置き - targeting の詳細定義
    """
    # 地域
    geo_locations: dict | None = Field(None, description="地域設定")
    # 例: {"countries": ["JP"], "cities": [{"key": "123456"}]}

    # 年齢
    age_min: int = Field(default=18, ge=13, le=65)
    age_max: int = Field(default=65, ge=13, le=65)

    # 性別: 0=全て, 1=男性, 2=女性
    genders: list[int] | None = Field(None)

    # 興味関心
    interests: list[dict] | None = Field(None)
    # 例: [{"id": "123456", "name": "インテリア"}]

    # TODO: 仮置き - その他のターゲティング
    # behaviors: list[dict] | None = None
    # custom_audiences: list[dict] | None = None
    # excluded_custom_audiences: list[dict] | None = None


class MetaAdConfig(BaseModel):
    """
    Meta広告の広告設定

    TODO: 仮置き - 広告クリエイティブの定義
    """
    name: str
    status: Literal["ACTIVE", "PAUSED"] = "PAUSED"

    # クリエイティブ
    # TODO: 仮置き - creative_id または inline creative
    creative_id: str | None = None

    # インライン定義（creative_idがない場合）
    image_path: str | None = Field(None, description="画像ファイルパス (assets/creatives/xxx.jpg)")
    video_path: str | None = Field(None, description="動画ファイルパス (assets/creatives/xxx.mp4)")
    primary_text: str | None = Field(None, description="メインテキスト")
    headline: str | None = Field(None, description="見出し")
    description: str | None = Field(None, description="説明文")
    call_to_action: str = Field(default="LEARN_MORE", description="CTAボタン")
    link_url: str | None = Field(None, description="リンク先URL")


class MetaAdSetConfig(BaseModel):
    """
    Meta広告の広告セット設定

    TODO: 仮置き - 広告セット定義
    """
    name: str
    status: Literal["ACTIVE", "PAUSED"] = "PAUSED"

    # 予算
    daily_budget: int | None = Field(None, description="日予算（円）")
    lifetime_budget: int | None = Field(None, description="通算予算（円）")

    # 最適化
    optimization_goal: str = Field(
        default="OFFSITE_CONVERSIONS",
        description="最適化目標 (OFFSITE_CONVERSIONS, LINK_CLICKS, etc.)"
    )
    billing_event: str = Field(default="IMPRESSIONS", description="課金イベント")

    # ターゲティング
    targeting: MetaTargeting

    # 配置
    # TODO: 仮置き - 配置設定
    # publisher_platforms: list[str] | None = None  # ["facebook", "instagram"]
    # instagram_positions: list[str] | None = None  # ["stream", "story", "reels"]

    # 広告
    ads: list[MetaAdConfig] = Field(default_factory=list)


class MetaCampaignConfig(BaseModel):
    """
    Meta広告のキャンペーン設定

    campaigns/meta/*.yaml のスキーマ

    TODO: 仮置き - キャンペーン定義
    """
    # メタデータ
    name: str
    id: str | None = Field(None, description="既存キャンペーンID（更新時）")

    # 設定
    status: Literal["ACTIVE", "PAUSED"] = "PAUSED"
    objective: str = Field(
        default="OUTCOME_SALES",
        description="キャンペーン目的 (OUTCOME_SALES, OUTCOME_LEADS, etc.)"
    )

    # 予算（キャンペーン単位の場合）
    daily_budget: int | None = Field(None, description="日予算（円）- Advantage予算使用時")

    # 広告セット
    adsets: list[MetaAdSetConfig] = Field(default_factory=list)

    @classmethod
    def from_yaml(cls, path: str | Path) -> "MetaCampaignConfig":
        """
        YAMLファイルから読み込む

        TODO: 仮置き - 実装
            with open(path) as f:
                data = yaml.safe_load(f)
            return cls(**data)
        """
        raise NotImplementedError("TODO: from_yaml")


# =============================================================================
# Google広告 キャンペーン設定
# =============================================================================

class GoogleKeywordConfig(BaseModel):
    """
    Google広告のキーワード設定

    TODO: 仮置き - キーワード定義
    """
    text: str = Field(..., description="キーワードテキスト")
    match_type: Literal["EXACT", "PHRASE", "BROAD"] = Field(
        default="PHRASE",
        description="マッチタイプ"
    )
    # TODO: 仮置き - 入札単価
    # cpc_bid_micros: int | None = None


class GoogleAdConfig(BaseModel):
    """
    Google広告の広告設定（レスポンシブ検索広告）

    TODO: 仮置き - RSA定義
    """
    name: str | None = None
    status: Literal["ENABLED", "PAUSED"] = "PAUSED"

    # 見出し（最大15個、最低3個）
    headlines: list[str] = Field(..., min_length=3, max_length=15)

    # 説明文（最大4個、最低2個）
    descriptions: list[str] = Field(..., min_length=2, max_length=4)

    # URL
    final_urls: list[str] = Field(..., min_length=1)
    path1: str | None = Field(None, max_length=15)
    path2: str | None = Field(None, max_length=15)


class GoogleAdGroupConfig(BaseModel):
    """
    Google広告の広告グループ設定

    TODO: 仮置き - 広告グループ定義
    """
    name: str
    status: Literal["ENABLED", "PAUSED"] = "PAUSED"

    # 入札
    cpc_bid_micros: int | None = Field(None, description="CPC入札単価（マイクロ単位）")

    # キーワード
    keywords: list[GoogleKeywordConfig] = Field(default_factory=list)

    # 除外キーワード
    negative_keywords: list[str] = Field(default_factory=list)

    # 広告
    ads: list[GoogleAdConfig] = Field(default_factory=list)


class GoogleCampaignConfig(BaseModel):
    """
    Google広告のキャンペーン設定

    campaigns/google/*.yaml のスキーマ

    TODO: 仮置き - キャンペーン定義
    """
    # メタデータ
    name: str
    id: str | None = Field(None, description="既存キャンペーンID（更新時）")

    # 設定
    status: Literal["ENABLED", "PAUSED"] = "PAUSED"
    advertising_channel_type: Literal["SEARCH", "DISPLAY", "VIDEO"] = "SEARCH"

    # 予算
    daily_budget: int = Field(..., description="日予算（円）")

    # 入札戦略
    bidding_strategy: str = Field(
        default="MAXIMIZE_CONVERSIONS",
        description="入札戦略 (MAXIMIZE_CONVERSIONS, TARGET_CPA, etc.)"
    )
    target_cpa_micros: int | None = Field(None, description="目標CPA（マイクロ単位）")

    # ネットワーク設定
    target_google_search: bool = Field(default=True)
    target_search_network: bool = Field(default=False, description="検索パートナー")
    target_content_network: bool = Field(default=False, description="ディスプレイネットワーク")

    # 地域
    geo_targets: list[str] = Field(default=["JP"], description="地域コード")

    # 言語
    language_codes: list[str] = Field(default=["ja"], description="言語コード")

    # 広告グループ
    adgroups: list[GoogleAdGroupConfig] = Field(default_factory=list)

    # キャンペーン単位の除外キーワード
    negative_keywords: list[str] = Field(default_factory=list)

    @classmethod
    def from_yaml(cls, path: str | Path) -> "GoogleCampaignConfig":
        """
        YAMLファイルから読み込む

        TODO: 仮置き - 実装
            with open(path) as f:
                data = yaml.safe_load(f)
            return cls(**data)
        """
        raise NotImplementedError("TODO: from_yaml")
