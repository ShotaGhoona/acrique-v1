"""
Meta広告プラットフォーム実装

Facebook Business SDK を使用して Meta広告 API を操作する。
"""

from dataclasses import dataclass
from typing import Any

from .base import BasePlatform, PlanResult, ApplyResult


@dataclass
class MetaConfig:
    """
    Meta広告の認証設定

    TODO: 仮置き - environments/*.yaml から読み込む
    """
    app_id: str
    app_secret: str
    access_token: str
    ad_account_id: str  # "act_123456789" 形式


@dataclass
class MetaCampaignResult:
    """
    Meta広告キャンペーンの結果

    TODO: 仮置き - API レスポンスをマッピング
    """
    id: str
    name: str
    status: str  # "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED"
    objective: str  # "OUTCOME_SALES" | "OUTCOME_LEADS" | etc.
    daily_budget: int | None  # マイクロ単位（1円 = 1,000,000）
    lifetime_budget: int | None
    # TODO: 仮置き - 他のフィールド
    # start_time: datetime
    # stop_time: datetime
    # bid_strategy: str


class MetaPlatform(BasePlatform[Any, MetaCampaignResult]):
    """
    Meta広告プラットフォーム

    TODO: 仮置き - Facebook Business SDK を使用した実装
    """

    def __init__(self, config: MetaConfig) -> None:
        self.config = config
        self._api = None  # TODO: 仮置き - FacebookAdsApi インスタンス
        self._account = None  # TODO: 仮置き - AdAccount インスタンス

    # =========================================================================
    # 初期化
    # =========================================================================

    def _init_api(self) -> None:
        """
        Facebook Business SDK を初期化

        TODO: 仮置き - 実装
            from facebook_business.api import FacebookAdsApi
            from facebook_business.adobjects.adaccount import AdAccount

            FacebookAdsApi.init(
                app_id=self.config.app_id,
                app_secret=self.config.app_secret,
                access_token=self.config.access_token,
            )
            self._api = FacebookAdsApi.get_default_api()
            self._account = AdAccount(self.config.ad_account_id)
        """
        raise NotImplementedError("TODO: _init_api")

    @classmethod
    def from_env(cls, env: str) -> "MetaPlatform":
        """
        環境設定からインスタンスを作成

        TODO: 仮置き - 実装
            config = load_environment(env)
            return cls(config.meta)
        """
        raise NotImplementedError("TODO: from_env")

    # =========================================================================
    # 接続・認証
    # =========================================================================

    def test_connection(self) -> bool:
        """
        接続テスト

        TODO: 仮置き - 実装
            try:
                self._init_api()
                # AdAccountの情報を取得して疎通確認
                self._account.api_get(fields=['name', 'account_status'])
                return True
            except Exception:
                return False
        """
        raise NotImplementedError("TODO: test_connection")

    # =========================================================================
    # キャンペーン CRUD
    # =========================================================================

    def list_campaigns(self) -> list[MetaCampaignResult]:
        """
        キャンペーン一覧を取得

        TODO: 仮置き - 実装
            self._init_api()
            campaigns = self._account.get_campaigns(fields=[
                'id',
                'name',
                'status',
                'objective',
                'daily_budget',
                'lifetime_budget',
            ])
            return [self._to_campaign_result(c) for c in campaigns]
        """
        raise NotImplementedError("TODO: list_campaigns")

    def get_campaign(self, campaign_id: str) -> MetaCampaignResult | None:
        """
        キャンペーン詳細を取得

        TODO: 仮置き - 実装
            from facebook_business.adobjects.campaign import Campaign

            self._init_api()
            try:
                campaign = Campaign(campaign_id)
                campaign.api_get(fields=[...])
                return self._to_campaign_result(campaign)
            except Exception:
                return None
        """
        raise NotImplementedError("TODO: get_campaign")

    def create_campaign(self, config: Any) -> MetaCampaignResult:
        """
        キャンペーンを作成

        TODO: 仮置き - 実装
            self._init_api()

            # キャンペーン作成
            campaign = self._account.create_campaign(params={
                'name': config.name,
                'objective': config.objective,
                'status': 'PAUSED',  # 最初は一時停止で作成
                'special_ad_categories': [],
            })

            # 広告セット作成
            for adset_config in config.adsets:
                adset = campaign.create_ad_set(params={
                    'name': adset_config.name,
                    'billing_event': 'IMPRESSIONS',
                    'optimization_goal': adset_config.optimization_goal,
                    'daily_budget': adset_config.daily_budget,
                    'targeting': adset_config.targeting,
                    'status': 'PAUSED',
                })

                # 広告作成
                for ad_config in adset_config.ads:
                    ad = adset.create_ad(params={
                        'name': ad_config.name,
                        'creative': ad_config.creative,
                        'status': 'PAUSED',
                    })

            return self._to_campaign_result(campaign)
        """
        raise NotImplementedError("TODO: create_campaign")

    def update_campaign(self, campaign_id: str, config: Any) -> MetaCampaignResult:
        """
        キャンペーンを更新

        TODO: 仮置き - 実装
            from facebook_business.adobjects.campaign import Campaign

            self._init_api()
            campaign = Campaign(campaign_id)
            campaign.api_update(params={
                'name': config.name,
                'status': config.status,
                # ...
            })
            return self._to_campaign_result(campaign)
        """
        raise NotImplementedError("TODO: update_campaign")

    def delete_campaign(self, campaign_id: str) -> bool:
        """
        キャンペーンを削除

        TODO: 仮置き - 実装
            from facebook_business.adobjects.campaign import Campaign

            self._init_api()
            campaign = Campaign(campaign_id)
            campaign.api_delete()
            return True
        """
        raise NotImplementedError("TODO: delete_campaign")

    # =========================================================================
    # Plan / Apply
    # =========================================================================

    def plan(self, config: Any) -> list[PlanResult]:
        """
        設定とAPIの状態を比較して差分を計算

        TODO: 仮置き - 実装
            1. config.id があれば既存キャンペーンを取得
            2. なければ新規作成として差分を返す
            3. 各フィールドを比較して変更点を抽出
        """
        raise NotImplementedError("TODO: plan")

    def apply(self, plan_results: list[PlanResult]) -> list[ApplyResult]:
        """
        差分を適用

        TODO: 仮置き - 実装
            results = []
            for plan in plan_results:
                if plan.action == "create":
                    result = self.create_campaign(...)
                elif plan.action == "update":
                    result = self.update_campaign(...)
                elif plan.action == "delete":
                    result = self.delete_campaign(...)
                results.append(ApplyResult(...))
            return results
        """
        raise NotImplementedError("TODO: apply")

    # =========================================================================
    # ヘルパー
    # =========================================================================

    def _to_campaign_result(self, campaign: Any) -> MetaCampaignResult:
        """
        Facebook SDK のオブジェクトを MetaCampaignResult に変換

        TODO: 仮置き - 実装
            return MetaCampaignResult(
                id=campaign['id'],
                name=campaign['name'],
                status=campaign['status'],
                objective=campaign['objective'],
                daily_budget=campaign.get('daily_budget'),
                lifetime_budget=campaign.get('lifetime_budget'),
            )
        """
        raise NotImplementedError("TODO: _to_campaign_result")
