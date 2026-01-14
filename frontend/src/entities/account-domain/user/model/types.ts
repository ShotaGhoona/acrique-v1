// === 自分の情報取得 ===
export interface GetMeResponse {
  id: number;
  email: string;
  name: string | null;
  name_kana: string | null;
  phone: string | null;
  company: string | null;
  is_email_verified: boolean;
  created_at: string | null;
}

// === 自分の情報更新 ===
export interface UpdateMeRequest {
  name?: string;
  name_kana?: string;
  phone?: string;
  company?: string;
}

export interface UpdateMeResponse {
  id: number;
  email: string;
  name: string | null;
  name_kana: string | null;
  phone: string | null;
  company: string | null;
  message: string;
}

// === パスワード変更 ===
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

// === ユーザー型 ===
export interface UserProfile {
  id: number;
  email: string;
  name: string | null;
  name_kana: string | null;
  phone: string | null;
  company: string | null;
  is_email_verified: boolean;
  created_at: string | null;
}
