import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../styles/NavbarStyle';
import { useAuth } from '../contexts/AuthContext';

export default function CustomNavbar({ currentScreen, onNavigate }) {
  const { user: authUser } = useAuth();
  const navItems = [
    { id: 'home', label: 'Home', screen: 'HomePageScreen', icon: 'home' },
    { id: 'events', label: 'Events', screen: 'EventsScreen', icon: 'calendar-month' },
    { 
      id: 'booking', 
      label: 'Booking', 
      screen: authUser?.is_priest ? 'BookingHistoryScreen' : 'BookingScreen', 
      icon: 'book-open-page-variant' 
    },
    { id: 'virtualtour', label: 'Virtual Tour', screen: 'VirtualTourScreen', icon: 'virtual-reality' },
    { id: 'profile', label: 'Profile', screen: 'ProfileScreen', icon: 'account-circle' },
  ];

  const liftAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(liftAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [currentScreen]);

  return (
    <View style={styles.navbar}>
      {navItems.map((item, index) => {
        const isActive = currentScreen === item.screen;

        const animatedStyle = {
          transform: [
            {
              translateY: isActive
                ? liftAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -2],
                })
                : 0,
            },
          ],
        };

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => onNavigate(item.screen)}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.iconWrapper,
                isActive && styles.navItemActive,
                animatedStyle,
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={isActive ? '#a8862fff' : '#666'}
              />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}