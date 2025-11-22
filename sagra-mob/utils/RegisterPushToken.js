import firestore from '@react-native-firebase/firestore';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';

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

    // Get Expo push token as fallback
    let expoToken = null;
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted') {
        const expoTokenData = await Notifications.getExpoPushTokenAsync();
        expoToken = expoTokenData.data;
        console.log("[FCM] Expo Token retrieved:", expoToken);
      }
    } catch (expoError) {
      console.log("[FCM] Expo token error:", expoError.message);
    }

    // Use firestore() directly
    const tokenData = {
      fcmToken: fcmToken,
      expoPushToken: expoToken,
      userDocId: userDocId,
      role: role || "User",
      platform: Platform.OS,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Firestore
    await firestore().collection("pushTokens").doc(user.id).set(tokenData);
    console.log("[FCM] Tokens saved to Firestore for user:", user.id);

    // Setup token refresh listener
    try {
      messaging().onTokenRefresh(async (newToken) => {
        console.log("[FCM] Token refreshed:", newToken);
        await firestore().collection("pushTokens").doc(user.id).update({
          fcmToken: newToken,
          updatedAt: new Date(),
        });
      });
    } catch (error) {
      console.log("[FCM] Error setting up token refresh listener:", error.message);
    }

    return {
      fcmToken,
      expoToken,
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

    // Use firestore() directly
    await firestore().collection("pushTokens").doc(user.id).update({
      fcmToken: null,
      expoPushToken: null,
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
