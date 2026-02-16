import { Alert, StatusBar, useColorScheme } from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';
import "./global.css"
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContextProvider } from './app/context/AppContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryProvider } from './app/providers/QueryProvider';
import { usePusher } from './app/hooks/usePusher';
import DeviceInfo from 'react-native-device-info';
import { verifyCode } from './app/api/services/otpVerify.service';
import { resetAndNavigate } from './app/utils/NavigationUtils';

function App() {

  const isDarkMode = useColorScheme() === 'dark';

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
      console.log(e);
      Alert.alert('Error', 'Failed to authenticate app! Please restart the app.');
    }
  };

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <QueryProvider>
            <AppContextProvider>
              <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
              <AppNavigator />
            </AppContextProvider>
          </QueryProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>

    </>
  );
}
export default App;
