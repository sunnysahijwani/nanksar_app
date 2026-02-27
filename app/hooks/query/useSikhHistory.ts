import { useQuery } from '@tanstack/react-query';
import { SikhHistoryService } from '../../api/services/SikhHistory.service';

export const useSikhHistoryList = () => {
  return useQuery({
    queryKey: ['sikh-history-list'],
    queryFn: async () => {
      const response = await SikhHistoryService.getList();
      if (response?.error || response?.code !== 200) {
        throw new Error(response?.msg || 'Failed to fetch sikh history list');
      }
      return response;
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};
