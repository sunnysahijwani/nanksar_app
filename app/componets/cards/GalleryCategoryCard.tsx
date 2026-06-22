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

type GalleryCategoryCardProps = {
  name: string;
  highlightImage: string;
  onPress: () => void;
  width: number;
  index?: number;
  imagesCount?: number;
  childrenCount?: number;
  /** If provided, overrides the locally computed image height (for uniform row heights) */
  fixedHeight?: number;
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const GalleryCategoryCard: React.FC<GalleryCategoryCardProps> = ({
  name,
  highlightImage,
  onPress,
  width,
  index = 0,
  imagesCount,
  childrenCount,
  fixedHeight,
}) => {
  const { colors } = useAppContext();

  // Natural image height derived from actual image dimensions
  const [naturalHeight, setNaturalHeight] = useState(width * 0.72);

  useEffect(() => {
    if (highlightImage) {
      Image.getSize(
        highlightImage,
        (imgW, imgH) => {
          const aspectRatio = imgH / imgW;
          setNaturalHeight(width * aspectRatio);
        },
        () => {
          setNaturalHeight(width * 0.72);
        },
      );
    }
  }, [highlightImage, width]);

  // Use row-level fixed height when provided (keeps siblings aligned), else use natural
  const imageHeight = fixedHeight ?? naturalHeight;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(18);
  const scale = useSharedValue(1);

  useEffect(() => {
    const delay = index * 70;
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 350, easing: Easing.out(Easing.quad) }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 380, easing: Easing.out(Easing.back(1.05)) }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedTouchable
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, { width }, animatedStyle]}
    >
      {/* Image */}
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        {highlightImage ? (
          <Image
            source={{ uri: highlightImage }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: withOpacity(colors.primary, 0.08) },
            ]}
          >
            <AppText size={28} style={{ color: withOpacity(colors.primary, 0.2) }}>
              {'|||'}
            </AppText>
          </View>
        )}
      </View>

      {/* Title + counts below image */}
      <View style={styles.nameContainer}>
        <AppText
          size={13}
          style={[styles.name, { color: colors.primary }]}
          numberOfLines={2}
        >
          {name}
        </AppText>
        {((imagesCount ?? 0) > 0 || (childrenCount ?? 0) > 0) && (
          <View style={styles.countRow}>
            {(childrenCount ?? 0) > 0 && (
              <View style={[styles.countBadge, { backgroundColor: withOpacity(colors.primary, 0.08) }]}>
                <AppText size={10} style={[styles.countText, { color: withOpacity(colors.primary, 0.7) }]}>
                  {childrenCount} 📁
                </AppText>
              </View>
            )}
            {(imagesCount ?? 0) > 0 && (
              <View style={[styles.countBadge, { backgroundColor: withOpacity(colors.primary, 0.08) }]}>
                <AppText size={10} style={[styles.countText, { color: withOpacity(colors.primary, 0.7) }]}>
                  {imagesCount} 🖼
                </AppText>
              </View>
            )}
          </View>
        )}
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#e8e8e8',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    paddingHorizontal: 10,
    paddingTop: 9,
    paddingBottom: 10,
    gap: 6,
  },
  name: {
    fontWeight: '700',
    letterSpacing: 0.2,
    lineHeight: 18,
  },
  countRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  countBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  countText: {
    fontWeight: '600',
  },
});

export default GalleryCategoryCard;
