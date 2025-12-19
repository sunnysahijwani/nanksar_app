import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, SplashScreen } from '../screens';
import { ScreenHeaders } from '../componets';
import MainHeader from '../componets/headers/MainHeader';
import AudioListingScreen from '../screens/AudioListingScreen/AudioListingScreen';
import SundarGutkaListingScreen from '../screens/SundarGutkaScreen/SundarGutkaListingScreen';
import SikhHistoryListingScreen from '../screens/SikhHistoryScreen/SikhHistoryListingScreen';
import GurbaniKoshListingScreen from '../screens/GurbaniKoshScreen/GurbaniKoshListingScreen';
import SundarGutkaDetailScreen from '../screens/SundarGutkaScreen/SundarGutkaDetailScreen';

const Stack = createNativeStackNavigator();

export default function RootStack() {
    return (
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen}  options={{ headerShown: false }} />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                // options={() => ({
                //     // header: () => <MainHeader/>
                //     headerShown: false,
                // })}
            />
            <Stack.Screen
                name="AudioListingScreen"
                component={AudioListingScreen}
                // options={() => ({
                //     header: () => <MainHeader/>
                // })}
            />
            <Stack.Screen name="SundarGutkaListingScreen" component={SundarGutkaListingScreen} />
            <Stack.Screen name="SundarGutkaDetailScreen" component={SundarGutkaDetailScreen} />
            <Stack.Screen name="SikhHistoryListingScreen" component={SikhHistoryListingScreen} />
            <Stack.Screen name="GurbaniKoshListingScreen" component={GurbaniKoshListingScreen} />

        </Stack.Navigator>
    );
}