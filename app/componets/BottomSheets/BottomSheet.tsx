import React, { ReactNode, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Pressable,
  Text,
  ScrollView,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  const sheetHeight = useSharedValue(0); // ⭐ measured height

  const [visible, setVisible] = useState(isOpen);

  /* ---------------- OPEN / CLOSE ---------------- */
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      overlayOpacity.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(0, { duration: 250 });
    } else {
      overlayOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(sheetHeight.value, { duration: 250 });
      setTimeout(() => setVisible(false), 260);
    }
  }, [isOpen]);

  /* ---------------- PAN GESTURE ---------------- */
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > sheetHeight.value * 0.25) {
        translateY.value = withTiming(sheetHeight.value, { duration: 200 });
      } else {
        translateY.value = withTiming(0, { duration: 200 });
      }
    });

  /* ---------------- ANIMATED STYLES ---------------- */
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      {/* Overlay click */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      {/* <GestureDetector gesture={panGesture}> */}
      <Animated.View
        onLayout={(e) => {
          sheetHeight.value = e.nativeEvent.layout.height; // ⭐ measure height
        }}
        style={[
          styles.sheet,
          {
            maxHeight: SCREEN_HEIGHT * 0.85, // ⭐ max height
            paddingBottom: insets.bottom,
            minHeight: SCREEN_HEIGHT * 0.3,
            backgroundColor: "#FFF",
          },
          sheetStyle,
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={10}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {children}
        </ScrollView>
      </Animated.View>
      {/* </GestureDetector> */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  header: {
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default BottomSheet;
