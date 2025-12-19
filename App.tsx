import { StatusBar, useColorScheme } from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';
import "./global.css"
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContextProvider } from './app/context/AppContext';
import { ThemeContext } from '@react-navigation/native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <AppContextProvider>
        {/* <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#000000' : '#FFFFFF' }}> */}
              <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
              <AppNavigator />
        {/* </SafeAreaView> */}
      </AppContextProvider>

    </>
  );
}
export default App;
