import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { StackActions } from '@react-navigation/native';
import AppLoader from '../../Loader/AppLoader';
import AppText from '../../elements/AppText/AppText';
import { emptyListText } from '../../../utils/constant';
import { SIZES } from '../../../utils/theme';
import { push, navigationRef, goBack } from '../../../utils/NavigationUtils';
import { useGallery } from '../../../hooks/query/useGallery';
import GalleryCategoryCard from '../../cards/GalleryCategoryCard';
import GalleryImageCard from '../../cards/GalleryImageCard';
import ImageViewer from './ImageViewer';
import GalleryBreadcrumb, { BreadcrumbItem } from './GalleryBreadcrumb';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_COLUMNS = 2;
const IMAGE_SPACING = 8;
const IMAGE_CARD_SIZE =
  (SCREEN_WIDTH -
    SIZES.screenDefaultPadding * 2 -
    IMAGE_SPACING * (IMAGE_COLUMNS - 1)) /
  IMAGE_COLUMNS;

// Carousel constants
const CAROUSEL_CARD_WIDTH = SCREEN_WIDTH * 0.82;
const CAROUSEL_CARD_MARGIN = 8;
const CAROUSEL_SNAP_INTERVAL = CAROUSEL_CARD_WIDTH + CAROUSEL_CARD_MARGIN * 2;

type GalleryCategory = {
  id: number;
  parent_id: number | null;
  name: string;
  short_description?: string;
  highlight_image: string | null;
  images_count: number;
  children_count: number;
  children_recursive_published: GalleryCategory[];
  images: GalleryImage[];
};

type GalleryImage = {
  id: number;
  category_id: number;
  title: string | null;
  image_path: string;
  thumbnail: string | null;
  medium_img: string | null;
  sort_index: number;
};

type ListItem =
  | { type: 'section_header'; title: string; key: string }
  | { type: 'category'; data: GalleryCategory; index: number; key: string }
  | { type: 'category_carousel'; data: GalleryCategory[]; key: string }
  | {
      type: 'image_row';
      data: GalleryImage[];
      startIndex: number;
      key: string;
    };

