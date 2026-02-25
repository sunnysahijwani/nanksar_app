import { apiClient } from '../client';

const BASE_URL = 'https://nanaksaramritghar.com/api/hukamnama';

export const HukamnamaService = {
  getByDate: async (date: string) => {
    const { data } = await apiClient.get(`${BASE_URL}/list?search=${date}`);
    return data;
  },
};
