import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AudioListingHeader from '../../headers/AudioListingHeader';
import PaathList from '../../lists/PaathList';
import AppText from '../../elements/AppText/AppText';
import AppLoader from '../../Loader/AppLoader';
import { navigate } from '../../../utils/NavigationUtils';
import {
  getFavourites,
  toggleFavourite,
  type GurbaniKhojFavourite,
} from '../../../storage/gurbaniKhojFavourites';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';
import { FlatList } from 'react-native';

export default function InnerGurbaniKhojFavourites() {
  const { colors } = useAppContext();
  const [favourites, setFavourites] = useState<GurbaniKhojFavourite[]>([]);
  const [ready, setReady] = useState(false);

  // Load (or refresh) favourites every time this screen is focused
  useFocusEffect(
    useCallback(() => {
      setFavourites(getFavourites());
      setReady(true);
      return () => setReady(false);
    }, []),
  );

  const handleUnfavourite = useCallback((item: GurbaniKhojFavourite) => {
    toggleFavourite(item); // removes it (it's currently favourited)
    setFavourites(prev => prev.filter(f => f.id !== item.id));
  }, []);

  const handleItemPress = useCallback((item: GurbaniKhojFavourite) => {
    navigate('GurBaniKhojSuwidhaDetailScreen', { page_index: item.page_index });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: GurbaniKhojFavourite }) => (
      <AppText className="mx-3">
        <PaathList
          punjabiText={item.punjabiText}
          englishText={item.englishText}
          onPress={() => handleItemPress(item)}
          isFavourited={true}
          onFavouriteToggle={() => handleUnfavourite(item)}
          showArrow={false}
        />
      </AppText>
    ),
    [handleItemPress, handleUnfavourite],
  );

  return (
    <View style={styles.container}>
      <AudioListingHeader isSearchBarShow={false} isShowSettings={false} />

      {/* Header label */}
      <View style={[styles.titleRow, { borderBottomColor: withOpacity(colors.primary, 0.15) }]}>
        <AppText size={15} style={{ color: colors.primary, fontWeight: '700' }}>
          {'★  Saved'}
        </AppText>
        {ready && favourites.length > 0 && (
          <AppText size={13} style={{ color: withOpacity(colors.primary, 0.55) }}>
            {favourites.length} {favourites.length === 1 ? 'item' : 'items'}
          </AppText>
        )}
      </View>

      {!ready ? (
        <AppLoader />
      ) : favourites.length === 0 ? (
        <View style={styles.emptyState}>
          <AppText size={32} style={{ color: withOpacity(colors.primary, 0.2) }}>☆</AppText>
          <AppText size={15} style={{ color: withOpacity(colors.primary, 0.5), marginTop: 8, textAlign: 'center' }}>
            No saved pages yet.{'\n'}Tap the star icon on any page to save it here.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={favourites}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          removeClippedSubviews
          initialNumToRender={15}
          windowSize={10}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
});