export default function InnerGalleryListing({ route }: any) {
  const category: GalleryCategory | undefined = route?.params?.category;
  const s3BaseUrlParam: string | undefined = route?.params?.s3BaseUrl;
  const breadcrumbs: BreadcrumbItem[] = route?.params?.breadcrumbs || [];
  const { colors } = useAppContext();

  const { data: apiResponse, isLoading } = useGallery(1);

  const s3BaseUrl = s3BaseUrlParam || apiResponse?.s3_base_url || '';

  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);

  const isRoot = !category;

  const categories: GalleryCategory[] = useMemo(() => {
    if (category) {
      return category.children_recursive_published || [];
    }
    return apiResponse?.data?.data || [];
  }, [category, apiResponse]);

  const images: GalleryImage[] = useMemo(() => {
    return category?.images || [];
  }, [category]);

  // Build a single flat list: folders → images (in rows of 3)
  // Root level: vertical cards. Sub-levels: horizontal carousel for folders.
  const listItems: ListItem[] = useMemo(() => {
    const items: ListItem[] = [];

    if (categories.length > 0 && images.length > 0) {
      items.push({ type: 'section_header', title: 'Albums', key: 'sh-albums' });
    }

    if (categories.length > 0) {
      if (isRoot) {
        // Root level: full-width vertical cards
        categories.forEach((cat, idx) => {
          items.push({
            type: 'category',
            data: cat,
            index: idx,
            key: `cat-${cat.id}`,
          });
        });
      } else {
        // Sub-level: horizontal carousel
        items.push({
          type: 'category_carousel',
          data: categories,
          key: 'cat-carousel',
        });
      }
    }

    if (images.length > 0) {
      if (categories.length > 0) {
        items.push({
          type: 'section_header',
          title: 'Photos',
          key: 'sh-photos',
        });
      }
      for (let i = 0; i < images.length; i += IMAGE_COLUMNS) {
        const rowImages = images.slice(i, i + IMAGE_COLUMNS);
        items.push({
          type: 'image_row',
          data: rowImages,
          startIndex: i,
          key: `imgrow-${i}`,
        });
      }
    }

    return items;
  }, [categories, images, isRoot]);

  const buildImageUrl = (path: string | null) => {
    if (!path || !s3BaseUrl) return '';
    return `${s3BaseUrl}/${path}`;
  };

  const handleCategoryPress = (cat: GalleryCategory) => {
    const newBreadcrumb: BreadcrumbItem = {
      id: cat.id,
      name: cat.name,
      highlight_image: cat.highlight_image,
    };
    push('GalleryScreen', {
      category: cat,
      s3BaseUrl,
      breadcrumbs: [...breadcrumbs, newBreadcrumb],
    });
  };

  const handleBackPress = () => {
    if (isRoot) {
      // At root gallery → go back to Home/Dashboard
      goBack();
    } else {
      // At any sub-level → pop all the way back to root gallery
      const depth = breadcrumbs.length;
      if (depth > 0 && navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.pop(depth));
      } else {
        goBack();
      }
    }
  };

  const handleBreadcrumbPress = (index: number) => {
    // Pop back to the breadcrumb level that was clicked
    // breadcrumbs = [A, B, C] and we're in C (depth 3)
    // Click A (index 0): pop(3 - 1 - 0) = pop(2)
    // Click B (index 1): pop(3 - 1 - 1) = pop(1)
    const popCount = breadcrumbs.length - 1 - index;
    if (popCount > 0 && navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.pop(popCount));
    }
  };

  const handleImagePress = (imageIndex: number) => {
    setViewerStartIndex(imageIndex);
    setViewerVisible(true);
  };

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'section_header') {
        return (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={styles.sectionHeaderContainer}
          >
            <View
              style={[
                styles.sectionLine,
                { backgroundColor: withOpacity(colors.primary, 0.15) },
              ]}
            />
            <AppText
              size={13}
              style={[styles.sectionHeaderText, { color: colors.primary }]}
            >
              {item.title}
            </AppText>
            <View
              style={[
                styles.sectionLine,
                { backgroundColor: withOpacity(colors.primary, 0.15) },
              ]}
            />
          </Animated.View>
        );
      }

      if (item.type === 'category') {
        const cat = item.data;
        return (
          <GalleryCategoryCard
            name={cat.name}
            shortDescription={cat.short_description}
            highlightImage={buildImageUrl(cat.highlight_image)}
            imagesCount={cat.images_count ?? cat.images?.length ?? 0}
            childrenCount={
              cat.children_count ??
              (cat.children_recursive_published?.length || 0)
            }
            onPress={() => handleCategoryPress(cat)}
            index={item.index}
            direction="vertical"
          />
        );
      }

      if (item.type === 'category_carousel') {
        return (
          <View style={styles.carouselBreakout}>
            <CategoryCarousel
              categories={item.data}
              buildImageUrl={buildImageUrl}
              onCategoryPress={handleCategoryPress}
              primaryColor={colors.primary}
            />
          </View>
        );
      }

      if (item.type === 'image_row') {
        return (
          <ImageRow
            images={item.data}
            startIndex={item.startIndex}
            buildImageUrl={buildImageUrl}
            onImagePress={handleImagePress}
            cardSize={IMAGE_CARD_SIZE}
          />
        );
      }

      return null;
    },
    [s3BaseUrl, colors, breadcrumbs],
  );

  const ListHeaderComponent = useMemo(() => {
    if (!category?.short_description) return null;
    return (
      <Animated.View
        entering={FadeIn.duration(400)}
        style={styles.headerDescription}
      >
        <AppText size={13} style={styles.headerDescriptionText}>
          {category.short_description}
        </AppText>
      </Animated.View>
    );
  }, [category]);

  if (isLoading && isRoot) {
    return (
      <View style={styles.container}>
        <GalleryBreadcrumb
          breadcrumbs={[]}
          s3BaseUrl={s3BaseUrl}
          onBackPress={handleBackPress}
          onBreadcrumbPress={handleBreadcrumbPress}
        />
        <AppLoader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GalleryBreadcrumb
        breadcrumbs={breadcrumbs}
        s3BaseUrl={s3BaseUrl}
        onBackPress={handleBackPress}
        onBreadcrumbPress={handleBreadcrumbPress}
      />

      <FlatList
        data={listItems}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppText size={14} style={styles.emptyText}>
              {emptyListText}
            </AppText>
          </View>
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={6}
      />

      {images.length > 0 && (
        <ImageViewer
          visible={viewerVisible}
          images={images.map(img => ({
            uri: buildImageUrl(img.image_path),
            title: img.title || undefined,
          }))}
          startIndex={viewerStartIndex}
          onClose={() => setViewerVisible(false)}
        />
      )}
    </View>
  );
}

