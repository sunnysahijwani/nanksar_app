import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import AudioListingHeader from '../../headers/AudioListingHeader';
import {
  useGuruGranthSahibjiBani,
  useGuruGranthSahibjiBaniSearch,
} from '../../../hooks/query/useGuruGranthSahibjiBani';
import AppLoader from '../../Loader/AppLoader';
import PaathList from '../../lists/PaathList';
import AppText from '../../elements/AppText/AppText';
import { emptyListText } from '../../../utils/constant';
import { navigate } from '../../../utils/NavigationUtils';
import { useFocusEffect } from '@react-navigation/native';
import { getCache } from '../../../storage/cache';
import { STORAGE_KEYS } from '../../../storage/keys';
import PunjabiKeyboard from '../../elements/PunjabiKeyboard/PunjabiKeyboard';
import { getFavourites } from '../../../storage/gurbaniKhojFavourites';
import { getBookmark } from '../../../storage/gurbaniKhojBookmark';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';

const EmptyListBox = () => {
  return (
    <View className="flex-1 justify-center items-center" style={{ flex: 1 }}>
      <AppText>{emptyListText}</AppText>
    </View>
  );
};

export default function InnerGurbaniKhojSuwidha(parms: any) {
  const { colors } = useAppContext();

  const [gurbaniRecords, setGurbaniRecords] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(parms?.searchOn || false);

  // In-memory Set for O(1) lookup per list row
  const [favouriteIds, setFavouriteIds] = useState<Set<number>>(
    () => new Set(getFavourites().map(f => f.id)),
  );

  // Bookmark for "Jump to bookmark" quick-access pill
  const [bookmark, setBookmarkState] = useState(() => getBookmark());

  const { data, isLoading } = useGuruGranthSahibjiBani(1, 20);
  const { data: searchData, isLoading: isSearching } =
    useGuruGranthSahibjiBaniSearch(searchText);

  const user_previous_page_index =
    getCache<number>(STORAGE_KEYS.GURU_GRANTH_SHIB_JI_BANI_PAGE) || 20;

  const getListData = (ListData: any) => {
    if (!ListData || !Object.values(ListData).length) return [];
    return Object.values(ListData ?? {})?.flat();
  };

  const getPujabiText = (PujabiText: any) => {
    if (!PujabiText || !PujabiText?.text) return '';
    return PujabiText?.text;
  };

  const getEnglishText = (TextData: any) => {
    if (
      !TextData ||
      !TextData?.transliterations ||
      !TextData?.transliterations?.length
    )
      return '';
    return (
      TextData?.transliterations?.find(
        (t: any) => t?.language?.language === 'English',
      )?.text || ''
    );
  };

  const handleOnListCardPress = (item: any) => {
    navigate('GurBaniKhojSuwidhaDetailScreen', {
      page_index: item?.hymn || '-1',
    });
  };

  // Existing: refresh list data on focus
  useFocusEffect(
    useCallback(() => {
      setGurbaniRecords((prevRecords: any[]) => [
        ...prevRecords,
        ...getListData(data),
      ]);
      return () => {
        setGurbaniRecords([]);
      };
    }, [data]),
  );

  // Refresh favourites + bookmark on focus (catches changes from other screens)
  useFocusEffect(
    useCallback(() => {
      setFavouriteIds(new Set(getFavourites().map(f => f.id)));
      setBookmarkState(getBookmark());
    }, []),
  );


  // Search results flattened
  const searchResults = useMemo(() => {
    if (!searchText || !searchData) return [];
    return getListData(searchData);
  }, [searchText, searchData]);

  const isSearchMode = searchText.length > 0;
  const displayData = isSearchMode ? searchResults : gurbaniRecords;
  const loading = isSearchMode ? isSearching : isLoading;

  const handleSearchIconPress = () => {
    setShowKeyboard(prev => !prev);
  };

  const handleKeyPress = (char: string) => {
    setSearchText(prev => prev + char);
  };

  const handleBackspace = () => {
    setSearchText(prev => prev.slice(0, -1));
  };

  const handleClearSearch = () => {
    setSearchText('');
    setShowKeyboard(false);
  };

  const handleToggleKeyboard = () => {
    setShowKeyboard(false);
  };

  const renderItem = useCallback(
    ({ item, index }: any) => {
      return (
        <AppText className="mx-3">
          <PaathList
            punjabiText={getPujabiText(item)}
            englishText={getEnglishText(item)}
            onPress={() => handleOnListCardPress(item)}
            showArrow={false}
            isActive={
              !isSearchMode &&
              item?.page_index === user_previous_page_index &&
              gurbaniRecords.reduce(
                (lastIdx: number, cur: any, idx: number) =>
                  cur?.page_index === item?.page_index ? idx : lastIdx,
                -1,
              ) === index
            }
          />
        </AppText>
      );
    },
    [
      user_previous_page_index,
      gurbaniRecords,
      isSearchMode,
    ],
  );

  if (isLoading && !isSearchMode) return <AppLoader fullScreen />;

  return (
    <View className="flex-1" style={{ flex: 1 }}>
      <View>
        <AudioListingHeader
          punjabiSearchActive={showKeyboard || isSearchMode}
          searchText={searchText}
          onSearchIconPress={handleSearchIconPress}
          onClearSearch={handleClearSearch}
          isShowSettings={false}
        />
      </View>

      {/* Quick-access bar */}
      <View style={styles.quickBar}>
        {/* Favourites pill — always visible so users discover the feature */}
        <Pressable
          style={[
            styles.quickPill,
            { borderColor: withOpacity(colors.primary, 0.4) },
            favouriteIds.size > 0 && {
              backgroundColor: withOpacity(colors.primary, 0.08),
            },
          ]}
          onPress={() => navigate('GurbaniKhojFavouritesScreen')}
        >
          <AppText
            size={13}
            style={{ color: colors.primary, fontWeight: '600' }}
          >
            {favouriteIds.size > 0
              ? `★ Saved (${favouriteIds.size})`
              : '☆ Saved'}
          </AppText>
        </Pressable>

        {/* Bookmark jump pill — only shown when a bookmark is set */}
        {bookmark && (
          <Pressable
            style={[
              styles.quickPill,
              {
                borderColor: withOpacity(colors.primary, 0.4),
                backgroundColor: withOpacity(colors.primary, 0.08),
              },
            ]}
            onPress={() =>
              navigate('GurBaniKhojSuwidhaDetailScreen', {
                page_index: bookmark.page_index,
              })
            }
          >
            <AppText
              size={13}
              style={{ color: colors.primary, fontWeight: '600' }}
            >
              {'■ Page ' + bookmark.page_index + '  →'}
            </AppText>
          </Pressable>
        )}
      </View>

      {/* Search result count */}
      {isSearchMode && !loading && (
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 6,
            alignItems: 'center',
          }}
        >
          <AppText size={13} style={{ color: '#888' }}>
            {searchResults.length}{' '}
            {searchResults.length === 1 ? 'result' : 'results'}
          </AppText>
        </View>
      )}

      {/* List */}
      <FlatList
        data={displayData}
        renderItem={renderItem}
        contentContainerStyle={
          displayData.length === 0 && !loading ? { flex: 1 } : undefined
        }
        keyExtractor={item => item?.id?.toString()}
        refreshing={loading}
        ListEmptyComponent={loading ? <AppLoader /> : EmptyListBox}
        removeClippedSubviews={true}
        initialNumToRender={10}
        windowSize={10}
        updateCellsBatchingPeriod={50}
      />

      {/* Punjabi keyboard */}
      {showKeyboard && (
        <PunjabiKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onToggleKeyboard={handleToggleKeyboard}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  quickBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  quickPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
});
