import { PermissionsAndroid, Platform } from "react-native";




export const requestMyAppPermission = async () => {

    if (Platform.OS == "android") {
        await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        ]);

    }
    return true;
};

export const requestPermission = async (PERMISSIONS: any) => {
    try {
        const granted = await PermissionsAndroid.request(PERMISSIONS)
        return granted === PermissionsAndroid.RESULTS.GRANTED ? true : false
    } catch (e: any) {
        console.log(e,'fgf');
        return false
    }

};