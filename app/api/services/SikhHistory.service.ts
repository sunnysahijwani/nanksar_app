import { apiClient } from '../client';

export const SikhHistoryService = {
  getList: async () => {
    const { data } = await apiClient.get('/sikh-history/list');
    return data;
  },
};
