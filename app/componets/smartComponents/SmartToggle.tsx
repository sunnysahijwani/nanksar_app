import React, { ReactNode, useState } from 'react';
import {
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface SmartToggleProps {
  style?: StyleProp<ViewStyle>;
  containerWidth?: number;
  direction?: 'rtl' | 'ltr';
  trigger: (props: { toggle: () => void; isOpen: boolean }) => ReactNode;
  children: (props: { toggle: () => void; isOpen: boolean }) => ReactNode;
}

const SmartToggle: React.FC<SmartToggleProps> = ({
  style,
  containerWidth = 300,
  direction = 'rtl',
  trigger,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animatedWidth = useSharedValue(0);

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    animatedWidth.value = withTiming(next ? containerWidth : 0, {
      duration: 500,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    width: animatedWidth.value,
    height: animatedWidth.value, // Keep it square
  }));

  const positionStyle =
    direction === 'rtl'
      ? { right: 0 }
      : { left: 0 };

  return (
    <View>
      {/* Trigger */}
      <TouchableOpacity onPress={toggle} style={{ position: 'relative', zIndex: 1, justifyContent: 'center', height: '100%', width: "auto", marginRight: direction === 'ltr' ? 'auto' : 0, marginLeft: direction === 'rtl' ? 'auto' : 0 }}>
        {trigger({ toggle, isOpen })}
      </TouchableOpacity>

      {/* Animated Container */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            overflow: 'hidden',
            alignItems: 'flex-start',
            marginRight: direction === 'rtl' ? 0 : 30,
            marginLeft: direction === 'ltr' ? 30 : 0,
            // backgroundColor: 'green',
          },
          positionStyle,
          style,
          animatedStyle,
        ]}
      >
        {children({ toggle, isOpen })}
      </Animated.View>
    </View>
  );
};

export default SmartToggle;