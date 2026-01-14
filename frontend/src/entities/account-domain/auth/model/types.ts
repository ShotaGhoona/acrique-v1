// === 会員登録 ===
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  name_kana?: string;
  phone?: string;
  company?: string;
}

export interface RegisterResponse {
  user_id: number;
  email: string;
  message: string;
}

// === ログイン ===
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  user_id: number;
}

// === ログアウト ===
export interface LogoutResponse {
  message: string;
}

// === 認証状態 ===
export interface StatusResponse {
  is_authenticated: boolean;
  user_id: number;
  email: string;
  name: string | null;
  is_email_verified: boolean;
}

// === メール認証 ===
export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
  verified_at: string;
}

// === パスワードリセット依頼 ===
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
}

// === パスワードリセット実行 ===
export interface PasswordResetConfirmRequest {
  token: string;
  new_password: string;
}

export interface PasswordResetConfirmResponse {
  message: string;
}

// === メール認証再送信 ===
export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

// === ユーザー型 ===
export interface User {
  id: number;
  email?: string;
  name?: string;
  is_email_verified?: boolean;
}
