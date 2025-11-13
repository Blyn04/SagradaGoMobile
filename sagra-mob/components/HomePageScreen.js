import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import styles from '../styles/HomePageStyle';
import CustomNavbar from '../customs/CustomNavbar';

export default function HomePageScreen({ user, onLogout, onNavigate }) {
  const shortcuts = [
    {
      id: 'donation',
      title: 'Donation',
      description: 'Make a donation',
      screen: 'DonationsScreen',
      color: '#FF6B6B',
    },
    {
      id: 'announcement',
      title: 'Announcement',
      description: 'View announcements',
      screen: 'AnnouncementsScreen',
      color: '#4ECDC4',
    },
    {
      id: 'virtualtour',
      title: 'Virtual Tour',
      description: 'Explore virtually',
      screen: 'VirtualTourScreen',
      color: '#95E1D3',
    },
  ];

  const handleShortcutPress = (screen) => {
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome!</Text>
          {user && (
            <Text style={styles.userName}>
              {user.first_name} {user.last_name}
            </Text>
          )}
        </View>

        <View style={styles.shortcutsContainer}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.shortcutsGrid}>
            {shortcuts.map((shortcut) => (
              <TouchableOpacity
                key={shortcut.id}
                style={[styles.shortcutCard, { borderLeftColor: shortcut.color }]}
                onPress={() => handleShortcutPress(shortcut.screen)}
              >
                <View style={[styles.shortcutIcon, { backgroundColor: shortcut.color }]}>
                  <Text style={styles.shortcutIconText}>
                    {shortcut.title.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.shortcutTitle}>{shortcut.title}</Text>
                <Text style={styles.shortcutDescription}>{shortcut.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <CustomNavbar
        currentScreen="HomePageScreen"
        onNavigate={onNavigate}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => handleShortcutPress('ChatBotScreen')}
      >
        <Text style={styles.floatingButtonText}>💬</Text>
      </TouchableOpacity>
    </View>
  );
}

