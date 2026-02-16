import {
    Pusher
} from '@pusher/pusher-websocket-react-native';
import { PUSHER_APP_KEY, PUSHER_CLUSTER } from '@env';
import DeviceInfo from 'react-native-device-info';

export const pusher = Pusher.getInstance();

let initialized = false;

export const initPusher = async () => {
    if (initialized) return;

    await pusher.init({
        apiKey: PUSHER_APP_KEY,
        cluster: PUSHER_CLUSTER,
        onError: (error) => {
            console.log('Pusher error:', error);
        },
    });

    await pusher.connect();
    initialized = true;
};

export const subscribePublicChannel = async (
    channelName?: string,
    callback: (data: any) => void
) => {

    const uuid = await DeviceInfo.getUniqueId();

    if(!channelName) {
        channelName = `app-auth-${uuid}`;
    }
    await pusher.subscribe({
        channelName,
        onEvent: (event) => {
            try {
                const data = JSON.parse(event.data);
                callback(data);
            } catch {
                callback(event.data);
            }
        },
    });
};


export const disconnectPusher = async () => {
    await pusher.disconnect();
    initialized = false;
};