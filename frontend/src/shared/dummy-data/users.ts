/**
 * ユーザー ダミーデータ
 * @see docs/requirements/12-データベース設計.md
 */

// =============================================================================
// 型定義（DB設計に基づく）
// =============================================================================

export interface User {
  id: number;
  email: string;
  name: string;
  name_kana: string;
  phone: string;
  company: string;
  stripe_customer_id: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: number;
  user_id: number;
  label: string;
  name: string;
  postal_code: string;
  prefecture: string;
  city: string;
  address1: string;
  address2: string;
  phone: string;
  is_default: boolean;
  created_at: string;
}

// =============================================================================
// ダミーデータ - ユーザー
// =============================================================================

export const users: User[] = [
  {
    id: 1,
    email: 'yamada@example.com',
    name: '山田 太郎',
    name_kana: 'ヤマダ タロウ',
    phone: '090-1234-5678',
    company: '株式会社山田商店',
    stripe_customer_id: 'cus_xxx123',
    email_verified_at: '2024-01-15T10:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 2,
    email: 'suzuki@startup.co.jp',
    name: '鈴木 花子',
    name_kana: 'スズキ ハナコ',
    phone: '080-9876-5432',
    company: '株式会社スタートアップ',
    stripe_customer_id: 'cus_xxx456',
    email_verified_at: '2024-02-01T10:00:00Z',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-06-15T00:00:00Z',
  },
  {
    id: 3,
    email: 'tanaka@example.com',
    name: '田中 一郎',
    name_kana: 'タナカ イチロウ',
    phone: '070-1111-2222',
    company: '',
    stripe_customer_id: null,
    email_verified_at: '2024-03-01T10:00:00Z',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
];

// =============================================================================
// ダミーデータ - 配送先
// =============================================================================

export const addresses: Address[] = [
  {
    id: 1,
    user_id: 1,
    label: '会社',
    name: '株式会社山田商店',
    postal_code: '150-0001',
    prefecture: '東京都',
    city: '渋谷区',
    address1: '神宮前1-2-3',
    address2: '山田ビル 5F',
    phone: '03-1234-5678',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    user_id: 1,
    label: '自宅',
    name: '山田 太郎',
    postal_code: '158-0094',
    prefecture: '東京都',
    city: '世田谷区',
    address1: '玉川4-5-6',
    address2: 'グランドハイツ 301',
    phone: '090-1234-5678',
    is_default: false,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    user_id: 2,
    label: 'オフィス',
    name: '株式会社スタートアップ',
    postal_code: '106-0032',
    prefecture: '東京都',
    city: '港区',
    address1: '六本木7-8-9',
    address2: 'スタートアップタワー 10F',
    phone: '03-9876-5432',
    is_default: true,
    created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 4,
    user_id: 3,
    label: '自宅',
    name: '田中 一郎',
    postal_code: '550-0002',
    prefecture: '大阪府',
    city: '大阪市西区',
    address1: '江戸堀1-2-3',
    address2: '',
    phone: '070-1111-2222',
    is_default: true,
    created_at: '2024-03-01T00:00:00Z',
  },
];

// =============================================================================
// ヘルパー関数
// =============================================================================

export const getUserById = (id: number): User | undefined => {
  return users.find((u) => u.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  return users.find((u) => u.email === email);
};

export const getAddressesByUserId = (userId: number): Address[] => {
  return addresses.filter((a) => a.user_id === userId);
};

export const getDefaultAddress = (userId: number): Address | undefined => {
  return addresses.find((a) => a.user_id === userId && a.is_default);
};

export const getAddressById = (id: number): Address | undefined => {
  return addresses.find((a) => a.id === id);
};

// 現在ログイン中のユーザー（デモ用）
export const currentUser: User = users[0];
export const currentUserAddresses: Address[] = getAddressesByUserId(currentUser.id);
