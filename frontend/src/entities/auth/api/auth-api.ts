import httpClient from '@/shared/api/client/http-client';
import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  PasswordResetConfirmRequest,
  PasswordResetConfirmResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  StatusResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '../model/types';

/**
 * 認証API
 */
export const authApi = {
  /**
   * 会員登録
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await httpClient.post<RegisterResponse>(
      '/api/auth/register',
      data,
    );
    return response.data;
  },

  /**
   * ログイン
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      '/api/auth/login',
      credentials,
    );
    return response.data;
  },

  /**
   * ログアウト
   */
  async logout(): Promise<LogoutResponse> {
    const response = await httpClient.post<LogoutResponse>('/api/auth/logout');
    return response.data;
  },

  /**
   * 認証状態取得
   */
  async getAuthStatus(): Promise<StatusResponse> {
    const response = await httpClient.get<StatusResponse>('/api/auth/status');
    return response.data;
  },

  /**
   * メール認証
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const response = await httpClient.post<VerifyEmailResponse>(
      '/api/auth/verify-email',
      data,
    );
    return response.data;
  },

  /**
   * パスワードリセット依頼
   */
  async requestPasswordReset(
    data: PasswordResetRequest,
  ): Promise<PasswordResetResponse> {
    const response = await httpClient.post<PasswordResetResponse>(
      '/api/auth/password-reset',
      data,
    );
    return response.data;
  },

  /**
   * パスワードリセット実行
   */
  async confirmPasswordReset(
    data: PasswordResetConfirmRequest,
  ): Promise<PasswordResetConfirmResponse> {
    const response = await httpClient.post<PasswordResetConfirmResponse>(
      '/api/auth/password-reset/confirm',
      data,
    );
    return response.data;
  },

  /**
   * メール認証再送信
   */
  async resendVerification(
    data: ResendVerificationRequest,
  ): Promise<ResendVerificationResponse> {
    const response = await httpClient.post<ResendVerificationResponse>(
      '/api/auth/resend-verification',
      data,
    );
    return response.data;
  },
};
