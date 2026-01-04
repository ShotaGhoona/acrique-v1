"""Admin操作ログ APIエンドポイント"""

from datetime import date

from fastapi import APIRouter, Depends, Query

from app.application.schemas.admin_log_schemas import GetAdminLogsInputDTO
from app.application.use_cases.admin_log_usecase import AdminLogUsecase
from app.di.admin_log import get_admin_log_usecase
from app.infrastructure.security.admin_security import (
    AdminAuth,
    get_current_admin_from_cookie,
)
from app.presentation.schemas.admin_log_schemas import (
    AdminLogResponse,
    GetAdminLogsResponse,
)

router = APIRouter(prefix='/admin/logs', tags=['Admin Logs'])


@router.get('', response_model=GetAdminLogsResponse)
async def get_logs(
    admin_id: int | None = Query(None, description='管理者IDでフィルタ'),
    action: str | None = Query(None, description='アクションでフィルタ'),
    target_type: str | None = Query(None, description='対象タイプでフィルタ'),
    date_from: date | None = Query(None, description='開始日'),
    date_to: date | None = Query(None, description='終了日'),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminLogUsecase = Depends(get_admin_log_usecase),
) -> GetAdminLogsResponse:
    """操作ログ一覧を取得"""
    input_dto = GetAdminLogsInputDTO(
        admin_id=admin_id,
        action=action,
        target_type=target_type,
        date_from=date_from,
        date_to=date_to,
        limit=limit,
        offset=offset,
    )
    output = usecase.get_logs(input_dto)

    return GetAdminLogsResponse(
        logs=[AdminLogResponse.from_dto(log) for log in output.logs],
        total=output.total,
        limit=output.limit,
        offset=output.offset,
    )
