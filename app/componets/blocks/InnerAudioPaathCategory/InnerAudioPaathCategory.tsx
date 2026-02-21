import React, { useCallback } from 'react';
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
import { useAudioPaathCategory } from '../../../hooks/query/useAudioPaath';
import { useAppContext } from '../../../context/AppContext';
import { useAudioPlayer } from '../../../context/AudioPlayerContext';
import { withOpacity } from '../../../utils/helper';
import { ARROW_RIGHT, PLAY_BUTTON, PAUSE_BUTTON } from '../../../assets/svgs';
import { AudioTrack } from './AudioPaathPlayerSheet';
import { AudioPaathCategory } from '../InnerAudioListing/InnerAudioListing';
import PlayingIndicator from '../../elements/PlayingIndicator/PlayingIndicator';

const PLACEHOLDER_IMAGE = 'https://nanaksaramritghar.com/logo.jpeg';
const THUMB_SIZE = 72;

type Props = {
  category: AudioPaathCategory;
  breadcrumbs: { id: number; title: string }[];
};

const InnerAudioPaathCategory: React.FC<Props> = ({ category, breadcrumbs }) => {
  const { colors } = useAppContext();
  const player = useAudioPlayer();

  const isLeaf = category.children.length === 0;

  const { data: apiResponse, isLoading } = useAudioPaathCategory(
    category.id,
    isLeaf,
  );

  const files: AudioTrack[] = apiResponse?.data?.category?.files ?? [];
  const subCategories: AudioPaathCategory[] = category.children;





  const handleSubCategoryPress = (cat: AudioPaathCategory) => {
    const nextBreadcrumbs = [...breadcrumbs, { id: cat.id, title: cat.title }];
    navigate('AudioPaathCategoryScreen', {
      category: cat,
      breadcrumbs: nextBreadcrumbs,
    });
  };

  const handleTrackPlayPress = (index: number) => {
    const activeTrackId =
      player.activeTrackIndex !== null
        ? player.tracks[player.activeTrackIndex]?.id
        : null;
    const tappedTrackId = files[index]?.id;

    if (activeTrackId === tappedTrackId) {
      // Same track — toggle play/pause
      player.togglePlay();
    } else {
      player.playTrack(files, index, category.image);
    }
  };

  // --- Sub-category row ---
  const renderSubCategory = useCallback(
    ({ item }: { item: AudioPaathCategory }) => {
      const imgUri = item.image ?? PLACEHOLDER_IMAGE;
      const subLabel =
        item.children.length > 0
          ? `${item.children.length} ${item.children.length === 1 ? 'folder' : 'folders'}`
          : item.files_count > 0
            ? `${item.files_count} ${item.files_count === 1 ? 'track' : 'tracks'}`
            : null;

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleSubCategoryPress(item)}
          style={[
            styles.row,
            { borderBottomColor: withOpacity(colors.primary, 0.1) },
          ]}
        >
          <Image source={{ uri: imgUri }} style={styles.thumb} resizeMode="cover" />
          <View style={styles.meta}>
            <AppText
              size={15}
              style={[styles.rowTitle, { color: colors.primary }]}
              numberOfLines={2}
            >
              {item.title}
            </AppText>
            {subLabel ? (
              <AppText
                size={12}
                style={[
                  styles.subLabel,
                  { color: withOpacity(colors.primary, 0.5) },
                ]}
              >
                {subLabel}
              </AppText>
            ) : null}
          </View>
          <ARROW_RIGHT
            color={withOpacity(colors.primary, 0.35)}
            width={18}
            height={18}
          />
        </TouchableOpacity>
      );
    },
    [colors, breadcrumbs],
  );

  // --- Track row ---
  const renderTrack = useCallback(
    ({ item, index }: { item: AudioTrack; index: number }) => {
      // A track is "active" only when it belongs to this screen's file list
      const isThisTrackActive =
        player.activeTrackIndex === index &&
        player.tracks[index]?.id === item.id;
      const isThisTrackPlaying = isThisTrackActive && player.isPlaying;

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleTrackPlayPress(index)}
          style={[
            styles.trackRow,
            { borderBottomColor: withOpacity(colors.primary, 0.1) },
          ]}
        >
          <View
            style={[
              styles.trackNumber,
              {
                backgroundColor: isThisTrackActive
                  ? withOpacity(colors.primary, 0.15)
                  : withOpacity(colors.primary, 0.06),
              },
            ]}
          >
            {isThisTrackPlaying ? (
              <PlayingIndicator
                isPlaying={true}
                color={colors.primary}
                size={14}
              />
            ) : isThisTrackActive ? (
              <PlayingIndicator
                isPlaying={false}
                color={colors.primary}
                size={14}
              />
            ) : (
              <AppText
                size={12}
                style={{ color: colors.primary, fontWeight: '700' }}
              >
                {index + 1}
              </AppText>
            )}
          </View>

          <View style={styles.meta}>
            <AppText
              size={15}
              style={[
                styles.rowTitle,
                { color: colors.primary },
                isThisTrackActive && { fontWeight: '800' },
              ]}
              numberOfLines={2}
            >
              {item.title}
            </AppText>
            {item.audio_length ? (
              <AppText
                size={12}
                style={[
                  styles.subLabel,
                  { color: withOpacity(colors.primary, 0.5) },
                ]}
              >
                {item.audio_length}
              </AppText>
            ) : null}
          </View>

          {isThisTrackPlaying ? (
            <PAUSE_BUTTON color={colors.primary} width={26} height={26} />
          ) : (
            <PLAY_BUTTON
              color={
                isThisTrackActive
                  ? colors.primary
                  : withOpacity(colors.primary, 0.35)
              }
              width={26}
              height={26}
            />
          )}
        </TouchableOpacity>
      );
    },
    [colors, files, player.activeTrackIndex, player.isPlaying, player.tracks],
  );

  if (isLoading && isLeaf) {
    return (
      <View style={styles.container}>
        <AudioListingHeader isSearchBarShow={false} isShowSettings={false} />
        <AppLoader />
      </View>
    );
  }

  const ListHeaderComponent = (
    <>
      {breadcrumbs.length > 0 && (
        <View
          style={[
            styles.breadcrumbBar,
            { backgroundColor: withOpacity(colors.primary, 0.06) },
          ]}
        >
          <AppText
            size={12}
            style={[styles.breadcrumbText, { color: colors.primary }]}
            numberOfLines={1}
          >
            {breadcrumbs.map(b => b.title).join(' › ')}
          </AppText>
        </View>
      )}
      {isLeaf && files.length > 0 && (
        <View style={styles.sectionLabelRow}>
          <AppText
            size={12}
            style={[
              styles.sectionLabel,
              { color: withOpacity(colors.primary, 0.45) },
            ]}
          >
            {files.length} {files.length === 1 ? 'TRACK' : 'TRACKS'}
          </AppText>
        </View>
      )}
    </>
  );

  // Add bottom padding when mini player is visible so last rows aren't hidden
  const bottomPad = player.miniPlayerVisible ? 160 : 0;

  return (
    <View style={styles.container}>
      <AudioListingHeader isSearchBarShow={false} isShowSettings={false} />

      {isLeaf ? (
        <FlatList
          data={files}
          renderItem={renderTrack}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={[
            files.length === 0 ? styles.emptyContainer : styles.listContent,
            bottomPad > 0 && { paddingBottom: bottomPad },
          ]}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <AppText size={14} style={{ color: '#999' }}>
                {emptyListText}
              </AppText>
            </View>
          }
          showsVerticalScrollIndicator={false}
          initialNumToRender={15}
        />
      ) : (
        <FlatList
          data={subCategories}
          renderItem={renderSubCategory}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={
            subCategories.length === 0
              ? styles.emptyContainer
              : styles.listContent
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: SIZES.xsSmall,
    paddingBottom: 32,
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
  rowTitle: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subLabel: {
    fontWeight: '500',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: SIZES.screenDefaultPadding,
    borderBottomWidth: 1,
    gap: 12,
  },
  trackNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breadcrumbBar: {
    paddingHorizontal: SIZES.screenDefaultPadding,
    paddingVertical: 8,
  },
  breadcrumbText: {
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  sectionLabelRow: {
    paddingHorizontal: SIZES.screenDefaultPadding,
    paddingTop: 14,
    paddingBottom: 2,
  },
  sectionLabel: {
    fontWeight: '600',
    letterSpacing: 0.8,
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

export default InnerAudioPaathCategory;
