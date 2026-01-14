import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/entities/account-domain/user/api/user-api';
import { USER_QUERY_KEY } from '../../get-me/lib/use-get-me';
import type { UpdateProfileFormData } from '../model/types';

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileFormData) => userApi.updateMe(data),
    onSuccess: () => {
      // ユーザー情報のキャッシュを更新
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
    onError: (error: any) => {
      console.error('Profile update failed:', error);
    },
  });
}
