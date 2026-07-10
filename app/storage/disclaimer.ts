import { getCache, setCache } from './cache';
import { STORAGE_KEYS } from './keys';

const DISCLAIMER_INTERVAL_MS = 3 * 24 * 60 * 60 * 1000; // show again after 3 days

export const shouldShowDisclaimer = (): boolean => {
  const lastShownAt = getCache<number>(STORAGE_KEYS.DISCLAIMER_LAST_SHOWN_AT);
  if (!lastShownAt) return true;
  return Date.now() - lastShownAt >= DISCLAIMER_INTERVAL_MS;
};

export const markDisclaimerShown = () => {
  setCache(STORAGE_KEYS.DISCLAIMER_LAST_SHOWN_AT, Date.now());
};
