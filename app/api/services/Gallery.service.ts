import { apiClient } from '../client';

const BASE_URL = 'https://nanaksaramritghar.com/api/gallery';

export const GalleryService = {
  getList: async (page: number = 1) => {
    const { data } = await apiClient.get(`${BASE_URL}/list?page=${page}`);
    return data;
  },
};
