import { useQuery } from '@tanstack/react-query';
import { VidyalaService } from '../../api/services/Vidyala.service';

export const useVidyala = () => {
  return useQuery({
    queryKey: ['vidyala-list'],
    queryFn: async () => {
      const response = await VidyalaService.getList();
      if (response?.error) {
        throw new Error(response?.msg || 'Failed to fetch vidyala');
      }
      return response;
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};
