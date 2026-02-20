import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Sound } from 'react-native-nitro-sound';
import { AudioTrack } from '../componets/blocks/InnerAudioPaathCategory/AudioPaathPlayerSheet';

type AudioPlayerContextType = {
  tracks: AudioTrack[];
  activeTrackIndex: number | null;
  isPlaying: boolean;
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMs, setCurrentMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [categoryImage, setCategoryImage] = useState<string | null>(null);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [miniPlayerVisible, setMiniPlayerVisible] = useState(false);
  // Increment to force audio restart even when activeTrackIndex doesn't change
  const [playToken, setPlayToken] = useState(0);

  const isPlayerReady = useRef(false);

  // Refs so callbacks always read fresh values without stale closures
  const sessionRef = useRef<{
    tracks: AudioTrack[];
    activeIndex: number | null;
    durationMs: number;
  }>({ tracks: [], activeIndex: null, durationMs: 0 });

  sessionRef.current.tracks = tracks;
  sessionRef.current.activeIndex = activeTrackIndex;
  sessionRef.current.durationMs = durationMs;

  const progress = durationMs > 0 ? currentMs / durationMs : 0;

  // --- Start audio when activeTrackIndex or playToken changes ---
  useEffect(() => {
    if (activeTrackIndex === null) return;
    const track = sessionRef.current.tracks[activeTrackIndex];
    if (!track?.temporary_url) return;

    isPlayerReady.current = false;
    Sound.stopPlayer();
    Sound.startPlayer(track.temporary_url);
    setCurrentMs(0);
    setDurationMs(0);

    const totalTracks = sessionRef.current.tracks.length;
    const capturedIndex = activeTrackIndex;

    Sound.addPlayBackListener(
      (e: { currentPosition: number; duration: number }) => {
        isPlayerReady.current = true;
        setCurrentMs(e.currentPosition);
        setDurationMs(e.duration);
      },
    );

    Sound.addPlaybackEndListener(() => {
      if (capturedIndex < totalTracks - 1) {
        setIsPlaying(true);
        setActiveTrackIndex(capturedIndex + 1);
      } else {
        setIsPlaying(false);
      }
    });

    return () => {
      Sound.removePlayBackListener();
      Sound.removePlaybackEndListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrackIndex, playToken]);

  // --- Pause / resume when isPlaying toggles ---
  useEffect(() => {
    if (!isPlayerReady.current) return;
    if (isPlaying) {
      Sound.resumePlayer();
    } else {
      Sound.pausePlayer();
    }
  }, [isPlaying]);

  // --- Actions ---

  const playTrack = useCallback(
    (newTracks: AudioTrack[], index: number, catImage?: string | null) => {
      const { tracks: currentTracks, activeIndex } = sessionRef.current;
      const newTrack = newTracks[index];
      const currentTrack =
        activeIndex !== null ? currentTracks[activeIndex] : null;

      setCategoryImage(catImage ?? null);
      setMiniPlayerVisible(false);
      setPlayerVisible(true);
      setIsPlaying(true);

      if (currentTrack?.id === newTrack?.id) {
        // Same track already loaded — just ensure sheet is open
        return;
      }

      setTracks(newTracks);
      setCurrentMs(0);
      setDurationMs(0);

      if (activeIndex === index) {
        // Same position, different tracks — force effect re-run via token
        setPlayToken(prev => prev + 1);
      } else {
        setActiveTrackIndex(index);
      }
    },
    [],
  );

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const stopAudio = useCallback(() => {
    Sound.stopPlayer();
    setPlayerVisible(false);
    setMiniPlayerVisible(false);
    setActiveTrackIndex(null);
    setIsPlaying(false);
    setCurrentMs(0);
    setDurationMs(0);
    setTracks([]);
  }, []);

  const seekTo = useCallback((ratio: number) => {
    const dur = sessionRef.current.durationMs;
    if (dur <= 0) return;
    const seekMs = Math.floor(ratio * dur);
    Sound.seekToPlayer(seekMs);
    setCurrentMs(seekMs);
  }, []);

  const goNext = useCallback(() => {
    const { activeIndex, tracks: t } = sessionRef.current;
    if (activeIndex === null || activeIndex >= t.length - 1) return;
    setIsPlaying(true);
    setCurrentMs(0);
    setDurationMs(0);
    setActiveTrackIndex(activeIndex + 1);
  }, []);

  const goPrev = useCallback(() => {
    const { activeIndex } = sessionRef.current;
    if (activeIndex === null || activeIndex <= 0) return;
    setIsPlaying(true);
    setCurrentMs(0);
    setDurationMs(0);
    setActiveTrackIndex(activeIndex - 1);
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
