/**
 * 入稿データ ダミーデータ
 * @see docs/requirements/12-データベース設計.md
 */

// =============================================================================
// 型定義（DB設計に基づく）
// =============================================================================

export type UploadStatus =
  | 'submitted' // 入稿済み
  | 'reviewing' // 確認中
  | 'approved' // 承認
  | 'rejected'; // 差し戻し

export type UploadType = 'logo' | 'qr' | 'photo' | 'text';

export interface Upload {
  id: number;
  user_id: number;
  order_id: number | null;
  order_item_id: number | null;
  file_name: string;
  file_url: string;
  file_type: string; // MIMEタイプ
  file_size: number; // bytes
  upload_type: UploadType;
  text_content: string | null; // テキスト入稿の場合
  status: UploadStatus;
  admin_notes: string;
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string;
}

// =============================================================================
// ステータスラベル
// =============================================================================

export const uploadStatusLabels: Record<UploadStatus, string> = {
  submitted: '入稿済み',
  reviewing: '確認中',
  approved: '承認',
  rejected: '差し戻し',
};

export const uploadStatusColors: Record<UploadStatus, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export const uploadTypeLabels: Record<UploadType, string> = {
  logo: 'ロゴデータ',
  qr: 'QRコード',
  photo: '写真',
  text: 'テキスト',
};

// =============================================================================
// ダミーデータ
// =============================================================================

export const uploads: Upload[] = [
  {
    id: 1,
    user_id: 1,
    order_id: 1,
    order_item_id: 1,
    file_name: 'qr-code.png',
    file_url: '/uploads/1/qr-code.png',
    file_type: 'image/png',
    file_size: 25600,
    upload_type: 'qr',
    text_content: null,
    status: 'approved',
    admin_notes: '',
    reviewed_by: 1,
    reviewed_at: '2024-06-02T10:00:00Z',
    created_at: '2024-06-01T15:00:00Z',
  },
  {
    id: 2,
    user_id: 1,
    order_id: 3,
    order_item_id: 4,
    file_name: 'company-logo.ai',
    file_url: '/uploads/2/company-logo.ai',
    file_type: 'application/illustrator',
    file_size: 1048576,
    upload_type: 'logo',
    text_content: null,
    status: 'reviewing',
    admin_notes: '',
    reviewed_by: null,
    reviewed_at: null,
    created_at: '2024-06-10T11:00:00Z',
  },
  {
    id: 3,
    user_id: 1,
    order_id: 3,
    order_item_id: 4,
    file_name: '',
    file_url: '',
    file_type: '',
    file_size: 0,
    upload_type: 'text',
    text_content: '受賞者：山田太郎\n受賞日：2024年6月15日\n表彰理由：2024年度 最優秀営業賞',
    status: 'submitted',
    admin_notes: '',
    reviewed_by: null,
    reviewed_at: null,
    created_at: '2024-06-10T11:05:00Z',
  },
  {
    id: 4,
    user_id: 2,
    order_id: 4,
    order_item_id: 5,
    file_name: 'startup-logo.svg',
    file_url: '/uploads/4/startup-logo.svg',
    file_type: 'image/svg+xml',
    file_size: 15360,
    upload_type: 'logo',
    text_content: null,
    status: 'approved',
    admin_notes: 'ベクターデータ確認OK',
    reviewed_by: 1,
    reviewed_at: '2024-05-21T14:00:00Z',
    created_at: '2024-05-20T16:00:00Z',
  },
  {
    id: 5,
    user_id: 3,
    order_id: null,
    order_item_id: null,
    file_name: 'my-photo.jpg',
    file_url: '/uploads/5/my-photo.jpg',
    file_type: 'image/jpeg',
    file_size: 2097152,
    upload_type: 'photo',
    text_content: null,
    status: 'rejected',
    admin_notes: '解像度が低いため、300dpi以上の画像で再入稿をお願いします。',
    reviewed_by: 2,
    reviewed_at: '2024-06-05T10:00:00Z',
    created_at: '2024-06-04T09:00:00Z',
  },
];

// =============================================================================
// ヘルパー関数
// =============================================================================

export const getUploadById = (id: number): Upload | undefined => {
  return uploads.find((u) => u.id === id);
};

export const getUploadsByOrderId = (orderId: number): Upload[] => {
  return uploads.filter((u) => u.order_id === orderId);
};

export const getUploadsByUserId = (userId: number): Upload[] => {
  return uploads.filter((u) => u.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const getUploadsByOrderItemId = (orderItemId: number): Upload[] => {
  return uploads.filter((u) => u.order_item_id === orderItemId);
};

// 入稿が必要な注文アイテムがあるかチェック
export const hasPendingUploads = (orderId: number): boolean => {
  const orderUploads = getUploadsByOrderId(orderId);
  return orderUploads.some((u) => u.status === 'submitted' || u.status === 'reviewing');
};

// ファイルサイズをフォーマット
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// 現在のユーザーの入稿（デモ用 - user_id: 1）
export const currentUserUploads: Upload[] = getUploadsByUserId(1);
