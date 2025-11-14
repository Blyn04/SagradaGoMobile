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
      date: 'Nov 20, 2025',
      description: 'Join us for a community cleanup event.',
    },
    {
      id: 'event2',
      title: 'Fundraising Gala',
      date: 'Dec 5, 2025',
      description: 'Attend our annual fundraising gala.',
    },
  ];

  const handleShortcutPress = (screen) => {
    if (onNavigate) onNavigate(screen);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          {user && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <Image
                source={user.profilePicture ? { uri: user.profilePicture } : require('../assets/defaultpfp.jpg')}
                style={{ width: 35, height: 35, borderRadius: 25, marginRight: 15 }}
              />
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.userName}>
                  Welcome back, {user.first_name}!
                </Text>
                <Text style={styles.appName}>SagradaGo</Text>
              </View>
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
          <View style={styles.shortcutsContainer}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            {upcomingEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{event.date}</Text>
                <Text style={styles.eventDescription}>{event.description}</Text>
              </View>
            ))}
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
