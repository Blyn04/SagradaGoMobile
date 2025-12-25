import { Platform, Alert, Linking, NativeModules } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import app from '../config/FireBaseConfig';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationHandler {
  constructor() {
    this.initialized = false;
    this.navigationRef = null;
  }

  setNavigationRef(ref) {
    this.navigationRef = ref;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      await this.requestPermissions();
      
      // Create Android notification channels
      await this.createNotificationChannel();

      // Background handler is registered in index.js - don't set it here
      this.setupForegroundMessageHandler();
      this.setupNotificationOpenedHandlers();
      this.setupExpoNotificationHandlers();

      this.initialized = true;
      console.log('NotificationHandler: Initialized successfully');

    } catch (error) {
      console.error('NotificationHandler: Error initializing:', error);
    }
  }

  async requestPermissions() {
    try {
      // Request FCM permissions
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('NotificationHandler: FCM permission denied');
        return false;
      }

      // Request Expo notification permissions
      if (Notifications && typeof Notifications.requestPermissionsAsync === 'function') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('NotificationHandler: Expo notification permission denied');
          return false;
        }
      }

      console.log('NotificationHandler: Permissions granted');
      return true;

    } catch (error) {
      console.error('NotificationHandler: Error requesting permissions:', error);
      return false;
    }
  }

  // Background message handler is registered in index.js
  // Do not set it here to avoid conflicts

  setupForegroundMessageHandler() {
    try {
      console.log('NotificationHandler: Setting up foreground message handler...');
      
      messaging().onMessage(async (remoteMessage) => {
        console.log('🔔 NotificationHandler: Foreground message received!');
        console.log('🔔 NotificationHandler: Message data:', JSON.stringify(remoteMessage, null, 2));
        
        if (remoteMessage?.notification) {
          console.log('🔔 NotificationHandler: Title:', remoteMessage.notification.title);
          console.log('🔔 NotificationHandler: Body:', remoteMessage.notification.body);
        }
        
        await this.showLocalNotification(remoteMessage);
        
        await this.saveNotificationToFirestore(remoteMessage);
      });
      
      console.log('NotificationHandler: ✅ Foreground message handler set up successfully');
      
    } catch (error) {
      console.error('NotificationHandler: ❌ Error setting up foreground message handler:', error);
    }
  }

  setupNotificationOpenedHandlers() {
    try {
      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('NotificationHandler: Notification opened app:', remoteMessage);
        this.handleNotificationNavigation(remoteMessage);
      });

      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) {
            console.log('NotificationHandler: App opened from notification:', remoteMessage);
            this.handleNotificationNavigation(remoteMessage);
          }
        });

    } catch (error) {
      console.error('NotificationHandler: Error setting up notification opened handlers:', error);
    }
  }


  async showLocalNotification(remoteMessage) {
    try {
      const { notification, data } = remoteMessage;
      
      if (!notification) {
        console.log('NotificationHandler: No notification object in message');
        return;
      }

      const title = notification.title || 'New Notification';
      const body = notification.body || 'You have a new message';
      
      console.log('NotificationHandler: 📱 Showing notification:', title, body);
      
      // Use expo-notifications to show system notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: data || {},
          sound: true,
        },
        trigger: null, // Show immediately
      });
      
      console.log('NotificationHandler: ✅ Notification displayed');

    } catch (error) {
      console.error('NotificationHandler: Error showing local notification:', error);
      console.error('NotificationHandler: Error stack:', error.stack);
      
      // Fallback to Alert
      if (remoteMessage?.notification) {
        try {
          Alert.alert(
            remoteMessage.notification.title || 'Notification',
            remoteMessage.notification.body || 'You have a new message',
            [{ text: 'OK' }]
          );
        } catch (fallbackError) {
          console.error('NotificationHandler: Fallback Alert also failed:', fallbackError);
        }
      }
    }
  }

  async saveNotificationToFirestore(remoteMessage) {
    try {
      const { notification, data } = remoteMessage;
      
      if (!notification) return;

      // Note: Notifications are primarily saved by the backend
      // This is optional client-side storage for in-app display
      // If Firestore rules don't allow writes, we'll skip this gracefully
      
      try {
        const db = getFirestore(app);
        const notificationData = {
          title: notification.title || 'New Notification',
          body: notification.body || 'You have a new message',
          data: data || {},
          timestamp: serverTimestamp(),
          type: data?.type || 'general',
          read: false,
          source: 'fcm',
        };

        // Try to save to general notifications collection
        // This may fail if Firestore rules don't allow client writes
        await addDoc(collection(db, 'allNotifications'), notificationData);

        // If notification is for a specific user, save to their personal collection
        if (data?.userId) {
          await addDoc(collection(db, 'accounts', data.userId, 'userNotifications'), notificationData);
        }

        console.log('NotificationHandler: Notification saved to Firestore');
      } catch (firestoreError) {
        // Silently fail - notifications are already displayed and backend handles storage
        console.log('NotificationHandler: Could not save to Firestore (likely security rules) - this is OK, backend handles storage');
      }

    } catch (error) {
      // Don't log as error - this is expected if Firestore rules restrict writes
      console.log('NotificationHandler: Skipping Firestore save (permissions or rules)');
    }
  }

  handleNotificationNavigation(remoteMessage) {
    const { data } = remoteMessage;
    
    if (!data || !this.navigationRef) return;

    setTimeout(() => {
      try {
        switch (data.type) {
          case 'request_approved':
            this.navigationRef.navigate('OrdersScreen');
            break;

          case 'new_request':
            this.navigationRef.navigate('PendingRequestScreen');
            break;

          case 'request_rejected':
            this.navigationRef.navigate('OrdersScreen');
            break;

          case 'inventory_update':
            this.navigationRef.navigate('InventoryStocks');
            break;

          case 'capex_approved':
            this.navigationRef.navigate('CapexRequestScreen');
            break;

          case 'capex_rejected':
            this.navigationRef.navigate('CapexRequestScreen');
            break;

          default:
            this.navigationRef.navigate('Notifications');
            break;
        }

      } catch (error) {
        console.error('NotificationHandler: Error navigating:', error);
      }
    }, 1000);
  }

  setupExpoNotificationHandlers() {
    try {
      // Handle notification received in foreground
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('NotificationHandler: Expo notification received:', notification);
      });

      // Handle notification response (when user taps notification)
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('NotificationHandler: Expo notification response:', response);
        this.handleExpoNotificationResponse(response);
      });
    } catch (error) {
      console.error('NotificationHandler: Error setting up Expo notification handlers:', error);
    }
  }

  handleExpoNotificationResponse(response) {
    const { notification } = response;
    const data = notification.request.content.data;
    
    if (data) {
      this.handleNotificationNavigation({ data });
    }
  }

  async createNotificationChannel() {
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });

        await Notifications.setNotificationChannelAsync('requests', {
          name: 'Request Notifications',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });

        await Notifications.setNotificationChannelAsync('inventory', {
          name: 'Inventory Notifications',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });

        console.log('NotificationHandler: ✅ Notification channels created');
      } catch (error) {
        console.error('NotificationHandler: Error creating notification channels:', error);
      }
    }
  }

  async sendTestNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null,
      });
      console.log('NotificationHandler: ✅ Test notification sent');
    } catch (error) {
      console.error('NotificationHandler: Error sending test notification:', error);
    }
  }

  async getPermissionsStatus() {
    try {
      let fcmStatus = false;
      let expoStatus = { status: 'denied' };
      
      fcmStatus = await messaging().hasPermission();
      fcmStatus = fcmStatus === messaging.AuthorizationStatus.AUTHORIZED;
      
      if (Notifications && typeof Notifications.getPermissionsAsync === 'function') {
        expoStatus = await Notifications.getPermissionsAsync();
      }
      
      return {
        fcm: fcmStatus,
        expo: expoStatus.status === 'granted',
      };

    } catch (error) {
      console.error('NotificationHandler: Error getting permissions status:', error);
      return { fcm: false, expo: false };
    }
  }
}

const notificationHandler = new NotificationHandler();

export default notificationHandler;
