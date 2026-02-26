import React, { useCallback, useEffect } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { SHARE } from '../../../assets/svgs';
import { COLORS } from '../../../utils/theme';

const GOLD = '#C5963A';
const GOLD_BORDER = '#A47A2E';
const DARK = '#2D1A00';
const FAB_SIZE = 52;
const RESTING_SCALE = 0.7; // smaller idle state
const ITEM_SIZE = 44;
const ITEM_GAP = 12;
const ANIM_DURATION = 250;

type FabItem = {
  key: string;
  icon: React.ReactNode;
  onPress: () => void;
  active?: boolean;
};

type HukamnamaFabProps = {
  onFontIncrease: () => void;
  onFontDecrease: () => void;
  onSharePress: () => void;
  translationOn: boolean;
  onTranslationToggle: () => void;
  transliterationOn: boolean;
  onTransliterationToggle: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HukamnamaFab = ({
  onFontIncrease,
  onFontDecrease,
  onSharePress,
  translationOn,
  onTranslationToggle,
  transliterationOn,
  onTransliterationToggle,
}: HukamnamaFabProps) => {
  const isOpen = useSharedValue(0);
  const fabScale = useSharedValue(RESTING_SCALE);

  // Attention pulse on mount
  useEffect(() => {
    fabScale.value = withDelay(
      600,
      withSequence(
        withTiming(1.15, { duration: 350, easing: Easing.out(Easing.back(2)) }),
        withTiming(RESTING_SCALE, {
          duration: 400,
          easing: Easing.inOut(Easing.cubic),
        }),
      ),
    );
  }, []);

  const toggle = useCallback(() => {
    const opening = isOpen.value === 0;
    isOpen.value = withTiming(opening ? 1 : 0, {
      duration: ANIM_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    fabScale.value = withTiming(opening ? 1 : RESTING_SCALE, {
      duration: ANIM_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const items: FabItem[] = [
    {
      key: 'transliteration',
      icon: (
        <Text
          style={[styles.itemText, transliterationOn && styles.itemTextActive]}
        >
          Abc
        </Text>
      ),
      onPress: onTransliterationToggle,
      active: transliterationOn,
    },
    {
      key: 'translation',
      icon: (
        <Text style={[styles.itemText, translationOn && styles.itemTextActive]}>
          Tr
        </Text>
      ),
      onPress: onTranslationToggle,
      active: translationOn,
    },
    {
      key: 'share',
      icon: <SHARE width={20} height={20} color={DARK} />,
      onPress: onSharePress,
    },
    {
      key: 'fontUp',
      icon: <Text style={styles.fontUpIcon}>ਅ</Text>,
      onPress: onFontIncrease,
    },
    {
      key: 'fontDown',
      icon: <Text style={styles.fontDownIcon}>ਅ</Text>,
      onPress: onFontDecrease,
    },
  ];

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: isOpen.value,
    pointerEvents: isOpen.value > 0.5 ? 'auto' : 'none',
  }));

  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const fabIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(isOpen.value, [0, 1], [0, 45])}deg` }],
  }));

  return (
    <>
      {/* Backdrop */}
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={toggle} />
      </Animated.View>

      <View style={styles.fabContainer}>
        {/* Action items */}
        {items.map((item, index) => {
          const animStyle = useAnimatedStyle(() => {
            const offset = (index + 1) * (ITEM_SIZE + ITEM_GAP);
            return {
              transform: [
                {
                  translateY: interpolate(isOpen.value, [0, 1], [0, -offset]),
                },
                {
                  scale: interpolate(isOpen.value, [0, 0.5, 1], [0, 0.5, 1]),
                },
              ],
              opacity: isOpen.value,
            };
          });

          return (
            <AnimatedPressable
              key={item.key}
              style={[
                styles.actionItem,
                item.active && styles.actionItemActive,
                animStyle,
              ]}
              onPress={item.onPress}
            >
              {item.icon}
            </AnimatedPressable>
          );
        })}

        {/* Main FAB */}
        <Animated.View style={fabStyle}>
          <Pressable style={styles.fab} onPress={toggle}>
            <Animated.Text style={[styles.fabIcon, fabIconStyle]}>
              +
            </Animated.Text>
          </Pressable>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 8,
    alignItems: 'center',
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: COLORS.primary.white,
    borderWidth: 2,
    borderColor: COLORS.primary.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 28,
    color: COLORS.primary.primary,
    fontWeight: '600',
    lineHeight: 30,
  },
  actionItem: {
    position: 'absolute',
    bottom: 0,
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  actionItemActive: {
    backgroundColor: GOLD,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK,
  },
  itemTextActive: {
    color: '#FFFFFF',
  },
  fontUpIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: DARK,
  },
  fontDownIcon: {
    fontSize: 13,
    fontWeight: '700',
    color: DARK,
  },
});

export default HukamnamaFab;
