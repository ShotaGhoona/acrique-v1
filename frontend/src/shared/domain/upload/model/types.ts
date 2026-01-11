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
