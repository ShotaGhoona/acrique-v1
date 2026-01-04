// ダッシュボード用ダミーデータ

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  pendingUploads: number;
  newUsers: number;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  productName: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export const dummyStats: DashboardStats = {
  totalOrders: 1234,
  totalRevenue: 12345678,
  pendingOrders: 23,
  pendingUploads: 8,
  newUsers: 42,
};

export const dummyRecentOrders: RecentOrder[] = [
  {
    id: 'ORD-001',
    customerName: '田中太郎',
    productName: 'アクリルキーホルダー',
    amount: 12800,
    status: 'pending',
    createdAt: '2025-01-03 14:30',
  },
  {
    id: 'ORD-002',
    customerName: '佐藤花子',
    productName: 'アクリルスタンド',
    amount: 25600,
    status: 'processing',
    createdAt: '2025-01-03 12:15',
  },
  {
    id: 'ORD-003',
    customerName: '鈴木一郎',
    productName: 'アクリルプレート',
    amount: 45000,
    status: 'completed',
    createdAt: '2025-01-03 10:00',
  },
  {
    id: 'ORD-004',
    customerName: '高橋美咲',
    productName: 'アクリルブロック',
    amount: 8900,
    status: 'pending',
    createdAt: '2025-01-02 18:45',
  },
  {
    id: 'ORD-005',
    customerName: '渡辺健二',
    productName: 'アクリルパネル',
    amount: 67800,
    status: 'cancelled',
    createdAt: '2025-01-02 16:20',
  },
];

export const dummyRevenueData: RevenueData[] = [
  { month: '8月', revenue: 8500000 },
  { month: '9月', revenue: 9200000 },
  { month: '10月', revenue: 10500000 },
  { month: '11月', revenue: 11800000 },
  { month: '12月', revenue: 15200000 },
  { month: '1月', revenue: 12300000 },
];
