import type { CategoryId } from '@/shared/domain/category/model/types';
import type {
  AdminProductDetail,
} from '@/entities/admin-product/model/types';

// 基本情報フォームの型
export interface BasicInfoFormData {
  name: string;
  name_ja: string;
  category_id: CategoryId | '';
  tagline: string;
  description: string;
  long_description: string;
  base_price: string;
  price_note: string;
  lead_time_days: string;
  lead_time_note: string;
  is_featured: boolean;
  requires_upload: boolean;
  upload_type: string;
  upload_note: string;
}

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
