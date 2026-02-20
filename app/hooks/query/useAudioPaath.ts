import { useQuery } from '@tanstack/react-query';
import { AudioPaathService } from '../../api/services/AudioPaath.service';

export const useAudioPaathList = () => {
  return useQuery({
    queryKey: ['audio-paath-list'],
    queryFn: async () => {
      const response = await AudioPaathService.getList();
      if (response?.error || response?.code !== 200) {
        throw new Error(response?.msg || 'Failed to fetch audio paath list');
      }
      return response;
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};

export const useAudioPaathCategory = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ['audio-paath-category', id],
    queryFn: async () => {
      const response = await AudioPaathService.getCategory(id);
      if (response?.error || response?.status !== 200) {
        throw new Error(response?.msg || 'Failed to fetch audio paath category');
      }
      return response;
    },
    enabled,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};
