import React, { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
  REPEAT,
} from '../../../assets/svgs';
import SmartToggle from '../../smartComponents/SmartToggle';

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
  const { colors } = useAppContext();
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const sheetHeight = useRef(SCREEN_HEIGHT * 0.85);

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
  const onSeekRef = useRef(onSeek);
  onSeekRef.current = onSeek;

  const progressBarRef = useRef<View>(null);
  const progressBarX = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt, gestureState) => {
        const relativeX = gestureState.moveX - progressBarX.current;

        let ratio = relativeX / progressBarW.current;
        ratio = Math.max(0, Math.min(1, ratio));

        // console.log('onPanResponderGrant ratio:', ratio);

        // Update UI instantly
        progressValue.value = ratio * 100;
      },

      onPanResponderMove: (evt, gestureState) => {
        const relativeX = gestureState.moveX - progressBarX.current;

        let ratio = relativeX / progressBarW.current;
        ratio = Math.max(0, Math.min(1, ratio));

        // console.log('onPanResponderMove ratio:', ratio);

        // Smooth UI update (NO animation here)
        progressValue.value = ratio * 100;
      },

      onPanResponderRelease: (evt, gestureState) => {
        const relativeX = gestureState.moveX - progressBarX.current;

        let ratio = relativeX / progressBarW.current;
        ratio = Math.max(0, Math.min(1, ratio));

        console.log('onPanResponderRelease final ratio:', ratio);

        // Final UI position
        progressValue.value = ratio * 100;

        // 🎵 Seek only once
        onSeekRef.current(ratio);
      },
    }),
  ).current;

  // ── Volume slider ─────────────────────────────────────────────────────────
  const volumeBarW = useRef(SCREEN_WIDTH - 120);
  const onVolumeChangeRef = useRef(onVolumeChange);
  onVolumeChangeRef.current = onVolumeChange;

  const volumePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const v = Math.max(
          0,
          Math.min(1, evt.nativeEvent.locationX / volumeBarW.current),
        );
        onVolumeChangeRef.current(v);
      },
      onPanResponderMove: evt => {
        const v = Math.max(
          0,
          Math.min(1, evt.nativeEvent.locationX / volumeBarW.current),
        );
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
          <View style={{ height: 35, overflow: 'hidden', flex: 1 }}>
            <SmartToggle
              containerWidth={300}
              direction="ltr"
              trigger={({ toggle, isOpen }) => {
                const selectedIndex = SPEEDS.indexOf(playbackSpeed);
                const selectedLabel =
                  selectedIndex !== -1 ? SPEED_LABELS[selectedIndex] : '';

                return (
                  <View className="bg-red-5000" style={{ paddingHorizontal: 8, width: 'auto', marginRight: 'auto', backgroundColor: "white", height: '100%', justifyContent: "center" }}>
                    {isOpen ? (
                      <AppText size={14} style={{ fontWeight: 'bold', color: colors.primary }}>✕</AppText>
                    ) : (
                      <AppText size={14} style={{ fontWeight: '600', color: colors.primary }}>
                        {selectedLabel}
                      </AppText>
                    )}
                  </View>
                );
              }}
            >
              {({ toggle }) => (
                <View className='bg-green-4000' style={styles.speedRow}>
                  {SPEEDS.map((s, i) => (
                    <Pressable
                      key={s}
                      onPress={() => { toggle(); onSpeedChange(s); }}
                      style={[
                        styles.speedBtn,
                        {
                          backgroundColor:
                            playbackSpeed === s ? colors.primary : 'transparent',
                          borderColor: colors.primary,
                        },
                      ]}
                    >
                      <AppText
                        size={12}
                        style={{
                          color: playbackSpeed === s ? '#fff' : colors.primary,
                          fontWeight: '600',
                        }}
                      >
                        {SPEED_LABELS[i]}
                      </AppText>
                    </Pressable>
                  ))}
                </View>
              )}
            </SmartToggle>
            <Text>123</Text>
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
            onLayout={() => {
              progressBarRef.current?.measure((x, y, width, height, pageX) => {
                progressBarX.current = pageX; // absolute X position
                progressBarW.current = width;
              });
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
              <AppText size={10} style={[styles.timeText, { color: colors.white }]}>ਨਾਨਕਸਰ ਰਿਕਾਰਡਿੰਗ ਸਟੂਡੀਓ</AppText>
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

        {/* Volume slider */}
        <View style={styles.volumeRow}>
          <AppText
            size={11}
            style={[styles.volumeLabel, { color: withOpacity(colors.primary, 0.6) }]}
          >
            Vol
          </AppText>
          <View
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
    height: 25,
    // borderRadius: 18,
    // marginLeft: -8,
    top: -6,
    elevation: 3,
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
  speedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  speedBtn: {
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
  volumeLabel: {
    minWidth: 24,
    fontWeight: '500',
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
