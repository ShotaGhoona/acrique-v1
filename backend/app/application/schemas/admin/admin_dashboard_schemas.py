"""Adminダッシュボード DTOスキーマ"""

from datetime import date

from pydantic import BaseModel, Field

# ========== ダッシュボード概要 ==========


class DashboardSummaryDTO(BaseModel):
    """ダッシュボード概要DTO"""

    today_orders: int
    today_revenue: int
    pending_orders: int
    processing_orders: int
    new_customers_this_month: int


class GetDashboardOutputDTO(BaseModel):
    """ダッシュボード取得出力DTO"""

    summary: DashboardSummaryDTO


# ========== 売上統計 ==========


class StatsDataPointDTO(BaseModel):
    """統計データポイントDTO"""

    date: str  # YYYY-MM-DD or YYYY-WW or YYYY-MM
    orders: int
    revenue: int


class StatsSummaryDTO(BaseModel):
    """統計サマリーDTO"""

    total_orders: int
    total_revenue: int


class GetStatsInputDTO(BaseModel):
    """売上統計取得入力DTO"""

    period: str = Field(default='daily', pattern=r'^(daily|weekly|monthly)$')
    date_from: date
    date_to: date


class GetStatsOutputDTO(BaseModel):
    """売上統計取得出力DTO"""

    data: list[StatsDataPointDTO]
    summary: StatsSummaryDTO
