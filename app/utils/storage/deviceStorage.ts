import DeviceInfo from 'react-native-device-info';
import { getItem, setItem, STORAGE_KEYS } from './asyncStorage';

export const getOrCreateDeviceUUID = async (): Promise<string> => {
    let uuid = await getItem<string>(STORAGE_KEYS.DEVICE_UUID);

    if (!uuid) {
        uuid = await DeviceInfo.getUniqueId();
        await setItem(STORAGE_KEYS.DEVICE_UUID, uuid);
    }

    return uuid;
};

