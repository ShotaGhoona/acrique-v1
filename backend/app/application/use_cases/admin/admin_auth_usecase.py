"""管理者認証ユースケース"""

import logging
from datetime import datetime

from app.application.interfaces.security_service import ISecurityService
from app.application.schemas.admin.admin_auth_schemas import (
    AdminLoginInputDTO,
    AdminLoginOutputDTO,
    AdminLogoutOutputDTO,
    AdminStatusOutputDTO,
)
from app.domain.entities.admin import AdminLog
from app.domain.exceptions.admin import (
    AdminInactiveError,
    AdminInvalidCredentialsError,
    AdminNotFoundError,
)
from app.domain.repositories.admin_repository import IAdminLogRepository, IAdminRepository

logger = logging.getLogger(__name__)


class AdminAuthUsecase:
    """管理者認証ユースケース"""

    def __init__(
        self,
        admin_repository: IAdminRepository,
        admin_log_repository: IAdminLogRepository,
        security_service: ISecurityService,
    ) -> None:
        self.admin_repository = admin_repository
        self.admin_log_repository = admin_log_repository
        self.security_service = security_service

    def login(
        self,
        input_dto: AdminLoginInputDTO,
        ip_address: str | None = None,
    ) -> AdminLoginOutputDTO:
        """管理者ログイン

        Args:
            input_dto: ログイン入力DTO
            ip_address: IPアドレス

        Returns:
            ログイン出力DTO

        Raises:
            AdminInvalidCredentialsError: 認証失敗
            AdminInactiveError: アカウント無効化
        """
        admin = self.admin_repository.get_by_email(input_dto.email)
        if admin is None:
            raise AdminInvalidCredentialsError()

        if not self.security_service.verify_password(
            input_dto.password, admin.password_hash
        ):
            raise AdminInvalidCredentialsError()

        if not admin.is_active:
            raise AdminInactiveError()

        # 最終ログイン日時を更新
        self.admin_repository.update_last_login(admin.id, datetime.utcnow())

        # ログイン履歴を記録
        self.admin_log_repository.create(
            AdminLog(
                admin_id=admin.id,
                action='login',
                target_type='admin',
                target_id=str(admin.id),
                ip_address=ip_address,
            )
        )

        # アクセストークンを生成
        access_token = self.security_service.create_admin_access_token(
            admin.id, admin.role.value
        )

        logger.info(f'Admin logged in: {admin.email}')

        return AdminLoginOutputDTO(
            access_token=access_token,
            admin_id=admin.id,
            name=admin.name,
            role=admin.role,
        )

    def logout(
        self,
        admin_id: int,
        ip_address: str | None = None,
    ) -> AdminLogoutOutputDTO:
        """管理者ログアウト

        Args:
            admin_id: 管理者ID
            ip_address: IPアドレス

        Returns:
            ログアウト出力DTO
        """
        # ログアウト履歴を記録
        self.admin_log_repository.create(
            AdminLog(
                admin_id=admin_id,
                action='logout',
                target_type='admin',
                target_id=str(admin_id),
                ip_address=ip_address,
            )
        )

        return AdminLogoutOutputDTO(message='ログアウトしました')

    def get_status(self, admin_id: int) -> AdminStatusOutputDTO:
        """管理者認証状態を取得

        Args:
            admin_id: 管理者ID

        Returns:
            認証状態出力DTO

        Raises:
            AdminNotFoundError: 管理者が見つからない
        """
        admin = self.admin_repository.get_by_id(admin_id)
        if admin is None:
            raise AdminNotFoundError()

        return AdminStatusOutputDTO(
            is_authenticated=True,
            admin_id=admin.id,
            email=admin.email,
            name=admin.name,
            role=admin.role,
        )
