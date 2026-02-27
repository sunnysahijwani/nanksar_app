import React, { useCallback } from 'react';
import {
  FlatList,
  Image,
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
import { Chapter, getImageUri } from '../../componets/blocks/InnerSikhHistory/InnerSikhHistoryListing';

const SikhHistoryChaptersScreen = ({ route }: any) => {
  const { chapters, title } = route.params as {
    chapters: Chapter[];
    title: string;
  };
  const { colors } = useAppContext();

  const handlePress = (chapter: Chapter) => {
    navigate('SikhHistorySakhiyanScreen', {
      sakhiyan: chapter.sakhiyan,
      title: chapter.title,
    });
  };

  const renderItem = useCallback(
    ({ item }: { item: Chapter }) => {
      const imgUri = getImageUri(item.image);

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handlePress(item)}
          style={[styles.row, { borderBottomColor: withOpacity(colors.primary, 0.1) }]}
        >
          <Image
            source={{ uri: imgUri }}
            style={styles.thumb}
            resizeMode="cover"
          />
          <View style={styles.meta}>
            <AppText
              size={15}
              style={[styles.title, { color: colors.primary }]}
              numberOfLines={2}
            >
              {item.title}
            </AppText>
            <AppText
              size={12}
              style={{ color: withOpacity(colors.primary, 0.5) }}
            >
              {item.sakhiyan.length}{' '}
              {item.sakhiyan.length === 1 ? 'Sakhi' : 'Sakhiyan'}
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
          data={chapters}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={
            chapters.length === 0 ? styles.emptyContainer : styles.listContent
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
    paddingVertical: 12,
    paddingHorizontal: SIZES.screenDefaultPadding,
    borderBottomWidth: 1,
    gap: 14,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  meta: {
    flex: 1,
    gap: 4,
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

export default SikhHistoryChaptersScreen;
