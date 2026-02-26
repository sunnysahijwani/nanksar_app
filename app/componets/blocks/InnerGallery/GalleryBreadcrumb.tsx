import React, { useEffect, useRef } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ARROW_LEFT } from '../../../assets/svgs';
import AppText from '../../elements/AppText/AppText';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';
import { SIZES } from '../../../utils/theme';

export type BreadcrumbItem = {
  id: number;
  name: string;
  highlight_image: string | null;
};

type GalleryBreadcrumbProps = {
  breadcrumbs: BreadcrumbItem[];
  s3BaseUrl: string;
  onBackPress: () => void;
  onBreadcrumbPress: (index: number) => void;
};

const CIRCLE_SIZE = 36;

export default function GalleryBreadcrumb({
  breadcrumbs,
  s3BaseUrl,
  onBackPress,
  onBreadcrumbPress,
}: GalleryBreadcrumbProps) {
  const { colors } = useAppContext();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to the end when breadcrumbs change
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [breadcrumbs.length]);

  const buildImageUrl = (path: string | null) => {
    if (!path || !s3BaseUrl) return '';
    return `${s3BaseUrl}/${path}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBackPress}
        style={[styles.backButton, { backgroundColor: withOpacity(colors.primary, 0.08) }]}
        activeOpacity={0.7}
      >
        <ARROW_LEFT color={colors.primary} width={22} height={22} />
      </TouchableOpacity>

      {breadcrumbs.length > 0 && (
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <BreadcrumbCircle
                key={item.id}
                item={item}
                imageUrl={buildImageUrl(item.highlight_image)}
                isLast={isLast}
                index={index}
                primaryColor={colors.primary}
                onPress={() => {
                  if (!isLast) {
                    onBreadcrumbPress(index);
                  }
                }}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

type BreadcrumbCircleProps = {
  item: BreadcrumbItem;
  imageUrl: string;
  isLast: boolean;
  index: number;
  primaryColor: string;
  onPress: () => void;
};

function BreadcrumbCircle({
  item,
  imageUrl,
  isLast,
  index,
  primaryColor,
  onPress,
}: BreadcrumbCircleProps) {
  const scale = useSharedValue(isLast ? 0.3 : 1);
  const opacity = useSharedValue(isLast ? 0 : 1);
  const translateX = useSharedValue(isLast ? 20 : 0);

  useEffect(() => {
    if (isLast) {
      const delay = 50;
      scale.value = withDelay(
        delay,
        withSpring(1, { damping: 12, stiffness: 180, mass: 0.8 }),
      );
      opacity.value = withDelay(
        delay,
        withTiming(1, { duration: 250, easing: Easing.out(Easing.quad) }),
      );
      translateX.value = withDelay(
        delay,
        withSpring(0, { damping: 14, stiffness: 200 }),
      );
    }
  }, [isLast]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.breadcrumbItem, animatedStyle]}>
      {/* Chevron separator before each circle except the first */}
      {index > 0 && (
        <AppText size={10} style={styles.chevron}>
          {'\u203A'}
        </AppText>
      )}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={isLast ? 1 : 0.7}
        style={[
          styles.circleWrapper,
          {
            borderColor: isLast ? primaryColor : withOpacity(primaryColor, 0.25),
            borderWidth: isLast ? 2.5 : 1.5,
          },
        ]}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.circleImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.circlePlaceholder, { backgroundColor: withOpacity(primaryColor, 0.12) }]}>
            <AppText size={14} style={{ color: withOpacity(primaryColor, 0.4) }}>
              {'F'}
            </AppText>
          </View>
        )}
      </TouchableOpacity>
      {isLast && (
        <AppText
          size={11}
          style={[styles.currentLabel, { color: primaryColor }]}
          numberOfLines={1}
        >
          {item.name}
        </AppText>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.screenDefaultPadding,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 50,
  },
  scrollView: {
    flex: 1,
    marginLeft: 8,
  },
  scrollContent: {
    alignItems: 'center',
    paddingRight: 8,
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    color: '#aaa',
    marginHorizontal: 6,
    fontSize: 16,
  },
  circleWrapper: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },
  circlePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLabel: {
    marginLeft: 6,
    fontWeight: '600',
    maxWidth: 120,
  },
});
