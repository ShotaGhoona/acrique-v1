import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductApi } from '@/entities/admin-domain/admin-product/api/admin-product-api';
import { ADMIN_PRODUCT_QUERY_KEY } from '../../get-product/lib/use-admin-product';

interface UploadProductImageParams {
  productId: string;
  file: File;
  alt?: string;
  is_main?: boolean;
  sort_order?: number;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UseUploadProductImageOptions {
  onProgress?: (progress: UploadProgress) => void;
}

export function useUploadProductImage(options?: UseUploadProductImageOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      file,
      alt,
      is_main,
      sort_order,
    }: UploadProductImageParams) => {
      // 1. Presigned URL取得
      const presignedResponse = await adminProductApi.getPresignedUrl(
        productId,
        {
          file_name: file.name,
          content_type: file.type,
        },
      );

      // 2. S3に直接アップロード
      await uploadToS3(presignedResponse.upload_url, file, options?.onProgress);

      // 3. DB登録
      const addResponse = await adminProductApi.addImage(productId, {
        s3_url: presignedResponse.file_url,
        alt,
        is_main,
        sort_order,
      });

      return addResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCT_QUERY_KEY });
    },
  });
}

/**
 * S3にファイルをアップロード
 */
async function uploadToS3(
  uploadUrl: string,
  file: File,
  onProgress?: (progress: UploadProgress) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`S3 upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('S3 upload failed'));
    });

    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}
