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
  Image,
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
import AppLoader from '../../Loader/AppLoader';
import AppText from '../../elements/AppText/AppText';
import { emptyListText } from '../../../utils/constant';
import { SIZES } from '../../../utils/theme';
import { push } from '../../../utils/NavigationUtils';
import { useGallery } from '../../../hooks/query/useGallery';
import GalleryCategoryCard from '../../cards/GalleryCategoryCard';
import GalleryImageCard from '../../cards/GalleryImageCard';
import ImageViewer from './ImageViewer';
import { BreadcrumbItem } from './GalleryBreadcrumb';
import MainHeader from '../../headers/MainHeader';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';
import { useLocalize } from '../../../hooks/useLocalize';
import AppHeader from '../../headers/AppHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PAD = SIZES.screenDefaultPadding;

// Category grid — 2-column
const CAT_GAP = 10;
const CATEGORY_CARD_W = (SCREEN_WIDTH - H_PAD * 2 - CAT_GAP) / 2;

// Carousel — sub-level folders
const CAROUSEL_CARD_W = SCREEN_WIDTH * 0.44;
const CAROUSEL_CARD_MARGIN = 6;
const CAROUSEL_SNAP_INTERVAL = CAROUSEL_CARD_W + CAROUSEL_CARD_MARGIN * 2;

// Image grid — 3-column
const IMAGE_COLUMNS = 3;
const IMAGE_SPACING = 6;
const IMAGE_CARD_SIZE =
  (SCREEN_WIDTH - H_PAD * 2 - IMAGE_SPACING * (IMAGE_COLUMNS - 1)) /
  IMAGE_COLUMNS;

type GalleryCategory = {
  id: number;
  parent_id: number | null;
  name: string;
  name_punjabi: string | null;
  short_description?: string | null;
  long_description?: string | null;
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
  title_punjabi: string | null;
  image_path: string;
  thumbnail: string | null;
  medium_img: string | null;
  sort_index: number;
};

type ListItem =
  | { type: 'section_header'; title: string; key: string }
  | { type: 'category_row'; data: GalleryCategory[]; startIndex: number; key: string }
  | { type: 'category_carousel'; data: GalleryCategory[]; key: string }
  | { type: 'image_row'; data: GalleryImage[]; startIndex: number; key: string };

