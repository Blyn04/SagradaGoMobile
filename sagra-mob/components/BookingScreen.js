import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import styles from '../styles/BookingStyle';
import CustomNavbar from '../customs/CustomNavbar';

export default function BookingScreen({ user, onNavigate }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Booking</Text>
          <Text style={styles.subtitle}>Book your visit or reservation</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.contentText}>
            Booking functionality will be displayed here.
          </Text>
        </View>
      </ScrollView>

      <CustomNavbar
        currentScreen="BookingScreen"
        onNavigate={onNavigate}
      />
    </View>
  );
}

