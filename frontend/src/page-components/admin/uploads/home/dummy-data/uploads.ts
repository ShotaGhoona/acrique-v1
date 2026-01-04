// 入稿データ管理用ダミーデータ

export type UploadStatus =
  | 'pending'
  | 'reviewing'
  | 'approved'
  | 'rejected'
  | 'revision_requested';

export interface UploadData {
  id: string;
  orderId: string;
  customerName: string;
  productName: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  status: UploadStatus;
  reviewNote: string | null;
  uploadedAt: string;
  reviewedAt: string | null;
}

export const uploadStatusLabels: Record<UploadStatus, string> = {
  pending: '確認待ち',
  reviewing: '確認中',
  approved: '承認済み',
  rejected: '却下',
  revision_requested: '修正依頼',
};

export const uploadStatusColors: Record<
  UploadStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'default',
  reviewing: 'secondary',
  approved: 'outline',
  rejected: 'destructive',
  revision_requested: 'destructive',
};

export const dummyUploads: UploadData[] = [
  {
    id: 'UPL-001',
    orderId: 'ORD-2025-001',
    customerName: '田中太郎',
    productName: 'アクリルキーホルダー 50mm',
    fileName: 'keychain_design_v1.ai',
    fileSize: '2.4 MB',
    fileType: 'Adobe Illustrator',
    status: 'pending',
    reviewNote: null,
    uploadedAt: '2025-01-03 15:00:00',
    reviewedAt: null,
  },
  {
    id: 'UPL-002',
    orderId: 'ORD-2025-002',
    customerName: '佐藤花子',
    productName: 'アクリルスタンド A5',
    fileName: 'stand_artwork.psd',
    fileSize: '15.8 MB',
    fileType: 'Photoshop',
    status: 'reviewing',
    reviewNote: null,
    uploadedAt: '2025-01-03 13:30:00',
    reviewedAt: null,
  },
  {
    id: 'UPL-003',
    orderId: 'ORD-2025-003',
    customerName: '鈴木一郎',
    productName: 'アクリルプレート 300x200mm',
    fileName: 'plate_design_final.pdf',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    status: 'approved',
    reviewNote: '問題なし。製造開始可能。',
    uploadedAt: '2025-01-02 11:00:00',
    reviewedAt: '2025-01-02 14:00:00',
  },
  {
    id: 'UPL-004',
    orderId: 'ORD-2025-006',
    customerName: '伊藤美穂',
    productName: 'アクリルキーホルダー 70mm',
    fileName: 'keychain_batch.zip',
    fileSize: '45.2 MB',
    fileType: 'ZIP Archive',
    status: 'revision_requested',
    reviewNote: '解像度が不足しています。300dpi以上でお願いします。',
    uploadedAt: '2025-01-01 16:00:00',
    reviewedAt: '2025-01-02 10:00:00',
  },
  {
    id: 'UPL-005',
    orderId: 'ORD-2025-005',
    customerName: '渡辺健二',
    productName: 'アクリルパネル 600x400mm',
    fileName: 'panel_design.ai',
    fileSize: '8.7 MB',
    fileType: 'Adobe Illustrator',
    status: 'rejected',
    reviewNote: 'カラーモードがRGBです。CMYKに変換してください。',
    uploadedAt: '2025-01-02 17:00:00',
    reviewedAt: '2025-01-02 18:00:00',
  },
];

export const getUploadById = (id: string): UploadData | undefined => {
  return dummyUploads.find((upload) => upload.id === id);
};
