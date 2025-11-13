import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import styles from '../styles/NavbarStyle';

export default function CustomNavbar({ currentScreen, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Home', screen: 'HomePageScreen' },
    { id: 'donation', label: 'Donation', screen: 'DonationsScreen' },
    { id: 'virtualtour', label: 'Virtual Tour', screen: 'VirtualTourScreen' },
    { id: 'profile', label: 'Profile', screen: 'ProfileScreen' },
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

