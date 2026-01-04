"""Admin操作ログ ユースケース"""

from datetime import datetime

from app.application.schemas.admin_log_schemas import (
    AdminLogDTO,
    GetAdminLogsInputDTO,
    GetAdminLogsOutputDTO,
)
from app.domain.entities.admin import AdminLog
from app.domain.repositories.admin_repository import IAdminLogRepository, IAdminRepository


class AdminLogUsecase:
    """Admin操作ログ ユースケース"""

    def __init__(
        self,
        admin_log_repository: IAdminLogRepository,
        admin_repository: IAdminRepository,
    ):
        self.admin_log_repository = admin_log_repository
        self.admin_repository = admin_repository
        # 管理者名のキャッシュ
        self._admin_name_cache: dict[int, str] = {}

    def get_logs(self, input_dto: GetAdminLogsInputDTO) -> GetAdminLogsOutputDTO:
        """操作ログ一覧を取得"""
        date_from = None
        date_to = None
        if input_dto.date_from:
            date_from = datetime.combine(input_dto.date_from, datetime.min.time())
        if input_dto.date_to:
            date_to = datetime.combine(input_dto.date_to, datetime.max.time())

        logs = self.admin_log_repository.get_all(
            admin_id=input_dto.admin_id,
            action=input_dto.action,
            target_type=input_dto.target_type,
            date_from=date_from,
            date_to=date_to,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )

        total = self.admin_log_repository.count_all(
            admin_id=input_dto.admin_id,
            action=input_dto.action,
            target_type=input_dto.target_type,
            date_from=date_from,
            date_to=date_to,
        )

        return GetAdminLogsOutputDTO(
            logs=[self._to_log_dto(log) for log in logs],
            total=total,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )

    def _get_admin_name(self, admin_id: int) -> str | None:
        """管理者名を取得（キャッシュ付き）"""
        if admin_id not in self._admin_name_cache:
            admin = self.admin_repository.get_by_id(admin_id)
            if admin:
                self._admin_name_cache[admin_id] = admin.name
            else:
                self._admin_name_cache[admin_id] = None
        return self._admin_name_cache.get(admin_id)

    def _to_log_dto(self, log: AdminLog) -> AdminLogDTO:
        """操作ログをDTOに変換"""
        return AdminLogDTO(
            id=log.id,
            admin_id=log.admin_id,
            admin_name=self._get_admin_name(log.admin_id),
            action=log.action,
            target_type=log.target_type,
            target_id=log.target_id,
            details=log.details,
            ip_address=log.ip_address,
            created_at=log.created_at,
        )
