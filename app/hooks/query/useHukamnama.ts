import { useQuery } from '@tanstack/react-query';
import { HukamnamaService } from '../../api/services/Hukamnama.service';

/**
 * Returns today's date in Indian Standard Time (UTC+5:30) as YYYY-MM-DD.
 */
function getTodayIST(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istDate = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000);
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const useHukamnama = (date?: string) => {
  const searchDate = date || getTodayIST();

  return useQuery({
    queryKey: ['hukamnama', searchDate],
    queryFn: async () => {
      const response = await HukamnamaService.getByDate(searchDate);
      if (response?.error || response?.code !== 200) {
        throw new Error(response?.msg || 'Failed to fetch Hukamnama');
      }
      return response;
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};
