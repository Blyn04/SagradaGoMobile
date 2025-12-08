import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import styles from '../styles/notificationStyle';
import CustomNavbar from '../customs/CustomNavbar';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { API_BASE_URL } from '../config/API';
import { useAuth } from '../contexts/AuthContext';

dayjs.extend(relativeTime);

export default function NotificationsScreen({ user, onNavigate }) {
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user: authUser } = useAuth();
  
  const currentUser = user || authUser;

  const fetchNotifications = async () => {
    try {
      if (!currentUser || !currentUser.uid) {
        console.warn('User not available for fetching notifications');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/getNotifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_id: currentUser.uid,
          recipient_type: 'user',
          limit: 50,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const transformedNotifications = data.notifications.map((notification) => ({
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          time: dayjs(notification.createdAt),
          read: notification.read || false,
          action: notification.action || null,
        }));

        setNotifications(transformedNotifications);
        setUnreadCount(data.unreadCount || 0);

      } else {
        Alert.alert('Error', data.message || 'Failed to load notifications');
      }

    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser?.uid]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
      case 'booking_status':
        return 'calendar-outline';

      case 'announcement':
        return 'megaphone-outline';

      case 'event':
        return 'calendar-outline';

      case 'donation':
      case 'donation_status':
        return 'heart-outline';
        
      case 'reminder':
        return 'time-outline';

      case 'system':
        return 'settings-outline';

      case 'message':
        return 'chatbubble-outline';

      default:
        return 'notifications-outline';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'booking':
      case 'booking_status':
        return '#a8862fff';

      case 'announcement':
        return '#4CAF50';

      case 'event':
        return '#2196F3';

      case 'donation':
      case 'donation_status':
        return '#FF9800';

      case 'reminder':
        return '#9C27B0';

      case 'system':
        return '#607D8B';

      case 'message':
        return '#E91E63';

      default:
        return '#666';
    }
  };

  const handleNotificationPress = async (notification) => {
    if (!notification.read) {
      try {
        const response = await fetch(`${API_BASE_URL}/markAsRead`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notification_id: notification.id,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setNotifications(notifications.map(n => 
            n.id === notification.id ? { ...n, read: true } : n
          ));
          const newCount = Math.max(0, unreadCount - 1);
          setUnreadCount(newCount);
          
          if (onNavigate && typeof onNavigate === 'function') {
            fetchNotifications();
          }

        } else {
          console.error('Error marking notification as read:', data.message);
        }

      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    if (notification.action && onNavigate) {
      onNavigate(notification.action);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUser || !currentUser.uid) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/markAllAsRead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_id: currentUser.uid,
          recipient_type: 'user',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setUnreadCount(0);

      } else {
        Alert.alert('Error', data.message || 'Failed to mark all as read');
      }
      
    } catch (error) {
      console.error('Error marking all as read:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#a8862fff" />
          <Text style={[styles.subtitle, { marginTop: 10 }]}>Loading notifications...</Text>
        </View>
        <CustomNavbar
          currentScreen="NotificationsScreen"
          onNavigate={onNavigate}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>Notifications</Text>
              <Text style={styles.subtitle}>
                {unreadCount > 0 
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up!'}
              </Text>
            </View>
            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={handleMarkAllAsRead}
                style={styles.markAllButton}
              >
                <Text style={styles.markAllText}>Mark all read</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyText}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.unreadCard,
                ]}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.7}
              >
                <View style={styles.notificationContent}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${getNotificationColor(notification.type)}20` },
                    ]}
                  >
                    <Ionicons
                      name={getNotificationIcon(notification.type)}
                      size={24}
                      color={getNotificationColor(notification.type)}
                    />
                  </View>
                  <View style={styles.notificationTextContainer}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle}>
                        {notification.title}
                      </Text>
                      {!notification.read && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notificationMessage} numberOfLines={2}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {notification.time.fromNow()}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color="#ccc"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <CustomNavbar
        currentScreen="NotificationsScreen"
        onNavigate={onNavigate}
      />
    </View>
  );
}

