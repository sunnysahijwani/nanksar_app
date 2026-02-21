import React from 'react';
import { useAudioPlayer } from '../../../context/AudioPlayerContext';
import AudioPaathPlayerSheet from './AudioPaathPlayerSheet';
import AudioMiniPlayer from './AudioMiniPlayer';

/**
 * Rendered at the app root so the mini player and full sheet persist
 * across all screens while audio is playing.
 */
const AudioPlayerOverlay: React.FC = () => {
  const {
    tracks,
    activeTrackIndex,
    isPlaying,
    isBuffering,
    currentMs,
    durationMs,
    progress,
    categoryImage,
    playerVisible,
    miniPlayerVisible,
    togglePlay,
    stopAudio,
    seekTo,
    goNext,
    goPrev,
    dismissSheet,
    expandSheet,
  } = useAudioPlayer();

  const activeTrack =
    activeTrackIndex !== null ? tracks[activeTrackIndex] : null;

  return (
    <>
      {playerVisible && activeTrackIndex !== null && tracks.length > 0 && (
        <AudioPaathPlayerSheet
          tracks={tracks}
          currentIndex={activeTrackIndex}
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          currentMs={currentMs}
          durationMs={durationMs}
          categoryImage={categoryImage}
          onClose={dismissSheet}
          onTogglePlay={togglePlay}
          onSeek={seekTo}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      {miniPlayerVisible && activeTrack && activeTrackIndex !== null && (
        <AudioMiniPlayer
          track={activeTrack}
          trackIndex={activeTrackIndex}
          totalTracks={tracks.length}
          isPlaying={isPlaying}
          progress={progress}
          onPlayPause={togglePlay}
          onPrev={goPrev}
          onNext={goNext}
          onStop={stopAudio}
          onExpand={expandSheet}
        />
      )}
    </>
  );
};

export default AudioPlayerOverlay;
