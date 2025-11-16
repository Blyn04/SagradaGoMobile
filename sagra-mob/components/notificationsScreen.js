import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import styles from '../styles/notificationStyle';
import CustomNavbar from '../customs/CustomNavbar';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function NotificationsScreen({ user, onNavigate }) {
  const [refreshing, setRefreshing] = useState(false);
 
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your baptism booking for December 15, 2024 has been confirmed.',
      time: dayjs().subtract(2, 'hours'),
      read: false,
      action: 'BookingHistoryScreen',
    },
    {
      id: '2',
      type: 'announcement',
      title: 'New Announcement',
      message: 'Join us for the Christmas Mass on December 24 at 6:00 PM.',
      time: dayjs().subtract(5, 'hours'),
      read: false,
      action: 'AnnouncementsScreen',
    },
    {
      id: '3',
      type: 'event',
      title: 'Upcoming Event',
      message: 'Community Cleanup event is scheduled for this Saturday.',
      time: dayjs().subtract(1, 'day'),
      read: true,
      action: 'EventsScreen',
    },
    {
      id: '4',
      type: 'donation',
      title: 'Thank You',
      message: 'Thank you for your generous donation. Your contribution makes a difference.',
      time: dayjs().subtract(2, 'days'),
      read: true,
      action: 'DonationsScreen',
    },
    {
      id: '5',
      type: 'reminder',
      title: 'Reminder',
      message: 'Don\'t forget about your scheduled confession appointment tomorrow.',
      time: dayjs().subtract(3, 'days'),
      read: true,
      action: 'BookingHistoryScreen',
    },
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return 'calendar-outline';

      case 'announcement':
        return 'megaphone-outline';

      case 'event':
        return 'calendar-outline';

      case 'donation':
        return 'heart-outline';
        
      case 'reminder':
        return 'time-outline';

      default:
        return 'notifications-outline';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'booking':
        return '#a8862fff';

      case 'announcement':
        return '#4CAF50';

      case 'event':
        return '#2196F3';

      case 'donation':
        return '#FF9800';

      case 'reminder':
        return '#9C27B0';

      default:
        return '#666';
    }
  };

  const handleNotificationPress = (notification) => {
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));

    if (notification.action && onNavigate) {
      onNavigate(notification.action);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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

