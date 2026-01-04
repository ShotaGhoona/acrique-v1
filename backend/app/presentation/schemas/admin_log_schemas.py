"""Admin操作ログ リクエスト/レスポンススキーマ"""

from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, Field

from app.application.schemas.admin_log_schemas import AdminLogDTO, GetAdminLogsInputDTO


# ========== Response Models ==========


class AdminLogResponse(BaseModel):
    """操作ログレスポンス"""

    id: int
    admin_id: int
    admin_name: str | None
    action: str
    target_type: str
    target_id: str | None
    details: dict[str, Any] | None
    ip_address: str | None
    created_at: datetime

    @classmethod
    def from_dto(cls, dto: AdminLogDTO) -> 'AdminLogResponse':
        return cls(
            id=dto.id,
            admin_id=dto.admin_id,
            admin_name=dto.admin_name,
            action=dto.action,
            target_type=dto.target_type,
            target_id=dto.target_id,
            details=dto.details,
            ip_address=dto.ip_address,
            created_at=dto.created_at,
        )


class GetAdminLogsResponse(BaseModel):
    """操作ログ一覧レスポンス"""

    logs: list[AdminLogResponse]
    total: int
    limit: int
    offset: int


# ========== Request Models (Query Params) ==========


class GetAdminLogsRequest(BaseModel):
    """操作ログ一覧取得リクエスト（クエリパラメータ用）"""

    admin_id: int | None = None
    action: str | None = None
    target_type: str | None = None
    date_from: date | None = None
    date_to: date | None = None
    limit: int = Field(default=20, ge=1, le=100)
    offset: int = Field(default=0, ge=0)

    def to_dto(self) -> GetAdminLogsInputDTO:
        return GetAdminLogsInputDTO(
            admin_id=self.admin_id,
            action=self.action,
            target_type=self.target_type,
            date_from=self.date_from,
            date_to=self.date_to,
            limit=self.limit,
            offset=self.offset,
        )
