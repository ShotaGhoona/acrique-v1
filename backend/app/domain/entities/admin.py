"""管理者エンティティ"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr


class AdminRole(str, Enum):
    """管理者権限"""

    SUPER_ADMIN = 'super_admin'
    ADMIN = 'admin'
    STAFF = 'staff'


class Admin(BaseModel):
    """管理者エンティティ"""

    model_config = ConfigDict(from_attributes=True)

    id: int | None = None
    email: EmailStr
    password_hash: str
    name: str
    role: AdminRole
    is_active: bool = True
    last_login_at: datetime | None = None
    created_at: datetime | None = None

    def can_manage_admins(self) -> bool:
        """管理者を管理できるか（super_admin/adminのみ）"""
        return self.role in [AdminRole.SUPER_ADMIN, AdminRole.ADMIN]

    def can_create_role(self, target_role: AdminRole) -> bool:
        """指定された権限の管理者を作成できるか"""
        if self.role == AdminRole.SUPER_ADMIN:
            return True
        if self.role == AdminRole.ADMIN:
            return target_role == AdminRole.STAFF
        return False

    def can_delete_admin(self, target: Admin) -> bool:
        """対象管理者を削除できるか"""
        # 自分自身は削除不可
        if self.id == target.id:
            return False
        # super_adminはsuper_admin以外を削除可能
        if self.role == AdminRole.SUPER_ADMIN:
            return target.role != AdminRole.SUPER_ADMIN
        # adminはstaffのみ削除可能
        if self.role == AdminRole.ADMIN:
            return target.role == AdminRole.STAFF
        return False


class AdminLog(BaseModel):
    """管理者操作ログエンティティ"""

    model_config = ConfigDict(from_attributes=True)

    id: int | None = None
    admin_id: int
    action: str  # login/logout/create/update/delete
    target_type: str  # admin/user/product/order
    target_id: str | None = None
    details: dict[str, Any] | None = None
    ip_address: str | None = None
    created_at: datetime | None = None
