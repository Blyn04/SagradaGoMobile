import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import styles from '../../styles/users/BookingHistoryStyle';
import CustomNavbar from '../../customs/CustomNavbar';

export default function BookingHistoryScreen({ user, onNavigate }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigate && onNavigate('ProfileScreen')}
          >
            <Ionicons name="arrow-back" size={24} color="#424242" />
          </TouchableOpacity>
          <Text style={styles.title}>Booking History</Text>
          <Text style={styles.subtitle}>View your past and upcoming bookings</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.contentText}>
            Your booking history will be displayed here.
          </Text>
        </View>
      </ScrollView>

      <CustomNavbar
        currentScreen="BookingHistoryScreen"
        onNavigate={onNavigate}
      />
    </View>
  );
}

