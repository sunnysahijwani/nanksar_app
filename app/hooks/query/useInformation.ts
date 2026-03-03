import { useQuery } from '@tanstack/react-query';
import { InformationService } from '../../api/services/Information.service';

export const useInformation = () => {
  return useQuery({
    queryKey: ['information-list'],
    queryFn: async () => {
      const response = await InformationService.getList();
      if (response?.error || response?.code !== 200) {
        throw new Error(response?.msg || 'Failed to fetch information');
      }
      return response;
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};
