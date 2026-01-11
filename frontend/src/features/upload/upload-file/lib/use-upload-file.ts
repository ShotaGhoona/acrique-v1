import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadApi } from '@/entities/upload/api/upload-api';
import type { CreateUploadResponse } from '@/entities/upload/model/types';
import type { UploadType } from '@/shared/domain/upload/model/types';
import { UPLOADS_QUERY_KEY } from '@/shared/api/query-keys';

interface UploadFileParams {
  file: File;
  uploadType: UploadType;
}

interface UploadFileResult {
  upload: CreateUploadResponse;
}

/**
 * ファイルアップロードフック
 *
 * 1. Presigned URL取得
 * 2. S3へファイルアップロード
 * 3. DBに入稿データ登録
 */
export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation<UploadFileResult, Error, UploadFileParams>({
    mutationFn: async ({ file, uploadType }) => {
      // 1. Presigned URL取得
      const presignedResult = await uploadApi.getPresignedUrl({
        file_name: file.name,
        content_type: file.type,
        upload_type: uploadType,
      });

      // 2. S3へファイルアップロード
      await uploadApi.uploadToS3(presignedResult.upload_url, file);

      // 3. DBに入稿データ登録
      const upload = await uploadApi.createUpload({
        file_name: file.name,
        s3_key: presignedResult.s3_key,
        file_url: presignedResult.file_url,
        file_type: file.type,
        file_size: file.size,
        upload_type: uploadType,
      });

      return { upload };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UPLOADS_QUERY_KEY });
    },
  });
}
