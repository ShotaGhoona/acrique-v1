// 注文管理用ダミーデータ

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: '未確認',
  confirmed: '確認済み',
  processing: '製造中',
  shipped: '発送済み',
  delivered: '配達完了',
  cancelled: 'キャンセル',
};

export const orderStatusColors: Record<OrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'default',
  confirmed: 'secondary',
  processing: 'secondary',
  shipped: 'outline',
  delivered: 'outline',
  cancelled: 'destructive',
};

export const dummyOrders: Order[] = [
  {
    id: 'ORD-2025-001',
    customerName: '田中太郎',
    customerEmail: 'tanaka@example.com',
    items: [
      { id: 1, productName: 'アクリルキーホルダー 50mm', quantity: 100, unitPrice: 128, subtotal: 12800 },
    ],
    totalAmount: 12800,
    status: 'pending',
    paymentStatus: 'paid',
    shippingAddress: '東京都渋谷区xxx-xxx',
    createdAt: '2025-01-03 14:30:00',
    updatedAt: '2025-01-03 14:30:00',
  },
  {
    id: 'ORD-2025-002',
    customerName: '佐藤花子',
    customerEmail: 'sato@example.com',
    items: [
      { id: 1, productName: 'アクリルスタンド A5', quantity: 50, unitPrice: 380, subtotal: 19000 },
      { id: 2, productName: 'アクリルスタンド A6', quantity: 30, unitPrice: 220, subtotal: 6600 },
    ],
    totalAmount: 25600,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: '大阪府大阪市xxx-xxx',
    createdAt: '2025-01-03 12:15:00',
    updatedAt: '2025-01-03 13:00:00',
  },
  {
    id: 'ORD-2025-003',
    customerName: '鈴木一郎',
    customerEmail: 'suzuki@example.com',
    items: [
      { id: 1, productName: 'アクリルプレート 300x200mm', quantity: 10, unitPrice: 4500, subtotal: 45000 },
    ],
    totalAmount: 45000,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: '愛知県名古屋市xxx-xxx',
    createdAt: '2025-01-02 10:00:00',
    updatedAt: '2025-01-03 09:00:00',
  },
  {
    id: 'ORD-2025-004',
    customerName: '高橋美咲',
    customerEmail: 'takahashi@example.com',
    items: [
      { id: 1, productName: 'アクリルブロック 50mm', quantity: 20, unitPrice: 445, subtotal: 8900 },
    ],
    totalAmount: 8900,
    status: 'confirmed',
    paymentStatus: 'paid',
    shippingAddress: '福岡県福岡市xxx-xxx',
    createdAt: '2025-01-02 18:45:00',
    updatedAt: '2025-01-02 19:00:00',
  },
  {
    id: 'ORD-2025-005',
    customerName: '渡辺健二',
    customerEmail: 'watanabe@example.com',
    items: [
      { id: 1, productName: 'アクリルパネル 600x400mm', quantity: 5, unitPrice: 13560, subtotal: 67800 },
    ],
    totalAmount: 67800,
    status: 'cancelled',
    paymentStatus: 'refunded',
    shippingAddress: '北海道札幌市xxx-xxx',
    createdAt: '2025-01-02 16:20:00',
    updatedAt: '2025-01-03 10:00:00',
  },
  {
    id: 'ORD-2025-006',
    customerName: '伊藤美穂',
    customerEmail: 'ito@example.com',
    items: [
      { id: 1, productName: 'アクリルキーホルダー 70mm', quantity: 200, unitPrice: 168, subtotal: 33600 },
    ],
    totalAmount: 33600,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: '京都府京都市xxx-xxx',
    createdAt: '2025-01-01 11:00:00',
    updatedAt: '2025-01-03 12:00:00',
  },
];

export const getOrderById = (id: string): Order | undefined => {
  return dummyOrders.find((order) => order.id === id);
};
