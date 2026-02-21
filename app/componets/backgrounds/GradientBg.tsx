// GradientBg.tsx
// The actual background image is rendered once at the App root (App.tsx),
// absolutely covering the full screen. This component is now a transparent
// container that optionally wraps children in a SafeAreaView.
import React from 'react';
import { ViewStyle, StyleProp, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GradientBgProps {
  colorsList?:         string[];  // kept for API compatibility — no longer used
  angle?:              number;
  style?:              StyleProp<ViewStyle>;
  children?:           React.ReactNode;
  locations?:          number[];
  enableSafeAreaView?: boolean;
  notchColor?:         string;
}

const GradientBg: React.FC<GradientBgProps> = ({
  style,
  children,
  enableSafeAreaView = true,
}) => {
  return (
    <View style={[{ flex: 1 }, style]}>
      {enableSafeAreaView ? (
        <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      ) : (
        children
      )}
    </View>
  );
};

export default GradientBg;
