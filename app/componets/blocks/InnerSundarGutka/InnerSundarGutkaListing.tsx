import React, { useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import AudioListingHeader from '../../headers/AudioListingHeader';
import AppLoader from '../../Loader/AppLoader';
import AppText from '../../elements/AppText/AppText';
import { emptyListText } from '../../../utils/constant';
import { SIZES } from '../../../utils/theme';
import { navigate } from '../../../utils/NavigationUtils';
import { useBeantBaniyan } from '../../../hooks/query/useBeantBaniyan';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';
import { ARROW_RIGHT } from '../../../assets/svgs';

type BeantBaniyanItem = {
  id: number;
  title: string;
  description: string;
  sort_index: number;
};

const InnerSundarGutkaListing = () => {
  const { colors } = useAppContext();
  const { data: apiResponse, isLoading } = useBeantBaniyan(1);
  const items: BeantBaniyanItem[] = apiResponse?.data?.data || [];

  const handlePress = (item: BeantBaniyanItem, index: number) => {
    navigate('SundarGutkaDetailScreen', { item, items, index });
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
            {item.title}
          </AppText>
          <ARROW_RIGHT
            color={withOpacity(colors.primary, 0.6)}
            width={20}
            height={20}
          />
        </View>
      </TouchableOpacity>
    ),
    [colors],
  );

  if (isLoading) return <AppLoader fullScreen />;

  return (
    <View style={styles.container}>
      <AudioListingHeader isSearchBarShow={false} isShowSettings={false} />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={
          items.length === 0 ? styles.emptyContainer : styles.listContent
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
        initialNumToRender={15}
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
    paddingBottom: 24,
    paddingTop: SIZES.xsSmall,
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
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
});

export default InnerSundarGutkaListing;
