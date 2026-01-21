"""
プラットフォーム共通インターフェース

Meta広告とGoogle広告で共通の操作を抽象化する。
"""

from abc import ABC, abstractmethod
from typing import Any, TypeVar, Generic
from dataclasses import dataclass

# TODO: 仮置き - 型定義
CampaignConfig = TypeVar("CampaignConfig")
CampaignResult = TypeVar("CampaignResult")


@dataclass
class PlanResult:
    """
    plan コマンドの結果

    TODO: 仮置き - 差分表示用のデータ構造
    """
    action: str  # "create" | "update" | "delete" | "no_change"
    platform: str  # "meta" | "google"
    resource_type: str  # "campaign" | "adset" | "ad" | "adgroup" | "keyword"
    resource_id: str | None  # 既存リソースの場合はID
    name: str
    changes: dict[str, tuple[Any, Any]]  # {field: (old_value, new_value)}


@dataclass
class ApplyResult:
    """
    apply コマンドの結果

    TODO: 仮置き - 適用結果のデータ構造
    """
    success: bool
    platform: str
    resource_type: str
    resource_id: str
    name: str
    message: str


class BasePlatform(ABC, Generic[CampaignConfig, CampaignResult]):
    """
    広告プラットフォームの基底クラス

    TODO: 仮置き - Meta/Google で共通のインターフェースを定義
    """

    # =========================================================================
    # 接続・認証
    # =========================================================================

    @abstractmethod
    def test_connection(self) -> bool:
        """
        接続テスト

        Returns:
            bool: 接続成功ならTrue

        TODO: 仮置き - 実装例
            - Meta: AdAccount.get_activities() などで疎通確認
            - Google: GoogleAdsService.search() で疎通確認
        """
        pass

    # =========================================================================
    # キャンペーン CRUD
    # =========================================================================

    @abstractmethod
    def list_campaigns(self) -> list[CampaignResult]:
        """
        キャンペーン一覧を取得

        TODO: 仮置き - 実装例
            - Meta: AdAccount.get_campaigns()
            - Google: GoogleAdsService.search() with GAQL
        """
        pass

    @abstractmethod
    def get_campaign(self, campaign_id: str) -> CampaignResult | None:
        """
        キャンペーン詳細を取得

        TODO: 仮置き - 実装例
            - Meta: Campaign(campaign_id).api_get()
            - Google: GoogleAdsService.search() with WHERE clause
        """
        pass

    @abstractmethod
    def create_campaign(self, config: CampaignConfig) -> CampaignResult:
        """
        キャンペーンを作成

        TODO: 仮置き - 実装例
            - Meta: AdAccount.create_campaign()
            - Google: CampaignService.mutate_campaigns()
        """
        pass

    @abstractmethod
    def update_campaign(self, campaign_id: str, config: CampaignConfig) -> CampaignResult:
        """
        キャンペーンを更新

        TODO: 仮置き - 実装例
            - Meta: Campaign(campaign_id).api_update()
            - Google: CampaignService.mutate_campaigns() with update operation
        """
        pass

    @abstractmethod
    def delete_campaign(self, campaign_id: str) -> bool:
        """
        キャンペーンを削除

        TODO: 仮置き - 実装例
            - Meta: Campaign(campaign_id).api_delete()
            - Google: CampaignService.mutate_campaigns() with remove operation
        """
        pass

    # =========================================================================
    # Plan / Apply
    # =========================================================================

    @abstractmethod
    def plan(self, config: CampaignConfig) -> list[PlanResult]:
        """
        設定とAPIの状態を比較して差分を計算

        TODO: 仮置き - 実装例
            1. config から期待する状態を取得
            2. API から現在の状態を取得
            3. 差分を計算
            4. PlanResult のリストを返す
        """
        pass

    @abstractmethod
    def apply(self, plan_results: list[PlanResult]) -> list[ApplyResult]:
        """
        差分を適用

        TODO: 仮置き - 実装例
            1. PlanResult を順に処理
            2. action に応じて create/update/delete を実行
            3. ApplyResult のリストを返す
        """
        pass


# =============================================================================
# ユーティリティ
# =============================================================================

def load_platform(platform: str, env: str) -> BasePlatform:
    """
    プラットフォームをロード

    TODO: 仮置き - 実装例
        config = load_environment(env)
        if platform == "meta":
            return MetaPlatform(config.meta)
        elif platform == "google":
            return GooglePlatform(config.google)
        else:
            raise ValueError(f"Unknown platform: {platform}")
    """
    raise NotImplementedError("TODO: load_platform")
