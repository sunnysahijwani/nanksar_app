import { storage } from './mmkv';

export const setCache = (key: string, value: any) => {
    if (!value) return;
    storage.set(key, JSON.stringify(value));
};

export const getCache = <T>(key: string): T | null => {
    const data = storage.getString(key);
    return data ? JSON.parse(data) : null;
};

export const clearCache = (key: string) => {
    console.log(key);
    storage.clearAll();
};
