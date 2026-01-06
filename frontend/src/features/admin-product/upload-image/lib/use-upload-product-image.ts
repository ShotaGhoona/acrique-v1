import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductApi } from '@/entities/admin-product/api/admin-product-api';
import { ADMIN_PRODUCT_QUERY_KEY } from '../../get-product/lib/use-admin-product';

interface UploadProductImageParams {
  productId: string;
  file: File;
  isMain?: boolean;
  sortOrder?: number;
}

interface UploadResult {
  fileUrl: string;
}

async function uploadProductImage({
  productId,
  file,
  isMain = false,
  sortOrder = 0,
}: UploadProductImageParams): Promise<UploadResult> {
  // 1. 署名付きURLを取得
  const presignedResult = await adminProductApi.getPresignedUrl(productId, {
    file_name: file.name,
    content_type: file.type,
  });

  // 2. S3に直接アップロード
  const uploadResponse = await fetch(presignedResult.upload_url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error('ファイルのアップロードに失敗しました');
  }

  // 3. 画像情報をバックエンドに保存
  await adminProductApi.addImage(productId, {
    url: presignedResult.file_url,
    is_main: isMain,
    sort_order: sortOrder,
  });

  return { fileUrl: presignedResult.file_url };
}

export function useUploadProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProductImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCT_QUERY_KEY });
    },
  });
}
