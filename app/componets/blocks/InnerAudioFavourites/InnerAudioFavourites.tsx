import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AudioListingHeader from '../../headers/AudioListingHeader';
import AppLoader from '../../Loader/AppLoader';
import AppText from '../../elements/AppText/AppText';
import { SIZES } from '../../../utils/theme';
import { useAppContext } from '../../../context/AppContext';
import { useAudioPlayer } from '../../../context/AudioPlayerContext';
import { withOpacity } from '../../../utils/helper';
import { PLAY_BUTTON, PAUSE_BUTTON } from '../../../assets/svgs';
import PlayingIndicator from '../../elements/PlayingIndicator/PlayingIndicator';
import {
  getAudioFavourites,
  toggleAudioFavourite,
  type AudioFavourite,
} from '../../../storage/audioFavourites';

const InnerAudioFavourites = () => {
  const { colors } = useAppContext();
  const player = useAudioPlayer();
  const [favourites, setFavourites] = useState<AudioFavourite[]>([]);
  const [ready, setReady] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setFavourites(getAudioFavourites());
      setReady(true);
      return () => setReady(false);
    }, []),
  );

  const handleUnfavourite = useCallback((item: AudioFavourite) => {
    toggleAudioFavourite(item);
    setFavourites(prev => prev.filter(f => f.id !== item.id));
  }, []);

  const handleTrackPress = useCallback(
    (index: number) => {
      const tracks = favourites.map(f => ({
        id: f.id,
        title: f.title,
        audio_path: f.audio_path,
        audio_length: f.audio_length,
        sort_index: f.sort_index,
        stream_url: f.stream_url,
        temporary_url: f.temporary_url,
      }));

      const activeTrackId =
        player.activeTrackIndex !== null
          ? player.tracks[player.activeTrackIndex]?.id
          : null;

      if (activeTrackId === tracks[index]?.id) {
        player.togglePlay();
      } else {
        player.playTrack(tracks, index, favourites[index]?.categoryImage);
      }
    },
    [favourites, player],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: AudioFavourite; index: number }) => {
      const isThisTrackActive =
        player.activeTrackIndex !== null &&
        player.tracks[player.activeTrackIndex]?.id === item.id;
      const isThisTrackPlaying = isThisTrackActive && player.isPlaying;

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleTrackPress(index)}
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
              <PlayingIndicator isPlaying color={colors.primary} size={14} />
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

          <Pressable
            onPress={() => handleUnfavourite(item)}
            hitSlop={8}
            style={styles.favBtn}
          >
            <AppText size={18} style={{ color: '#E6A817' }}>
              ★
            </AppText>
          </Pressable>

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
    [
      colors,
      player.activeTrackIndex,
      player.isPlaying,
      player.tracks,
      handleTrackPress,
      handleUnfavourite,
    ],
  );

  const bottomPad = player.miniPlayerVisible ? 160 : 0;

  return (
    <View style={styles.container}>
      <AudioListingHeader isSearchBarShow={false} isShowSettings={false} />

      <View
        style={[
          styles.titleRow,
          { borderBottomColor: withOpacity(colors.primary, 0.15) },
        ]}
      >
        <AppText
          size={15}
          style={{ color: colors.primary, fontWeight: '700' }}
        >
          {'★  Saved Audio'}
        </AppText>
        {ready && favourites.length > 0 && (
          <AppText
            size={13}
            style={{ color: withOpacity(colors.primary, 0.55) }}
          >
            {favourites.length}{' '}
            {favourites.length === 1 ? 'track' : 'tracks'}
          </AppText>
        )}
      </View>

      {!ready ? (
        <AppLoader />
      ) : favourites.length === 0 ? (
        <View style={styles.emptyState}>
          <AppText
            size={32}
            style={{ color: withOpacity(colors.primary, 0.2) }}
          >
            ☆
          </AppText>
          <AppText
            size={15}
            style={{
              color: withOpacity(colors.primary, 0.5),
              marginTop: 8,
              textAlign: 'center',
            }}
          >
            No saved audio yet.{'\n'}Tap the star icon on any track to save it
            here.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={favourites}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={[
            styles.listContent,
            bottomPad > 0 && { paddingBottom: bottomPad },
          ]}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={15}
        />
      )}
    </View>
  );
};

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
  listContent: {
    paddingTop: SIZES.xsSmall,
    paddingBottom: 32,
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
  favBtn: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
});

export default InnerAudioFavourites;
