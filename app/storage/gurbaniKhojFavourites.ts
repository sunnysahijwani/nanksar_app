import { getCache, setCache } from './cache';
import { STORAGE_KEYS } from './keys';

export type GurbaniKhojFavourite = {
  id: number;
  page_index: number;
  punjabiText: string;
  englishText?: string;
};

export const getFavourites = (): GurbaniKhojFavourite[] =>
  getCache<GurbaniKhojFavourite[]>(STORAGE_KEYS.GURBANI_KHOJ_FAVOURITES) ?? [];

export const isFavourited = (id: number): boolean =>
  getFavourites().some(f => f.id === id);

/**
 * Toggles the favourite state for an item.
 * Returns `true` if the item is now favourited, `false` if removed.
 */
export const toggleFavourite = (item: GurbaniKhojFavourite): boolean => {
  const list = getFavourites();
  const exists = list.some(f => f.id === item.id);
  if (exists) {
    setCache(STORAGE_KEYS.GURBANI_KHOJ_FAVOURITES, list.filter(f => f.id !== item.id));
    return false;
  }
  setCache(STORAGE_KEYS.GURBANI_KHOJ_FAVOURITES, [...list, item]);
  return true;
};
