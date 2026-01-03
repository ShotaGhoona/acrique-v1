// 見積もり管理用ダミーデータ

export type EstimateStatus = 'pending' | 'reviewing' | 'quoted' | 'accepted' | 'rejected' | 'expired';

export interface Estimate {
  id: string;
  customerName: string;
  customerEmail: string;
  companyName: string;
  productType: string;
  quantity: number;
  specifications: string;
  quotedAmount: number | null;
  status: EstimateStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
}

export const estimateStatusLabels: Record<EstimateStatus, string> = {
  pending: '未対応',
  reviewing: '確認中',
  quoted: '見積済み',
  accepted: '成約',
  rejected: '不成立',
  expired: '期限切れ',
};

export const estimateStatusColors: Record<EstimateStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'default',
  reviewing: 'secondary',
  quoted: 'outline',
  accepted: 'outline',
  rejected: 'destructive',
  expired: 'destructive',
};

export const dummyEstimates: Estimate[] = [
  {
    id: 'EST-2025-001',
    customerName: '山田太郎',
    customerEmail: 'yamada@company.com',
    companyName: '株式会社サンプル',
    productType: 'アクリルサイネージ',
    quantity: 50,
    specifications: 'サイズ: A2、厚さ: 5mm、印刷: 両面フルカラー',
    quotedAmount: null,
    status: 'pending',
    createdAt: '2025-01-03 10:00:00',
    updatedAt: '2025-01-03 10:00:00',
    expiresAt: null,
  },
  {
    id: 'EST-2025-002',
    customerName: '佐藤美咲',
    customerEmail: 'sato@shop.com',
    companyName: 'ショップABC',
    productType: 'アクリルディスプレイ',
    quantity: 100,
    specifications: 'サイズ: 150x100mm、厚さ: 3mm、カスタム形状',
    quotedAmount: 250000,
    status: 'quoted',
    createdAt: '2025-01-02 14:30:00',
    updatedAt: '2025-01-03 09:00:00',
    expiresAt: '2025-01-17',
  },
  {
    id: 'EST-2025-003',
    customerName: '田中健二',
    customerEmail: 'tanaka@office.com',
    companyName: 'オフィスソリューションズ',
    productType: 'デスクネームプレート',
    quantity: 500,
    specifications: 'サイズ: 100x30mm、レーザー刻印',
    quotedAmount: 375000,
    status: 'accepted',
    createdAt: '2024-12-28 11:00:00',
    updatedAt: '2025-01-02 16:00:00',
    expiresAt: null,
  },
  {
    id: 'EST-2025-004',
    customerName: '鈴木花子',
    customerEmail: 'suzuki@design.com',
    companyName: 'デザインスタジオK',
    productType: 'アクリルアート',
    quantity: 10,
    specifications: '特大サイズ: 1000x600mm、LED照明付き',
    quotedAmount: 450000,
    status: 'rejected',
    createdAt: '2024-12-20 09:00:00',
    updatedAt: '2024-12-25 14:00:00',
    expiresAt: null,
  },
  {
    id: 'EST-2025-005',
    customerName: '高橋誠',
    customerEmail: 'takahashi@event.com',
    companyName: 'イベント企画LLC',
    productType: 'アクリルトロフィー',
    quantity: 30,
    specifications: 'カスタムデザイン、名入れ込み',
    quotedAmount: null,
    status: 'reviewing',
    createdAt: '2025-01-03 08:00:00',
    updatedAt: '2025-01-03 11:00:00',
    expiresAt: null,
  },
];

export const getEstimateById = (id: string): Estimate | undefined => {
  return dummyEstimates.find((estimate) => estimate.id === id);
};
