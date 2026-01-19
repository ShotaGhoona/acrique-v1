import type { UploadStatus } from '@/shared/domain/upload/model/types';

// === 入稿データ型 ===
export interface Upload {
  id: number;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  status: UploadStatus;
  admin_notes: string | null;
  order_id: number | null;
  order_item_id: number | null;
  quantity_index: number;
  created_at: string | null;
}

// === Presigned URL取得 ===
export interface GetPresignedUrlRequest {
  file_name: string;
  content_type: string;
}

export interface GetPresignedUrlResponse {
  upload_url: string;
  file_url: string;
  s3_key: string;
  expires_in: number;
}

// === アップロード完了登録 ===
export interface CreateUploadRequest {
  file_name: string;
  s3_key: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
}

export interface CreateUploadResponse {
  id: number;
  file_name: string;
  file_url: string;
  status: UploadStatus;
  created_at: string | null;
}

// === 入稿データ一覧取得 ===
export interface GetUploadsResponse {
  uploads: Upload[];
}

// === 入稿データ詳細取得 ===
export interface GetUploadResponse {
  upload: Upload;
}

// === 入稿データ削除 ===
export interface DeleteUploadResponse {
  message: string;
}

// === 注文明細への紐付け ===
export interface LinkUploadsRequest {
  upload_ids: number[];
  quantity_index: number;
}

export interface LinkUploadsResponse {
  linked_count: number;
  message: string;
}
