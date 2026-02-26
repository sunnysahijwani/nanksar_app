import { getCache, setCache } from './cache';
import { STORAGE_KEYS } from './keys';

export type AudioFavourite = {
  id: number;
  title: string;
  audio_path: string;
  audio_length: string | null;
  sort_index: number;
  stream_url: string | null;
  temporary_url: string | null;
  image?: string | null;
  categoryImage?: string | null;
};

export const getAudioFavourites = (): AudioFavourite[] =>
  getCache<AudioFavourite[]>(STORAGE_KEYS.AUDIO_FAVOURITES) ?? [];

export const isAudioFavourited = (id: number): boolean =>
  getAudioFavourites().some(f => f.id === id);

/**
 * Toggles the favourite state for an audio track.
 * Returns `true` if the item is now favourited, `false` if removed.
 */
export const toggleAudioFavourite = (item: AudioFavourite): boolean => {
  const list = getAudioFavourites();
  const exists = list.some(f => f.id === item.id);
  if (exists) {
    setCache(STORAGE_KEYS.AUDIO_FAVOURITES, list.filter(f => f.id !== item.id));
    return false;
  }
  setCache(STORAGE_KEYS.AUDIO_FAVOURITES, [...list, item]);
  return true;
};
