import { apiClient } from '../client';

export const BeantBaniyanService = {
  getList: async (page: number = 1) => {
    const { data } = await apiClient.get(`/beantbaniyan/list?page=${page}`);
    return data;
  },
};
