/**
 * 見積もり ダミーデータ
 * @see docs/requirements/12-データベース設計.md
 */

import { getProductById, type Product } from './products';

// =============================================================================
// 型定義（DB設計に基づく）
// =============================================================================

export type EstimateStatus =
  | 'requested' // 依頼中
  | 'quoted' // 見積もり済み
  | 'approved' // 承認済み
  | 'ordered' // 注文済み
  | 'revision_requested' // 再見積もり依頼
  | 'expired' // 期限切れ
  | 'cancelled'; // キャンセル

export interface Estimate {
  id: number;
  user_id: number;
  estimate_number: string; // EST-240101-001
  status: EstimateStatus;
  subtotal: number | null; // 回答後
  tax: number | null;
  total: number | null;
  valid_until: string | null; // 有効期限
  notes: string; // 顧客備考
  admin_notes: string; // 管理者メモ
  quoted_at: string | null;
  approved_at: string | null;
  converted_order_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface EstimateItem {
  id: number;
  estimate_id: number;
  product_id: string;
  quantity: number;
  options: Record<string, string>;
  unit_price: number | null; // 回答後
  subtotal: number | null;
  notes: string;
}

// 見積もり詳細ページ用の複合型
export interface EstimateDetail extends Estimate {
  items: (EstimateItem & { product?: Product })[];
}

// =============================================================================
// ステータスラベル
// =============================================================================

export const estimateStatusLabels: Record<EstimateStatus, string> = {
  requested: '依頼中',
  quoted: '見積もり回答済み',
  approved: '承認済み',
  ordered: '注文済み',
  revision_requested: '再見積もり依頼中',
  expired: '期限切れ',
  cancelled: 'キャンセル',
};

export const estimateStatusColors: Record<EstimateStatus, string> = {
  requested: 'bg-blue-100 text-blue-800',
  quoted: 'bg-green-100 text-green-800',
  approved: 'bg-cyan-100 text-cyan-800',
  ordered: 'bg-gray-100 text-gray-800',
  revision_requested: 'bg-orange-100 text-orange-800',
  expired: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-500',
};

// =============================================================================
// ダミーデータ - 見積もり
// =============================================================================

export const estimates: Estimate[] = [
  {
    id: 1,
    user_id: 1,
    estimate_number: 'EST-240601-001',
    status: 'quoted',
    subtotal: 85000,
    tax: 8500,
    total: 93500,
    valid_until: '2024-07-01',
    notes: 'オリジナルデザインで50個お願いしたいです。ロゴデータは後日送付します。',
    admin_notes: '特注対応。納期3週間で回答。',
    quoted_at: '2024-06-03T10:00:00Z',
    approved_at: null,
    converted_order_id: null,
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2024-06-03T10:00:00Z',
  },
  {
    id: 2,
    user_id: 1,
    estimate_number: 'EST-240520-002',
    status: 'ordered',
    subtotal: 120000,
    tax: 12000,
    total: 132000,
    valid_until: '2024-06-20',
    notes: '社員表彰用のトロフィーを10個お願いします。刻印あり。',
    admin_notes: '',
    quoted_at: '2024-05-22T10:00:00Z',
    approved_at: '2024-05-25T10:00:00Z',
    converted_order_id: 4,
    created_at: '2024-05-20T10:00:00Z',
    updated_at: '2024-05-25T10:00:00Z',
  },
  {
    id: 3,
    user_id: 2,
    estimate_number: 'EST-240610-003',
    status: 'requested',
    subtotal: null,
    tax: null,
    total: null,
    valid_until: null,
    notes: 'エントランス用の大型看板を検討しています。A1サイズ以上で、バックライト対応が可能かお聞きしたいです。',
    admin_notes: '',
    quoted_at: null,
    approved_at: null,
    converted_order_id: null,
    created_at: '2024-06-10T14:00:00Z',
    updated_at: '2024-06-10T14:00:00Z',
  },
  {
    id: 4,
    user_id: 1,
    estimate_number: 'EST-240401-004',
    status: 'expired',
    subtotal: 35000,
    tax: 3500,
    total: 38500,
    valid_until: '2024-05-01',
    notes: 'メニュースタンド10個',
    admin_notes: '',
    quoted_at: '2024-04-03T10:00:00Z',
    approved_at: null,
    converted_order_id: null,
    created_at: '2024-04-01T10:00:00Z',
    updated_at: '2024-05-02T00:00:00Z',
  },
];

// =============================================================================
// ダミーデータ - 見積もり明細
// =============================================================================

export const estimateItems: EstimateItem[] = [
  // Estimate 1
  {
    id: 1,
    estimate_id: 1,
    product_id: 'qr-cube',
    quantity: 50,
    options: { サイズ: '70mm角', 厚み: '15mm' },
    unit_price: 1700,
    subtotal: 85000,
    notes: 'オリジナルデザイン希望',
  },

  // Estimate 2
  {
    id: 2,
    estimate_id: 2,
    product_id: 'award-trophy',
    quantity: 10,
    options: { サイズ: 'L (高さ25cm)', 刻印: 'あり' },
    unit_price: 12000,
    subtotal: 120000,
    notes: '',
  },

  // Estimate 3
  {
    id: 3,
    estimate_id: 3,
    product_id: 'sign-plate',
    quantity: 1,
    options: { サイズ: 'カスタム（A1以上）', 取付方法: '壁掛け式' },
    unit_price: null,
    subtotal: null,
    notes: 'バックライト対応希望、A1〜A0サイズで検討中',
  },

  // Estimate 4
  {
    id: 4,
    estimate_id: 4,
    product_id: 'menu-stand',
    quantity: 10,
    options: { サイズ: 'A4', タイプ: '両面' },
    unit_price: 3500,
    subtotal: 35000,
    notes: '',
  },
];

// =============================================================================
// ヘルパー関数
// =============================================================================

export const getEstimateById = (id: number): Estimate | undefined => {
  return estimates.find((e) => e.id === id);
};

export const getEstimateByNumber = (estimateNumber: string): Estimate | undefined => {
  return estimates.find((e) => e.estimate_number === estimateNumber);
};

export const getEstimatesByUserId = (userId: number): Estimate[] => {
  return estimates.filter((e) => e.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const getEstimateItems = (estimateId: number): EstimateItem[] => {
  return estimateItems.filter((item) => item.estimate_id === estimateId);
};

export const getEstimateDetail = (estimateId: number): EstimateDetail | undefined => {
  const estimate = getEstimateById(estimateId);
  if (!estimate) return undefined;

  const items = getEstimateItems(estimateId).map((item) => ({
    ...item,
    product: getProductById(item.product_id),
  }));

  return {
    ...estimate,
    items,
  };
};

// 現在のユーザーの見積もり（デモ用 - user_id: 1）
export const currentUserEstimates: Estimate[] = getEstimatesByUserId(1);
