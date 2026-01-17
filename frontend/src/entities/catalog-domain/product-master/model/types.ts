// === モデルカテゴリ ===
export type ModelCategory = 'signature' | 'standard' | 'free-cut' | 'structure';

// === 商品マスタ ===
export interface ProductMaster {
  id: string;
  name: string;
  name_en: string | null;
  model_category: ModelCategory | null;
  tagline: string | null;
  description: string | null;
  base_lead_time_days: number | null;
}

// === APIレスポンス ===
export interface ProductMasterListResponse {
  masters: ProductMaster[];
  total: number;
}
