import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressApi } from '@/entities/address';
import { ADDRESSES_QUERY_KEY } from '../../get-addresses';

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressApi.setDefaultAddress(id),
    onSuccess: () => {
      // 配送先一覧のキャッシュを更新
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
    onError: (error: any) => {
      console.error('Set default address failed:', error);
    },
  });
}
