import React, { useCallback } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import AppText from '../AppText/AppText';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';

// Gurmukhi keyboard layout matching the screenshot
const KEYBOARD_ROWS = [
  ['ੳ', 'ਕ', 'ਚ', 'ਟ', 'ਤ', 'ਪ', 'ਯ', 'ੴ'],
  ['ਅ', 'ਖ', 'ਛ', 'ਠ', 'ਥ', 'ਫ', 'ਰ', 'ੜ'],
  ['ੲ', 'ਗ', 'ਜ', 'ਡ', 'ਦ', 'ਬ', 'ਲ', '॥'],
  ['ਸ', 'ਘ', 'ਝ', 'ਢ', 'ਧ', 'ਭ', 'ਵ', '⌫'],
  ['ਹ', 'ਙ', 'ਞ', 'ਣ', 'ਨ', 'ਮ', '⌨', '੧੨੩'],
];

// Number/symbol pad
const NUMBER_ROWS = [
  ['੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮'],
  ['੯', '੦', 'ੰ', 'ਂ', 'ੱ', '਼', 'ਃ', '⌫'],
  ['ਾ', 'ਿ', 'ੀ', 'ੁ', 'ੂ', 'ੇ', 'ੈ', 'ੋ'],
  ['ੌ', 'ਁ', ' ', ' ', ' ', ' ', '⌨', 'ੳਅੲ'],
];

type PunjabiKeyboardProps = {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onToggleKeyboard?: () => void;
};

type KeyButtonProps = {
  keyChar: string;
  isSpecial: boolean;
  onPress: () => void;
  primaryColor: string;
};

const KeyButton = React.memo(({ keyChar, isSpecial, onPress, primaryColor }: KeyButtonProps) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  }, [scaleAnim]);

  return (
    <Animated.View style={[styles.keyOuter, { transform: [{ scale: scaleAnim }] }]}>
      {/* Bottom shadow layer — gives the raised 3D look */}
      <View style={[styles.keyShadow, { backgroundColor: isSpecial ? withOpacity(primaryColor, 0.35) : withOpacity(primaryColor, 0.25) }]} />
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.key,
          isSpecial
            ? { backgroundColor: withOpacity(primaryColor, 0.15) }
            : styles.normalKey,
        ]}
      >
        <AppText
          size={keyChar === '⌫' ? 18 : isSpecial ? 11 : 20}
          style={[
            styles.keyText,
            { color: isSpecial ? primaryColor : primaryColor },
          ]}
        >
          {keyChar}
        </AppText>
      </Pressable>
    </Animated.View>
  );
});

export default function PunjabiKeyboard({
  onKeyPress,
  onBackspace,
  onToggleKeyboard,
}: PunjabiKeyboardProps) {
  const { colors } = useAppContext();
  const [showNumbers, setShowNumbers] = React.useState(false);

  const rows = showNumbers ? NUMBER_ROWS : KEYBOARD_ROWS;

  const handlePress = useCallback((key: string) => {
    if (key === '⌫') {
      onBackspace();
    } else if (key === '੧੨੩') {
      setShowNumbers(true);
    } else if (key === 'ੳਅੲ') {
      setShowNumbers(false);
    } else if (key === '⌨') {
      onToggleKeyboard?.();
    } else if (key.trim() === '') {
      onKeyPress(' ');
    } else {
      onKeyPress(key);
    }
  }, [onKeyPress, onBackspace, onToggleKeyboard]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.secondary },
      ]}
    >
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key, keyIndex) => {
            const isSpecial =
              key === '⌫' || key === '⌨' || key === '੧੨੩' || key === 'ੳਅੲ';
            return (
              <KeyButton
                key={`${rowIndex}-${keyIndex}`}
                keyChar={key}
                isSpecial={isSpecial}
                onPress={() => handlePress(key)}
                primaryColor={colors.primary}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 3,
    paddingVertical: 10,
    paddingBottom: 20,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    gap: 5,
  },
  keyOuter: {
    flex: 1,
    height: 46,
    position: 'relative',
  },
  // Dark underlay visible at the bottom — creates the 3D edge
  keyShadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 1,
    bottom: 0,
    borderRadius: 7,
  },
  key: {
    flex: 1,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    // Leave 3px at bottom so keyShadow peeks through
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 3,
  },
  normalKey: {
    backgroundColor: '#ffffff',
  },
  keyText: {
    fontWeight: '500',
  },
});
