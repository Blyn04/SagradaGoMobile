import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/NavbarStyle';

export default function CustomNavbar({ currentScreen, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Home', screen: 'HomePageScreen', icon: 'home' },
    { id: 'events', label: 'Events', screen: 'EventsScreen', icon: 'calendar' },
    { id: 'booking', label: 'Booking', screen: 'BookingScreen', icon: 'book' },
    { id: 'virtualtour', label: 'Virtual Tour', screen: 'VirtualTourScreen', icon: 'globe' },
    { id: 'profile', label: 'Profile', screen: 'ProfileScreen', icon: 'person' },
  ];

  return (
    <View style={styles.navbar}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.navItem,
            currentScreen === item.screen && styles.navItemActive
          ]}
          onPress={() => onNavigate(item.screen)}
        >
          <Ionicons
            name={currentScreen === item.screen ? item.icon : `${item.icon}-outline`}
            size={24}
            color={currentScreen === item.screen ? '#007AFF' : '#666'}
          />
          <Text
            style={[
              styles.navText,
              currentScreen === item.screen && styles.navTextActive
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

