import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/entities/admin-domain/admin/api/admin-api';
import type { UpdateAdminRequest } from '@/entities/admin-domain/admin/model/types';
import { ADMINS_QUERY_KEY } from '../../get-admins/lib/use-admins';

export function useUpdateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      adminId,
      data,
    }: {
      adminId: number;
      data: UpdateAdminRequest;
    }) => adminApi.updateAdmin(adminId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMINS_QUERY_KEY });
    },
  });
}
