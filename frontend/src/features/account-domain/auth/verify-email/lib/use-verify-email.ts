import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/entities/account-domain/auth/api/auth-api';

export function useVerifyEmail() {
  const router = useRouter();

  return useMutation({
    mutationFn: (token: string) => {
      return authApi.verifyEmail({ token });
    },
    onSuccess: () => {
      router.push('/login?verified=true');
    },
    onError: (error: any) => {
      console.error('Email verification failed:', error);
    },
  });
}
