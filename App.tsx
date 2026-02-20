import { Alert, StatusBar, useColorScheme } from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';
import "./global.css"
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

function App() {

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
      resetAndNavigate("Home");
    } catch (e) {
      Alert.alert('Error', 'Failed to authenticate app! Please restart the app.');
    }
  };

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content" // or light-content
          />
          <QueryProvider>
            <AppContextProvider>
              <AudioPlayerProvider>
                <AppNavigator />
                <AudioPlayerOverlay />
              </AudioPlayerProvider>
            </AppContextProvider>
          </QueryProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>

    </>
  );
}
export default App;
