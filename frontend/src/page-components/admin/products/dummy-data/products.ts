// 商品管理用ダミーデータ

export type ProductCategory = 'shop' | 'office' | 'you';
export type ProductStatus = 'active' | 'draft' | 'archived';

export interface Product {
  id: string;
  name: string;
  nameJa: string;
  category: ProductCategory;
  price: number;
  stock: number;
  status: ProductStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const categoryLabels: Record<ProductCategory, string> = {
  shop: '店舗向け',
  office: 'オフィス向け',
  you: '個人向け',
};

export const statusLabels: Record<ProductStatus, string> = {
  active: '公開中',
  draft: '下書き',
  archived: 'アーカイブ',
};

export const statusColors: Record<ProductStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'default',
  draft: 'secondary',
  archived: 'outline',
};

export const dummyProducts: Product[] = [
  {
    id: 'PRD-001',
    name: 'Acrylic Keychain',
    nameJa: 'アクリルキーホルダー',
    category: 'you',
    price: 128,
    stock: 500,
    status: 'active',
    description: '高品質なアクリル素材を使用したキーホルダー。',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-03',
  },
  {
    id: 'PRD-002',
    name: 'Acrylic Stand',
    nameJa: 'アクリルスタンド',
    category: 'you',
    price: 380,
    stock: 300,
    status: 'active',
    description: 'オリジナルイラストを美しく飾れるアクリルスタンド。',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-02',
  },
  {
    id: 'PRD-003',
    name: 'Signage Panel',
    nameJa: 'サイネージパネル',
    category: 'shop',
    price: 12000,
    stock: 50,
    status: 'active',
    description: '店舗のディスプレイに最適なサイネージパネル。',
    createdAt: '2024-11-15',
    updatedAt: '2025-01-01',
  },
  {
    id: 'PRD-004',
    name: 'Desk Nameplate',
    nameJa: 'デスクネームプレート',
    category: 'office',
    price: 2500,
    stock: 200,
    status: 'active',
    description: 'オフィスデスク用の高級感あるネームプレート。',
    createdAt: '2024-11-10',
    updatedAt: '2024-12-28',
  },
  {
    id: 'PRD-005',
    name: 'Award Trophy',
    nameJa: 'アワードトロフィー',
    category: 'office',
    price: 8500,
    stock: 30,
    status: 'draft',
    description: '表彰式にふさわしい高品質アクリルトロフィー。',
    createdAt: '2024-12-20',
    updatedAt: '2024-12-25',
  },
  {
    id: 'PRD-006',
    name: 'Menu Stand',
    nameJa: 'メニュースタンド',
    category: 'shop',
    price: 3200,
    stock: 0,
    status: 'archived',
    description: '飲食店向けのメニュースタンド（販売終了）。',
    createdAt: '2024-06-01',
    updatedAt: '2024-11-01',
  },
];

export const getProductById = (id: string): Product | undefined => {
  return dummyProducts.find((product) => product.id === id);
};
