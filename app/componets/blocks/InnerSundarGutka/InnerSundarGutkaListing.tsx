import React, { useCallback, useMemo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AudioListingHeader from '../../headers/AudioListingHeader';
import AppLoader from '../../Loader/AppLoader';
import AppText from '../../elements/AppText/AppText';
import { emptyListText } from '../../../utils/constant';
import { SIZES } from '../../../utils/theme';
import { navigate, resetAndNavigate } from '../../../utils/NavigationUtils';
import { useBeantBaniyanInfinite } from '../../../hooks/query/useBeantBaniyan';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';
import { ARROW_RIGHT } from '../../../assets/svgs';
import GoBack from '../../smartComponents/GoBack';
import MainHeader from '../../headers/MainHeader';

const HEADER_BAR_HEIGHT = 50;

type DescriptionEntry = {
  index: number;
  title: string;
  content: string;
};

type BeantBaniyanItem = {
  id: number;
  title: string;
  title_punjabi?: string;
  description?: string;
  description_text?: string;
  descriptions_data?: DescriptionEntry[];
  description_file_url?: string;
  description_path?: string;
  sort_index: number;
};

const InnerSundarGutkaListing = () => {
  const { colors, lang } = useAppContext();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useBeantBaniyanInfinite();

  const isEnglish = lang?.nanaksarAmritGhar === 'NANAKSAR AMRITGHAR';

  const items = useMemo<BeantBaniyanItem[]>(
    () => data?.pages.flatMap(p => p?.data?.data ?? []) ?? [],
    [data]
  );

  const loadMore = () => {
    if (isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  };

  const getTitle = (item: BeantBaniyanItem): string => {
    if (isEnglish) {
      return item.title || item.title_punjabi || '';
    }
    return item.title_punjabi || item.title || '';
  };

  const HEADER_TOTAL = 0;

  const previousScrollY = useSharedValue(0);
  const headerOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      const diff = currentY - previousScrollY.value;
      previousScrollY.value = currentY;

      if (currentY <= 0) {
        headerOffset.value = withTiming(0, { duration: 250 });
        return;
      }

      if (diff > 3) {
        // Scrolling down → smoothly hide header
        headerOffset.value = withTiming(-HEADER_TOTAL, { duration: 300 });
      }
    },
  });

  const headerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerOffset.value }],
  }));

  const handlePress = (item: BeantBaniyanItem, index: number) => {
    navigate('SundarGutkaDetailScreen', { item, items, index });
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item, index }: { item: BeantBaniyanItem; index: number }) => (
      <TouchableOpacity activeOpacity={0.7} onPress={() => handlePress(item, index)}>
        <View
          style={[
            styles.row,
            { borderBottomColor: withOpacity(colors.primary, 0.15) },
          ]}
        >
          <AppText size={16} style={[styles.title, { color: colors.primary }]}>
            {getTitle(item)}
          </AppText>
          {/* <ARROW_RIGHT
            color={withOpacity(colors.primary, 0.6)}
            width={20}
            height={20}
          /> */}
        </View>
      </TouchableOpacity>
    ),
    [colors, isEnglish],
  );

  if (isLoading) return <AppLoader fullScreen />;

  return (
    <View style={styles.container}>
      <Animated.View style={[headerAnimStyle]}>
        <MainHeader
          isShowSearchIcon={false}
        />
        {/* <View style={[styles.header, { backgroundColor: withOpacity(colors.primary, 0.85) }]}>
          <GoBack
            color={colors.secondary}
            style={{ alignItems: 'center', padding: 0 }}
            textStyle={styles.headerTitle}
            title={lang.sundarGutka} />
          <TouchableOpacity
            onPress={() => resetAndNavigate('Home')}
            activeOpacity={0.7}
            style={styles.homeButton}
          >
            <Image
              source={require('../../../assets/images/nanaksar_logo.png')}
              style={{ width: 30, height: 30, borderRadius: 15 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View> */}
      </Animated.View>
      <Animated.FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item: BeantBaniyanItem) => item.id.toString()}
        contentContainerStyle={[
          items.length === 0 && !isLoading ? styles.emptyContainer : styles.listContent,
          { paddingTop: HEADER_TOTAL },
        ]}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyBox}>
              <AppText size={14} style={{ color: '#999' }}>
                {emptyListText}
              </AppText>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={10}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  listContent: {
    paddingHorizontal: SIZES.screenDefaultPadding,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: SIZES.screenDefaultPadding,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    flex: 1,
    fontWeight: '600',
    letterSpacing: 0.4,
    marginRight: 8,
  },
  header: {
    height: HEADER_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.screenDefaultPadding,
    gap: 8,

  },
  headerTitle: {
    fontWeight: '700',
    flex: 1,
    fontSize: 20,
  },
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
});

export default InnerSundarGutkaListing;
