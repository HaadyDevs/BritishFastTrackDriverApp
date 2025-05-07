/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background FCM message:', remoteMessage);
  // Handle logic like saving to async storage or queue
});

AppRegistry.registerComponent(appName, () => App);
