import { apiClient } from '../client';

const BASE_URL = 'https://nanaksaramritghar.com/api/information';

export const InformationService = {
  getList: async () => {
    const { data } = await apiClient.get(`${BASE_URL}/list`);
    return data;
  },
};
