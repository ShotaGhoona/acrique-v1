/**
 * カート ダミーデータ
 * @see docs/requirements/12-データベース設計.md
 */

import { getProductById, type Product } from './products';

// =============================================================================
// 型定義（DB設計に基づく）
// =============================================================================

export interface CartItem {
  id: number;
  user_id: number;
  product_id: string;
  quantity: number;
  options: Record<string, string>; // { "サイズ": "70mm角", "厚み": "10mm" }
  created_at: string;
  updated_at: string;
}

// カート表示用の拡張型
export interface CartItemWithProduct extends CartItem {
  product: Product;
  unit_price: number; // オプション込みの単価
  subtotal: number;
}

// カート全体の型
export interface Cart {
  items: CartItemWithProduct[];
  subtotal: number; // 小計
  shipping_fee: number; // 送料
  tax: number; // 消費税
  total: number; // 合計
}

// =============================================================================
// ダミーデータ
// =============================================================================

export const cartItems: CartItem[] = [
  {
    id: 1,
    user_id: 1,
    product_id: 'qr-cube',
    quantity: 3,
    options: { サイズ: '60mm角', 厚み: '10mm', 仕上げ: '鏡面仕上げ' },
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2024-06-01T10:00:00Z',
  },
  {
    id: 2,
    user_id: 1,
    product_id: 'menu-stand',
    quantity: 5,
    options: { サイズ: 'A4', タイプ: '両面' },
    created_at: '2024-06-01T11:00:00Z',
    updated_at: '2024-06-01T11:00:00Z',
  },
  {
    id: 3,
    user_id: 1,
    product_id: 'acrylic-stand',
    quantity: 1,
    options: { サイズ: 'M (12cm)' },
    created_at: '2024-06-02T09:00:00Z',
    updated_at: '2024-06-02T09:00:00Z',
  },
];

// =============================================================================
// 価格計算ヘルパー
// =============================================================================

// オプション込みの単価を計算
const calculateUnitPrice = (productId: string, options: Record<string, string>): number => {
  const product = getProductById(productId);
  if (!product) return 0;

  // TODO: 実際にはproductOptionValuesからprice_diffを取得して計算
  // 今はシンプルにbase_priceを返す
  let price = product.base_price;

  // サイズによる価格差分（簡易実装）
  if (options['サイズ'] === '60mm角') price += 2000;
  if (options['サイズ'] === '80mm角') price += 6000;
  if (options['サイズ'] === 'M (12cm)') price += 1500;

  // その他オプション
  if (options['厚み'] === '15mm') price += 2000;
  if (options['厚み'] === '20mm') price += 4000;
  if (options['仕上げ'] === 'マット仕上げ') price += 1000;

  return price;
};

// =============================================================================
// ヘルパー関数
// =============================================================================

export const getCartItemsByUserId = (userId: number): CartItem[] => {
  return cartItems.filter((item) => item.user_id === userId);
};

export const getCartWithProducts = (userId: number): Cart => {
  const items = getCartItemsByUserId(userId);

  const cartItemsWithProduct: CartItemWithProduct[] = items
    .map((item) => {
      const product = getProductById(item.product_id);
      if (!product) return null;

      const unit_price = calculateUnitPrice(item.product_id, item.options);
      const subtotal = unit_price * item.quantity;

      return {
        ...item,
        product,
        unit_price,
        subtotal,
      };
    })
    .filter((item): item is CartItemWithProduct => item !== null);

  const subtotal = cartItemsWithProduct.reduce((sum, item) => sum + item.subtotal, 0);
  const shipping_fee = subtotal >= 30000 ? 0 : 1000; // 3万円以上で送料無料
  const tax = Math.floor(subtotal * 0.1);
  const total = subtotal + shipping_fee + tax;

  return {
    items: cartItemsWithProduct,
    subtotal,
    shipping_fee,
    tax,
    total,
  };
};

export const getCartItemCount = (userId: number): number => {
  return getCartItemsByUserId(userId).reduce((sum, item) => sum + item.quantity, 0);
};

// 現在のカート（デモ用 - user_id: 1）
export const currentCart: Cart = getCartWithProducts(1);
