import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import AppText from '../elements/AppText/AppText';
import LinearGradient from 'react-native-linear-gradient';

type GalleryImageCardProps = {
  thumbnailUrl: string;
  title?: string;
  size: number;
  onPress: () => void;
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const GalleryImageCard: React.FC<GalleryImageCardProps> = ({
  thumbnailUrl,
  title,
  size,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
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
      style={[styles.card, { width: size, height: size }, animatedStyle]}
    >
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      {title ? (
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.titleOverlay}
        >
          <AppText size={9} style={styles.titleText} numberOfLines={1}>
            {title}
          </AppText>
        </LinearGradient>
      ) : null}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: '#e8e8e8',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 6,
    paddingTop: 16,
    paddingBottom: 5,
  },
  titleText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default GalleryImageCard;
