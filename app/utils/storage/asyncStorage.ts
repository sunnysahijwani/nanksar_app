import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage Keys (single source of truth)
 */
export const STORAGE_KEYS = {
  APP_TOKEN: 'APP_TOKEN',
  DEVICE_UUID: 'DEVICE_UUID',
};

/**
 * Generic SET
 */
export const setItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`AsyncStorage set error [${key}]`, error);
  }
};

/**
 * Generic GET
 */
export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? (JSON.parse(jsonValue) as T) : null;
  } catch (error) {
    console.error(`AsyncStorage get error [${key}]`, error);
    return null;
  }
};

/**
 * Remove single item
 */
export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`AsyncStorage remove error [${key}]`, error);
  }
};

/**
 * Clear all storage (logout / reset)
 */
export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('AsyncStorage clear error', error);
  }
};
