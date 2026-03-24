import { apiClient } from '../client';
import axios from 'axios';

export const BeantBaniyanService = {
  getList: async (page: number = 1) => {
    const { data } = await apiClient.get(`/beantbaniyan/list?page=${page}`);
    return data;
  },
  getShow: async (id: number) => {
    const { data } = await apiClient.get(`/beantbaniyan/show/${id}`);
    return data;
  },
  getDescriptionsFromUrl: async (url: string) => {
    const { data } = await axios.get(url);
    return data;
  },
};
