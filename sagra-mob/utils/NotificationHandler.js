import { Platform, Alert, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

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

      this.setupBackgroundMessageHandler();
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
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('NotificationHandler: FCM permission denied');
        return false;
      }

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

  setupBackgroundMessageHandler() {
    try {
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('NotificationHandler: Background message received:', remoteMessage);

        await this.saveNotificationToFirestore(remoteMessage);
      });

    } catch (error) {
      console.error('NotificationHandler: Error setting up background message handler:', error);
    }
  }

  setupForegroundMessageHandler() {
    try {
      messaging().onMessage(async (remoteMessage) => {
        console.log('NotificationHandler: Foreground message received:', remoteMessage);
        
        await this.showLocalNotification(remoteMessage);
        
        await this.saveNotificationToFirestore(remoteMessage);
      });
      
    } catch (error) {
      console.error('NotificationHandler: Error setting up foreground message handler:', error);
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

  setupExpoNotificationHandlers() {
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('NotificationHandler: Expo notification received:', notification);
    });


    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('NotificationHandler: Expo notification response:', response);
      this.handleExpoNotificationResponse(response);
    });
  }

  async showLocalNotification(remoteMessage) {
    try {
      const { notification, data } = remoteMessage;
      
      if (notification) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title || 'New Notification',
            body: notification.body || 'You have a new message',
            data: data || {},
            sound: true,
          },
          trigger: null, 
        });
      }

    } catch (error) {
      console.error('NotificationHandler: Error showing local notification:', error);
    }
  }

  async saveNotificationToFirestore(remoteMessage) {
    try {
      const { notification, data } = remoteMessage;
      
      if (!notification) return;

      const notificationData = {
        title: notification.title || 'New Notification',
        body: notification.body || 'You have a new message',
        data: data || {},
        timestamp: firestore.FieldValue.serverTimestamp(),
        type: data?.type || 'general',
        read: false,
        source: 'fcm',
      };

      await firestore().collection('allNotifications').add(notificationData);

      if (data?.userId) {
        await firestore().collection('accounts').doc(data.userId).collection('userNotifications').add(notificationData);
      }

      console.log('NotificationHandler: Notification saved to Firestore');

    } catch (error) {
      console.error('NotificationHandler: Error saving notification to Firestore:', error);
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

  handleExpoNotificationResponse(response) {
    const { notification } = response;
    const data = notification.request.content.data;
    
    if (data) {
      this.handleNotificationNavigation({ data });
    }
  }

  async createNotificationChannel() {
    if (Platform.OS === 'android') {
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
