import { apiClient } from '../client';
const Prefix = '/guru-granth-sahib-ji';
export const GuruGranthSahibjiBaniService = {
  getList: async (page?: number, to_index?: number) => {
    const page_index = page || null;
    let url = Prefix + '/list' + (page_index ? '?page_index=' + page_index : '') + (to_index ? `&to_index=${to_index}` : '');
    const { data } = await apiClient.get('https://nanaksaramritghar.com/api'+url);
    return data;
  },
};
