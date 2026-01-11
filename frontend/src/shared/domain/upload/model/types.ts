// === アップロードステータス ===
export type UploadStatus =
  | 'pending'
  | 'submitted'
  | 'reviewing'
  | 'approved'
  | 'rejected';

export const UPLOAD_STATUS_LABELS: Record<UploadStatus, string> = {
  pending: '確認待ち',
  submitted: '提出済み',
  reviewing: '確認中',
  approved: '承認済み',
  rejected: '差し戻し',
};

export const UPLOAD_STATUS_COLORS: Record<
  UploadStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'default',
  submitted: 'secondary',
  reviewing: 'secondary',
  approved: 'outline',
  rejected: 'destructive',
};

// === アップロード種別 ===
export type UploadType = 'logo' | 'qr' | 'photo' | 'text';

// === アップロード種別ラベル ===
export const UPLOAD_TYPE_LABELS: Record<UploadType, string> = {
  logo: 'ロゴ',
  qr: 'QRコード',
  photo: '写真',
  text: 'テキスト',
};

// === アップロード種別ラベル（詳細版） ===
export const UPLOAD_TYPE_LABELS_DETAIL: Record<UploadType, string> = {
  logo: 'ロゴデータ',
  qr: 'QRコード',
  photo: '写真',
  text: 'テキストデータ',
};

// === アップロード種別の説明 ===
export const UPLOAD_TYPE_DESCRIPTIONS: Record<UploadType, string> = {
  logo: 'ロゴデータをアップロードしてください。AI, EPS, PDF, SVG, PNG形式に対応しています。',
  qr: 'QRコードの元となるURLまたは画像をアップロードしてください。',
  photo: '写真をアップロードしてください。300dpi以上の高解像度画像を推奨します。',
  text: 'テキストデータをアップロードしてください。',
};

// === ヘルパー関数 ===

/**
 * アップロード種別のラベルを取得
 */
export function getUploadTypeLabel(uploadType: UploadType): string {
  return UPLOAD_TYPE_LABELS[uploadType] ?? 'データ';
}

/**
 * アップロード種別の詳細ラベルを取得
 */
export function getUploadTypeLabelDetail(uploadType: UploadType): string {
  return UPLOAD_TYPE_LABELS_DETAIL[uploadType] ?? 'データ';
}

/**
 * アップロード種別の説明を取得
 */
export function getUploadDescription(uploadType: UploadType): string {
  return UPLOAD_TYPE_DESCRIPTIONS[uploadType] ?? 'ファイルをアップロードしてください。';
}
