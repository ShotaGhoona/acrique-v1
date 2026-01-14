import type { CategoryId } from '@/shared/domain/category/model/types';

// 基本情報フォームの型（フォーム入力用、APIリクエストとは異なる）
export interface BasicInfoFormData {
  name: string;
  name_ja: string;
  category_id: CategoryId | '';
  tagline: string;
  description: string;
  long_description: string;
  base_price: string; // フォームではstring、APIではnumber
  price_note: string;
  lead_time_days: string; // フォームではstring、APIではnumber
  lead_time_note: string;
  is_featured: boolean;
  requires_upload: boolean;
  upload_type: string;
  upload_note: string;
}
