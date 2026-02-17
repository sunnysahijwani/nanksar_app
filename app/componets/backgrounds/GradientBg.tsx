// GradientBg.tsx
import React, { use } from 'react';
import { ViewStyle, StyleProp, StatusBar, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppContext } from '../../context/AppContext';
import { withOpacity } from '../../utils/helper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface GradientBgProps {
  colorsList?: string[]; // Array of colors for the gradient
  angle?: number; // Angle in degrees (default: 104)
  style?: StyleProp<ViewStyle>; // Optional additional styles
  children?: React.ReactNode; // Support for children
  locations?: number[];
  enableSafeAreaView?: boolean;
  notchColor?: string
}

const GradientBg: React.FC<GradientBgProps> = ({
  colorsList,
  angle = 180,
  style,
  children,
  locations = [0.1, 0.11, 1],
  enableSafeAreaView = true,
  notchColor = "#f8fafc",
}) => {
  const { colors } = useAppContext();
  if (!colorsList) {
    colorsList = [notchColor, withOpacity(colors.screenBgGr[1], 1), withOpacity(colors.screenBgGr[2], 1)];
  }
  // const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={colorsList}
      useAngle={true}
      angle={angle}
      locations={locations}
      style={[{ flex: 1 }, style]}
    >
      {enableSafeAreaView ? <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView> : children}
    </LinearGradient>

  );
};

export default GradientBg;