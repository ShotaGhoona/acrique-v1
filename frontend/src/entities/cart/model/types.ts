// === カートアイテム型 ===
export interface CartItem {
  id: number;
  product_id: string;
  product_name: string | null;
  product_name_ja: string | null;
  product_image_url: string | null;
  base_price: number;
  quantity: number;
  options: Record<string, unknown> | null;
  subtotal: number;
  created_at: string | null;
  updated_at: string | null;
}

// === カート取得 ===
export interface GetCartResponse {
  items: CartItem[];
  item_count: number;
  total_quantity: number;
  subtotal: number;
  tax: number;
  total: number;
}

// === カート追加 ===
export interface AddToCartRequest {
  product_id: string;
  quantity?: number;
  options?: Record<string, unknown>;
}

export interface AddToCartResponse {
  item: CartItem;
  message: string;
}

// === カートアイテム更新 ===
export interface UpdateCartItemRequest {
  quantity?: number;
  options?: Record<string, unknown>;
}

export interface UpdateCartItemResponse {
  item: CartItem;
  message: string;
}

// === カートアイテム削除 ===
export interface DeleteCartItemResponse {
  message: string;
}

// === カート全削除 ===
export interface ClearCartResponse {
  deleted_count: number;
  message: string;
}
