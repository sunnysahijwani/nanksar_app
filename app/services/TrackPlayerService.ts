/**
 * TrackPlayerService
 *
 * This module runs in a separate background thread managed by react-native-track-player.
 * It handles remote-control events from:
 *   - iOS: Control Centre, lock screen, AirPods/headphone buttons
 *   - Android: Media notification buttons, headphone buttons, Bluetooth controls
 *
 * IMPORTANT: This file must be registered via TrackPlayer.registerPlaybackService()
 * in index.js before AppRegistry.registerComponent().
 */
import TrackPlayer, { Event } from 'react-native-track-player';

module.exports = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => {
    TrackPlayer.seekTo(position);
  });
};
