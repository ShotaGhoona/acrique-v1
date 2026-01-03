// 顧客管理用ダミーデータ

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string | null;
  totalOrders: number;
  totalSpent: number;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string;
}

export const userStatusLabels: Record<UserStatus, string> = {
  active: 'アクティブ',
  inactive: '非アクティブ',
  suspended: '停止中',
};

export const userStatusColors: Record<UserStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'default',
  inactive: 'secondary',
  suspended: 'destructive',
};

export const dummyUsers: CustomerUser[] = [
  {
    id: 'USR-001',
    name: '田中太郎',
    email: 'tanaka@example.com',
    phone: '03-1234-5678',
    companyName: null,
    totalOrders: 5,
    totalSpent: 45800,
    status: 'active',
    createdAt: '2024-06-15',
    lastLoginAt: '2025-01-03 14:00',
  },
  {
    id: 'USR-002',
    name: '佐藤花子',
    email: 'sato@company.com',
    phone: '06-9876-5432',
    companyName: '株式会社ABC',
    totalOrders: 12,
    totalSpent: 358000,
    status: 'active',
    createdAt: '2024-03-20',
    lastLoginAt: '2025-01-03 10:30',
  },
  {
    id: 'USR-003',
    name: '鈴木一郎',
    email: 'suzuki@office.com',
    phone: '052-111-2222',
    companyName: 'オフィスソリューションズ',
    totalOrders: 8,
    totalSpent: 189000,
    status: 'active',
    createdAt: '2024-05-10',
    lastLoginAt: '2025-01-02 16:45',
  },
  {
    id: 'USR-004',
    name: '高橋美咲',
    email: 'takahashi@example.com',
    phone: '092-333-4444',
    companyName: null,
    totalOrders: 2,
    totalSpent: 12500,
    status: 'inactive',
    createdAt: '2024-10-01',
    lastLoginAt: '2024-11-15 09:00',
  },
  {
    id: 'USR-005',
    name: '渡辺健二',
    email: 'watanabe@shop.com',
    phone: '011-555-6666',
    companyName: 'ショップXYZ',
    totalOrders: 0,
    totalSpent: 0,
    status: 'suspended',
    createdAt: '2024-08-20',
    lastLoginAt: '2024-09-01 12:00',
  },
  {
    id: 'USR-006',
    name: '伊藤美穂',
    email: 'ito@design.com',
    phone: '075-777-8888',
    companyName: 'デザインスタジオM',
    totalOrders: 15,
    totalSpent: 520000,
    status: 'active',
    createdAt: '2024-01-05',
    lastLoginAt: '2025-01-03 11:20',
  },
];

export const getUserById = (id: string): CustomerUser | undefined => {
  return dummyUsers.find((user) => user.id === id);
};
