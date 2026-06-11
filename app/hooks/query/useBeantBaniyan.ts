import { useInfiniteQuery } from '@tanstack/react-query';
import { BeantBaniyanService } from '../../api/services/BeantBaniyan.service';

export const useBeantBaniyanInfinite = () => {
  return useInfiniteQuery({
    queryKey: ['beant-baniyan-list'],
    queryFn: async ({ pageParam }) => {
      const response = await BeantBaniyanService.getList(pageParam);
      if (response?.error || response?.code !== 200) {
        throw new Error(response?.msg || 'Failed to fetch beant baniyan');
      }
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const items = lastPage?.data?.data ?? [];
      if (items.length === 0) return undefined;
      return allPages.length + 1;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};
