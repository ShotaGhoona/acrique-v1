import type { CategoryId } from '@/shared/domain/category/model/types';
import type { UploadRequirements } from '@/shared/domain/upload/model/types';
import type { ProductionType } from '@/entities/catalog-domain/product/model/types';

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
  master_id: string;
  production_type: ProductionType;
  upload_requirements: UploadRequirements;
}
