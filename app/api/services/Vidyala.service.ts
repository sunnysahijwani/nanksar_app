import { apiClient } from '../client';

const BASE_URL = 'https://nanaksaramritghar.com/api/vidyala';

export const VidyalaService = {
  getList: async () => {
    const { data } = await apiClient.get(`${BASE_URL}/list`);
    return data;
  },
};
