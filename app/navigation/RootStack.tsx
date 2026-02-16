import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GurBaniKhojSuwidhaScreen, HomeScreen, SplashScreen } from '../screens';
import AudioListingScreen from '../screens/AudioListingScreen/AudioListingScreen';
import SundarGutkaListingScreen from '../screens/SundarGutkaScreen/SundarGutkaListingScreen';
import SikhHistoryListingScreen from '../screens/SikhHistoryScreen/SikhHistoryListingScreen';
import GurbaniKoshListingScreen from '../screens/GurbaniKoshScreen/GurbaniKoshListingScreen';
import SundarGutkaDetailScreen from '../screens/SundarGutkaScreen/SundarGutkaDetailScreen';
import GurbaniKhojSuwidhaScreenDetail from '../screens/GurbaniKhojSuwidhaScreen/GurbaniKhojSuwidhaScreenDetail';

const Stack = createNativeStackNavigator();

export default function RootStack() {
    return (
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AudioListingScreen" component={AudioListingScreen} />
            <Stack.Screen name="SundarGutkaListingScreen" component={SundarGutkaListingScreen} />
            <Stack.Screen name="SundarGutkaDetailScreen" component={SundarGutkaDetailScreen} />
            <Stack.Screen name="SikhHistoryListingScreen" component={SikhHistoryListingScreen} />
            <Stack.Screen name="GurbaniKoshListingScreen" component={GurbaniKoshListingScreen} />
            <Stack.Screen name="GurBaniKhojSuwidhaScreen" component={GurBaniKhojSuwidhaScreen} />
            <Stack.Screen name="GurBaniKhojSuwidhaDetailScreen" component={GurbaniKhojSuwidhaScreenDetail} />
        </Stack.Navigator>
    );
}