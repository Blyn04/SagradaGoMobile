import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/users/AnnouncementsStyle';
import CustomNavbar from '../../customs/CustomNavbar';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../config/API';
import dayjs from 'dayjs';

export default function AnnouncementsScreen({ user, onNavigate }) {
  const { user: authUser } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getUserName = () => {
    if (authUser) {
      const fullName = [
        authUser.first_name || '',
        authUser.middle_name || '',
        authUser.last_name || ''
      ].filter(Boolean).join(' ').trim();

      return fullName || 'Guest';
    }

    return 'Guest';
  };

  const defaultAnnouncements = [
    {
      id: 1,
      title: 'Weekly Mass Schedule Update',
      content: 'Please be informed that our weekly mass schedule has been updated. Regular masses are now held every Sunday at 7:00 AM and 5:00 PM.',
      date: dayjs().subtract(2, 'day').format('MMMM DD, YYYY'),
      author: 'Parish Office',
      priority: 'normal',
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
    },
    {
      id: 2,
      title: 'Community Service Event',
      content: 'Join us for our monthly community service event this coming Saturday. We will be helping clean up the church grounds and organizing donations for families in need.',
      date: dayjs().subtract(5, 'day').format('MMMM DD, YYYY'),
      author: 'Volunteer Committee',
      priority: 'important',
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
    },
    {
      id: 3,
      title: 'Special Prayer Service',
      content: 'We invite everyone to attend our special prayer service for peace and unity this Friday evening at 6:00 PM.',
      date: dayjs().subtract(1, 'week').format('MMMM DD, YYYY'),
      author: 'Parish Priest',
      priority: 'normal',
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
    },
  ];

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

      setAnnouncements(defaultAnnouncements);

    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements(defaultAnnouncements);

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnnouncements();
  };

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(search.toLowerCase()) ||
    announcement.content.toLowerCase().includes(search.toLowerCase()) ||
    announcement.author.toLowerCase().includes(search.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'important':
        return '#FF6B6B';

      case 'urgent':
        return '#FF4444';

      default:
        return '#4ECDC4';
    }
  };

  const handleAnnouncementPress = (announcement) => {
    Alert.alert(
      announcement.title,
      `${announcement.content}\n\nDate: ${announcement.date}\nAuthor: ${announcement.author}`,
      [{ text: 'OK' }]
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#424242" />
        <Text style={{ marginTop: 10, color: '#666', fontFamily: 'Poppins_500Medium' }}>
          Loading announcements...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ padding: 20, paddingBottom: -5 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {getUserName() || 'Guest'} 👋</Text>
          <Text style={styles.title}>Announcements</Text>
          <Text style={styles.subtitle}>Stay updated with our latest news!</Text>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#777" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search announcements..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* ANNOUNCEMENTS LIST */}
        {filteredAnnouncements.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="megaphone-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No announcements found</Text>
            <Text style={styles.emptySubtext}>
              {search ? 'Try a different search term' : 'Check back later for updates'}
            </Text>
          </View>
        ) : (
          <View style={styles.announcementsList}>
            {filteredAnnouncements.map((announcement) => (
              <TouchableOpacity
                key={announcement.id}
                style={styles.announcementCard}
                onPress={() => handleAnnouncementPress(announcement)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    {announcement.priority !== 'normal' && (
                      <View
                        style={[
                          styles.priorityBadge,
                          { backgroundColor: getPriorityColor(announcement.priority) },
                        ]}
                      >
                        <Text style={styles.priorityText}>
                          {announcement.priority.toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {announcement.title}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>

                <Text style={styles.cardContent} numberOfLines={3}>
                  {announcement.content}
                </Text>

                <View style={styles.cardFooter}>
                  <View style={styles.cardInfo}>
                    <Ionicons name="calendar-outline" size={14} color="#777" />
                    <Text style={styles.cardInfoText}>{announcement.date}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Ionicons name="person-outline" size={14} color="#777" />
                    <Text style={styles.cardInfoText}>{announcement.author}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <CustomNavbar
        currentScreen="AnnouncementsScreen"
        onNavigate={onNavigate}
      />
    </View>
  );
}
