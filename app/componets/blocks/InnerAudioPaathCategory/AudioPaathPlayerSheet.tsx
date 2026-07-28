import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  Text
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
  REPEAT,
} from '../../../assets/svgs';
import { useLocalize } from '../../../hooks/useLocalize';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PLACEHOLDER_IMAGE = 'https://nanaksaramritghar.com/logo.jpeg';
const ART_SIZE = SCREEN_WIDTH * 0.58;

const SPEEDS: number[] = [0.75, 1.0, 1.25, 1.5];
const SPEED_LABELS: string[] = ['0.75x', '1x', '1.25x', '1.5x'];

export type AudioTrack = {
  id: number;
  title: string;
  audio_path: string;
  audio_length: string | null;
  sort_index: number;
  stream_url: string | null;
  temporary_url: string | null;
  image?: string | null;
  title_punjabi?: string | null;
  author?: string | null;
};

type Props = {
  tracks: AudioTrack[];
  currentIndex: number;
  isPlaying: boolean;
  isBuffering: boolean;
  currentMs: number;
  durationMs: number;
  categoryImage: string | null;
  playbackSpeed: number;
  volume: number;
  onClose: () => void;
  onTogglePlay: () => void;
  onSeek: (ratio: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onSpeedChange: (speed: number) => void;
  onVolumeChange: (v: number) => void;
  isLooping: boolean;
  onToggleLoop: () => void;
};

const AudioPaathPlayerSheet: React.FC<Props> = ({
  tracks,
  currentIndex,
  isPlaying,
  isBuffering,
  currentMs,
  durationMs,
  categoryImage,
  playbackSpeed,
  volume,
  onClose,
  onTogglePlay,
  onSeek,
  onPrev,
  onNext,
  onSpeedChange,
  onVolumeChange,
  isLooping,
  onToggleLoop,
}) => {

  const { colors, lang } = useAppContext();
  const { t } = useLocalize();
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const sheetHeight = useRef(SCREEN_HEIGHT * 0.85);

  // Speed panel — vertical bottom-to-top
  const SPEED_ITEM_H = 44;
  const SPEED_PANEL_H = SPEEDS.length * SPEED_ITEM_H;
  const [speedOpen, setSpeedOpen] = useState(false);
  const speedAnim = useSharedValue(0);

  const toggleSpeed = useCallback(() => {
    const next = !speedOpen;
    setSpeedOpen(next);
    speedAnim.value = withTiming(next ? SPEED_PANEL_H : 0, { duration: 260 });
  }, [speedOpen]);

  const speedPanelStyle = useAnimatedStyle(() => ({
    height: speedAnim.value,
  }));

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

  const progressValue = useSharedValue(0);
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));
  const progressBarSeekerStyle = useAnimatedStyle(() => ({
    left: `${progressValue.value}%`,
  }));

  // ── Seek bar ─────────────────────────────────────────────────────────────
  const progressBarW = useRef(SCREEN_WIDTH - 96);
  const seekTouchStartX = useRef(0);   // locationX at grant
  const onSeekRef = useRef(onSeek);
  onSeekRef.current = onSeek;

  const progressBarRef = useRef<View>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        // locationX is relative to the view — no screen-position math needed
        seekTouchStartX.current = evt.nativeEvent.locationX;
        const ratio = Math.max(0, Math.min(1, evt.nativeEvent.locationX / progressBarW.current));
        progressValue.value = ratio * 100;
      },

      onPanResponderMove: (_, gestureState) => {
        // dx is the delta from the touch-start point — always accurate
        const x = seekTouchStartX.current + gestureState.dx;
        const ratio = Math.max(0, Math.min(1, x / progressBarW.current));
        progressValue.value = ratio * 100;
      },

      onPanResponderRelease: (_, gestureState) => {
        const x = seekTouchStartX.current + gestureState.dx;
        const ratio = Math.max(0, Math.min(1, x / progressBarW.current));
        progressValue.value = ratio * 100;
        onSeekRef.current(ratio);
      },
    }),
  ).current;

  // ── Volume slider ─────────────────────────────────────────────────────────
  const volumeBarW = useRef(SCREEN_WIDTH - 120);
  const volumeTouchStartX = useRef(0);
  const volumeBarRef = useRef<View>(null);
  const onVolumeChangeRef = useRef(onVolumeChange);
  onVolumeChangeRef.current = onVolumeChange;

  const volumePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        volumeTouchStartX.current = evt.nativeEvent.locationX;
        const v = Math.max(0, Math.min(1, evt.nativeEvent.locationX / volumeBarW.current));
        onVolumeChangeRef.current(v);
      },
      onPanResponderMove: (_, gestureState) => {
        const x = volumeTouchStartX.current + gestureState.dx;
        const v = Math.max(0, Math.min(1, x / volumeBarW.current));
        onVolumeChangeRef.current(v);
      },
      onPanResponderRelease: (_, gestureState) => {
        const x = volumeTouchStartX.current + gestureState.dx;
        const v = Math.max(0, Math.min(1, x / volumeBarW.current));
        onVolumeChangeRef.current(v);
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

        {/* Header */}
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

        {/* Album art */}
        <Image
          source={{ uri: artUri }}
          style={styles.albumArt}
          resizeMode="cover"
        />

        {/* Track info */}
        <View style={styles.trackInfo}>
          <AppText
            size={17}
            style={[styles.trackTitle, { color: colors.primary }]}
            numberOfLines={2}
          >
            {t(track, 'title')}
          </AppText>
          {track?.author ? (
            <AppText
              size={12}
              style={{ color: withOpacity(colors.primary, 0.5) }}
            >
              {track.author}
            </AppText>
          ) : null}
        </View>
        {/* Speed selector + Repeat row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, zIndex: 10 }}>
          {/* Speed trigger with vertical panel expanding upward */}
          <View style={{ position: 'relative' }}>
            {/* Options panel — absolutely above the trigger, grows bottom-to-top */}
            <Animated.View
              style={[
                styles.speedPanel,
                { borderColor: withOpacity(colors.primary, 0.12), display: speedOpen ? 'flex' : 'none' },
                speedPanelStyle,
              ]}
            >
              {SPEEDS.map((s, i) => (
                <Pressable
                  key={s}
                  onPress={() => { toggleSpeed(); onSpeedChange(s); }}
                  style={[
                    styles.speedPanelItem,
                    {
                      backgroundColor:
                        playbackSpeed === s
                          ? withOpacity(colors.primary, 0.1)
                          : 'transparent',
                    },
                  ]}
                >
                  <AppText
                    size={13}
                    style={{
                      color: colors.primary,
                      fontWeight: playbackSpeed === s ? '700' : '500',
                    }}
                  >
                    {SPEED_LABELS[i]}
                  </AppText>
                </Pressable>
              ))}
            </Animated.View>

            {/* Trigger button */}
            <TouchableOpacity
              onPress={toggleSpeed}
              style={[
                styles.speedTrigger,
                { borderColor: withOpacity(colors.primary, 0.35) },
              ]}
              activeOpacity={0.7}
            >
              <AppText
                size={13}
                style={{ color: colors.primary, fontWeight: '600' }}
              >
                {speedOpen ? '✕' : (SPEED_LABELS[SPEEDS.indexOf(playbackSpeed)] ?? '1x')}
              </AppText>
            </TouchableOpacity>
          </View>

          <Pressable onPress={onToggleLoop} hitSlop={12}>
            <REPEAT
              color={isLooping ? colors.primary : withOpacity(colors.primary, 0.3)}
              width={28}
              height={28}
            />
          </Pressable>
        </View>

        {/* Seek bar — taller hitbox for easy dragging */}
        <View style={styles.progressContainer}>
          <AppText size={11} style={styles.timeText}>
            {formatTime(currentMs)}
          </AppText>
          <View
            ref={progressBarRef}
            style={styles.seekHitbox}
            onLayout={e => {
              progressBarW.current = e.nativeEvent.layout.width;
            }}
            {...panResponder.panHandlers}
          >
            <View style={[styles.progressTrack, { backgroundColor: withOpacity(colors.primary, 0.5), height: 15, justifyContent: 'center' }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress * 100}%`,
                    height: 15,
                    backgroundColor: colors.primary,
                  },
                  progressBarStyle,
                ]}
              />
              <Animated.View
                style={[
                  styles.progressThumb,
                  {
                    left: `${progress * 100}%`,
                    backgroundColor: colors.primary,
                  },
                  progressBarSeekerStyle,
                ]}
              />
              <Text allowFontScaling={false} size={10} style={[styles.timeText, { color: colors.white }]}>{lang?.NanaksarRecordingStudio}</Text>
            </View>
          </View>
          <AppText size={11} style={styles.timeText}>
            {formatTime(durationMs)}
          </AppText>
        </View>

        {/* Playback controls */}
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
            disabled={isBuffering}
            hitSlop={8}
            style={[styles.playBtn, { backgroundColor: colors.primary }]}
          >
            {isBuffering ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : isPlaying ? (
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

        {/* Volume slider with − / + buttons */}
        <View style={styles.volumeRow}>
          <TouchableOpacity
            onPress={() => onVolumeChange(Math.max(0, parseFloat((volume - 0.1).toFixed(1))))}
            style={[styles.volBtn, { borderColor: withOpacity(colors.primary, 0.35) }]}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <AppText size={18} style={{ color: colors.primary, fontWeight: '700', lineHeight: 20 }}>−</AppText>
          </TouchableOpacity>

          <View
            ref={volumeBarRef}
            style={styles.volumeHitbox}
            onLayout={e => {
              volumeBarW.current = e.nativeEvent.layout.width;
            }}
            {...volumePanResponder.panHandlers}
          >
            <View style={styles.volumeTrack}>
              <View
                style={[
                  styles.volumeFill,
                  {
                    width: `${volume * 100}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
              <View
                style={[
                  styles.volumeThumb,
                  {
                    left: `${volume * 100}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => onVolumeChange(Math.min(1, parseFloat((volume + 0.1).toFixed(1))))}
            style={[styles.volBtn, { borderColor: withOpacity(colors.primary, 0.35), marginLeft: 8 }]}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <AppText size={18} style={{ color: colors.primary, fontWeight: '700', lineHeight: 20 }}>+</AppText>
          </TouchableOpacity>
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
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLabel: {
    fontWeight: '500',
  },
  albumArt: {
    width: ART_SIZE,
    height: ART_SIZE,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 16,
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
    marginBottom: 20,
    gap: 8,
  },
  seekHitbox: {
    flex: 1,
    height: 28,
    justifyContent: 'center',
    overflow: 'visible',
  },
  progressTrack: {
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
    width: 5,
    height: 15,
    // borderRadius: 18,
    // marginLeft: -8,
    // top: -6,
    elevation: 3,
  },
  timeText: {
    color: '#999',
    minWidth: 36,
    textAlign: 'center',
    top: -2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    marginBottom: 20,
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
  speedPanel: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    minWidth: 100,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 4,
  },
  speedPanelItem: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  speedTrigger: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  volBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeHitbox: {
    flex: 1,
    height: 28,
    justifyContent: 'center',
    overflow: 'visible',
  },
  volumeTrack: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    justifyContent: 'center',
    overflow: 'visible',
  },
  volumeFill: {
    position: 'absolute',
    left: 0,
    height: 4,
    borderRadius: 2,
  },
  volumeThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -8,
    top: -6,
    elevation: 3,
  },
});

export default AudioPaathPlayerSheet;
