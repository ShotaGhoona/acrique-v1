"""Adminダッシュボード APIエンドポイント"""

from datetime import date

from fastapi import APIRouter, Depends, Query

from app.application.schemas.admin_dashboard_schemas import GetStatsInputDTO
from app.application.use_cases.admin_dashboard_usecase import AdminDashboardUsecase
from app.di.admin_dashboard import get_admin_dashboard_usecase
from app.infrastructure.security.admin_security import AdminAuth, get_current_admin_from_cookie
from app.presentation.schemas.admin_dashboard_schemas import (
    DashboardSummaryResponse,
    GetDashboardResponse,
    GetStatsResponse,
    StatsDataPointResponse,
    StatsSummaryResponse,
)

router = APIRouter(prefix='/admin/dashboard', tags=['Admin Dashboard'])


@router.get('', response_model=GetDashboardResponse)
async def get_dashboard(
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminDashboardUsecase = Depends(get_admin_dashboard_usecase),
) -> GetDashboardResponse:
    """ダッシュボード情報を取得"""
    output = usecase.get_dashboard()

    return GetDashboardResponse(
        summary=DashboardSummaryResponse.from_dto(output.summary)
    )


@router.get('/stats', response_model=GetStatsResponse)
async def get_stats(
    period: str = Query(
        default='daily',
        pattern=r'^(daily|weekly|monthly)$',
        description='集計期間: daily/weekly/monthly',
    ),
    date_from: date = Query(..., description='開始日'),
    date_to: date = Query(..., description='終了日'),
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminDashboardUsecase = Depends(get_admin_dashboard_usecase),
) -> GetStatsResponse:
    """売上統計を取得"""
    input_dto = GetStatsInputDTO(
        period=period,
        date_from=date_from,
        date_to=date_to,
    )
    output = usecase.get_stats(input_dto)

    return GetStatsResponse(
        data=[StatsDataPointResponse.from_dto(d) for d in output.data],
        summary=StatsSummaryResponse.from_dto(output.summary),
    )
