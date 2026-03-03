import React from 'react';
import { ImageBackground, StatusBar, View } from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';
import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContextProvider } from './app/context/AppContext';
import { AudioPlayerProvider } from './app/context/AudioPlayerContext';
import AudioPlayerOverlay from './app/componets/blocks/InnerAudioPaathCategory/AudioPlayerOverlay';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryProvider } from './app/providers/QueryProvider';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const BG_IMAGE = require('./app/assets/images/app_background.jpg');

function App() {
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
