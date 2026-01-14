import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAuthApi } from '@/entities/admin-domain/admin-auth/api/admin-auth-api';
import type { AdminLoginRequest } from '@/entities/admin-domain/admin-auth/model/types';
import { ADMIN_AUTH_STATUS_QUERY_KEY } from '../../get-status/lib/use-admin-auth-status';

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminLoginRequest) => adminAuthApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_AUTH_STATUS_QUERY_KEY });
    },
  });
}
