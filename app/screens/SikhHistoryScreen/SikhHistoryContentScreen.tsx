import React, { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import GradientBg from '../../componets/backgrounds/GradientBg';
import AudioListingHeader from '../../componets/headers/AudioListingHeader';
import AppText from '../../componets/elements/AppText/AppText';
import { emptyListText } from '../../utils/constant';
import { SIZES } from '../../utils/theme';
import { navigate } from '../../utils/NavigationUtils';
import { useAppContext } from '../../context/AppContext';
import { withOpacity } from '../../utils/helper';
import { ARROW_RIGHT } from '../../assets/svgs';
import { SakhiyanContent } from '../../componets/blocks/InnerSikhHistory/InnerSikhHistoryListing';

const SikhHistoryContentScreen = ({ route }: any) => {
  const { contents, title } = route.params as {
    contents: SakhiyanContent[];
    title: string;
  };
  const { colors } = useAppContext();

  const handlePress = (content: SakhiyanContent) => {
    navigate('SikhHistoryContentDetailScreen', {
      content,
    });
  };

  const renderItem = useCallback(
    ({ item, index }: { item: SakhiyanContent; index: number }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handlePress(item)}
          style={[styles.row, { borderBottomColor: withOpacity(colors.primary, 0.1) }]}
        >
          <View style={[styles.indexCircle, { backgroundColor: withOpacity(colors.primary, 0.1) }]}>
            <AppText size={14} style={{ color: colors.primary, fontWeight: '700' }}>
              {index + 1}
            </AppText>
          </View>
          <View style={styles.meta}>
            <AppText
              size={15}
              style={[styles.title, { color: colors.primary }]}
              numberOfLines={2}
            >
              {item.title}
            </AppText>
          </View>
          <ARROW_RIGHT
            color={withOpacity(colors.primary, 0.35)}
            width={18}
            height={18}
          />
        </TouchableOpacity>
      );
    },
    [colors],
  );

  return (
    <GradientBg>
      <View style={styles.container}>
        <AudioListingHeader isSearchBarShow={false} isShowSettings={false} />

        <FlatList
          data={contents}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={
            contents.length === 0 ? styles.emptyContainer : styles.listContent
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <AppText size={14} style={{ color: '#999' }}>
                {emptyListText}
              </AppText>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </GradientBg>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: SIZES.xsSmall,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: SIZES.screenDefaultPadding,
    borderBottomWidth: 1,
    gap: 14,
  },
  indexCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meta: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 0.2,
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

export default SikhHistoryContentScreen;
