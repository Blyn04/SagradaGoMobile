import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import styles from '../../styles/users/EventsStyle';
import CustomNavbar from '../../customs/CustomNavbar';

export default function EventsScreen({ user, onNavigate }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Events</Text>
          <Text style={styles.subtitle}>Upcoming events and activities.</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.contentText}>
            Events will be displayed here.
          </Text>
        </View>
      </ScrollView>

      <CustomNavbar
        currentScreen="EventsScreen"
        onNavigate={onNavigate}
      />
    </View>
  );
}

