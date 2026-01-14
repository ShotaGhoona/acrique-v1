import { useMutation } from '@tanstack/react-query';
import { userApi } from '@/entities/account-domain/user/api/user-api';
import type { ChangePasswordFormData } from '../model/types';

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      userApi.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      }),
    onError: (error: any) => {
      console.error('Password change failed:', error);
    },
  });
}
