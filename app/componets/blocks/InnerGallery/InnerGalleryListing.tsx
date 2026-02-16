import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, FlatList, View, StyleSheet } from 'react-native';
import AudioListingHeader from '../../headers/AudioListingHeader';
import AppLoader from '../../Loader/AppLoader';
import AppText from '../../elements/AppText/AppText';
import { emptyListText } from '../../../utils/constant';
import { SIZES } from '../../../utils/theme';
import { navigate } from '../../../utils/NavigationUtils';
import { useGallery } from '../../../hooks/query/useGallery';
import GalleryCategoryCard from '../../cards/GalleryCategoryCard';
import GalleryImageCard from '../../cards/GalleryImageCard';
import ImageViewer from './ImageViewer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const SPACING = 10;
const CARD_SIZE = (SCREEN_WIDTH - SIZES.screenDefaultPadding * 2 - SPACING) / NUM_COLUMNS;

type GalleryCategory = {
  id: number;
  parent_id: number | null;
  name: string;
  highlight_image: string | null;
  images_count: number;
  children_recursive: GalleryCategory[];
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

type GridItem =
  | { type: 'category'; data: GalleryCategory }
  | { type: 'image'; data: GalleryImage; index: number };

export default function InnerGalleryListing({ route }: any) {
  const category: GalleryCategory | undefined = route?.params?.category;
  const s3BaseUrlParam: string | undefined = route?.params?.s3BaseUrl;

  const { data: apiResponse, isLoading } = useGallery(1);

  const s3BaseUrl = s3BaseUrlParam || apiResponse?.s3_base_url || '';

  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);

  // If we have a category passed via params, show its children + images
  // Otherwise show top-level categories from the API
  const categories: GalleryCategory[] = useMemo(() => {
    if (category) {
      return category.children_recursive || [];
    }
    return apiResponse?.data?.data || [];
  }, [category, apiResponse]);

  const images: GalleryImage[] = useMemo(() => {
    return category?.images || [];
  }, [category]);

  // Build a unified grid: images first, then sub-categories
  const gridItems: GridItem[] = useMemo(() => {
    const items: GridItem[] = [];
    images.forEach((img, idx) => {
      items.push({ type: 'image', data: img, index: idx });
    });
    categories.forEach(cat => {
      items.push({ type: 'category', data: cat });
    });
    return items;
  }, [images, categories]);

  const buildImageUrl = (path: string | null) => {
    if (!path || !s3BaseUrl) return '';
    return `${s3BaseUrl}/${path}`;
  };

  const handleCategoryPress = (cat: GalleryCategory) => {
    navigate('GalleryScreen', { category: cat, s3BaseUrl });
  };

  const handleImagePress = (imageIndex: number) => {
    setViewerStartIndex(imageIndex);
    setViewerVisible(true);
  };

  const renderItem = useCallback(({ item }: { item: GridItem }) => {
    if (item.type === 'category') {
      const cat = item.data;
      return (
        <View style={styles.cardWrapper}>
          <GalleryCategoryCard
            name={cat.name}
            highlightImage={buildImageUrl(cat.highlight_image)}
            imagesCount={cat.images_count}
            size={CARD_SIZE}
            onPress={() => handleCategoryPress(cat)}
          />
        </View>
      );
    }

    const img = item.data;
    return (
      <View style={styles.cardWrapper}>
        <GalleryImageCard
          thumbnailUrl={buildImageUrl(img.thumbnail || img.image_path)}
          title={img.title || undefined}
          size={CARD_SIZE}
          onPress={() => handleImagePress(item.index)}
        />
      </View>
    );
  }, [s3BaseUrl, categories]);

  const headerTitle = category?.name || 'Gallery';

  // Section headers for images and categories
  const ListHeaderComponent = useMemo(() => {
    if (!category) return null;
    if (images.length === 0 && categories.length === 0) return null;

    return (
      <View style={styles.sectionHeader}>
        {category.short_description ? (
          <AppText size={13} style={styles.descriptionText}>
            {category.short_description}
          </AppText>
        ) : null}
      </View>
    );
  }, [category, images, categories]);

  if (isLoading && !category) {
    return (
      <View style={styles.container}>
        <AudioListingHeader />
        <AppLoader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AudioListingHeader />

      <FlatList
        data={gridItems}
        renderItem={renderItem}
        keyExtractor={(item) =>
          item.type === 'category'
            ? `cat-${item.data.id}`
            : `img-${item.data.id}`
        }
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppText size={14} style={styles.emptyText}>{emptyListText}</AppText>
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
            title: img.title || undefined,
          }))}
          startIndex={viewerStartIndex}
          onClose={() => setViewerVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SIZES.screenDefaultPadding,
    paddingTop: SIZES.xsSmall,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: SPACING,
  },
  cardWrapper: {
    width: CARD_SIZE,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  descriptionText: {
    color: '#666',
    lineHeight: 18,
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
});
