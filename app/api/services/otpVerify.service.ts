import { setItem, STORAGE_KEYS } from '../../utils/storage/asyncStorage';
import { apiClient } from '../client';

export const verifyCode = async (code: string, uuid: string) => {

    try {

        const res = await apiClient.post('/authentication/verify-otp', {
            uuid,
            code,
        });

        const resData = res.data;
        if (resData?.error) {
            throw new Error(resData?.msg || 'Invalid code');
        }

        await setItem(STORAGE_KEYS.APP_TOKEN, resData?.token);

        return true;
    } catch (e: any) {
        console.log(e);
        return false;
    }
};


export const genrateOtpForMyApp = async (uuid?: string) => {
    const res = await apiClient.post('/authentication/genrate-otp', {
        uuid
    });
    return res.data;
};