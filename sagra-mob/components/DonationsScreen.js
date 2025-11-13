import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import styles from '../styles/DonationsStyle';
import CustomNavbar from '../customs/CustomNavbar';

export default function DonationsScreen({ user, onNavigate }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Donations</Text>
          <Text style={styles.subtitle}>Make a donation to support our cause</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.contentText}>
            Donation content will be displayed here.
          </Text>
        </View>
      </ScrollView>

      <CustomNavbar
        currentScreen="DonationsScreen"
        onNavigate={onNavigate}
      />
    </View>
  );
}

