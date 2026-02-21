import React, { useEffect } from 'react';
import { Alert, ImageBackground, StatusBar, View } from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';
import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContextProvider } from './app/context/AppContext';
import { AudioPlayerProvider } from './app/context/AudioPlayerContext';
import AudioPlayerOverlay from './app/componets/blocks/InnerAudioPaathCategory/AudioPlayerOverlay';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryProvider } from './app/providers/QueryProvider';
import { usePusher } from './app/hooks/usePusher';
import DeviceInfo from 'react-native-device-info';
import { verifyCode } from './app/api/services/otpVerify.service';
import { resetAndNavigate } from './app/utils/NavigationUtils';
import TrackPlayer, { Capability } from 'react-native-track-player';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const BG_IMAGE = require('./app/assets/images/app_background.jpg');

function App() {
  // Set up TrackPlayer here — before AudioPlayerProvider mounts — so its
  // hooks (usePlaybackState, useProgress, useTrackPlayerEvents) subscribe to
  // an already-initialised player on their first render.
  useEffect(() => {
    (async () => {
      try {
        await TrackPlayer.setupPlayer({ autoHandleInterruptions: true });
      } catch {
        // "already initialized" on hot-reload — safe to ignore
      }
      try {
        await TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play, Capability.Pause, Capability.Stop,
            Capability.SkipToNext, Capability.SkipToPrevious, Capability.SeekTo,
          ],
          compactCapabilities: [
            Capability.Play, Capability.Pause,
            Capability.SkipToNext, Capability.SkipToPrevious,
          ],
          progressUpdateEventInterval: 1,
        });
      } catch (e) {
        console.error('[TrackPlayer] updateOptions failed:', e);
      }
    })();
  }, []);

  usePusher('', (event: any) => verifyOtp(event)); // subscribe to public channel

  const verifyOtp = async (data: any) => {
    try {
      if (!data) return;
      const code = data?.code || '';
      const uuid = await DeviceInfo.getUniqueId();
      const res = await verifyCode(code, uuid);
      if (!res) {
        throw new Error('Failed to authenticate app');
      }
      resetAndNavigate('Home');
    } catch (e) {
      Alert.alert(
        'Error',
        'Failed to authenticate app! Please restart the app.',
      );
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <QueryProvider>
          <AppContextProvider>
            <AudioPlayerProvider>
              <ImageBackground
                source={BG_IMAGE}
                style={{ flex: 1 }}
                resizeMode="cover"
              >
                <AppNavigator />
              </ImageBackground>

              <View
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                pointerEvents="box-none"
              >
                <AudioPlayerOverlay />
              </View>
            </AudioPlayerProvider>
          </AppContextProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
export default App;
