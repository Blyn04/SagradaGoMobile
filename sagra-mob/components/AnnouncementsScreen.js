import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import styles from '../styles/AnnouncementsStyle';
import CustomNavbar from '../customs/CustomNavbar';

export default function AnnouncementsScreen({ user, onNavigate }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Announcements</Text>
          <Text style={styles.subtitle}>Stay updated with our latest news</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.contentText}>
            Announcements will be displayed here.
          </Text>
        </View>
      </ScrollView>

      <CustomNavbar
        currentScreen="AnnouncementsScreen"
        onNavigate={onNavigate}
      />
    </View>
  );
}

