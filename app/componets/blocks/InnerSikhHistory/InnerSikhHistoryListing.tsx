import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AppLoader from '../../Loader/AppLoader';
import AppText from '../../elements/AppText/AppText';
import { emptyListText } from '../../../utils/constant';
import { SIZES } from '../../../utils/theme';
import { navigate } from '../../../utils/NavigationUtils';
import { useSikhHistoryList } from '../../../hooks/query/useSikhHistory';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';
import MainHeader from '../../headers/MainHeader';
import { useLocalize } from '../../../hooks/useLocalize';
import AppHeader from '../../headers/AppHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PAD = SIZES.screenDefaultPadding;
const GRID_GAP = 12;
const GRID_CARD_WIDTH = (SCREEN_WIDTH - H_PAD * 2 - GRID_GAP) / 2;

const PLACEHOLDER_IMAGE = 'https://nanaksaramritghar.com/logo.jpeg';
const S3_BASE_URL = 'https://nanaksar.s3.ap-south-1.amazonaws.com/';

export type SakhiyanContent = {
  id: number;
  title: string;
  title_punjabi: string | null;
  description: string | null;
  sakhiyan_id: number;
  description_path: string | null;
};

export type Sakhiyan = {
  id: number;
  title: string;
  title_punjabi: string | null;
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
  title_punjabi: string | null;
};

export type SikhHistoryItem = {
  id: number;
  title: string;
  title_punjabi: string | null;
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

// ── Hero card (first item, full width) ────────────────────────────────────
const HeroCard = ({
  item,
  colors,
  onPress,
}: {
  item: SikhHistoryItem;
  colors: any;
  onPress: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.82}
    onPress={onPress}
    style={[styles.heroCard, { backgroundColor: colors.white }]}
  >
    <Image
      source={{ uri: getImageUri(item.image) }}
      style={styles.heroImage}
      resizeMode="cover"
    />
    <View style={[styles.heroOverlay, { backgroundColor: withOpacity(colors.primary, 0.55) }]}>
      <AppText size={18} style={styles.heroTitle} numberOfLines={2}>
        {item.title}
      </AppText>
      {item.written_by ? (
        <AppText size={12} style={styles.heroSub} numberOfLines={1}>
          {item.written_by}
        </AppText>
      ) : null}
      <AppText size={11} style={styles.heroChapters}>
        {item.chapters.length} {item.chapters.length === 1 ? 'Chapter' : 'Chapters'}
      </AppText>
    </View>
  </TouchableOpacity>
);

// ── Grid card (remaining items, 2-column) ──────────────────────────────────
const GridCard = ({
  item,
  colors,
  onPress,
  isLeftCol,
}: {
  item: SikhHistoryItem;
  colors: any;
  onPress: () => void;
  isLeftCol: boolean;
}) => {
  const { t } = useLocalize();

  return <TouchableOpacity
    activeOpacity={0.82}
    onPress={onPress}
    style={[
      styles.gridCard,
      { backgroundColor: colors.white, marginLeft: isLeftCol ? 0 : GRID_GAP },
    ]}
  >
    <Image
      source={{ uri: getImageUri(item.image) }}
      style={styles.gridImage}
      resizeMode="contain"
    />
    <View style={styles.gridBody}>
      <AppText
        size={13}
        style={[styles.gridTitle, { color: colors.primary }]}
        numberOfLines={2}
      >
        {t(item, 'title')}
      </AppText>
      {item.written_by ? (
        <AppText
          size={11}
          style={[styles.gridSub, { color: withOpacity(colors.primary, 0.55) }]}
          numberOfLines={1}
        >
          {item.written_by}
        </AppText>
      ) : null}
      {/* <AppText size={10} style={{ color: withOpacity(colors.primary, 0.4), marginTop: 2 }}>
        {item.chapters.length} {item.chapters.length === 1 ? 'Chapter' : 'Chapters'}
      </AppText> */}
    </View>
  </TouchableOpacity>
};

// ── Main component ─────────────────────────────────────────────────────────
const InnerSikhHistoryListing = () => {
  const { colors, lang } = useAppContext();
  const { data: apiResponse, isLoading } = useSikhHistoryList();
  const histories: SikhHistoryItem[] = apiResponse?.data?.data ?? [];

  const handlePress = (item: SikhHistoryItem) => {
    // direct jump to chepater is there is only one chatper in the history
    if (item.chapters.length === 1) {
      navigate('SikhHistorySakhiyanScreen', {
        sakhiyan: item.chapters[0].sakhiyan,
        title: item.chapters[0].title,
        title_punjabi: item.chapters[0].title_punjabi ?? null,
      });
      return
    }
    navigate('SikhHistoryChaptersScreen', {
      chapters: item.chapters,
      title: item.title,
      title_punjabi: item.title_punjabi ?? null,
    });
  };

  // const heroItem = histories[0] ?? null;
  const gridItems = histories;

  const renderGridItem = ({ item, index }: { item: SikhHistoryItem; index: number }) => (
    <GridCard
      item={item}
      colors={colors}
      onPress={() => handlePress(item)}
      isLeftCol={index % 2 === 0}
    />
  );

  if (isLoading) return <AppLoader fullScreen />;

  return (
    <View style={styles.container}>
      <AppHeader title={lang.SikhHistory}/>

      <FlatList
        data={gridItems}
        renderItem={renderGridItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        // ListHeaderComponent={
        //   heroItem ? (
        //     <HeroCard
        //       item={heroItem}
        //       colors={colors}
        //       onPress={() => handlePress(heroItem)}
        //     />
        //   ) : null
        // }
        contentContainerStyle={
          histories.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <AppText size={14} style={{ color: '#999' }}>{emptyListText}</AppText>
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
    paddingHorizontal: H_PAD,
    paddingTop: SIZES.xsSmall,
    paddingBottom: 24,
  },
  row: {
    marginTop: GRID_GAP,
  },

  // ── Hero card ──────────────────────────────────────────────────────────
  heroCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 4,
  },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#e0e0e0',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  heroTitle: {
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.85)',
    fontStyle: 'italic',
  },
  heroChapters: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },

  // ── Grid card ──────────────────────────────────────────────────────────
  gridCard: {
    width: GRID_CARD_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  gridImage: {
    width: '100%',
    height: GRID_CARD_WIDTH,
    backgroundColor: '#f0f0f0',

  },
  gridBody: {
    padding: 10,
    gap: 3,
    justifyContent: 'space-between',
    flex: 1,
  },
  gridTitle: {
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  gridSub: {
    fontStyle: 'italic',
  },

  emptyContainer: {
    flex: 1,
    paddingHorizontal: H_PAD,
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
});

export default InnerSikhHistoryListing;
