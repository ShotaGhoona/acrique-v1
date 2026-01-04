"""Adminダッシュボード ユースケース"""

from app.application.schemas.admin_dashboard_schemas import (
    DashboardSummaryDTO,
    GetDashboardOutputDTO,
    GetStatsInputDTO,
    GetStatsOutputDTO,
    StatsDataPointDTO,
    StatsSummaryDTO,
)
from app.domain.repositories.order_repository import IOrderRepository
from app.domain.repositories.user_repository import IUserRepository


class AdminDashboardUsecase:
    """Adminダッシュボード ユースケース"""

    def __init__(
        self,
        order_repository: IOrderRepository,
        user_repository: IUserRepository,
    ):
        self.order_repository = order_repository
        self.user_repository = user_repository

    def get_dashboard(self) -> GetDashboardOutputDTO:
        """ダッシュボード情報を取得"""
        today_stats = self.order_repository.get_today_stats()
        pending_count = self.order_repository.get_pending_count()
        processing_count = self.order_repository.get_processing_count()
        new_customers = self.user_repository.count_new_this_month()

        summary = DashboardSummaryDTO(
            today_orders=today_stats['orders'],
            today_revenue=today_stats['revenue'],
            pending_orders=pending_count,
            processing_orders=processing_count,
            new_customers_this_month=new_customers,
        )

        return GetDashboardOutputDTO(summary=summary)

    def get_stats(self, input_dto: GetStatsInputDTO) -> GetStatsOutputDTO:
        """売上統計を取得"""
        from datetime import datetime

        date_from = datetime.combine(input_dto.date_from, datetime.min.time())
        date_to = datetime.combine(input_dto.date_to, datetime.max.time())

        stats_data = self.order_repository.get_stats(
            date_from=date_from,
            date_to=date_to,
            group_by=input_dto.period,
        )

        data_points = [
            StatsDataPointDTO(
                date=item['date'],
                orders=item['orders'],
                revenue=item['revenue'],
            )
            for item in stats_data
        ]

        total_orders = sum(d.orders for d in data_points)
        total_revenue = sum(d.revenue for d in data_points)

        return GetStatsOutputDTO(
            data=data_points,
            summary=StatsSummaryDTO(
                total_orders=total_orders,
                total_revenue=total_revenue,
            ),
        )
