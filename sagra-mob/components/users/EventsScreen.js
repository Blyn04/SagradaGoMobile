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
import VolunteerScreen from './VolunteerScreen';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../config/API';

export default function EventsScreen({ onNavigate }) {
  const { user: authUser } = useAuth();
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getUserName = () => {
    if (authUser) {
      const capitalize = (str) =>
        str ? str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase() : '';

      const fullName = [
        capitalize(authUser?.first_name),
        capitalize(authUser?.last_name)
      ].filter(Boolean).join(' ');

      if (authUser.is_priest) {
        return `Father ${fullName || ''}`.trim();
      }

      return fullName || 'Guest';
    }

    return 'Guest';
  };

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("upcoming");

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

  const now = new Date();
  now.setHours(0, 0, 0, 0); 

  const upcomingEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= now;
  });

  const pastEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < now;
  });

  const filteredEvents = (selectedTab === "upcoming" ? upcomingEvents : pastEvents).filter(e =>
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
            {selectedTab === "upcoming"
              ? upcomingEvents.length > 0
                ? `We have ${upcomingEvents.length} upcoming events!`
                : "No upcoming events yet!"
              : pastEvents.length > 0
              ? `We have ${pastEvents.length} past events!`
              : "No past events yet!"}
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

        {/* TABS */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "upcoming" && styles.tabActive]}
            onPress={() => setSelectedTab("upcoming")}
          >
            <Text style={[styles.tabText, selectedTab === "upcoming" && styles.tabTextActive]}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "past" && styles.tabActive]}
            onPress={() => setSelectedTab("past")}
          >
            <Text style={[styles.tabText, selectedTab === "past" && styles.tabTextActive]}>
              Past
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 30, paddingBottom: 20, paddingTop: 10 }}>
          <Text style={styles.sectiontitle}>
            {selectedTab === "upcoming" ? "What's coming?" : "Past events"}
          </Text>
          <Text style={styles.subtitle}>
            {selectedTab === "upcoming"
              ? "Upcoming events and activities."
              : "Events that have already happened."}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
        ) : filteredEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedTab === "upcoming"
                ? "No upcoming events found."
                : "No past events found."}
            </Text>
          </View>
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

                  {!authUser?.is_priest && selectedTab === "upcoming" && (
                    <TouchableOpacity
                      style={styles.cardVolunteerBtn}
                      onPress={() => {
                        setSelectedEvent(event);
                        setShowVolunteerModal(true);
                      }}
                    >
                      <Ionicons name="hand-left-outline" size={20} color="#fff" />
                      <Text style={styles.cardVolunteerText}>Volunteer</Text>
                    </TouchableOpacity>
                  )}

                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </ScrollView>

      <CustomNavbar currentScreen="EventsScreen" onNavigate={onNavigate} />

      <VolunteerScreen
        visible={showVolunteerModal}
        onClose={() => {
          setShowVolunteerModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </View>
  );
}
