import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/entities/auth';
import type { RegisterFormData } from '../model/types';

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterFormData) => {
      return authApi.register({
        email: data.email,
        password: data.password,
        name: data.name,
        name_kana: data.name_kana,
        phone: data.phone,
        company: data.company,
      });
    },
    onSuccess: () => {
      router.push('/register/complete');
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
    },
  });
}
