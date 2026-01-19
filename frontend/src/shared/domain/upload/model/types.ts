// === 入稿要件（Product用） ===
export type UploadInputType = 'text' | 'url' | 'date' | 'file';

export interface UploadInputBase {
  type: UploadInputType;
  key: string;
  label: string;
  required: boolean;
}

export interface UploadInputText extends UploadInputBase {
  type: 'text';
  placeholder?: string;
  maxLength?: number;
}

export interface UploadInputUrl extends UploadInputBase {
  type: 'url';
  placeholder?: string;
}

export interface UploadInputDate extends UploadInputBase {
  type: 'date';
}

export interface UploadInputFile extends UploadInputBase {
  type: 'file';
  accept: string;
  maxSizeMB?: number;
  note?: string;
}

export type UploadInput =
  | UploadInputText
  | UploadInputUrl
  | UploadInputDate
  | UploadInputFile;

export interface UploadRequirementsData {
  inputs: UploadInput[];
}

export type UploadRequirements = UploadRequirementsData | null;

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
