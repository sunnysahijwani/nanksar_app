import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GurBaniKhojSuwidhaScreen, HomeScreen, SplashScreen } from '../screens';
import AudioListingScreen from '../screens/AudioListingScreen/AudioListingScreen';
import SundarGutkaListingScreen from '../screens/SundarGutkaScreen/SundarGutkaListingScreen';
import SikhHistoryListingScreen from '../screens/SikhHistoryScreen/SikhHistoryListingScreen';
import SikhHistoryChaptersScreen from '../screens/SikhHistoryScreen/SikhHistoryChaptersScreen';
import SikhHistorySakhiyanScreen from '../screens/SikhHistoryScreen/SikhHistorySakhiyanScreen';
import SikhHistoryContentScreen from '../screens/SikhHistoryScreen/SikhHistoryContentScreen';
import SikhHistoryContentDetailScreen from '../screens/SikhHistoryScreen/SikhHistoryContentDetailScreen';
import GurbaniKoshListingScreen from '../screens/GurbaniKoshScreen/GurbaniKoshListingScreen';
import SundarGutkaDetailScreen from '../screens/SundarGutkaScreen/SundarGutkaDetailScreen';
import GurbaniKhojSuwidhaScreenDetail from '../screens/GurbaniKhojSuwidhaScreen/GurbaniKhojSuwidhaScreenDetail';
import GurbaniKhojFavouritesScreen from '../screens/GurbaniKhojSuwidhaScreen/GurbaniKhojFavouritesScreen';
import GalleryScreen from '../screens/GalleryScreen/GalleryScreen';
import AudioPaathCategoryScreen from '../screens/AudioPaathCategoryScreen/AudioPaathCategoryScreen';
import HukamnamaScreen from '../screens/HukamnamaScreen/HukamnamaScreen';
import AudioFavouritesScreen from '../screens/AudioFavouritesScreen/AudioFavouritesScreen';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'fade',
        animationDuration: 200,
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AudioListingScreen" component={AudioListingScreen} />
      <Stack.Screen
        name="AudioPaathCategoryScreen"
        component={AudioPaathCategoryScreen}
      />
      <Stack.Screen
        name="SundarGutkaListingScreen"
        component={SundarGutkaListingScreen}
      />
      <Stack.Screen
        name="SundarGutkaDetailScreen"
        component={SundarGutkaDetailScreen}
      />
      <Stack.Screen
        name="SikhHistoryListingScreen"
        component={SikhHistoryListingScreen}
      />
      <Stack.Screen
        name="SikhHistoryChaptersScreen"
        component={SikhHistoryChaptersScreen}
      />
      <Stack.Screen
        name="SikhHistorySakhiyanScreen"
        component={SikhHistorySakhiyanScreen}
      />
      <Stack.Screen
        name="SikhHistoryContentScreen"
        component={SikhHistoryContentScreen}
      />
      <Stack.Screen
        name="SikhHistoryContentDetailScreen"
        component={SikhHistoryContentDetailScreen}
      />
      <Stack.Screen
        name="GurbaniKoshListingScreen"
        component={GurbaniKoshListingScreen}
      />
      <Stack.Screen
        name="GurBaniKhojSuwidhaScreen"
        component={GurBaniKhojSuwidhaScreen}
      />
      <Stack.Screen
        name="GurBaniKhojSuwidhaDetailScreen"
        component={GurbaniKhojSuwidhaScreenDetail}
      />
      <Stack.Screen
        name="GurbaniKhojFavouritesScreen"
        component={GurbaniKhojFavouritesScreen}
      />
      <Stack.Screen name="GalleryScreen" component={GalleryScreen} />
      <Stack.Screen name="HukamnamaScreen" component={HukamnamaScreen} />
      <Stack.Screen name="AudioFavouritesScreen" component={AudioFavouritesScreen} />
    </Stack.Navigator>
  );
}
