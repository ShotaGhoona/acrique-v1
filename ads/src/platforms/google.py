"""
Google広告プラットフォーム実装

google-ads Python SDK を使用して Google Ads API を操作する。
"""

from dataclasses import dataclass
from typing import Any

from .base import BasePlatform, PlanResult, ApplyResult


@dataclass
class GoogleConfig:
    """
    Google広告の認証設定

    TODO: 仮置き - environments/*.yaml から読み込む
    """
    developer_token: str
    client_id: str
    client_secret: str
    refresh_token: str
    customer_id: str  # ハイフンなし "1234567890"
    login_customer_id: str | None = None  # MCC使用時


@dataclass
class GoogleCampaignResult:
    """
    Google広告キャンペーンの結果

    TODO: 仮置き - API レスポンスをマッピング
    """
    id: str
    name: str
    status: str  # "ENABLED" | "PAUSED" | "REMOVED"
    advertising_channel_type: str  # "SEARCH" | "DISPLAY" | "VIDEO" | etc.
    budget_amount_micros: int  # マイクロ単位（1円 = 1,000,000）
    # TODO: 仮置き - 他のフィールド
    # bidding_strategy_type: str
    # start_date: str
    # end_date: str


class GooglePlatform(BasePlatform[Any, GoogleCampaignResult]):
    """
    Google広告プラットフォーム

    TODO: 仮置き - google-ads SDK を使用した実装
    """

    def __init__(self, config: GoogleConfig) -> None:
        self.config = config
        self._client = None  # TODO: 仮置き - GoogleAdsClient インスタンス

    # =========================================================================
    # 初期化
    # =========================================================================

    def _init_client(self) -> None:
        """
        Google Ads Client を初期化

        TODO: 仮置き - 実装
            from google.ads.googleads.client import GoogleAdsClient

            self._client = GoogleAdsClient.load_from_dict({
                "developer_token": self.config.developer_token,
                "client_id": self.config.client_id,
                "client_secret": self.config.client_secret,
                "refresh_token": self.config.refresh_token,
                "login_customer_id": self.config.login_customer_id,
                "use_proto_plus": True,
            })
        """
        raise NotImplementedError("TODO: _init_client")

    @classmethod
    def from_env(cls, env: str) -> "GooglePlatform":
        """
        環境設定からインスタンスを作成

        TODO: 仮置き - 実装
            config = load_environment(env)
            return cls(config.google)
        """
        raise NotImplementedError("TODO: from_env")

    # =========================================================================
    # GAQL ヘルパー
    # =========================================================================

    def _search(self, query: str) -> list[Any]:
        """
        GAQL クエリを実行

        TODO: 仮置き - 実装
            self._init_client()
            ga_service = self._client.get_service("GoogleAdsService")
            response = ga_service.search(
                customer_id=self.config.customer_id,
                query=query,
            )
            return list(response)
        """
        raise NotImplementedError("TODO: _search")

    # =========================================================================
    # 接続・認証
    # =========================================================================

    def test_connection(self) -> bool:
        """
        接続テスト

        TODO: 仮置き - 実装
            try:
                self._init_client()
                # 簡単なクエリで疎通確認
                query = "SELECT customer.id FROM customer LIMIT 1"
                self._search(query)
                return True
            except Exception:
                return False
        """
        raise NotImplementedError("TODO: test_connection")

    # =========================================================================
    # キャンペーン CRUD
    # =========================================================================

    def list_campaigns(self) -> list[GoogleCampaignResult]:
        """
        キャンペーン一覧を取得

        TODO: 仮置き - 実装
            query = '''
                SELECT
                    campaign.id,
                    campaign.name,
                    campaign.status,
                    campaign.advertising_channel_type,
                    campaign_budget.amount_micros
                FROM campaign
                WHERE campaign.status != 'REMOVED'
                ORDER BY campaign.id
            '''
            rows = self._search(query)
            return [self._to_campaign_result(row) for row in rows]
        """
        raise NotImplementedError("TODO: list_campaigns")

    def get_campaign(self, campaign_id: str) -> GoogleCampaignResult | None:
        """
        キャンペーン詳細を取得

        TODO: 仮置き - 実装
            query = f'''
                SELECT
                    campaign.id,
                    campaign.name,
                    campaign.status,
                    campaign.advertising_channel_type,
                    campaign_budget.amount_micros
                FROM campaign
                WHERE campaign.id = {campaign_id}
            '''
            rows = self._search(query)
            if rows:
                return self._to_campaign_result(rows[0])
            return None
        """
        raise NotImplementedError("TODO: get_campaign")

    def create_campaign(self, config: Any) -> GoogleCampaignResult:
        """
        キャンペーンを作成

        TODO: 仮置き - 実装
            self._init_client()

            # 1. CampaignBudget 作成
            budget_service = self._client.get_service("CampaignBudgetService")
            budget_operation = self._client.get_type("CampaignBudgetOperation")
            budget = budget_operation.create
            budget.name = f"{config.name}_budget"
            budget.amount_micros = config.daily_budget * 1_000_000
            budget.delivery_method = self._client.enums.BudgetDeliveryMethodEnum.STANDARD

            budget_response = budget_service.mutate_campaign_budgets(
                customer_id=self.config.customer_id,
                operations=[budget_operation],
            )
            budget_resource_name = budget_response.results[0].resource_name

            # 2. Campaign 作成
            campaign_service = self._client.get_service("CampaignService")
            campaign_operation = self._client.get_type("CampaignOperation")
            campaign = campaign_operation.create
            campaign.name = config.name
            campaign.campaign_budget = budget_resource_name
            campaign.advertising_channel_type = (
                self._client.enums.AdvertisingChannelTypeEnum.SEARCH
            )
            campaign.status = self._client.enums.CampaignStatusEnum.PAUSED

            # ネットワーク設定（検索のみ、ディスプレイOFF）
            campaign.network_settings.target_google_search = True
            campaign.network_settings.target_search_network = False
            campaign.network_settings.target_content_network = False

            campaign_response = campaign_service.mutate_campaigns(
                customer_id=self.config.customer_id,
                operations=[campaign_operation],
            )

            # 3. AdGroup 作成
            # ... (config.adgroupsをループ)

            # 4. AdGroupCriterion (キーワード) 作成
            # ... (config.keywordsをループ)

            # 5. AdGroupAd (広告) 作成
            # ... (config.adsをループ)

            return self.get_campaign(campaign_id)
        """
        raise NotImplementedError("TODO: create_campaign")

    def update_campaign(self, campaign_id: str, config: Any) -> GoogleCampaignResult:
        """
        キャンペーンを更新

        TODO: 仮置き - 実装
            self._init_client()
            campaign_service = self._client.get_service("CampaignService")
            campaign_operation = self._client.get_type("CampaignOperation")

            campaign = campaign_operation.update
            campaign.resource_name = f"customers/{self.config.customer_id}/campaigns/{campaign_id}"
            campaign.name = config.name
            campaign.status = self._client.enums.CampaignStatusEnum[config.status]

            # フィールドマスクを設定
            self._client.copy_from(
                campaign_operation.update_mask,
                protobuf_helpers.field_mask(None, campaign._pb),
            )

            campaign_service.mutate_campaigns(
                customer_id=self.config.customer_id,
                operations=[campaign_operation],
            )

            return self.get_campaign(campaign_id)
        """
        raise NotImplementedError("TODO: update_campaign")

    def delete_campaign(self, campaign_id: str) -> bool:
        """
        キャンペーンを削除（REMOVED状態に変更）

        TODO: 仮置き - 実装
            self._init_client()
            campaign_service = self._client.get_service("CampaignService")
            campaign_operation = self._client.get_type("CampaignOperation")

            # Google広告では削除 = REMOVEDステータスに変更
            campaign_operation.remove = (
                f"customers/{self.config.customer_id}/campaigns/{campaign_id}"
            )

            campaign_service.mutate_campaigns(
                customer_id=self.config.customer_id,
                operations=[campaign_operation],
            )

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
            同 meta.py
        """
        raise NotImplementedError("TODO: plan")

    def apply(self, plan_results: list[PlanResult]) -> list[ApplyResult]:
        """
        差分を適用

        TODO: 仮置き - 実装
            同 meta.py
        """
        raise NotImplementedError("TODO: apply")

    # =========================================================================
    # ヘルパー
    # =========================================================================

    def _to_campaign_result(self, row: Any) -> GoogleCampaignResult:
        """
        GAQL レスポンスを GoogleCampaignResult に変換

        TODO: 仮置き - 実装
            return GoogleCampaignResult(
                id=str(row.campaign.id),
                name=row.campaign.name,
                status=row.campaign.status.name,
                advertising_channel_type=row.campaign.advertising_channel_type.name,
                budget_amount_micros=row.campaign_budget.amount_micros,
            )
        """
        raise NotImplementedError("TODO: _to_campaign_result")
