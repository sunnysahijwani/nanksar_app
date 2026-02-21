import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import TrackPlayer, {
  Event,
  State,
  type Track,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
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

/** Convert an app AudioTrack to a react-native-track-player Track object */
function toPlayerTrack(
  track: AudioTrack,
  categoryImage?: string | null,
): Track {
  return {
    id: String(track.id),
    url: track.stream_url ?? track.temporary_url ?? '',
    title: track.title,
    artist: 'Nanaksar Amritghar',
    artwork: track.image ?? categoryImage ?? undefined,
  };
}

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [activeTrackIndex, setActiveTrackIndex] = useState<number | null>(null);
  const [categoryImage, setCategoryImage] = useState<string | null>(null);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [miniPlayerVisible, setMiniPlayerVisible] = useState(false);

  // TrackPlayer reactive hooks — these keep updating even when app is backgrounded
  const playbackState = usePlaybackState();
  const { position, duration } = useProgress(250); // updates every 250 ms

  const isBuffering =
    playbackState.state === State.Loading ||
    playbackState.state === State.Buffering;

  const isPlaying =
    playbackState.state === State.Playing ||
    playbackState.state === State.Buffering ||
    playbackState.state === State.Loading;

  const currentMs = Math.floor(position * 1000);
  const durationMs = Math.floor(duration * 1000);
  const progress = durationMs > 0 ? currentMs / durationMs : 0;

  // Keep a ref so async callbacks read the latest tracks without stale closures
  const tracksRef = useRef<AudioTrack[]>([]);
  tracksRef.current = tracks;
  const activeIndexRef = useRef<number | null>(null);
  activeIndexRef.current = activeTrackIndex;

  // TrackPlayer is set up in App.tsx before this provider mounts.
  // No additional setup needed here.

  // ── Sync React state when TrackPlayer advances to the next track ──────────
  // Covers: end-of-track auto-advance, lock-screen next/prev, notification buttons
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
    if (event.index !== undefined && event.index !== null) {
      setActiveTrackIndex(event.index);
    }
  });

  // ── Reset visible UI when the queue finishes ──────────────────────────────
  useTrackPlayerEvents([Event.PlaybackQueueEnded], () => {
    setPlayerVisible(false);
    setMiniPlayerVisible(false);
    setActiveTrackIndex(null);
  });

  // ── Actions ───────────────────────────────────────────────────────────────

  const playTrack = useCallback(
    async (
      newTracks: AudioTrack[],
      index: number,
      catImage?: string | null,
    ) => {
      const currentTrack =
        activeIndexRef.current !== null
          ? tracksRef.current[activeIndexRef.current]
          : null;
      const newTrack = newTracks[index];

      // Open the sheet immediately so the user gets visual feedback
      setCategoryImage(catImage ?? null);
      setMiniPlayerVisible(false);
      setPlayerVisible(true);

      // Same track already loaded — just ensure it's playing
      if (currentTrack?.id === newTrack?.id) {
        try { await TrackPlayer.play(); } catch (e) { console.error('[TrackPlayer] play error:', e); }
        return;
      }

      setTracks(newTracks);
      setActiveTrackIndex(index);

      try {
        await TrackPlayer.reset();
        await TrackPlayer.add(newTracks.map(t => toPlayerTrack(t, catImage)));
        await TrackPlayer.skip(index);
        await TrackPlayer.play();
      } catch (e) {
        console.error('[TrackPlayer] playTrack error:', e);
      }
    },
    [],
  );

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  }, [isPlaying]);

  const stopAudio = useCallback(async () => {
    await TrackPlayer.reset();
    setPlayerVisible(false);
    setMiniPlayerVisible(false);
    setActiveTrackIndex(null);
    setTracks([]);
  }, []);

  const seekTo = useCallback(
    async (ratio: number) => {
      if (durationMs <= 0) return;
      // TrackPlayer.seekTo takes seconds; durationMs is milliseconds
      await TrackPlayer.seekTo((ratio * durationMs) / 1000);
    },
    [durationMs],
  );

  const goNext = useCallback(async () => {
    const idx = activeIndexRef.current;
    if (idx === null || idx >= tracksRef.current.length - 1) return;
    await TrackPlayer.skipToNext();
    setActiveTrackIndex(idx + 1);
  }, []);

  const goPrev = useCallback(async () => {
    const idx = activeIndexRef.current;
    if (idx === null || idx <= 0) return;
    await TrackPlayer.skipToPrevious();
    setActiveTrackIndex(idx - 1);
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
