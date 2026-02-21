/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import TrackPlayer from 'react-native-track-player';
import TrackPlayerService from './app/services/TrackPlayerService';

// Must be registered before AppRegistry so the background service is ready
// before the JS bundle mounts.
TrackPlayer.registerPlaybackService(() => TrackPlayerService);

AppRegistry.registerComponent(appName, () => App);
