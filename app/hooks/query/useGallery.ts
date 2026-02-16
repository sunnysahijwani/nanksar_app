import { useQuery } from '@tanstack/react-query';
import { GalleryService } from '../../api/services/Gallery.service';

export const useGallery = (page: number = 1) => {
  return useQuery({
    queryKey: ['gallery-list', page],
    queryFn: async () => {
      const response = await GalleryService.getList(page);
      if (response?.error || response?.code !== 200) {
        throw new Error(response?.msg || 'Failed to fetch gallery');
      }
      return response;
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};
