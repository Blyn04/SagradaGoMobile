import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { getFirestore, doc, setDoc, updateDoc } from 'firebase/firestore';
import app from '../config/FireBaseConfig';

/**
 * Register for FCM push notifications
 * This function handles both FCM and Expo notifications for maximum compatibility
 */
export const registerForPushNotificationsAsync = async (user, userDocId, role) => {
  try {
    console.log("[FCM] Starting push notification registration...");

    if (!user || !user.id) {
      console.log("[FCM] No authenticated user found");
      return null;
    }

    // Request FCM permissions
    let fcmToken = null;
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log("[FCM] FCM permission not granted");
        return null;
      }

      // Get FCM token
      fcmToken = await messaging().getToken();
      console.log("[FCM] FCM Token retrieved:", fcmToken);
    } catch (error) {
      console.log("[FCM] Error getting FCM token:", error.message);
      fcmToken = null;
    }

    if (!fcmToken) {
      console.log("[FCM] No FCM token available, cannot register for push notifications");
      return null;
    }

    // Save token to Firestore
    const tokenData = {
      fcmToken: fcmToken,
      userDocId: userDocId,
      role: role || "User",
      platform: Platform.OS,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Firestore
    const db = getFirestore(app);
    await setDoc(doc(db, "pushTokens", user.id), tokenData);
    console.log("[FCM] Tokens saved to Firestore for user:", user.id);

    // Setup token refresh listener
    try {
      messaging().onTokenRefresh(async (newToken) => {
        console.log("[FCM] Token refreshed:", newToken);
        const db = getFirestore(app);
        await updateDoc(doc(db, "pushTokens", user.id), {
          fcmToken: newToken,
          updatedAt: new Date(),
        });
      });
    } catch (error) {
      console.log("[FCM] Error setting up token refresh listener:", error.message);
    }

    return {
      fcmToken,
      userId: user.id,
    };

  } catch (error) {
    console.error("[FCM] Error during registration:", error.message);
    return null;
  }
};

/**
 * Unregister push notifications
 */
export const unregisterPushNotifications = async (user) => {
  try {
    if (!user || !user.id) return;

    // Use Firestore directly
    const db = getFirestore(app);
    await updateDoc(doc(db, "pushTokens", user.id), {
      fcmToken: null,
      deletedAt: new Date(),
    });

    console.log("[FCM] Push notifications unregistered for user:", user.id);
  } catch (error) {
    console.error("[FCM] Error unregistering:", error.message);
  }
};

/**
 * Get current push token
 */
export const getCurrentPushToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    return fcmToken;
  } catch (error) {
    console.error("[FCM] Error getting current token:", error.message);
    return null;
  }
};

/**
 * Check if push notifications are enabled
 */
export const isPushNotificationEnabled = async () => {
  try {
    const authStatus = await messaging().hasPermission();
    return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
  } catch (error) {
    console.error("[FCM] Error checking permission:", error.message);
    return false;
  }
};
