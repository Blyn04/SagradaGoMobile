import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import styles from '../../styles/users/EventsStyle';
import CustomNavbar from '../../customs/CustomNavbar';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../config/API'; // ✅ use your API.js config

export default function EventsScreen({ onNavigate }) {
  const { user: authUser } = useAuth();

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

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/getAllEvents`);
      setEvents(response.data.events || []);

    } catch (error) {
      console.error("Error fetching events:", error);

    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {getUserName()} 👋</Text>
          <Text style={styles.title}>
            {events.length > 0
              ? `We have ${events.length} events this month!`
              : "No upcoming events yet"}
          </Text>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#777" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={{ paddingHorizontal: 30, paddingBottom: 20 }}>
          <Text style={styles.sectiontitle}>What's coming?</Text>
          <Text style={styles.subtitle}>Upcoming events and activities.</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 30, height: 450 }}
          >
            {filteredEvents.map((event) => (
              <View key={event._id} style={styles.card}>
                <Image
                  source={{ uri: event.image || 'https://via.placeholder.com/150' }}
                  style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                  <View>
                    <Text style={styles.cardTitle}>{event.title}</Text>
                    <Text style={styles.cardInfo}>
                      {new Date(event.date).toDateString()}
                    </Text>
                    <Text style={styles.cardInfo}>{event.location}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.cardVolunteerBtn}
                    onPress={() => onNavigate('VolunteerScreen', { event })}
                  >
                    <Ionicons name="hand-left-outline" size={20} color="#fff" />
                    <Text style={styles.cardVolunteerText}>Volunteer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </ScrollView>

      <CustomNavbar currentScreen="EventsScreen" onNavigate={onNavigate} />
    </View>
  );
}
