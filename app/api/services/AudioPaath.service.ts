import { apiClient } from '../client';

export const AudioPaathService = {
  getList: async () => {
    const { data } = await apiClient.get('/paath/list');
    return data;
  },

  getCategory: async (id: number) => {
    const { data } = await apiClient.get(`/paath/show/${id}`);
    return data;
  },
};
