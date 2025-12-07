import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Pressable,
  Animated,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import styles from '../../styles/users/AnnouncementsStyle';
import CustomNavbar from '../../customs/CustomNavbar';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../config/API';

export default function AnnouncementsScreen({ onNavigate }) {
  const { user: authUser } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];

  const openModal = (item) => {
    setSelectedAnnouncement(item);
    setModalVisible(true);

    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedAnnouncement(null);
    });
  };

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

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/getAnnouncements`);
      const data = response.data.announcements || response.data;
      const mappedData = data.map(item => ({
        id: item._id,
        title: item.title,
        content: item.content,
        date: item.date,
        author: item.author,
        priority: item.priority,
        image: item.image,
      }));

      setAnnouncements(mappedData);

    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements([]);

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
      case 'important': return '#FF6B6B';
      case 'urgent': return '#FF4444';
      default: return '#4ECDC4';
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

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
      <View style={{ padding: 20, paddingTop: 30, }}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/sagrada.png')}
            style={{ width: 60, height: 60, alignSelf: 'center' }}
            resizeMode="contain"
          />
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.title}>Announcements</Text>
            <Text style={styles.subtitle}>Stay updated with our latest news!</Text>
          </View>
        </View>

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredAnnouncements.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="megaphone-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No announcements found.</Text>
            <Text style={styles.emptySubtext}>
              {search ? 'Try a different search term.' : 'Check back later for updates.'}
            </Text>
          </View>
        ) : (
          <View style={styles.announcementsList}>
            {filteredAnnouncements.map((announcement) => (
              <TouchableOpacity
                key={announcement.id}
                style={styles.announcementCard}
                onPress={() => openModal(announcement)}
                activeOpacity={0.8}
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
                        <Text style={styles.priorityText}>{announcement.priority.toUpperCase()}</Text>
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
                  <View style={[styles.cardInfo, { flex: 1, justifyContent: 'flex-start' }]}>
                    <Ionicons name="calendar-outline" size={14} color="#777" />
                    <Text style={styles.cardInfoText}>{announcement.date}</Text>
                  </View>

                  <View style={[styles.cardInfo, { flex: 1, justifyContent: 'flex-end' }]}>
                    <Ionicons name="person-outline" size={14} color="#777" />
                    <Text style={styles.cardInfoText}>{announcement.author}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable onPress={closeModal} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              padding: 20,
              paddingBottom: 40,
              backgroundColor: '#fff',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              transform: [{ translateY }],
            }}
          >
            {selectedAnnouncement && (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 20, fontFamily: 'Poppins_700Bold', flex: 1 }}>
                    {selectedAnnouncement.title}
                  </Text>
                  <Pressable onPress={closeModal}>
                    <Ionicons name="close" size={26} color="#333" />
                  </Pressable>
                </View>

                <Text style={{ marginTop: 10, fontSize: 14, fontFamily: 'Poppins_400Regular', color: '#555' }}>
                  {selectedAnnouncement.content}
                </Text>

                <View style={{ marginTop: 20 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name="calendar-outline" size={18} color="#555" />
                    <Text style={{ marginLeft: 6, fontFamily: 'Poppins_500Medium', color: '#555' }}>
                      {selectedAnnouncement.date}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="person-outline" size={18} color="#555" />
                    <Text style={{ marginLeft: 6, fontFamily: 'Poppins_500Medium', color: '#555' }}>
                      {selectedAnnouncement.author}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </Animated.View>
        </Pressable>
      </Modal>

      <CustomNavbar currentScreen="AnnouncementsScreen" onNavigate={onNavigate} />
    </View>
  );
}
