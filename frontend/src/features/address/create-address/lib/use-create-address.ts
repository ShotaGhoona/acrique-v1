import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressApi } from '@/entities/address/api/address-api';
import { ADDRESSES_QUERY_KEY } from '../../get-addresses/lib/use-addresses';
import type { CreateAddressFormData } from '../model/types';

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressFormData) => addressApi.createAddress(data),
    onSuccess: () => {
      // 配送先一覧のキャッシュを更新
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
    onError: (error: any) => {
      console.error('Create address failed:', error);
    },
  });
}
