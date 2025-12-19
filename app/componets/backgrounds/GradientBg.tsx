// GradientBg.tsx
import React, { use } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppContext } from '../../context/AppContext';
import { withOpacity } from '../../utils/helper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GradientBgProps {
  colorsList?: string[]; // Array of colors for the gradient
  angle?: number; // Angle in degrees (default: 104)
  style?: StyleProp<ViewStyle>; // Optional additional styles
  children?: React.ReactNode; // Support for children
  locations?: number[];
}

const GradientBg: React.FC<GradientBgProps> = ({
  colorsList,
  angle = 135,
  style,
  children,
  locations= [0, 1],
}) => {
  const { colors } = useAppContext();
  if (!colorsList) {
    colorsList = [withOpacity(colors.primary, 0.1), withOpacity(colors.primary, 0.2)];
  }

  return (
    <LinearGradient
      colors={colorsList}
      useAngle={true}
      angle={angle}
      locations={locations}
      style={[{ flex: 1 }, style]}
    >
      <SafeAreaView style={{ flex: 1 }}>
      {children}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default GradientBg;