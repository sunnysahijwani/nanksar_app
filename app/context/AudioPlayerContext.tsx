import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Sound, { type PlayBackType } from 'react-native-nitro-sound';
import { AudioTrack } from '../componets/blocks/InnerAudioPaathCategory/AudioPaathPlayerSheet';
import { Alert, PermissionsAndroid } from 'react-native';
import { requestPermission } from '../utils/permission';

type AudioPlayerContextType = {
  tracks: AudioTrack[];
  activeTrackIndex: number | null;
  isPlaying: boolean;
  isBuffering: boolean;
  progress: number; // 0–1
  currentMs: number;
  durationMs: number;
  categoryImage: string | null;
  playerVisible: boolean;
  miniPlayerVisible: boolean;

  playTrack: (
    tracks: AudioTrack[],
    index: number,
    categoryImage?: string | null,
  ) => void;
  togglePlay: () => void;
  stopAudio: () => void;
  seekTo: (ratio: number) => void;
  goNext: () => void;
  goPrev: () => void;
  dismissSheet: () => void;
  expandSheet: () => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error('useAudioPlayer must be used inside AudioPlayerProvider');
  }
  return ctx;
};

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [activeTrackIndex, setActiveTrackIndex] = useState<number | null>(null);
  const [categoryImage, setCategoryImage] = useState<string | null>(null);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [miniPlayerVisible, setMiniPlayerVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentMs, setCurrentMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);

  const progress = durationMs > 0 ? currentMs / durationMs : 0;

  // Keep refs so async callbacks read the latest values without stale closures
  const tracksRef = useRef<AudioTrack[]>([]);
  tracksRef.current = tracks;
  const activeIndexRef = useRef<number | null>(null);
  activeIndexRef.current = activeTrackIndex;

  /**
   * Concurrency control:
   *
   * genRef is a generation counter. Every time a new play/next/prev/stop
   * operation starts, it increments the counter and captures its own value.
   * After every await, the operation checks whether it still holds the
   * current generation — if not, a newer operation has taken over and this
   * one exits silently, preventing stale setIsPlaying/setIsBuffering calls
   * from landing after a stop or a different track has been requested.
   *
   * isBusyRef is a simple mutex used by goNext/goPrev so that rapid taps
   * are dropped rather than stacked (playTrack skips the mutex and always
   * cancels whatever is in flight, since an explicit track selection should
   * always win).
   */
  const genRef = useRef(0);
  const isBusyRef = useRef(false);

  // Register progress and end listeners once on mount
  useEffect(() => {
    Sound.setSubscriptionDuration(0.25); // update every 250 ms

    Sound.addPlayBackListener((e: PlayBackType) => {
      setCurrentMs(Math.floor(e.currentPosition));
      setDurationMs(Math.floor(e.duration));
    });

    Sound.addPlaybackEndListener(() => {
      // If a manual transition is already in progress, let it win.
      if (isBusyRef.current) return;

      const idx = activeIndexRef.current;
      const list = tracksRef.current;

      if (idx !== null && idx < list.length - 1) {
        // Auto-advance to the next track
        const nextIdx = idx + 1;
        const gen = ++genRef.current;
        isBusyRef.current = true;

        setActiveTrackIndex(nextIdx);
        setCurrentMs(0);
        setDurationMs(0);

        const url = list[nextIdx].stream_url ?? list[nextIdx].temporary_url ?? '';
        Sound.startPlayer(url)
          .then(() => {
            if (genRef.current === gen) isBusyRef.current = false;
          })
          .catch(e => {
            if (genRef.current === gen) isBusyRef.current = false;
            console.error('[Sound] auto-advance error:', e);
          });
      } else {
        // Queue ended — reset UI
        setIsPlaying(false);
        setPlayerVisible(false);
        setMiniPlayerVisible(false);
        setActiveTrackIndex(null);
        setCurrentMs(0);
        setDurationMs(0);
      }
    });

    return () => {
      Sound.removePlayBackListener();
      Sound.removePlaybackEndListener();
      Sound.stopPlayer().catch(() => {});
    };
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────

  const playTrack = useCallback(
    async (
      newTracks: AudioTrack[],
      index: number,
      catImage?: string | null,
    ) => {
      const hasPermission = await requestPermission(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      if (!hasPermission) {
        Alert.alert('Error', 'You need to allow permission to play audio.');
        return;
      }

      const currentTrack =
        activeIndexRef.current !== null
          ? tracksRef.current[activeIndexRef.current]
          : null;
      const newTrack = newTracks[index];

      // Open the sheet immediately so the user gets visual feedback
      setCategoryImage(catImage ?? null);
      setMiniPlayerVisible(false);
      setPlayerVisible(true);

      // Same track already loaded — just ensure it is playing
      if (currentTrack?.id === newTrack?.id) {
        try {
          await Sound.resumePlayer();
          setIsPlaying(true);
        } catch (e) {
          console.error('[Sound] resume error:', e);
        }
        return;
      }

      // Cancel any in-flight operation and take ownership
      const gen = ++genRef.current;
      isBusyRef.current = true;

      setTracks(newTracks);
      setActiveTrackIndex(index);
      setCurrentMs(0);
      setDurationMs(0);
      setIsBuffering(true);

      try {
        await Sound.stopPlayer();
        if (genRef.current !== gen) return; // cancelled by a newer op

        const url = newTrack.stream_url ?? newTrack.temporary_url ?? '';
        await Sound.startPlayer(url);
        if (genRef.current !== gen) {
          // A stop/next/prev arrived while we were buffering — clean up
          Sound.stopPlayer().catch(() => {});
          return;
        }

        setIsPlaying(true);
        setIsBuffering(false);
      } catch (e) {
        if (genRef.current === gen) setIsBuffering(false);
        console.error('[Sound] playTrack error:', e);
      } finally {
        if (genRef.current === gen) isBusyRef.current = false;
      }
    },
    [],
  );

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      await Sound.pausePlayer();
      setIsPlaying(false);
    } else {
      await Sound.resumePlayer();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const stopAudio = useCallback(async () => {
    // Increment generation to invalidate any in-flight operation, then
    // release the mutex so nothing is left holding it after the stop.
    genRef.current++;
    isBusyRef.current = false;

    await Sound.stopPlayer();
    setIsPlaying(false);
    setPlayerVisible(false);
    setMiniPlayerVisible(false);
    setActiveTrackIndex(null);
    setTracks([]);
    setCurrentMs(0);
    setDurationMs(0);
  }, []);

  const seekTo = useCallback(
    async (ratio: number) => {
      if (durationMs <= 0) return;
      // seekToPlayer takes milliseconds
      await Sound.seekToPlayer(ratio * durationMs);
    },
    [durationMs],
  );

  const goNext = useCallback(async () => {
    // Drop rapid taps while a transition is already in progress
    if (isBusyRef.current) return;

    const idx = activeIndexRef.current;
    const list = tracksRef.current;
    if (idx === null || idx >= list.length - 1) return;

    const nextIdx = idx + 1;
    const gen = ++genRef.current;
    isBusyRef.current = true;

    setActiveTrackIndex(nextIdx);
    setCurrentMs(0);
    setDurationMs(0);
    setIsBuffering(true);

    try {
      await Sound.stopPlayer();
      if (genRef.current !== gen) return;

      const url = list[nextIdx].stream_url ?? list[nextIdx].temporary_url ?? '';
      await Sound.startPlayer(url);
      if (genRef.current !== gen) {
        Sound.stopPlayer().catch(() => {});
        return;
      }

      setIsPlaying(true);
      setIsBuffering(false);
    } catch (e) {
      if (genRef.current === gen) setIsBuffering(false);
      console.error('[Sound] goNext error:', e);
    } finally {
      if (genRef.current === gen) isBusyRef.current = false;
    }
  }, []);

  const goPrev = useCallback(async () => {
    // Drop rapid taps while a transition is already in progress
    if (isBusyRef.current) return;

    const idx = activeIndexRef.current;
    const list = tracksRef.current;
    if (idx === null || idx <= 0) return;

    const prevIdx = idx - 1;
    const gen = ++genRef.current;
    isBusyRef.current = true;

    setActiveTrackIndex(prevIdx);
    setCurrentMs(0);
    setDurationMs(0);
    setIsBuffering(true);

    try {
      await Sound.stopPlayer();
      if (genRef.current !== gen) return;

      const url = list[prevIdx].stream_url ?? list[prevIdx].temporary_url ?? '';
      await Sound.startPlayer(url);
      if (genRef.current !== gen) {
        Sound.stopPlayer().catch(() => {});
        return;
      }

      setIsPlaying(true);
      setIsBuffering(false);
    } catch (e) {
      if (genRef.current === gen) setIsBuffering(false);
      console.error('[Sound] goPrev error:', e);
    } finally {
      if (genRef.current === gen) isBusyRef.current = false;
    }
  }, []);

  const dismissSheet = useCallback(() => {
    setPlayerVisible(false);
    setMiniPlayerVisible(true);
  }, []);

  const expandSheet = useCallback(() => {
    setMiniPlayerVisible(false);
    setPlayerVisible(true);
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        tracks,
        activeTrackIndex,
        isPlaying,
        isBuffering,
        progress,
        currentMs,
        durationMs,
        categoryImage,
        playerVisible,
        miniPlayerVisible,
        playTrack,
        togglePlay,
        stopAudio,
        seekTo,
        goNext,
        goPrev,
        dismissSheet,
        expandSheet,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
