import { getCache, setCache } from './cache';
import { storage } from './mmkv';
import { STORAGE_KEYS } from './keys';

export type GurbaniKhojBookmark = {
  page_index: number;
};

export const getBookmark = (): GurbaniKhojBookmark | null =>
  getCache<GurbaniKhojBookmark>(STORAGE_KEYS.GURBANI_KHOJ_BOOKMARK);

export const saveBookmark = (b: GurbaniKhojBookmark) =>
  setCache(STORAGE_KEYS.GURBANI_KHOJ_BOOKMARK, b);

export const clearBookmark = () =>
  storage.delete(STORAGE_KEYS.GURBANI_KHOJ_BOOKMARK);
