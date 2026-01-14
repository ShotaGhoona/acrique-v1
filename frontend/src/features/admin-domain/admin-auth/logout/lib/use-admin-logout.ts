import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAuthApi } from '@/entities/admin-domain/admin-auth/api/admin-auth-api';
import { ADMIN_AUTH_STATUS_QUERY_KEY } from '../../get-status/lib/use-admin-auth-status';

export function useAdminLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminAuthApi.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_AUTH_STATUS_QUERY_KEY });
    },
  });
}
