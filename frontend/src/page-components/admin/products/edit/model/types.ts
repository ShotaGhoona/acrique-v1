import type { AdminProductDetail } from '@/entities/admin-domain/admin-product/model/types';
import type { BasicInfoFormData } from '@/features/admin-domain/admin-product/update-product/model/types';

// Re-export for convenience
export type { BasicInfoFormData };

// 各タブで使用する共通のProps
export interface TabProps {
  productId: string;
  product: AdminProductDetail;
}

// 基本情報タブのProps
export interface BasicInfoTabProps extends TabProps {
  formData: BasicInfoFormData;
  onFormDataChange: (data: BasicInfoFormData) => void;
}

// メディアタブのProps
export interface MediaTabProps extends TabProps {}

// 詳細設定タブのProps
export interface DetailsTabProps extends TabProps {}

// プレビューシートのProps
export interface ProductPreviewSheetProps {
  product: AdminProductDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
