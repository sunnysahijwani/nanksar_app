import React, { useCallback, useEffect, useRef } from 'react';
import {
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PLACEHOLDER_IMAGE = 'https://nanaksaramritghar.com/logo.jpeg';

export type AudioTrack = {
  id: number;
  title: string;
  audio_path: string;
  audio_length: string | null;
  sort_index: number;
  stream_url: string | null;
  temporary_url: string | null;
  image?: string | null;
};

type Props = {
  tracks: AudioTrack[];
  currentIndex: number;
  isPlaying: boolean;
  currentMs: number;
  durationMs: number;
  categoryImage: string | null;
  onClose: () => void;
  onTogglePlay: () => void;
  onSeek: (ratio: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

const AudioPaathPlayerSheet: React.FC<Props> = ({
  tracks,
  currentIndex,
  isPlaying,
  currentMs,
  durationMs,
  categoryImage,
  onClose,
  onTogglePlay,
  onSeek,
  onPrev,
  onNext,
}) => {
  const { colors } = useAppContext();
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const sheetHeight = useRef(SCREEN_HEIGHT * 0.72);

  // Animate in on mount
  useEffect(() => {
    overlayOpacity.value = withTiming(1, { duration: 220 });
    translateY.value = withTiming(0, { duration: 260 });
  }, []);

  const handleClose = useCallback(() => {
    overlayOpacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(sheetHeight.current, { duration: 250 });
    setTimeout(() => onClose(), 260);
  }, [onClose]);

  const progress = durationMs > 0 ? currentMs / durationMs : 0;

  const formatTime = (ms: number): string => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const track = tracks[currentIndex];
  const artUri = track?.image ?? categoryImage ?? PLACEHOLDER_IMAGE;

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const progressBarW = useRef(SCREEN_WIDTH - 48);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const ratio = Math.max(
          0,
          Math.min(1, evt.nativeEvent.locationX / progressBarW.current),
        );
        onSeek(ratio);
      },
      onPanResponderMove: evt => {
        const ratio = Math.max(
          0,
          Math.min(1, evt.nativeEvent.locationX / progressBarW.current),
        );
        onSeek(ratio);
      },
    }),
  ).current;

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: insets.bottom + 16 },
          sheetStyle,
        ]}
        onLayout={e => {
          sheetHeight.current = e.nativeEvent.layout.height;
        }}
      >
        <View style={styles.dragHandle} />

        <View style={styles.header}>
          <Pressable onPress={handleClose} hitSlop={12}>
            <AppText
              size={22}
              style={{ color: colors.primary, fontWeight: '600' }}
            >
              ←
            </AppText>
          </Pressable>
          <AppText
            size={13}
            style={[
              styles.headerLabel,
              { color: withOpacity(colors.primary, 0.5) },
            ]}
          >
            {currentIndex + 1} / {tracks.length}
          </AppText>
        </View>

        <Image
          source={{ uri: artUri }}
          style={styles.albumArt}
          resizeMode="cover"
        />

        <View style={styles.trackInfo}>
          <AppText
            size={18}
            style={[styles.trackTitle, { color: colors.primary }]}
            numberOfLines={2}
          >
            {track?.title ?? ''}
          </AppText>
          {track?.audio_length ? (
            <AppText
              size={12}
              style={{ color: withOpacity(colors.primary, 0.5) }}
            >
              {track.audio_length}
            </AppText>
          ) : null}
        </View>

        <View style={styles.progressContainer}>
          <AppText size={11} style={styles.timeText}>
            {formatTime(currentMs)}
          </AppText>
          <View
            style={styles.progressTrack}
            onLayout={e => {
              progressBarW.current = e.nativeEvent.layout.width;
            }}
            {...panResponder.panHandlers}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
            <View
              style={[
                styles.progressThumb,
                {
                  left: `${progress * 100}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <AppText size={11} style={styles.timeText}>
            {formatTime(durationMs)}
          </AppText>
        </View>

        <View style={styles.controls}>
          <Pressable
            onPress={onPrev}
            disabled={currentIndex === 0}
            style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
            hitSlop={12}
          >
            <PREV_BUTTON color={colors.primary} width={44} height={44} />
          </Pressable>

          <Pressable
            onPress={onTogglePlay}
            hitSlop={8}
            style={[styles.playBtn, { backgroundColor: colors.primary }]}
          >
            {isPlaying ? (
              <PAUSE_BUTTON color="#fff" width={32} height={32} />
            ) : (
              <PLAY_BUTTON color="#fff" width={32} height={32} />
            )}
          </Pressable>

          <Pressable
            onPress={onNext}
            disabled={currentIndex === tracks.length - 1}
            style={{ opacity: currentIndex === tracks.length - 1 ? 0.3 : 1 }}
            hitSlop={12}
          >
            <NEXT_BUTTON color={colors.primary} width={44} height={44} />
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLabel: {
    fontWeight: '500',
  },
  albumArt: {
    width: SCREEN_WIDTH - 80,
    height: SCREEN_WIDTH - 80,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 4,
  },
  trackTitle: {
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    justifyContent: 'center',
    overflow: 'visible',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    height: 4,
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: -7,
    top: -5,
    elevation: 2,
  },
  timeText: {
    color: '#999',
    minWidth: 36,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
  },
  playBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default AudioPaathPlayerSheet;
