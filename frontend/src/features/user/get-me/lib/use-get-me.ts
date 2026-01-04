import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/entities/user';

export const USER_QUERY_KEY = ['user', 'me'] as const;

export function useGetMe() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: () => userApi.getMe(),
    staleTime: 1000 * 60 * 5, // 5分間はキャッシュを使用
  });
}
