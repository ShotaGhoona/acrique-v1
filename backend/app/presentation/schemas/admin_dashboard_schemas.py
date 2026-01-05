"""Adminダッシュボード リクエスト/レスポンススキーマ"""

from datetime import date

from pydantic import BaseModel, Field

from app.application.schemas.admin_dashboard_schemas import (
    DashboardSummaryDTO,
    GetStatsInputDTO,
    StatsDataPointDTO,
    StatsSummaryDTO,
)

# ========== Response Models ==========


class DashboardSummaryResponse(BaseModel):
    """ダッシュボード概要レスポンス"""

    today_orders: int
    today_revenue: int
    pending_orders: int
    processing_orders: int
    new_customers_this_month: int

    @classmethod
    def from_dto(cls, dto: DashboardSummaryDTO) -> 'DashboardSummaryResponse':
        return cls(
            today_orders=dto.today_orders,
            today_revenue=dto.today_revenue,
            pending_orders=dto.pending_orders,
            processing_orders=dto.processing_orders,
            new_customers_this_month=dto.new_customers_this_month,
        )


class GetDashboardResponse(BaseModel):
    """ダッシュボード取得レスポンス"""

    summary: DashboardSummaryResponse


class StatsDataPointResponse(BaseModel):
    """統計データポイントレスポンス"""

    date: str
    orders: int
    revenue: int

    @classmethod
    def from_dto(cls, dto: StatsDataPointDTO) -> 'StatsDataPointResponse':
        return cls(
            date=dto.date,
            orders=dto.orders,
            revenue=dto.revenue,
        )


class StatsSummaryResponse(BaseModel):
    """統計サマリーレスポンス"""

    total_orders: int
    total_revenue: int

    @classmethod
    def from_dto(cls, dto: StatsSummaryDTO) -> 'StatsSummaryResponse':
        return cls(
            total_orders=dto.total_orders,
            total_revenue=dto.total_revenue,
        )


class GetStatsResponse(BaseModel):
    """売上統計取得レスポンス"""

    data: list[StatsDataPointResponse]
    summary: StatsSummaryResponse


# ========== Request Models (Query Params) ==========


class GetStatsRequest(BaseModel):
    """売上統計取得リクエスト（クエリパラメータ用）"""

    period: str = Field(default='daily', pattern=r'^(daily|weekly|monthly)$')
    date_from: date
    date_to: date

    def to_dto(self) -> GetStatsInputDTO:
        return GetStatsInputDTO(
            period=self.period,
            date_from=self.date_from,
            date_to=self.date_to,
        )
