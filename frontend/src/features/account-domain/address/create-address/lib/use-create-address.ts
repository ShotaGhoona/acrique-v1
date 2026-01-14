import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressApi } from '@/entities/account-domain/address/api/address-api';
import type { CreateAddressRequest } from '@/entities/account-domain/address/model/types';
import { ADDRESSES_QUERY_KEY } from '../../get-addresses/lib/use-addresses';

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressRequest) => addressApi.createAddress(data),
    onSuccess: () => {
      // 配送先一覧のキャッシュを更新
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
    onError: (error: any) => {
      console.error('Create address failed:', error);
    },
  });
}
