import React, { useCallback } from 'react';
import { Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const SPRING_CONFIG = { damping: 15, stiffness: 150, mass: 0.5 };
const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;

type ZoomableImageProps = {
  uri: string;
  width: number;
  height: number;
  onZoomChange?: (isZoomed: boolean) => void;
};

export default function ZoomableImage({
  uri,
  width,
  height,
  onZoomChange,
}: ZoomableImageProps) {
  // ── shared values ──
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const notifyZoom = useCallback(
    (zoomed: boolean) => {
      onZoomChange?.(zoomed);
    },
    [onZoomChange],
  );

  // ── helpers ──
  const clampTranslation = (
    value: number,
    currentScale: number,
    dimension: number,
  ) => {
    'worklet';
    const maxTranslate = Math.max(0, (dimension * (currentScale - 1)) / 2);
    return Math.min(maxTranslate, Math.max(-maxTranslate, value));
  };

  // ── pinch gesture ──
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate(event => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));
    })
    .onEnd(() => {
      if (scale.value < MIN_SCALE) {
        scale.value = withSpring(MIN_SCALE, SPRING_CONFIG);
        translateX.value = withSpring(0, SPRING_CONFIG);
        translateY.value = withSpring(0, SPRING_CONFIG);
      }
      savedScale.value = scale.value;

      // Reset translation if zoomed out to 1×
      if (scale.value <= 1.05) {
        scale.value = withSpring(1, SPRING_CONFIG);
        translateX.value = withSpring(0, SPRING_CONFIG);
        translateY.value = withSpring(0, SPRING_CONFIG);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
        runOnJS(notifyZoom)(false);
      } else {
        // Clamp translation to bounds
        translateX.value = withSpring(
          clampTranslation(translateX.value, scale.value, width),
          SPRING_CONFIG,
        );
        translateY.value = withSpring(
          clampTranslation(translateY.value, scale.value, height),
          SPRING_CONFIG,
        );
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
        runOnJS(notifyZoom)(true);
      }
    });

  // ── pan gesture (only when zoomed) ──
  const panGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(2)
    .manualActivation(true)
    .onTouchesMove((_event, stateManager) => {
      if (scale.value > 1.05) {
        stateManager.activate();
      } else {
        stateManager.fail();
      }
    })
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate(event => {
      translateX.value = clampTranslation(
        savedTranslateX.value + event.translationX,
        scale.value,
        width,
      );
      translateY.value = clampTranslation(
        savedTranslateY.value + event.translationY,
        scale.value,
        height,
      );
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // ── double-tap gesture ──
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1.05) {
        // Zoom out
        scale.value = withSpring(1, SPRING_CONFIG);
        translateX.value = withSpring(0, SPRING_CONFIG);
        translateY.value = withSpring(0, SPRING_CONFIG);
        savedScale.value = 1;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
        runOnJS(notifyZoom)(false);
      } else {
        // Zoom in
        scale.value = withSpring(DOUBLE_TAP_SCALE, SPRING_CONFIG);
        savedScale.value = DOUBLE_TAP_SCALE;
        runOnJS(notifyZoom)(true);
      }
    });

  // ── compose gestures ──
  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture,
  );

  // ── animated style ──
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          { width, height, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
          animatedStyle,
        ]}
      >
        <Image
          source={{ uri }}
          style={{ width, height }}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
}

