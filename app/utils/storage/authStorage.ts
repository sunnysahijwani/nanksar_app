import { getItem, setItem, removeItem, STORAGE_KEYS } from './asyncStorage';

export const saveAppToken = async (token: string) => {
  await setItem(STORAGE_KEYS.APP_TOKEN, token);
};

export const getAppToken = async (): Promise<string | null> => {
  return await getItem<string>(STORAGE_KEYS.APP_TOKEN);
};

export const removeAppToken = async () => {
  await removeItem(STORAGE_KEYS.APP_TOKEN);
};
