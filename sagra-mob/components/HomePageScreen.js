import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import styles from '../styles/HomePageStyle';
import CustomNavbar from '../customs/CustomNavbar';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import axios from 'axios';
import { API_BASE_URL } from '../config/API';
import CustomCalendar from '../customs/CustomCalendar';
import NotificationBadge from './NotificationBadge';
import { useAuth } from '../contexts/AuthContext';

export default function HomePageScreen({ user, onLogout, onNavigate }) {
  const [selectedSection, setSelectedSection] = useState('Quick Access');
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [unreadCount, setUnreadCount] = useState(0);
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;

  const shortcuts = [
    {
      id: 'donation',
      title: 'Donation',
      description: 'Make a donation',
      screen: 'DonationsScreen',
      color: '#FFC942',
      hints: ['Help a family', 'Support a cause'],
      image: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwz2-2x2nNm-1Y0wXm4sTfRp-ZOsbo5xWEitpsAKPSuK52hB1ymCI4WykGQaNIhNLJSIrrq4-8XHwjT4ACHKaEXcD8YnT_Po4M9M39IjcjCz4xRQXjkSJ4HVudItvbaPbjGDPdF=s680-w680-h510-rw',
    },
    {
      id: 'announcement',
      title: 'Announcement',
      description: 'View announcements',
      screen: 'AnnouncementsScreen',
      color: '#d89d09ff',
      hints: ['News & Updates', 'Community Alerts'],
      image: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwwN85yC8vouPT69D5Kjz8RTchXeOyMbQ-dSmI4ui25OH7_XpPsGW0yWPWjtArSTSwAFuvAk7ODktcYtGTIu0NeFIAY7glt9p6mblqIwQlpy6PziibLSAQiyQK87jhB1iVmPU8=s680-w680-h510-rw',
    },
    {
      id: 'virtualtour',
      title: 'Virtual Tour',
      description: 'Explore virtually',
      screen: 'VirtualTourScreen',
      color: '#705104ff',
      hints: ['Explore Locations', '360° Experience'],
      image: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzL4AseRFcztDs3mM7aDc-Y0GOre4wu4KSxaFDllXAqoeL1e0YYe9qFAOfZImXr5qkFKHVQpLMBgCya3ia4j49QwGxTAC3qtjWiHDc6ljGnA7PEBCt8o9iqcF7fs7NiVG1Tg1lIqQ=s680-w680-h510-rw',
    },
  ];

  const getUserName = () => {
    if (user) {
      const capitalize = (str) =>
        str ? str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase() : '';

      const fullName = [
        capitalize(currentUser?.first_name),
        // capitalize(currentUser?.last_name)
      ].filter(Boolean).join(' ');

      if (user.is_priest) {
        return `Father ${fullName || ''}`.trim();
      }

      return fullName || 'Guest';
    }
    return 'Guest';
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => dayjs().add(i, 'day'));

  useEffect(() => {
    if (user && user.is_priest) {
      fetchPriestSchedule();

    } else {
      fetchEvents();
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      if (!currentUser || !currentUser.uid) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/getUnreadCount`, {
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
        setUnreadCount(data.unreadCount || 0);
      }

    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [currentUser?.uid]);

  useEffect(() => {
    const refreshTimer = setTimeout(() => {
      fetchUnreadCount();
    }, 1000);

    return () => clearTimeout(refreshTimer);
  }, [currentUser?.uid]);

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await axios.get(`${API_BASE_URL}/getAllEvents`);
      setEvents(res.data.events || []);

    } catch (err) {
      console.error("Error fetching events:", err);

    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchPriestSchedule = async () => {
    if (!user?.uid) return;

    try {
      setLoadingBookings(true);
      const response = await fetch(`${API_BASE_URL}/getPriestSchedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priest_id: user.uid }),
      });

      const data = await response.json();

      if (response.ok && data.bookings) {
        setBookings(data.bookings || []);

      } else {
        console.error('Error fetching priest schedule:', data.message);
        setBookings([]);
      }

    } catch (err) {
      console.error("Error fetching priest schedule:", err);
      setBookings([]);

    } finally {
      setLoadingBookings(false);
    }
  };

  const eventsForSelectedDate = events.filter(
    (event) => dayjs(event.date).format('YYYY-MM-DD') === selectedDate
  );

  const bookingsForSelectedDate = bookings
    .filter((booking) => {
      if (!booking.date) return false;
      const bookingDate = dayjs(booking.date).format('YYYY-MM-DD');
      return bookingDate === selectedDate;
    })
    .sort((a, b) => {
      if (user && user.is_priest) {
        const timeA = a.time ? (dayjs(a.time).isValid() ? dayjs(a.time) : null) : null;
        const timeB = b.time ? (dayjs(b.time).isValid() ? dayjs(b.time) : null) : null;

        if (timeA && timeB) {
          return timeA.valueOf() - timeB.valueOf();
        }

        if (timeA && !timeB) return -1;
        if (!timeA && timeB) return 1;
        return 0;
      }

      return 0;
    });

  const handleShortcutPress = (screen) => {
    if (onNavigate) {
      onNavigate(screen);
      if (screen === 'NotificationsScreen') {
        setTimeout(fetchUnreadCount, 500);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          {user && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Image
                  source={
                    user.profilePicture === 'female-avatar'
                      ? require('../assets/avatars/female-avatar.png')
                      : user.profilePicture === 'male-avatar'
                        ? require('../assets/avatars/male-avatar.png')
                        : user.profilePicture && user.profilePicture.startsWith('http')
                          ? { uri: user.profilePicture }
                          : require('../assets/defaultpfp.jpg')
                  }
                  style={{ width: 35, height: 35, borderRadius: 25, marginRight: 15 }}
                />
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.userName}>
                    Welcome, {getUserName()}!
                  </Text>
                  <Text style={styles.appName}>SagradaGo</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  handleShortcutPress('NotificationsScreen');
                  setTimeout(fetchUnreadCount, 500);
                }}
                style={{ padding: 8, position: 'relative' }}
              >
                <Ionicons name="notifications-outline" size={24} color="#424242" />
                <NotificationBadge count={unreadCount} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* PRIEST VIEW → CALENDAR */}
        {user && user.is_priest ? (
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={styles.title}>Your Schedule</Text>

            {/* Calendar Date Selector */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 15, gap: 10 }}
            >
              {last7Days.map((dateObj) => {
                const dateStr = dateObj.format('YYYY-MM-DD');
                const dayLabel = dateObj.format('ddd');
                const dateLabel = dateObj.format('DD');
                const isSelected = dateStr === selectedDate;

                return (
                  <TouchableOpacity
                    key={dateStr}
                    onPress={() => setSelectedDate(dateStr)}
                    style={[styles.dateButton, isSelected && styles.activeDateButton]}
                  >
                    <Text style={styles.dateButtonText}>{dayLabel}</Text>
                    <Text style={styles.dateButtonText}>{dateLabel}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <CustomCalendar
              selectedDate={selectedDate}
              onDateSelect={(date) => setSelectedDate(dayjs(date).format('YYYY-MM-DD'))}
              markedDates={bookings
                .filter((booking) => booking.date)
                .map((booking) => {
                  const date = dayjs(booking.date);
                  return date.isValid() ? date.toDate() : null;
                })
                .filter(Boolean)}
            />

            {/* Bookings for Selected Date */}
            {loadingBookings ? (
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#666', fontFamily: 'Poppins_500Medium' }}>
                Loading schedule...
              </Text>
            ) : bookingsForSelectedDate.length > 0 ? (
              bookingsForSelectedDate.map((booking) => (
                <TouchableOpacity
                  key={booking._id || booking.transaction_id}
                  style={[styles.eventCard, { marginBottom: 15 }]}
                >
                  <View style={{ padding: 15 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.eventTitle, { fontSize: 18, marginBottom: 5 }]}>{booking.sacrament || booking.type}</Text>
                        <Text style={styles.eventDate}>
                          {dayjs(booking.date).format('MMMM D, YYYY')} at {booking.time ? (dayjs(booking.time).isValid() ? dayjs(booking.time).format('h:mm A') : booking.time.toString()) : 'TBD'}
                        </Text>
                      </View>
                      <View style={{
                        backgroundColor: booking.status === 'confirmed' ? '#4CAF50' : '#FF9800',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 12,
                      }}>
                        <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'Poppins_600SemiBold', textTransform: 'capitalize' }}>
                          {booking.status}
                        </Text>
                      </View>
                    </View>

                    {booking.groom_name && booking.bride_name && (
                      <Text style={{ fontSize: 14, fontFamily: 'Poppins_400Regular', color: '#555' }}>
                        {booking.groom_name} & {booking.bride_name}
                      </Text>
                    )}
                    {(booking.full_name || booking.candidate_name || booking.deceased_name) && (
                      <Text style={{ fontSize: 14, fontFamily: 'Poppins_400Regular', color: '#555', marginBottom: 5, borderTopColor: '#eee', borderTopWidth: 1, paddingTop: 15 }}>
                        {booking.full_name || booking.candidate_name || booking.deceased_name}
                      </Text>
                    )}

                    {booking.attendees && (
                      <Text style={{ fontSize: 13, fontFamily: 'Poppins_400Regular', color: '#777' }}>
                        {booking.attendees} attendee{booking.attendees !== 1 ? 's' : ''}
                      </Text>
                    )}

                    {booking.contact_number && (
                      <Text style={{ fontSize: 13, fontFamily: 'Poppins_400Regular', color: '#777', marginTop: 3 }}>
                        Contact: {booking.contact_number}
                      </Text>
                    )}

                    {booking.transaction_id && (
                      <Text style={{ fontSize: 12, fontFamily: 'Poppins_400Regular', color: '#999', marginTop: 5 }}>
                        ID: {booking.transaction_id}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#666', fontFamily: 'Poppins_500Medium' }}>
                No bookings scheduled for this day.
              </Text>
            )}
          </View>
        ) : (
          // NON-PRIEST VIEW 
          <>
            <View style={styles.sectionSelector}>
              <TouchableOpacity
                style={[
                  styles.sectionButton,
                  selectedSection === 'Quick Access' && styles.activeSectionButton
                ]}
                onPress={() => setSelectedSection('Quick Access')}
              >
                <Ionicons
                  name="flash-outline"
                  size={20}
                  color={selectedSection === 'Quick Access' ? '#fff' : '#424242'}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[
                    styles.sectionButtonText,
                    selectedSection === 'Quick Access' && { color: '#fff' }
                  ]}
                >
                  Quick Access
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sectionButton,
                  selectedSection === 'Upcoming Events' && styles.activeSectionButton
                ]}
                onPress={() => setSelectedSection('Upcoming Events')}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={selectedSection === 'Upcoming Events' ? '#fff' : '#424242'}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[
                    styles.sectionButtonText,
                    selectedSection === 'Upcoming Events' && { color: '#fff' }
                  ]}
                >
                  Upcoming Events
                </Text>
              </TouchableOpacity>
            </View>

            {/* QUICK ACCESS */}
            {selectedSection === 'Quick Access' && (
              <View style={styles.shortcutsContainer}>
                <Text style={styles.title}>Popular Services</Text>
                <View style={styles.shortcutsColumn}>
                  {shortcuts.map((shortcut) => (
                    <TouchableOpacity
                      key={shortcut.id}
                      style={[styles.shortcutCard, { borderLeftColor: shortcut.color }]}
                      onPress={() => handleShortcutPress(shortcut.screen)}
                    >
                      <View style={styles.shortcutArrowContainer}>
                        <Ionicons
                          name="arrow-forward-outline"
                          size={20}
                          color="#444"
                          style={{ transform: [{ rotate: '-45deg' }] }}
                        />
                      </View>

                      {shortcut.image && (
                        <Image
                          source={{ uri: shortcut.image }}
                          style={{ width: '100%', height: 120, borderRadius: 10, marginBottom: 8 }}
                          resizeMode="cover"
                        />
                      )}

                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                        {shortcut.hints.map((hint, index) => (
                          <Text key={index} style={[styles.shortcutHint, { marginRight: 5, marginBottom: 5 }]}>
                            {hint}
                          </Text>
                        ))}
                      </View>
                      <Text style={styles.shortcutTitle}>{shortcut.title}</Text>
                      <Text style={styles.shortcutDescription}>{shortcut.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* UPCOMING EVENTS */}
            {selectedSection === 'Upcoming Events' && (
              <View>
                <Text style={[styles.title, { paddingLeft: 20 }]}>Upcoming Events</Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20, gap: 10, marginVertical: 10 }}
                >
                  {last7Days.map((dateObj) => {
                    const dateStr = dateObj.format('YYYY-MM-DD');
                    const dayLabel = dateObj.format('ddd');
                    const dateLabel = dateObj.format('DD');
                    const isSelected = dateStr === selectedDate;

                    return (
                      <TouchableOpacity
                        key={dateStr}
                        onPress={() => setSelectedDate(dateStr)}
                        style={[
                          styles.dateButton,
                          isSelected && styles.activeDateButton
                        ]}
                      >
                        <Text style={[styles.dateButtonText]}>
                          {dayLabel}
                        </Text>
                        <Text style={[styles.dateButtonText]}>
                          {dateLabel}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {eventsForSelectedDate.length > 0 ? (
                  eventsForSelectedDate.map((event) => (
                    <TouchableOpacity
                      key={event._id}
                      style={styles.eventCard}
                      onPress={() => onNavigate('EventsScreen', { eventId: event._id })}
                    >
                      <Image
                        source={{ uri: event.image || 'https://via.placeholder.com/400' }}
                        style={{ width: '100%', height: 130, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                        resizeMode="cover"
                      />
                      <View style={{ padding: 15 }}>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                        <Text style={styles.eventDate}>{dayjs(event.date).format('MMMM D, YYYY')}</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Poppins_400Regular', color: '#555' }}>
                          {event.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ textAlign: 'center', marginTop: 20, color: '#666', fontFamily: 'Poppins_500Medium' }}>
                    No events on this day.
                  </Text>
                )}
              </View>
            )}
          </>
        )}

      </ScrollView>

      <CustomNavbar currentScreen="HomePageScreen" onNavigate={onNavigate} />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => handleShortcutPress('ChatBotScreen')}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#424242" />
      </TouchableOpacity>

    </View>
  );
}
