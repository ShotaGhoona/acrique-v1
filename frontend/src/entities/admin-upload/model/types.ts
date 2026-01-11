import type { UploadStatus } from '@/entities/upload/model/types';

// === Admin用入稿データ型 ===
export interface AdminUpload {
  id: number;
  user_id: number;
  order_id: number | null;
  order_item_id: number | null;
  quantity_index: number;
  file_name: string;
  s3_key: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  upload_type: string | null;
  text_content: string | null;
  status: UploadStatus;
  admin_notes: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string | null;
}

// === Admin入稿データ一覧取得 ===
export interface GetAdminUploadsParams {
  status?: UploadStatus;
  user_id?: number;
  order_id?: number;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export interface GetAdminUploadsResponse {
  uploads: AdminUpload[];
  total: number;
  limit: number;
  offset: number;
}

// === Admin入稿データ詳細取得 ===
export interface GetAdminUploadResponse {
  upload: AdminUpload;
}

// === Admin入稿データ承認 ===
export interface ApproveUploadRequest {
  admin_notes?: string;
}

export interface ApproveUploadResponse {
  upload: AdminUpload;
  message: string;
  order_status_updated: boolean;
}

// === Admin入稿データ差し戻し ===
export interface RejectUploadRequest {
  admin_notes: string;
}

export interface RejectUploadResponse {
  upload: AdminUpload;
  message: string;
  order_status_updated: boolean;
}
