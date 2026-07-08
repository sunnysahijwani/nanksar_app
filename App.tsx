import React, { useEffect } from 'react';
import { ImageBackground, Platform, StatusBar, View } from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';
import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContextProvider } from './app/context/AppContext';
import { AudioPlayerProvider } from './app/context/AudioPlayerContext';
import AudioPlayerOverlay from './app/componets/blocks/InnerAudioPaathCategory/AudioPlayerOverlay';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryProvider } from './app/providers/QueryProvider';
import ScreenGuardModule from 'react-native-screenguard';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const BG_IMAGE = require('./app/assets/images/app_background.jpg');

function App() {
  // Protect the app from screenshots and screen recording.
  useEffect(() => {
    const configureScreenGuard = async () => {
      try {
        await ScreenGuardModule.initSettings({
          enableCapture: false,
          enableRecord: false,
          displayScreenGuardOverlay: Platform.OS === 'ios',
          displayScreenguardOverlayAndroid: Platform.OS === 'android',
          timeAfterResume: 1500,
          trackingLog: false,
        });

        await ScreenGuardModule.registerWithImage({
          source: require('./app/assets/images/logo.jpeg'),
          defaultSource: require('./app/assets/images/logo.jpeg'),
          width: 180,
          height: 180,
          alignment: 4,
          backgroundColor: '#FFFFFF',
        });
      } catch (error) {
        console.warn('Screen guard setup failed:', error);
      }
    };

    void configureScreenGuard();
  }, []);

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
