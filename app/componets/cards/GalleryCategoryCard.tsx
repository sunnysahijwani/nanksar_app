import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  withSpring,
} from 'react-native-reanimated';
import AppText from '../elements/AppText/AppText';
import { useAppContext } from '../../context/AppContext';
import { withOpacity } from '../../utils/helper';
import LinearGradient from 'react-native-linear-gradient';
import ImageAutoResize from '../smartComponents/ImageAutoResize';

type GalleryCategoryCardProps = {
  name: string;
  shortDescription?: string;
  highlightImage: string;
  imagesCount: number;
  childrenCount: number;
  onPress: () => void;
  index?: number;
  direction?: 'vertical' | 'horizontal';
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const GalleryCategoryCard: React.FC<GalleryCategoryCardProps> = ({
  name,
  shortDescription,
  highlightImage,
  imagesCount,
  childrenCount,
  onPress,
  index = 0,
  direction = 'horizontal',
}) => {
  const { colors } = useAppContext();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(1);

  useEffect(() => {
    const delay = index * 100;
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 450, easing: Easing.out(Easing.back(1.1)) }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(0, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedTouchable
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card]}
    >
      {highlightImage ? (
        <View
          style={[
            styles.imageContainer,
            { height: direction === 'horizontal' ? 200 : 'auto' },
          ]}
        >
          {direction === 'vertical' ? (
            <ImageAutoResize source={highlightImage} />
          ) : (
            <Image
              source={{ uri: highlightImage }}
              style={[styles.image]}
              resizeMode="cover"
            />
          )}
        </View>
      ) : (
        <View
          style={[
            styles.placeholderImage,
            { backgroundColor: withOpacity(colors.primary, 0.1) },
          ]}
        >
          <AppText
            size={40}
            style={{ color: withOpacity(colors.primary, 0.25) }}
          >
            {'|||'}
          </AppText>
        </View>
      )}

      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <AppText size={16} style={styles.nameText} numberOfLines={1}>
            {name}
          </AppText>
          {shortDescription ? (
            <AppText size={12} style={styles.descriptionText} numberOfLines={2}>
              {shortDescription}
            </AppText>
          ) : null}
        </View>

        <View style={styles.statsRow}>
          {childrenCount > 0 && (
            <View
              style={[
                styles.statBadge,
                { backgroundColor: withOpacity(colors.primary, 0.08) },
              ]}
            >
              <FolderIcon color={colors.primary} size={14} />
              <AppText
                size={11}
                style={[styles.statText, { color: colors.primary }]}
              >
                {childrenCount}
              </AppText>
            </View>
          )}
          {imagesCount > 0 && (
            <View
              style={[
                styles.statBadge,
                { backgroundColor: withOpacity(colors.primary, 0.08) },
              ]}
            >
              <ImageIcon color={colors.primary} size={14} />
              <AppText
                size={11}
                style={[styles.statText, { color: colors.primary }]}
              >
                {imagesCount}
              </AppText>
            </View>
          )}
        </View>
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.03)']}
        style={styles.subtleGradient}
        pointerEvents="none"
      />
    </AnimatedTouchable>
  );
};

const FolderIcon = ({ color, size }: { color: string; size: number }) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <View
      style={{
        width: size * 0.55,
        height: size * 0.15,
        backgroundColor: color,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        position: 'absolute',
        top: size * 0.15,
        left: 0,
      }}
    />
    <View
      style={{
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        borderRadius: 2,
        position: 'absolute',
        bottom: size * 0.1,
      }}
    />
  </View>
);

const ImageIcon = ({ color, size }: { color: string; size: number }) => (
  <View
    style={{
      width: size,
      height: size * 0.8,
      borderWidth: 1.5,
      borderColor: color,
      borderRadius: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: size * 0.1,
    }}
  >
    <View
      style={{
        width: size * 0.25,
        height: size * 0.25,
        borderRadius: size * 0.125,
        backgroundColor: color,
        position: 'absolute',
        top: size * 0.1,
        right: size * 0.1,
      }}
    />
    <View
      style={{
        width: 0,
        height: 0,
        borderLeftWidth: size * 0.2,
        borderRightWidth: size * 0.2,
        borderBottomWidth: size * 0.25,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
        position: 'absolute',
        bottom: size * 0.05,
        left: size * 0.08,
        transform: [{ rotate: '180deg' }],
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 100,
    justifyContent: 'space-between',
  },
  textContainer: {
    gap: 4,
    flex: 1,
  },
  nameText: {
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.2,
  },
  descriptionText: {
    fontWeight: '400',
    color: '#777',
    fontStyle: 'italic',
    lineHeight: 17,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statText: {
    fontWeight: '600',
  },
  subtleGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
});

export default GalleryCategoryCard;
