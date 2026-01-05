import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/entities/admin/api/admin-api';
import { ADMINS_QUERY_KEY } from '../../get-admins/lib/use-admins';

export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminId: number) => adminApi.deleteAdmin(adminId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMINS_QUERY_KEY });
    },
  });
}
