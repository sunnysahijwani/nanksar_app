import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AudioListingHeader from '../../headers/AudioListingHeader';
import AppLoader from '../../Loader/AppLoader';
import AppText from '../../elements/AppText/AppText';
import { emptyListText } from '../../../utils/constant';
import { SIZES } from '../../../utils/theme';
import { navigate } from '../../../utils/NavigationUtils';
import { useSikhHistoryList } from '../../../hooks/query/useSikhHistory';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';
import { ARROW_RIGHT } from '../../../assets/svgs';

const PLACEHOLDER_IMAGE = 'https://nanaksaramritghar.com/logo.jpeg';
const S3_BASE_URL = 'https://nanaksaramritghar.com/storage/';

export type SakhiyanContent = {
  id: number;
  title: string;
  description: string | null;
  sakhiyan_id: number;
  description_path: string | null;
};

export type Sakhiyan = {
  id: number;
  title: string;
  heading: string | null;
  chapter_id: number;
  contents: SakhiyanContent[];
};

export type Chapter = {
  id: number;
  title: string;
  image: string | null;
  sikh_history_id: number;
  sakhiyan: Sakhiyan[];
};

export type SikhHistoryItem = {
  id: number;
  title: string;
  image: string | null;
  written_by: string | null;
  parent_id: number | null;
  chapters: Chapter[];
};

export const getImageUri = (image: string | null): string => {
  if (!image) return PLACEHOLDER_IMAGE;
  if (image.startsWith('http')) return image;
  return `${S3_BASE_URL}${image}`;
};

const InnerSikhHistoryListing = () => {
  const { colors } = useAppContext();
  const { data: apiResponse, isLoading } = useSikhHistoryList();
  const [height, setHeight] = useState(300);
  const histories: SikhHistoryItem[] = apiResponse?.data?.data ?? [];



  const handlePress = (item: SikhHistoryItem) => {
    navigate('SikhHistoryChaptersScreen', {
      chapters: item.chapters,
      title: item.title,
    });
  };
  const renderItem = ({ item }: { item: SikhHistoryItem }) => {
    const imgUri = getImageUri(item.image);
    let layoutWidth = 0;
    const onLayout = (event: any) => {
      layoutWidth = event.nativeEvent.layout.width;
    }
    return (
      <TouchableOpacity onLayout={onLayout}
        activeOpacity={0.7}
        onPress={() => handlePress(item)}
        style={[styles.card, { backgroundColor: colors.white }]}
      >
        <Image
          source={{ uri: imgUri }}
          style={[styles.cardImage, { height: height }]}
          height={height}
          resizeMode="cover"
          onLoad={(event) => {
            const { width, height } = event.nativeEvent.source;
            const scaledHeight = (layoutWidth * height) / width;
            setHeight(scaledHeight - 100);
          }}
        />
        <View style={styles.cardBody}>
          <AppText
            size={16}
            style={[styles.cardTitle, { color: colors.primary }]}
            numberOfLines={2}
          >
            {item.title}
          </AppText>
          {item.written_by ? (
            <AppText
              size={12}
              style={[styles.writtenBy, { color: withOpacity(colors.primary, 0.6) }]}
            >
              {item.written_by}
            </AppText>
          ) : null}
          <View style={styles.cardFooter}>
            <AppText
              size={12}
              style={{ color: withOpacity(colors.primary, 0.5) }}
            >
              {item.chapters.length}{' '}
              {item.chapters.length === 1 ? 'Chapter' : 'Chapters'}
            </AppText>
            <ARROW_RIGHT
              color={withOpacity(colors.primary, 0.35)}
              width={16}
              height={16}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) return <AppLoader fullScreen />;

  return (
    <View style={styles.container}>
      <AudioListingHeader isSearchBarShow={false} isShowSettings={false} />

      <FlatList
        data={histories}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={
          histories.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <AppText size={14} style={{ color: '#999' }}>
              {emptyListText}
            </AppText>
          </View>
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SIZES.screenDefaultPadding,
    paddingTop: SIZES.xsSmall,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#e0e0e0',

    top: 0,
  },
  cardBody: {
    padding: 14,
    gap: 6,
  },
  cardTitle: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  writtenBy: {
    fontWeight: '500',
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: SIZES.screenDefaultPadding,
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
});

export default InnerSikhHistoryListing;
