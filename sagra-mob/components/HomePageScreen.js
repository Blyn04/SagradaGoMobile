import React, { useState } from 'react';
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

export default function HomePageScreen({ user, onLogout, onNavigate }) {
  const [selectedSection, setSelectedSection] = useState('Quick Access');

  const shortcuts = [
    {
      id: 'donation',
      title: 'Donation',
      description: 'Make a donation',
      screen: 'DonationsScreen',
      color: '#FFC942',
      hints: ['Help a family', 'Support a cause'],
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=80&q=80',
    },
    {
      id: 'announcement',
      title: 'Announcement',
      description: 'View announcements',
      screen: 'AnnouncementsScreen',
      color: '#d89d09ff',
      hints: ['News & Updates', 'Community Alerts'],
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=80&q=80',
    },
    {
      id: 'virtualtour',
      title: 'Virtual Tour',
      description: 'Explore virtually',
      screen: 'VirtualTourScreen',
      color: '#705104ff',
      hints: ['Explore Locations', '360° Experience'],
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=80&q=80',
    },
  ];

  const upcomingEvents = [
    {
      id: 'event1',
      title: 'Community Cleanup',
      date: dayjs().add(1, 'day').format('YYYY-MM-DD'), // dummy for layout event card
      description: 'Join us for a community cleanup event.',
    },
  ];

  const handleShortcutPress = (screen) => {
    if (onNavigate) onNavigate(screen);
  };

  const last7Days = Array.from({ length: 7 }, (_, i) =>
    dayjs().add(i, 'day')
  );

  const [selectedDate, setSelectedDate] = useState(last7Days[0].format('YYYY-MM-DD'));

  const eventsForSelectedDate = upcomingEvents.filter(
    (event) => dayjs(event.date).format('YYYY-MM-DD') === selectedDate
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

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
                    Welcome back, {user.first_name}!
                  </Text>
                  <Text style={styles.appName}>SagradaGo</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleShortcutPress('NotificationsScreen')}
                style={{ padding: 8 }}
              >
                <Ionicons name="notifications-outline" size={24} color="#424242" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, marginBottom: 20, gap: 10 }}
        >
          <TouchableOpacity
            style={[styles.sectionButton, selectedSection === 'Quick Access' && styles.activeSectionButton]}
            onPress={() => setSelectedSection('Quick Access')}
          >
            <Ionicons
              name="flash-outline"
              size={20}
              color={selectedSection === 'Quick Access' ? '#fff' : '#424242'}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.sectionButtonText, selectedSection === 'Quick Access' && { color: '#fff' }]}>
              Quick Access
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sectionButton, selectedSection === 'Upcoming Events' && styles.activeSectionButton]}
            onPress={() => setSelectedSection('Upcoming Events')}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={selectedSection === 'Upcoming Events' ? '#fff' : '#424242'}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.sectionButtonText, selectedSection === 'Upcoming Events' && { color: '#fff' }]}>
              Upcoming Events
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sectionButton, selectedSection === 'Emerlyn' && styles.activeSectionButton]}
            onPress={() => setSelectedSection('Upcoming Events')}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={selectedSection === 'Emerlyn' ? '#fff' : '#424242'}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.sectionButtonText, selectedSection === 'Emerlyn' && { color: '#fff' }]}>
              Emerlyn
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {selectedSection === 'Quick Access' && (
          <View style={styles.shortcutsContainer}>
            <Text style={styles.title}>Explore our Services</Text>
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
                      style={{ width: '100%', height: 100, borderRadius: 10, marginBottom: 8 }}
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
                <View key={event.id} style={styles.eventCard}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80' }}
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
                </View>
              ))
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#666', fontFamily: 'Poppins_500Medium' }}>
                No events on this day.
              </Text>
            )}
          </View>
        )}

      </ScrollView>

      <CustomNavbar
        currentScreen="HomePageScreen"
        onNavigate={onNavigate}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => handleShortcutPress('ChatBotScreen')}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#424242" />
      </TouchableOpacity>

    </View>
  );
}
