import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressApi } from '@/entities/account-domain/address/api/address-api';
import { ADDRESSES_QUERY_KEY } from '../../get-addresses/lib/use-addresses';
import type { UpdateAddressFormData } from '../model/types';

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAddressFormData }) =>
      addressApi.updateAddress(id, data),
    onSuccess: () => {
      // 配送先一覧のキャッシュを更新
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
    onError: (error: any) => {
      console.error('Update address failed:', error);
    },
  });
}
