// 管理者一覧用ダミーデータ

export type AdminRole = 'super_admin' | 'admin' | 'operator';
export type AdminStatus = 'active' | 'inactive';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastLoginAt: string;
  createdAt: string;
}

export const adminRoleLabels: Record<AdminRole, string> = {
  super_admin: 'スーパー管理者',
  admin: '管理者',
  operator: 'オペレーター',
};

export const adminRoleColors: Record<
  AdminRole,
  'default' | 'secondary' | 'outline'
> = {
  super_admin: 'default',
  admin: 'secondary',
  operator: 'outline',
};

export const adminStatusLabels: Record<AdminStatus, string> = {
  active: '有効',
  inactive: '無効',
};

export const dummyAdmins: AdminUser[] = [
  {
    id: 'ADM-001',
    name: '山田管理者',
    email: 'admin@acrique.com',
    role: 'super_admin',
    status: 'active',
    lastLoginAt: '2025-01-03 09:00:00',
    createdAt: '2024-01-01',
  },
  {
    id: 'ADM-002',
    name: '佐藤運営',
    email: 'sato.admin@acrique.com',
    role: 'admin',
    status: 'active',
    lastLoginAt: '2025-01-03 10:30:00',
    createdAt: '2024-03-15',
  },
  {
    id: 'ADM-003',
    name: '田中オペレーター',
    email: 'tanaka.op@acrique.com',
    role: 'operator',
    status: 'active',
    lastLoginAt: '2025-01-02 18:00:00',
    createdAt: '2024-06-20',
  },
  {
    id: 'ADM-004',
    name: '鈴木サポート',
    email: 'suzuki.op@acrique.com',
    role: 'operator',
    status: 'inactive',
    lastLoginAt: '2024-11-15 14:00:00',
    createdAt: '2024-08-01',
  },
];
