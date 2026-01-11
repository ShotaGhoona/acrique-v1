import httpClient from '@/shared/api/client/http-client';
import type {
  CreateUploadRequest,
  CreateUploadResponse,
  DeleteUploadResponse,
  GetPresignedUrlRequest,
  GetPresignedUrlResponse,
  GetUploadResponse,
  GetUploadsResponse,
  LinkUploadsRequest,
  LinkUploadsResponse,
} from '../model/types';

/**
 * 入稿データAPI
 */
export const uploadApi = {
  /**
   * Presigned URL取得
   */
  async getPresignedUrl(
    data: GetPresignedUrlRequest,
  ): Promise<GetPresignedUrlResponse> {
    const response = await httpClient.post<GetPresignedUrlResponse>(
      '/api/uploads/presigned',
      data,
    );
    return response.data;
  },

  /**
   * S3へファイルをアップロード
   */
  async uploadToS3(uploadUrl: string, file: File): Promise<void> {
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  },

  /**
   * アップロード完了登録
   */
  async createUpload(data: CreateUploadRequest): Promise<CreateUploadResponse> {
    const response = await httpClient.post<CreateUploadResponse>(
      '/api/uploads',
      data,
    );
    return response.data;
  },

  /**
   * 入稿データ一覧取得
   */
  async getUploads(): Promise<GetUploadsResponse> {
    const response = await httpClient.get<GetUploadsResponse>('/api/uploads');
    return response.data;
  },

  /**
   * 入稿データ詳細取得
   */
  async getUpload(uploadId: number): Promise<GetUploadResponse> {
    const response = await httpClient.get<GetUploadResponse>(
      `/api/uploads/${uploadId}`,
    );
    return response.data;
  },

  /**
   * 入稿データ削除
   */
  async deleteUpload(uploadId: number): Promise<DeleteUploadResponse> {
    const response = await httpClient.delete<DeleteUploadResponse>(
      `/api/uploads/${uploadId}`,
    );
    return response.data;
  },

  /**
   * 注文明細への紐付け
   */
  async linkUploadsToOrderItem(
    orderId: number,
    itemId: number,
    data: LinkUploadsRequest,
  ): Promise<LinkUploadsResponse> {
    const response = await httpClient.put<LinkUploadsResponse>(
      `/api/orders/${orderId}/items/${itemId}/uploads`,
      data,
    );
    return response.data;
  },
};
