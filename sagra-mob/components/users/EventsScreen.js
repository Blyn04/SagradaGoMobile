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
  const [volunteerEvents, setVolunteerEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [volunteerSubTab, setVolunteerSubTab] = useState("registered");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (authUser?.uid && selectedTab === "volunteer") {
      fetchUserVolunteers();
    }
  }, [selectedTab, authUser]);

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

  const fetchUserVolunteers = async () => {
    try {
      setLoadingVolunteers(true);
      const response = await axios.post(`${API_BASE_URL}/getUserVolunteers`, {
        user_id: authUser?.uid || authUser?.id,
      });
      const volunteers = response.data.volunteers || [];
      
      // Fetch event details for each volunteer record
      const volunteersWithEvents = await Promise.all(
        volunteers.map(async (volunteer) => {
          if (volunteer.event_id) {
            try {
              const eventResponse = await axios.get(`${API_BASE_URL}/getEvent/${volunteer.event_id}`);
              return {
                ...volunteer,
                event: eventResponse.data.event,
              };
            } catch (error) {
              console.error(`Error fetching event ${volunteer.event_id}:`, error);
              return volunteer;
            }
          }
          return volunteer;
        })
      );
      
      setVolunteerEvents(volunteersWithEvents);
    } catch (error) {
      console.error("Error fetching user volunteers:", error);
    } finally {
      setLoadingVolunteers(false);
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

  // Categorize volunteer events
  const finishedVolunteers = volunteerEvents.filter(v => {
    if (!v.event || !v.event.date) return false;
    const eventDate = new Date(v.event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < now;
  });

  const ongoingVolunteers = volunteerEvents.filter(v => {
    if (!v.event || !v.event.date) return false;
    const eventDate = new Date(v.event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === now.getTime();
  });

  const registeredVolunteers = volunteerEvents.filter(v => {
    if (!v.event || !v.event.date) return false;
    const eventDate = new Date(v.event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate > now;
  });

  const getVolunteerEventsForTab = () => {
    const currentSubTab = selectedTab === "volunteer" ? volunteerSubTab : selectedTab;
    if (currentSubTab === "finished") return finishedVolunteers;
    if (currentSubTab === "ongoing") return ongoingVolunteers;
    if (currentSubTab === "registered") return registeredVolunteers;
    return [];
  };

  const filteredEvents = selectedTab === "volunteer" 
    ? [] 
    : (selectedTab === "upcoming" ? upcomingEvents : pastEvents).filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase())
      );

  const filteredVolunteerEvents = getVolunteerEventsForTab().filter(v => {
    const eventTitle = v.event?.title || v.eventTitle || '';
    const eventLocation = v.event?.location || '';
    return eventTitle.toLowerCase().includes(search.toLowerCase()) ||
           eventLocation.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {getUserName()} 👋</Text>
          <Text style={styles.title}>
            {selectedTab === "volunteer"
              ? "Your Volunteer Activities"
              : selectedTab === "upcoming"
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
            placeholderTextColor="#999"
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
          {!authUser?.is_priest && (
            <TouchableOpacity
              style={[styles.tab, selectedTab === "volunteer" && styles.tabActive]}
              onPress={() => setSelectedTab("volunteer")}
            >
              <Text style={[styles.tabText, selectedTab === "volunteer" && styles.tabTextActive]}>
                Volunteer
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {selectedTab === "volunteer" ? (
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, volunteerSubTab === "finished" && styles.tabActive]}
              onPress={() => setVolunteerSubTab("finished")}
            >
              <Text style={[styles.tabText, volunteerSubTab === "finished" && styles.tabTextActive]}>
                Finished
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, volunteerSubTab === "ongoing" && styles.tabActive]}
              onPress={() => setVolunteerSubTab("ongoing")}
            >
              <Text style={[styles.tabText, volunteerSubTab === "ongoing" && styles.tabTextActive]}>
                Ongoing
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, volunteerSubTab === "registered" && styles.tabActive]}
              onPress={() => setVolunteerSubTab("registered")}
            >
              <Text style={[styles.tabText, volunteerSubTab === "registered" && styles.tabTextActive]}>
                Registered
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={{ paddingHorizontal: 30, paddingBottom: 20, paddingTop: 10 }}>
          <Text style={styles.sectiontitle}>
            {selectedTab === "upcoming" 
              ? "What's coming?" 
              : selectedTab === "past"
              ? "Past events"
              : selectedTab === "volunteer"
              ? volunteerSubTab === "finished"
                ? "Finished Activities"
                : volunteerSubTab === "ongoing"
                ? "Ongoing Activities"
                : "Registered Activities"
              : "Events"}
          </Text>
          <Text style={styles.subtitle}>
            {selectedTab === "upcoming"
              ? "Upcoming events and activities."
              : selectedTab === "past"
              ? "Events that have already happened."
              : selectedTab === "volunteer"
              ? volunteerSubTab === "finished"
                ? "Activities you've completed as a volunteer."
                : volunteerSubTab === "ongoing"
                ? "Activities currently happening that you're volunteering for."
                : "Upcoming activities you're registered to volunteer for."
              : "Events and activities."}
          </Text>
        </View>

        {selectedTab === "volunteer" ? (
          loadingVolunteers ? (
            <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
          ) : filteredVolunteerEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {volunteerSubTab === "finished"
                  ? "No finished volunteer activities found."
                  : volunteerSubTab === "ongoing"
                  ? "No ongoing volunteer activities found."
                  : volunteerSubTab === "registered"
                  ? "No registered volunteer activities found."
                  : "No volunteer activities found."}
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingHorizontal: 30, height: 450 }}
            >
              {filteredVolunteerEvents.map((volunteer) => {
                const event = volunteer.event || {};
                return (
                  <View key={volunteer._id} style={styles.card}>
                    <Image
                      source={{ uri: event.image || 'https://via.placeholder.com/150' }}
                      style={styles.cardImage}
                    />
                    <View style={styles.cardContent}>
                      <View>
                        <Text style={styles.cardTitle}>{event.title || volunteer.eventTitle}</Text>
                        {event.date && (
                          <Text style={styles.cardInfo}>
                            {new Date(event.date).toDateString()}
                          </Text>
                        )}
                        {(event.time_start || event.time_end) && (
                          <Text style={styles.cardInfo}>
                            {event.time_start && event.time_end
                              ? `${event.time_start} - ${event.time_end}`
                              : event.time_start
                              ? `${event.time_start} -`
                              : `- ${event.time_end}`}
                          </Text>
                        )}
                        {event.location && (
                          <Text style={styles.cardInfo}>{event.location}</Text>
                        )}
                        <Text style={[styles.cardInfo, { marginTop: 5, fontStyle: 'italic', color: '#666' }]}>
                          Status: {volunteer.status || 'pending'}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )
        ) : loading ? (
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
                    {(event.time_start || event.time_end) && (
                      <Text style={styles.cardInfo}>
                        {event.time_start && event.time_end
                          ? `${event.time_start} - ${event.time_end}`
                          : event.time_start
                          ? `${event.time_start} -`
                          : `- ${event.time_end}`}
                      </Text>
                    )}
                    <Text style={styles.cardInfo}>{event.location}</Text>
                  </View>

                  {!authUser?.is_priest && selectedTab === "upcoming" && (
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                      {event.type === "event" && (
                        <TouchableOpacity
                          style={[styles.cardVolunteerBtn, { flex: 1, backgroundColor: '#4CAF50', marginRight: 5 }]}
                          onPress={() => {
                            setSelectedEvent(event);
                            setShowVolunteerModal(true);
                          }}
                        >
                          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                          <Text style={styles.cardVolunteerText}>Register</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={[styles.cardVolunteerBtn, { flex: event.type === "event" ? 1 : 1, marginLeft: event.type === "event" ? 5 : 0 }]}
                        onPress={() => {
                          setSelectedEvent(event);
                          setShowVolunteerModal(true);
                        }}
                      >
                        <Ionicons name="hand-left-outline" size={20} color="#fff" />
                        <Text style={styles.cardVolunteerText}>Volunteer</Text>
                      </TouchableOpacity>
                    </View>
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
