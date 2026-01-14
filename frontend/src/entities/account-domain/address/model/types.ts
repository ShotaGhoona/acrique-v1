// === 配送先型 ===
export interface Address {
  id: number;
  label: string | null;
  name: string;
  postal_code: string;
  prefecture: string;
  city: string;
  address1: string;
  address2: string | null;
  phone: string;
  is_default: boolean;
  created_at: string | null;
}

// === 配送先一覧 ===
export interface GetAddressListResponse {
  addresses: Address[];
  total: number;
}

// === 配送先追加 ===
export interface CreateAddressRequest {
  label?: string;
  name: string;
  postal_code: string;
  prefecture: string;
  city: string;
  address1: string;
  address2?: string;
  phone: string;
  is_default?: boolean;
}

export interface CreateAddressResponse {
  address: Address;
  message: string;
}

// === 配送先詳細 ===
export interface GetAddressResponse {
  address: Address;
}

// === 配送先更新 ===
export interface UpdateAddressRequest {
  label?: string;
  name?: string;
  postal_code?: string;
  prefecture?: string;
  city?: string;
  address1?: string;
  address2?: string;
  phone?: string;
}

export interface UpdateAddressResponse {
  address: Address;
  message: string;
}

// === 配送先削除 ===
export interface DeleteAddressResponse {
  message: string;
}

// === デフォルト設定 ===
export interface SetDefaultAddressResponse {
  address: Address;
  message: string;
}
