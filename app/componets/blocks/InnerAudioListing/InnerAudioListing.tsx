import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AudioListingHeader from '../../headers/AudioListingHeader';
import AppLoader from '../../Loader/AppLoader';
import AppText from '../../elements/AppText/AppText';
import { emptyListText } from '../../../utils/constant';
import { useLocalize } from '../../../hooks/useLocalize';
import { SIZES } from '../../../utils/theme';
import { navigate } from '../../../utils/NavigationUtils';
import { useAudioPaathList } from '../../../hooks/query/useAudioPaath';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';
import { ARROW_RIGHT } from '../../../assets/svgs';
import { getAudioFavourites } from '../../../storage/audioFavourites';
import DropdownMenuHeader from '../../headers/DropdownMenuHeader';
import AppHeader from '../../headers/AppHeader';

const PLACEHOLDER_IMAGE = 'https://nanaksaramritghar.com/logo.jpeg';
const THUMB_SIZE = 72;

export type AudioPaathCategory = {
  id: number;
  title: string;
  title_punjabi: string | null;
  image: string | null;
  sort_index: number;
  publish_status: number;
  files_count: number;
  children: AudioPaathCategory[];
};

const InnerAudioListing = () => {
  const { colors, lang } = useAppContext();
  const { t } = useLocalize();

  const { data: apiResponse, isLoading } = useAudioPaathList();

  const categories: AudioPaathCategory[] = apiResponse?.data ?? [];

  const [favCount, setFavCount] = useState(() => getAudioFavourites().length);

  useFocusEffect(
    useCallback(() => {
      setFavCount(getAudioFavourites().length);
    }, []),
  );

  const handlePress = (cat: AudioPaathCategory) => {
    navigate('AudioPaathCategoryScreen', {
      category: cat,
      breadcrumbs: [{ id: cat.id, title: cat.title, title_punjabi: cat.title_punjabi ?? cat.title }],
    });
  };

  const renderItem = useCallback(
    ({ item }: { item: AudioPaathCategory }) => {
      const imgUri = item.image ?? PLACEHOLDER_IMAGE;
      const subLabel = item.children.length > 0
        ? `${item.children.length} ${item.children.length === 1 ? 'folder' : 'folders'}`
        : item.files_count > 0
          ? `${item.files_count} ${item.files_count === 1 ? 'track' : 'tracks'}`
          : null;

      const title = t(item, 'title');


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
            <AppText size={15} style={[styles.title, { color: colors.primary }]} numberOfLines={2}>
              {title}
            </AppText>
            {/* {subLabel ? (
              <AppText size={12} style={[styles.subLabel, { color: withOpacity(colors.primary, 0.5) }]}>
                {subLabel}
              </AppText>
            ) : null} */}
          </View>
          <ARROW_RIGHT color={withOpacity(colors.primary, 0.35)} width={18} height={18} />
        </TouchableOpacity>
      );
    },
    [colors, t],
  );

  if (isLoading) return <AppLoader fullScreen />;

  return (
    <View style={styles.container}>
      <AppHeader
        title={lang.AudioPath}
      />

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={
          categories.length === 0 ? styles.emptyContainer : styles.listContent
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
        initialNumToRender={12}
      />
    </View>
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
    width: THUMB_SIZE,
    height: THUMB_SIZE,
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
  subLabel: {
    fontWeight: '500',
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

export default InnerAudioListing;
