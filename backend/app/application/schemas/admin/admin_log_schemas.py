"""Admin操作ログ DTOスキーマ"""

from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, Field

# ========== 共通DTO ==========


class AdminInfoDTO(BaseModel):
    """管理者情報DTO（ログ表示用）"""

    id: int
    name: str


class AdminLogDTO(BaseModel):
    """操作ログDTO"""

    id: int
    admin_id: int
    admin_name: str | None = None
    action: str
    target_type: str
    target_id: str | None
    details: dict[str, Any] | None
    ip_address: str | None
    created_at: datetime


# ========== ログ一覧 ==========


class GetAdminLogsInputDTO(BaseModel):
    """操作ログ一覧取得入力DTO"""

    admin_id: int | None = None
    action: str | None = None
    target_type: str | None = None
    date_from: date | None = None
    date_to: date | None = None
    limit: int = Field(default=20, ge=1, le=100)
    offset: int = Field(default=0, ge=0)


class GetAdminLogsOutputDTO(BaseModel):
    """操作ログ一覧取得出力DTO"""

    logs: list[AdminLogDTO]
    total: int
    limit: int
    offset: int
