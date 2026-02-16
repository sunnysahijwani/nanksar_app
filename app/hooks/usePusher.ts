import { useEffect } from 'react';
import {
    initPusher,
    subscribePublicChannel,
    disconnectPusher,
} from '../utils/pusher';

export const usePusher = (
    channelName: string,
    onMessage: (data: any) => void
) => {
    useEffect(() => {
        let mounted = true;

        const start = async () => {
            await initPusher();
            if (mounted) {
                await subscribePublicChannel(channelName, onMessage);
            }
        };

        start();

        return () => {
            mounted = false;
            disconnectPusher();
        };
    }, [channelName, onMessage]);
};
