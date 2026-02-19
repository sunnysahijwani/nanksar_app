import { useQuery } from '@tanstack/react-query';
import { BeantBaniyanService } from '../../api/services/BeantBaniyan.service';

export const useBeantBaniyan = (page: number = 1) => {
  return useQuery({
    queryKey: ['beant-baniyan-list', page],
    queryFn: async () => {
      const response = await BeantBaniyanService.getList(page);
      if (response?.error || response?.code !== 200) {
        throw new Error(response?.msg || 'Failed to fetch beant baniyan');
      }
      return response;
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};
