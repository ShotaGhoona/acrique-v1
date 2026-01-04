import { useQuery } from '@tanstack/react-query';
import { addressApi } from '@/entities/address/api/address-api';

export const ADDRESSES_QUERY_KEY = ['addresses'] as const;

export function useAddresses() {
  return useQuery({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: () => addressApi.getAddresses(),
    staleTime: 1000 * 60 * 5, // 5分間はキャッシュを使用
  });
}
