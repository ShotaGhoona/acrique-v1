import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/entities/admin-domain/admin/api/admin-api';
import type { CreateAdminRequest } from '@/entities/admin-domain/admin/model/types';
import { ADMINS_QUERY_KEY } from '../../get-admins/lib/use-admins';

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminRequest) => adminApi.createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMINS_QUERY_KEY });
    },
  });
}
