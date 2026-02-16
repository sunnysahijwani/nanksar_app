import { useQuery } from '@tanstack/react-query';
import { GuruGranthSahibjiBaniService } from '../../api/services/GuruGranthSahibjiBani.service';
import { getCache, setCache } from '../../storage/cache';
import { STORAGE_KEYS } from '../../storage/keys';

const pageIndexPrefix = 'page_index_';

export const useGuruGranthSahibjiBani = (page_index?: number, to_index?: number, forceRefresh: boolean = false) => {
  return useQuery({
    queryKey: ['guru-granth-sahib-ji-bani-list', page_index, to_index],
    queryFn: async () => {

      const cachedData = getCache<any>(STORAGE_KEYS.GURU_GRANTH_SHIB_JI_BANI_DATA) || {};

      try {

        const isPageIndexDataExist = cachedData?.[pageIndexPrefix + page_index] || null;
        // clearCache(STORAGE_KEYS.GURU_GRANTH_SHIB_JI_BANI_DATA);
        // const cachedPage = getCache<number>(STORAGE_KEYS.GURU_GRANTH_SHIB_JI_BANI_PAGE) || -1;
        // const cachedHasNextPage = getCache<boolean>(STORAGE_KEYS.GURU_GRANTH_SHIB_JI_BANI_HAS_NEXT_PAGE) || true;

        // ✅ Use cache if exists and not forcing refresh
        if (isPageIndexDataExist && !forceRefresh) {
          return cachedData || {};
        }

        // 🔁 Fetch from API
        const response = await GuruGranthSahibjiBaniService.getList(page_index, to_index);

        if (response?.error || response?.code != 200) {
          return cachedData;
        };


        const newData = {
          ...(cachedData ?? {}),
          ...(response?.result ?? {})
        };
        setCache(STORAGE_KEYS.GURU_GRANTH_SHIB_JI_BANI_DATA, newData);
        // setCache(STORAGE_KEYS.GURU_GRANTH_SHIB_JI_BANI_PAGE, page);
        // setCache(STORAGE_KEYS.GURU_GRANTH_SHIB_JI_BANI_HAS_NEXT_PAGE, response?.result?.hasNextPage || true);
        return newData || [];
      }
      catch (e: any) {
        console.error(e, 'error');
        return cachedData || [];
      }
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};