export default function InnerGalleryListing({ route }: any) {
  const category: GalleryCategory | undefined = route?.params?.category;
  const s3BaseUrlParam: string | undefined = route?.params?.s3BaseUrl;
  const breadcrumbs: BreadcrumbItem[] = route?.params?.breadcrumbs || [];
  const { colors, lang } = useAppContext();
  const { t } = useLocalize();

  const { data: apiResponse, isLoading } = useGallery(1);

  const s3BaseUrl = s3BaseUrlParam || apiResponse?.s3_base_url || '';

  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);

  // category.id → computed natural image height (used to align cards within a row)
  const [categoryImageHeights, setCategoryImageHeights] = useState<Record<number, number>>({});

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

  // Pre-fetch highlight image dimensions so rows can use a uniform height
  useEffect(() => {
    if (!s3BaseUrl || categories.length === 0) return;
    const pending: Record<number, number> = {};
    let resolved = 0;
    categories.forEach(cat => {
      if (!cat.highlight_image) {
        resolved++;
        return;
      }
      const url = `${s3BaseUrl}/${cat.highlight_image}`;
      Image.getSize(
        url,
        (imgW, imgH) => {
          pending[cat.id] = CATEGORY_CARD_W * (imgH / imgW);
          resolved++;
          if (resolved === categories.length) {
            setCategoryImageHeights(prev => ({ ...prev, ...pending }));
          }
        },
        () => {
          resolved++;
          if (resolved === categories.length) {
            setCategoryImageHeights(prev => ({ ...prev, ...pending }));
          }
        },
      );
    });
  }, [categories, s3BaseUrl]);

  const listItems: ListItem[] = useMemo(() => {
    const items: ListItem[] = [];

    if (categories.length > 0 && images.length > 0) {
      items.push({ type: 'section_header', title: lang?.albums || 'Albums', key: 'sh-albums' });
    }

    if (categories.length > 0) {
      if (isRoot) {
        // Root: 2-column grid rows
        for (let i = 0; i < categories.length; i += 2) {
          items.push({
            type: 'category_row',
            data: categories.slice(i, i + 2),
            startIndex: i,
            key: `catrow-${i}`,
          });
        }
      } else {
        // Sub-level: horizontal carousel
        items.push({ type: 'category_carousel', data: categories, key: 'cat-carousel' });
      }
    }

    if (images.length > 0) {
      if (categories.length > 0) {
        items.push({
          type: 'section_header',
          title: lang?.photos || 'Photos',
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
  }, [categories, images, isRoot, lang]);

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
              size={12}
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

      if (item.type === 'category_row') {
        // Uniform row height = max of pre-fetched heights for cards in this row
        const fallback = CATEGORY_CARD_W * 0.72;
        const rowHeight = Math.max(
          ...item.data.map(cat => categoryImageHeights[cat.id] ?? fallback),
          fallback,
        );
        return (
          <View style={styles.categoryRow}>
            {item.data.map((cat, idx) => (
              <GalleryCategoryCard
                key={cat.id}
                name={t(cat, 'name')}
                highlightImage={buildImageUrl(cat.highlight_image)}
                imagesCount={cat.images_count}
                childrenCount={cat.children_count}
                onPress={() => handleCategoryPress(cat)}
                width={CATEGORY_CARD_W}
                index={item.startIndex + idx}
                fixedHeight={rowHeight}
              />
            ))}
            {item.data.length < 2 && (
              <View style={{ width: CATEGORY_CARD_W }} />
            )}
          </View>
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
    [s3BaseUrl, colors, breadcrumbs, lang, t, categoryImageHeights],
  );

  const ListHeaderComponent = useMemo(() => {
    const short = category?.short_description;
    const long = category?.long_description;
    if (!short && !long) return null;
    return (
      <Animated.View
        entering={FadeIn.duration(400)}
        style={styles.headerDescription}
      >
        {long ? (
          <AppText size={13} style={[styles.headerDescriptionText, { color: colors.primary }]}>
            {long}
          </AppText>
        ) : null}
        {short ? (
          <AppText size={12} style={styles.headerDescriptionSubText}>
            {short}
          </AppText>
        ) : null}
      </Animated.View>
    );
  }, [category, colors]);

  const headerTitle = isRoot
    ? (lang?.gallery || 'Gallery')
    : t(category, 'name');

  if (isLoading && isRoot) {
    return (
      <View style={styles.container}>
        <MainHeader
          title={headerTitle}
          isShowSearchIcon={false}
          isShowFontSize={true}
          isShowHomeButton={true}
        />
        <AppLoader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title={headerTitle}
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
        initialNumToRender={8}
      />

      {images.length > 0 && (
        <ImageViewer
          visible={viewerVisible}
          images={images.map(img => ({
            uri: buildImageUrl(img.image_path),
            title: t(img, 'title') || undefined,
          }))}
          startIndex={viewerStartIndex}
          onClose={() => setViewerVisible(false)}
        />
      )}
    </View>
  );
}

// ── Horizontal carousel for sub-level folders ──────────────────────────────
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
  const { t } = useLocalize();
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
          name={t(item, 'name')}
          highlightImage={buildImageUrl(item.highlight_image)}
          imagesCount={item.images_count}
          childrenCount={item.children_count}
          onPress={() => onCategoryPress(item)}
          width={CAROUSEL_CARD_W}
          index={index}
        />
      </View>
    ),
    [buildImageUrl, onCategoryPress, t],
  );

  return (
    <Animated.View entering={FadeIn.duration(350)} style={carouselStyles.container}>
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
                  width: i === activeIndex ? 16 : 6,
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
    paddingLeft: H_PAD,
    paddingRight: H_PAD - CAROUSEL_CARD_MARGIN,
  },
  cardWrapper: {
    marginHorizontal: CAROUSEL_CARD_MARGIN,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
    marginBottom: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});

// ── Image row ──────────────────────────────────────────────────────────────
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
  const { t } = useLocalize();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    opacity.value = withDelay(
      40,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) }),
    );
    translateY.value = withDelay(
      40,
      withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) }),
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
          title={t(img, 'title') || undefined}
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
    paddingHorizontal: H_PAD,
    paddingTop: SIZES.xsSmall,
    paddingBottom: 30,
  },
  headerDescription: {
    marginBottom: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 4,
  },
  headerDescriptionText: {
    fontWeight: '600',
    lineHeight: 20,
  },
  headerDescriptionSubText: {
    color: '#888',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
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
  categoryRow: {
    flexDirection: 'row',
    gap: CAT_GAP,
    marginBottom: CAT_GAP,
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
    marginHorizontal: -H_PAD,
    marginBottom: 4,
  },
});