// Horizontal carousel for sub-level folder cards with pagination dots
type CategoryCarouselProps = {
  categories: GalleryCategory[];
  buildImageUrl: (path: string | null) => string;
  onCategoryPress: (cat: GalleryCategory) => void;
  primaryColor: string;
};

function CategoryCarousel({
  categories,
  buildImageUrl,
  onCategoryPress,
  primaryColor,
}: CategoryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<FlatList>(null);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / CAROUSEL_SNAP_INTERVAL);
      setActiveIndex(Math.min(index, categories.length - 1));
    },
    [categories.length],
  );

  const renderCarouselItem = useCallback(
    ({ item, index }: { item: GalleryCategory; index: number }) => (
      <View style={carouselStyles.cardWrapper}>
        <GalleryCategoryCard
          name={item.name}
          shortDescription={item.short_description}
          highlightImage={buildImageUrl(item.highlight_image)}
          imagesCount={item.images_count ?? item.images?.length ?? 0}
          childrenCount={
            item.children_count ??
            (item.children_recursive_published?.length || 0)
          }
          onPress={() => onCategoryPress(item)}
          index={index}
        />
      </View>
    ),
    [buildImageUrl, onCategoryPress],
  );

  return (
    <Animated.View
      entering={FadeIn.duration(350)}
      style={carouselStyles.container}
    >
      <FlatList
        ref={carouselRef}
        data={categories}
        renderItem={renderCarouselItem}
        keyExtractor={cat => `carousel-${cat.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CAROUSEL_SNAP_INTERVAL}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={carouselStyles.listContent}
      />
      {categories.length > 1 && (
        <View style={carouselStyles.dotsRow}>
          {categories.map((cat, i) => (
            <View
              key={cat.id}
              style={[
                carouselStyles.dot,
                {
                  backgroundColor:
                    i === activeIndex
                      ? primaryColor
                      : withOpacity(primaryColor, 0.2),
                  width: i === activeIndex ? 18 : 7,
                },
              ]}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const carouselStyles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  listContent: {
    paddingLeft: SIZES.screenDefaultPadding,
    paddingRight: SIZES.screenDefaultPadding - CAROUSEL_CARD_MARGIN,
  },
  cardWrapper: {
    width: CAROUSEL_CARD_WIDTH,
    marginHorizontal: CAROUSEL_CARD_MARGIN,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
    marginBottom: 6,
  },
  dot: {
    height: 7,
    borderRadius: 4,
  },
});

// Image row component for the gallery grid
type ImageRowProps = {
  images: GalleryImage[];
  startIndex: number;
  buildImageUrl: (path: string | null) => string;
  onImagePress: (index: number) => void;
  cardSize: number;
};

function ImageRow({
  images,
  startIndex,
  buildImageUrl,
  onImagePress,
  cardSize,
}: ImageRowProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(15);

  useEffect(() => {
    opacity.value = withDelay(
      50,
      withTiming(1, { duration: 350, easing: Easing.out(Easing.quad) }),
    );
    translateY.value = withDelay(
      50,
      withTiming(0, { duration: 350, easing: Easing.out(Easing.quad) }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.imageRow, animatedStyle]}>
      {images.map((img, idx) => (
        <GalleryImageCard
          key={`img-${img.id}`}
          thumbnailUrl={buildImageUrl(img.thumbnail || img.image_path)}
          title={img.title || undefined}
          size={cardSize}
          onPress={() => onImagePress(startIndex + idx)}
        />
      ))}
      {images.length < IMAGE_COLUMNS &&
        Array.from({ length: IMAGE_COLUMNS - images.length }).map((_, i) => (
          <View key={`empty-${i}`} style={{ width: cardSize }} />
        ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SIZES.screenDefaultPadding,
    paddingTop: SIZES.xsSmall,
    paddingBottom: 30,
  },
  headerDescription: {
    marginBottom: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerDescriptionText: {
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 19,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
    gap: 10,
  },
  sectionLine: {
    flex: 1,
    height: 1,
  },
  sectionHeaderText: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: IMAGE_SPACING,
    marginBottom: IMAGE_SPACING,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: '#999',
  },
  carouselBreakout: {
    marginHorizontal: -SIZES.screenDefaultPadding,
  },
});
