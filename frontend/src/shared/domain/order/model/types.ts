// === 注文ステータス ===
export type OrderStatus =
  | 'pending' // 支払い待ち（注文作成〜支払い完了）
  | 'reviewing' // 入稿審査中（Admin確認待ち）
  | 'revision_required' // 再入稿待ち（Admin差し戻し後）
  | 'confirmed' // 製作待ち（審査完了 or 入稿不要）
  | 'processing' // 製作中
  | 'shipped' // 発送済み
  | 'delivered' // 完了
  | 'cancelled'; // キャンセル

// === 決済方法 ===
export type PaymentMethod = 'stripe' | 'bank_transfer';

// === Badge Variant 型 ===
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

// === ユーザー向けステータスラベル ===
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: '支払い待ち',
  reviewing: '入稿確認中',
  revision_required: '再入稿待ち',
  confirmed: '製作準備中',
  processing: '製作中',
  shipped: '発送済み',
  delivered: '完了',
  cancelled: 'キャンセル',
};

// === 管理者向けステータスラベル ===
export const ADMIN_ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: '支払待ち',
  reviewing: '入稿確認中',
  revision_required: '再入稿待ち',
  confirmed: '確定',
  processing: '製作中',
  shipped: '発送済み',
  delivered: '配達完了',
  cancelled: 'キャンセル',
};

// === ユーザー向けステータスバッジ色 ===
export const ORDER_STATUS_VARIANTS: Record<OrderStatus, BadgeVariant> = {
  pending: 'default',
  reviewing: 'secondary',
  revision_required: 'default',
  confirmed: 'secondary',
  processing: 'default',
  shipped: 'default',
  delivered: 'outline',
  cancelled: 'destructive',
};

// === 管理者向けステータスバッジ色 ===
export const ADMIN_ORDER_STATUS_VARIANTS: Record<OrderStatus, BadgeVariant> = {
  pending: 'default',
  reviewing: 'secondary',
  revision_required: 'default',
  confirmed: 'secondary',
  processing: 'secondary',
  shipped: 'outline',
  delivered: 'outline',
  cancelled: 'destructive',
};

// === 処理中とみなすステータス一覧 ===
export const PROCESSING_STATUSES: OrderStatus[] = [
  'pending',
  'reviewing',
  'revision_required',
  'confirmed',
  'processing',
];
