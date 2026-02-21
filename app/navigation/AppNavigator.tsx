import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RootStack from './RootStack';
import { navigationRef } from '../utils/NavigationUtils';

// Make the navigation container background transparent so the root-level
// background image in App.tsx shows through every screen.
const TransparentTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef} theme={TransparentTheme}>
      <RootStack />
    </NavigationContainer>
  );
}
