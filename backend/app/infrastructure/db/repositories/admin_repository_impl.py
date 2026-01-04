"""管理者リポジトリ実装"""

from datetime import datetime

from sqlalchemy.orm import Session

from app.domain.entities.admin import Admin, AdminLog, AdminRole
from app.domain.repositories.admin_repository import IAdminLogRepository, IAdminRepository
from app.infrastructure.db.models.admin_model import AdminLogModel, AdminModel


class AdminRepositoryImpl(IAdminRepository):
    """管理者リポジトリ実装"""

    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_id(self, admin_id: int) -> Admin | None:
        """IDで管理者を取得"""
        model = self.session.query(AdminModel).filter(AdminModel.id == admin_id).first()
        return self._to_entity(model) if model else None

    def get_by_email(self, email: str) -> Admin | None:
        """メールアドレスで管理者を取得"""
        model = self.session.query(AdminModel).filter(AdminModel.email == email).first()
        return self._to_entity(model) if model else None

    def get_all(
        self,
        role: AdminRole | None = None,
        is_active: bool | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[Admin]:
        """管理者一覧を取得"""
        query = self.session.query(AdminModel)
        if role is not None:
            query = query.filter(AdminModel.role == role.value)
        if is_active is not None:
            query = query.filter(AdminModel.is_active == is_active)
        query = query.order_by(AdminModel.created_at.desc())
        models = query.offset(offset).limit(limit).all()
        return [self._to_entity(m) for m in models]

    def count_all(
        self,
        role: AdminRole | None = None,
        is_active: bool | None = None,
    ) -> int:
        """管理者数を取得"""
        query = self.session.query(AdminModel)
        if role is not None:
            query = query.filter(AdminModel.role == role.value)
        if is_active is not None:
            query = query.filter(AdminModel.is_active == is_active)
        return query.count()

    def create(self, admin: Admin) -> Admin:
        """管理者を作成"""
        model = AdminModel(
            email=admin.email,
            password_hash=admin.password_hash,
            name=admin.name,
            role=admin.role.value,
            is_active=admin.is_active,
        )
        self.session.add(model)
        self.session.flush()
        return self._to_entity(model)

    def update(self, admin: Admin) -> Admin:
        """管理者を更新"""
        model = self.session.query(AdminModel).filter(AdminModel.id == admin.id).first()
        if model:
            model.email = admin.email
            model.name = admin.name
            model.role = admin.role.value
            model.is_active = admin.is_active
            if admin.password_hash != model.password_hash:
                model.password_hash = admin.password_hash
            self.session.flush()
        return self._to_entity(model)

    def update_last_login(self, admin_id: int, last_login_at: datetime) -> bool:
        """最終ログイン日時を更新"""
        model = self.session.query(AdminModel).filter(AdminModel.id == admin_id).first()
        if model:
            model.last_login_at = last_login_at
            self.session.flush()
            return True
        return False

    def delete(self, admin_id: int) -> bool:
        """管理者を削除"""
        model = self.session.query(AdminModel).filter(AdminModel.id == admin_id).first()
        if model:
            self.session.delete(model)
            self.session.flush()
            return True
        return False

    def _to_entity(self, model: AdminModel) -> Admin:
        """モデルをエンティティに変換"""
        return Admin(
            id=model.id,
            email=model.email,
            password_hash=model.password_hash,
            name=model.name,
            role=AdminRole(model.role),
            is_active=model.is_active,
            last_login_at=model.last_login_at,
            created_at=model.created_at,
        )


class AdminLogRepositoryImpl(IAdminLogRepository):
    """管理者操作ログリポジトリ実装"""

    def __init__(self, session: Session) -> None:
        self.session = session

    def create(self, log: AdminLog) -> AdminLog:
        """操作ログを作成"""
        model = AdminLogModel(
            admin_id=log.admin_id,
            action=log.action,
            target_type=log.target_type,
            target_id=log.target_id,
            details=log.details,
            ip_address=log.ip_address,
        )
        self.session.add(model)
        self.session.flush()
        return self._to_entity(model)

    def get_by_admin_id(
        self,
        admin_id: int,
        limit: int = 50,
        offset: int = 0,
    ) -> list[AdminLog]:
        """管理者IDで操作ログを取得"""
        models = (
            self.session.query(AdminLogModel)
            .filter(AdminLogModel.admin_id == admin_id)
            .order_by(AdminLogModel.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
        return [self._to_entity(m) for m in models]

    def get_all(
        self,
        admin_id: int | None = None,
        action: str | None = None,
        target_type: str | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[AdminLog]:
        """操作ログ一覧を取得（フィルタリング対応）"""
        query = self.session.query(AdminLogModel)

        if admin_id is not None:
            query = query.filter(AdminLogModel.admin_id == admin_id)
        if action:
            query = query.filter(AdminLogModel.action == action)
        if target_type:
            query = query.filter(AdminLogModel.target_type == target_type)
        if date_from:
            query = query.filter(AdminLogModel.created_at >= date_from)
        if date_to:
            query = query.filter(AdminLogModel.created_at <= date_to)

        query = query.order_by(AdminLogModel.created_at.desc())
        models = query.offset(offset).limit(limit).all()
        return [self._to_entity(m) for m in models]

    def count_all(
        self,
        admin_id: int | None = None,
        action: str | None = None,
        target_type: str | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
    ) -> int:
        """操作ログ数を取得"""
        query = self.session.query(AdminLogModel)

        if admin_id is not None:
            query = query.filter(AdminLogModel.admin_id == admin_id)
        if action:
            query = query.filter(AdminLogModel.action == action)
        if target_type:
            query = query.filter(AdminLogModel.target_type == target_type)
        if date_from:
            query = query.filter(AdminLogModel.created_at >= date_from)
        if date_to:
            query = query.filter(AdminLogModel.created_at <= date_to)

        return query.count()

    def _to_entity(self, model: AdminLogModel) -> AdminLog:
        """モデルをエンティティに変換"""
        return AdminLog(
            id=model.id,
            admin_id=model.admin_id,
            action=model.action,
            target_type=model.target_type,
            target_id=model.target_id,
            details=model.details,
            ip_address=model.ip_address,
            created_at=model.created_at,
        )
