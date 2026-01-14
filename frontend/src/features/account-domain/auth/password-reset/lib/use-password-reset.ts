import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/entities/account-domain/auth/api/auth-api';
import type {
  PasswordResetConfirmFormData,
  PasswordResetRequestFormData,
} from '../model/types';

export function usePasswordResetRequest() {
  return useMutation({
    mutationFn: (data: PasswordResetRequestFormData) => {
      return authApi.requestPasswordReset({ email: data.email });
    },
    onError: (error: any) => {
      console.error('Password reset request failed:', error);
    },
  });
}

export function usePasswordResetConfirm() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: PasswordResetConfirmFormData) => {
      return authApi.confirmPasswordReset({
        token: data.token,
        new_password: data.new_password,
      });
    },
    onSuccess: () => {
      router.push('/login?reset=true');
    },
    onError: (error: any) => {
      console.error('Password reset confirm failed:', error);
    },
  });
}
