import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { getLocalizedField } from '../utils/localization';
import { AppLanguage } from '../utils/constant';

/**
 * Hook that returns a bound `t()` helper for translating field values.
 *
 * Usage:
 *   const { t } = useLocalize();
 *   const title = t(item, 'title');        // returns title_punjabi or title
 *   const desc  = t(item, 'description'); // returns description_punjabi or description
 *
 * The hook re-memoizes only when the language changes, so it's safe to
 * use inside renderItem callbacks and useMemo/useCallback dependency arrays.
 */
export function useLocalize() {
  const { currentLanguage } = useAppContext();

  const t = useCallback(
    (obj: Record<string, any> | null | undefined, field: string): string =>
      getLocalizedField(obj, field, currentLanguage as AppLanguage),
    [currentLanguage],
  );

  return { t, currentLanguage };
}
