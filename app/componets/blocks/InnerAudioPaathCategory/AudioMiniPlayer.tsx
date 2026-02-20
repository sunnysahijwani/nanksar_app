import React from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../elements/AppText/AppText';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';
import {
  PLAY_BUTTON,
  PAUSE_BUTTON,
  PREV_BUTTON,
  NEXT_BUTTON,
} from '../../../assets/svgs';
import { AudioTrack } from './AudioPaathPlayerSheet';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  track: AudioTrack;
  trackIndex: number;
  totalTracks: number;
  isPlaying: boolean;
  progress: number; // 0–1
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onStop: () => void;
  onExpand: () => void;
};

const AudioMiniPlayer: React.FC<Props> = ({
  track,
  trackIndex,
  totalTracks,
  isPlaying,
  progress,
  onPlayPause,
  onPrev,
  onNext,
  onStop,
  onExpand,
}) => {
  const { colors } = useAppContext();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + 8,
          borderTopColor: withOpacity(colors.primary, 0.12),
        },
      ]}
    >
      {/* Thin progress bar at very top */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%`, backgroundColor: colors.primary },
          ]}
        />
      </View>

      {/* Tap anywhere (except controls) to expand */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onExpand}
        style={styles.expandArea}
      >
        {/* Track info row */}
        <View style={styles.infoRow}>
          <View style={styles.trackMeta}>
            <AppText
              size={14}
              style={[styles.trackTitle, { color: colors.primary }]}
              numberOfLines={1}
            >
              {track.title}
            </AppText>
            <AppText size={11} style={{ color: withOpacity(colors.primary, 0.5) }}>
              {trackIndex + 1} of {totalTracks}
            </AppText>
          </View>

          {/* Close / stop button */}
          <Pressable onPress={onStop} hitSlop={14} style={styles.closeBtn}>
            <AppText size={18} style={{ color: withOpacity(colors.primary, 0.55), fontWeight: '600' }}>
              ✕
            </AppText>
          </Pressable>
        </View>

        {/* Playback controls */}
        <View style={styles.controls}>
          <Pressable
            onPress={onPrev}
            disabled={trackIndex === 0}
            style={{ opacity: trackIndex === 0 ? 0.3 : 1 }}
            hitSlop={12}
          >
            <PREV_BUTTON color={colors.primary} width={36} height={36} />
          </Pressable>

          <Pressable
            onPress={onPlayPause}
            hitSlop={8}
            style={[styles.playBtn, { backgroundColor: colors.primary }]}
          >
            {isPlaying
              ? <PAUSE_BUTTON color="#fff" width={24} height={24} />
              : <PLAY_BUTTON color="#fff" width={24} height={24} />
            }
          </Pressable>

          <Pressable
            onPress={onNext}
            disabled={trackIndex === totalTracks - 1}
            style={{ opacity: trackIndex === totalTracks - 1 ? 0.3 : 1 }}
            hitSlop={12}
          >
            <NEXT_BUTTON color={colors.primary} width={36} height={36} />
          </Pressable>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    zIndex: 50,
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#ebebeb',
    width: '100%',
  },
  progressFill: {
    height: 3,
  },
  expandArea: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  trackMeta: {
    flex: 1,
    gap: 2,
  },
  trackTitle: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  closeBtn: {
    paddingLeft: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingBottom: 4,
  },
  playBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});

export default AudioMiniPlayer;
