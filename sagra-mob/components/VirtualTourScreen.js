import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import styles from '../styles/VirtualTourStyle';
import CustomNavbar from '../customs/CustomNavbar';

export default function VirtualTourScreen({ user, onNavigate }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Virtual Tour</Text>
          <Text style={styles.subtitle}>Explore our virtual experience</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.contentText}>
            Virtual tour content will be displayed here.
          </Text>
        </View>
      </ScrollView>

      <CustomNavbar
        currentScreen="VirtualTourScreen"
        onNavigate={onNavigate}
      />
    </View>
  );
}

