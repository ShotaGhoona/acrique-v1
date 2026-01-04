import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressApi } from '@/entities/address/api/address-api';
import { ADDRESSES_QUERY_KEY } from '../../get-addresses/lib/use-addresses';

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressApi.deleteAddress(id),
    onSuccess: () => {
      // 配送先一覧のキャッシュを更新
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
    onError: (error: any) => {
      console.error('Delete address failed:', error);
    },
  });
}
