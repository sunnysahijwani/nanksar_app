import { apiClient } from '../client';

export const HukamnamaService = {
  getByDate: async (date: string) => {
    const { data } = await apiClient.get(`/hukamnama/list`, {
      params: { search: date },
    });
    return data;
  },
};
