"""管理者管理ユースケース"""

import logging

from app.application.interfaces.security_service import ISecurityService
from app.application.schemas.admin_admin_schemas import (
    AdminDTO,
    CreateAdminInputDTO,
    CreateAdminOutputDTO,
    DeleteAdminOutputDTO,
    GetAdminsInputDTO,
    GetAdminsOutputDTO,
    UpdateAdminInputDTO,
    UpdateAdminOutputDTO,
)
from app.domain.entities.admin import Admin, AdminLog, AdminRole
from app.domain.exceptions.admin import (
    AdminEmailAlreadyExistsError,
    AdminNotFoundError,
    AdminPermissionDeniedError,
    CannotDeleteSelfError,
)
from app.domain.repositories.admin_repository import IAdminLogRepository, IAdminRepository

logger = logging.getLogger(__name__)


class AdminAdminUsecase:
    """管理者管理ユースケース"""

    def __init__(
        self,
        admin_repository: IAdminRepository,
        admin_log_repository: IAdminLogRepository,
        security_service: ISecurityService,
    ) -> None:
        self.admin_repository = admin_repository
        self.admin_log_repository = admin_log_repository
        self.security_service = security_service

    def get_admins(self, input_dto: GetAdminsInputDTO) -> GetAdminsOutputDTO:
        """管理者一覧を取得

        Args:
            input_dto: 管理者一覧取得入力DTO

        Returns:
            管理者一覧取得出力DTO
        """
        admins = self.admin_repository.get_all(
            role=input_dto.role,
            is_active=input_dto.is_active,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )
        total = self.admin_repository.count_all(
            role=input_dto.role,
            is_active=input_dto.is_active,
        )

        return GetAdminsOutputDTO(
            admins=[self._to_admin_dto(a) for a in admins],
            total=total,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )

    def create_admin(
        self,
        current_admin_id: int,
        input_dto: CreateAdminInputDTO,
        ip_address: str | None = None,
    ) -> CreateAdminOutputDTO:
        """管理者を作成

        Args:
            current_admin_id: 操作者の管理者ID
            input_dto: 管理者作成入力DTO
            ip_address: IPアドレス

        Returns:
            管理者作成出力DTO

        Raises:
            AdminEmailAlreadyExistsError: メールアドレスが既に存在
            AdminPermissionDeniedError: 権限不足
        """
        # 重複チェック
        existing = self.admin_repository.get_by_email(input_dto.email)
        if existing:
            raise AdminEmailAlreadyExistsError()

        # 権限チェック
        current_admin = self.admin_repository.get_by_id(current_admin_id)
        if not current_admin.can_create_role(input_dto.role):
            raise AdminPermissionDeniedError(f'{input_dto.role.value}を作成する')

        # パスワードハッシュ化
        password_hash = self.security_service.hash_password(input_dto.password)

        # 管理者作成
        admin = Admin(
            email=input_dto.email,
            password_hash=password_hash,
            name=input_dto.name,
            role=input_dto.role,
        )
        created = self.admin_repository.create(admin)

        # 操作ログ記録
        self.admin_log_repository.create(
            AdminLog(
                admin_id=current_admin_id,
                action='create',
                target_type='admin',
                target_id=str(created.id),
                details={'email': created.email, 'role': created.role.value},
                ip_address=ip_address,
            )
        )

        logger.info(f'Admin created: {created.email} by admin_id={current_admin_id}')

        return CreateAdminOutputDTO(
            admin=self._to_admin_dto(created),
            message='管理者を追加しました',
        )

    def update_admin(
        self,
        current_admin_id: int,
        target_admin_id: int,
        input_dto: UpdateAdminInputDTO,
        ip_address: str | None = None,
    ) -> UpdateAdminOutputDTO:
        """管理者を更新

        Args:
            current_admin_id: 操作者の管理者ID
            target_admin_id: 更新対象の管理者ID
            input_dto: 管理者更新入力DTO
            ip_address: IPアドレス

        Returns:
            管理者更新出力DTO

        Raises:
            AdminNotFoundError: 管理者が見つからない
            AdminEmailAlreadyExistsError: メールアドレスが既に存在
            AdminPermissionDeniedError: 権限不足
        """
        admin = self.admin_repository.get_by_id(target_admin_id)
        if admin is None:
            raise AdminNotFoundError()

        current_admin = self.admin_repository.get_by_id(current_admin_id)

        # 権限チェック（自分自身の編集は許可）
        if current_admin_id != target_admin_id:
            if not current_admin.can_manage_admins():
                raise AdminPermissionDeniedError('管理者を編集する')
            # super_adminの編集はsuper_adminのみ
            if (
                admin.role == AdminRole.SUPER_ADMIN
                and current_admin.role != AdminRole.SUPER_ADMIN
            ):
                raise AdminPermissionDeniedError('super_adminを編集する')

        # メールアドレス重複チェック
        if input_dto.email is not None:
            existing = self.admin_repository.get_by_email(input_dto.email)
            if existing and existing.id != admin.id:
                raise AdminEmailAlreadyExistsError()
            admin.email = input_dto.email

        # 更新
        if input_dto.name is not None:
            admin.name = input_dto.name
        if input_dto.role is not None:
            # roleの変更は権限チェック
            if not current_admin.can_create_role(input_dto.role):
                raise AdminPermissionDeniedError(f'{input_dto.role.value}に変更する')
            admin.role = input_dto.role
        if input_dto.is_active is not None:
            admin.is_active = input_dto.is_active
        if input_dto.password is not None:
            admin.password_hash = self.security_service.hash_password(input_dto.password)

        updated = self.admin_repository.update(admin)

        # 操作ログ記録
        self.admin_log_repository.create(
            AdminLog(
                admin_id=current_admin_id,
                action='update',
                target_type='admin',
                target_id=str(target_admin_id),
                ip_address=ip_address,
            )
        )

        logger.info(f'Admin updated: {updated.email} by admin_id={current_admin_id}')

        return UpdateAdminOutputDTO(
            admin=self._to_admin_dto(updated),
            message='管理者情報を更新しました',
        )

    def delete_admin(
        self,
        current_admin_id: int,
        target_admin_id: int,
        ip_address: str | None = None,
    ) -> DeleteAdminOutputDTO:
        """管理者を削除

        Args:
            current_admin_id: 操作者の管理者ID
            target_admin_id: 削除対象の管理者ID
            ip_address: IPアドレス

        Returns:
            管理者削除出力DTO

        Raises:
            CannotDeleteSelfError: 自分自身を削除しようとした
            AdminNotFoundError: 管理者が見つからない
            AdminPermissionDeniedError: 権限不足
        """
        # 自分自身は削除不可
        if current_admin_id == target_admin_id:
            raise CannotDeleteSelfError()

        admin = self.admin_repository.get_by_id(target_admin_id)
        if admin is None:
            raise AdminNotFoundError()

        current_admin = self.admin_repository.get_by_id(current_admin_id)
        if not current_admin.can_delete_admin(admin):
            raise AdminPermissionDeniedError('この管理者を削除する')

        self.admin_repository.delete(target_admin_id)

        # 操作ログ記録
        self.admin_log_repository.create(
            AdminLog(
                admin_id=current_admin_id,
                action='delete',
                target_type='admin',
                target_id=str(target_admin_id),
                details={'email': admin.email},
                ip_address=ip_address,
            )
        )

        logger.info(f'Admin deleted: {admin.email} by admin_id={current_admin_id}')

        return DeleteAdminOutputDTO(message='管理者を削除しました')

    def _to_admin_dto(self, admin: Admin) -> AdminDTO:
        """AdminエンティティをAdminDTOに変換"""
        return AdminDTO(
            id=admin.id,
            email=admin.email,
            name=admin.name,
            role=admin.role,
            is_active=admin.is_active,
            last_login_at=admin.last_login_at,
            created_at=admin.created_at,
        )
