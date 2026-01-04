// === 注文ステータス ===
export type OrderStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'paid'
  | 'awaiting_data'
  | 'data_reviewing'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// === 決済方法 ===
export type PaymentMethod = 'stripe' | 'bank_transfer';
