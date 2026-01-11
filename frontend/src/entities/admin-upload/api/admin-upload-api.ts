import httpClient from '@/shared/api/client/http-client';
import type {
  ApproveUploadRequest,
  ApproveUploadResponse,
  GetAdminUploadResponse,
  GetAdminUploadsParams,
  GetAdminUploadsResponse,
  RejectUploadRequest,
  RejectUploadResponse,
} from '../model/types';

/**
 * Admin入稿データAPI
 */
export const adminUploadApi = {
  /**
   * 入稿データ一覧取得
   */
  async getUploads(
    params?: GetAdminUploadsParams,
  ): Promise<GetAdminUploadsResponse> {
    const response = await httpClient.get<GetAdminUploadsResponse>(
      '/api/admin/uploads',
      { params },
    );
    return response.data;
  },

  /**
   * 入稿データ詳細取得
   */
  async getUpload(uploadId: number): Promise<GetAdminUploadResponse> {
    const response = await httpClient.get<GetAdminUploadResponse>(
      `/api/admin/uploads/${uploadId}`,
    );
    return response.data;
  },

  /**
   * 入稿データ承認
   */
  async approveUpload(
    uploadId: number,
    data: ApproveUploadRequest,
  ): Promise<ApproveUploadResponse> {
    const response = await httpClient.post<ApproveUploadResponse>(
      `/api/admin/uploads/${uploadId}/approve`,
      data,
    );
    return response.data;
  },

  /**
   * 入稿データ差し戻し
   */
  async rejectUpload(
    uploadId: number,
    data: RejectUploadRequest,
  ): Promise<RejectUploadResponse> {
    const response = await httpClient.post<RejectUploadResponse>(
      `/api/admin/uploads/${uploadId}/reject`,
      data,
    );
    return response.data;
  },
};
