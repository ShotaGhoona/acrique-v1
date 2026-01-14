import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/entities/account-domain/auth/api/auth-api';
import type { LoginRequest } from '@/entities/account-domain/auth/model/types';
import { useAppDispatch } from '@/store/hooks/typed-hooks';
import { setUser } from '@/store/slices/authSlice';

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      // バックエンドレスポンス {access_token, user_id} からユーザーオブジェクトを生成
      dispatch(setUser({ id: data.user_id }));
      // リダイレクト先があればそこへ、なければトップページへ（購買意欲を維持）
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });
}
