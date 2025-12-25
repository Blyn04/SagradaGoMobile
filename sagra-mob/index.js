import { registerRootComponent } from 'expo';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

import App from './App';

// Register background message handler - MUST be at top level before app registration
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('🔔 Background message received:', remoteMessage);
  // Background notifications with notification payload are automatically displayed by FCM
  // This handler is mainly for data-only messages or additional processing
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
