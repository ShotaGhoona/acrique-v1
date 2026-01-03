import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/entities/auth';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import type { LoginFormData } from '../model/types';

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (credentials: LoginFormData) => {
      // バックエンドのリクエスト形式に変換
      return authApi.login({
        email: credentials.email,
        password: credentials.password,
      });
    },
    onSuccess: (data) => {
      // バックエンドレスポンス {access_token, user_id} からユーザーオブジェクトを生成
      dispatch(setUser({ id: data.user_id }));
      // リダイレクト先があればそこへ、なければマイページへ
      const redirect = searchParams.get('redirect') || '/mypage';
      router.push(redirect);
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });
}
