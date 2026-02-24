import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AudioPro,
  AudioProContentType,
  AudioProEventType,
  AudioProState,
} from 'react-native-audio-pro';
import { AudioTrack } from '../componets/blocks/InnerAudioPaathCategory/AudioPaathPlayerSheet';

const PLACEHOLDER = 'https://nanaksaramritghar.com/logo.jpeg';

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
  playbackSpeed: number;
  volume: number;
  isLooping: boolean;

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
  changeSpeed: (speed: number) => void;
  changeVolume: (v: number) => void;
  toggleLoop: () => void;
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
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isLooping, setIsLooping] = useState(false);

  const progress = durationMs > 0 ? currentMs / durationMs : 0;

  // Refs so event callbacks always read the latest values without stale closures
  const tracksRef = useRef<AudioTrack[]>([]);
  tracksRef.current = tracks;
  const activeIndexRef = useRef<number | null>(null);
  activeIndexRef.current = activeTrackIndex;
  const categoryImageRef = useRef<string | null>(null);
  categoryImageRef.current = categoryImage;
  const isLoopingRef = useRef(false);
  isLoopingRef.current = isLooping;

  // Internal helper: start playing the track at `idx`, or reset if out of bounds
  const _playAtIndex = useCallback((idx: number | null) => {
    const list = tracksRef.current;
    if (idx === null || idx < 0 || idx >= list.length) {
      setIsPlaying(false);
      setPlayerVisible(false);
      setMiniPlayerVisible(false);
      setActiveTrackIndex(null);
      setCurrentMs(0);
      setDurationMs(0);
      AudioPro.clear();
      return;
    }
    const track = list[idx];
    setActiveTrackIndex(idx);
    setCurrentMs(0);
    setDurationMs(0);
    AudioPro.play({
      id: String(track.id),
      url: track.stream_url ?? track.temporary_url ?? '',
      title: track.title,
      artwork: categoryImageRef.current ?? PLACEHOLDER,
    });
  }, []);

  // Single event listener covering progress, state, track-end, and lock-screen controls
  useEffect(() => {
    AudioPro.configure({
      contentType: AudioProContentType.SPEECH,
      progressIntervalMs: 250,
      showNextPrevControls: true,
      showSkipControls: false,
    });

    const sub = AudioPro.addEventListener((event) => {
      switch (event.type) {
        case AudioProEventType.STATE_CHANGED: {
          const state = event.payload?.state;
          if (state === AudioProState.LOADING) {
            setIsBuffering(true);
          } else if (state === AudioProState.PLAYING) {
            setIsPlaying(true);
            setIsBuffering(false);
          } else if (state === AudioProState.PAUSED) {
            setIsPlaying(false);
          } else if (
            state === AudioProState.STOPPED ||
            state === AudioProState.IDLE
          ) {
            setIsPlaying(false);
            setIsBuffering(false);
          }
          break;
        }

        case AudioProEventType.PROGRESS:
          setCurrentMs(Math.floor(event.payload?.position ?? 0));
          setDurationMs(Math.floor(event.payload?.duration ?? 0));
          break;

        case AudioProEventType.TRACK_ENDED:
          if (isLoopingRef.current) {
            _playAtIndex(activeIndexRef.current);
          } else {
            _playAtIndex((activeIndexRef.current ?? -1) + 1);
          }
          break;

        case AudioProEventType.REMOTE_NEXT:
          _playAtIndex((activeIndexRef.current ?? -1) + 1);
          break;

        case AudioProEventType.REMOTE_PREV:
          _playAtIndex((activeIndexRef.current ?? 1) - 1);
          break;

        default:
          break;
      }
    });

    return () => {
      sub.remove();
      AudioPro.stop();
      AudioPro.clear();
    };
  }, [_playAtIndex]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const playTrack = useCallback(
    (
      newTracks: AudioTrack[],
      index: number,
      catImage?: string | null,
    ) => {
      setCategoryImage(catImage ?? null);
      categoryImageRef.current = catImage ?? null;
      setMiniPlayerVisible(false);
      setPlayerVisible(true);
      setTracks(newTracks);
      tracksRef.current = newTracks;
      _playAtIndex(index);
    },
    [_playAtIndex],
  );

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      AudioPro.pause();
    } else {
      AudioPro.resume();
    }
  }, [isPlaying]);

  const stopAudio = useCallback(() => {
    AudioPro.stop();
    AudioPro.clear();
    setIsPlaying(false);
    setIsBuffering(false);
    setPlayerVisible(false);
    setMiniPlayerVisible(false);
    setActiveTrackIndex(null);
    setTracks([]);
    setCurrentMs(0);
    setDurationMs(0);
  }, []);

  const seekTo = useCallback(
    (ratio: number) => {
      if (durationMs > 0) {
        AudioPro.seekTo(ratio * durationMs);
      }
    },
    [durationMs],
  );

  const goNext = useCallback(() => {
    _playAtIndex((activeIndexRef.current ?? -1) + 1);
  }, [_playAtIndex]);

  const goPrev = useCallback(() => {
    _playAtIndex((activeIndexRef.current ?? 1) - 1);
  }, [_playAtIndex]);

  const dismissSheet = useCallback(() => {
    setPlayerVisible(false);
    setMiniPlayerVisible(true);
  }, []);

  const expandSheet = useCallback(() => {
    setMiniPlayerVisible(false);
    setPlayerVisible(true);
  }, []);

  const changeSpeed = useCallback((speed: number) => {
    AudioPro.setPlaybackSpeed(speed);
    setPlaybackSpeed(speed);
  }, []);

  const changeVolume = useCallback((v: number) => {
    AudioPro.setVolume(v);
    setVolume(v);
  }, []);

  const toggleLoop = useCallback(() => {
    setIsLooping(prev => {
      isLoopingRef.current = !prev;
      return !prev;
    });
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
        playbackSpeed,
        volume,
        isLooping,
        playTrack,
        togglePlay,
        stopAudio,
        seekTo,
        goNext,
        goPrev,
        dismissSheet,
        expandSheet,
        changeSpeed,
        changeVolume,
        toggleLoop,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
