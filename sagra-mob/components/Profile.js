import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import styles from '../styles/ProfileStyle';
import CustomNavbar from './CustomNavbar';

export default function Profile({ user, onNavigate, onLogout }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.first_name?.charAt(0) || 'U'}
                {user?.last_name?.charAt(0) || ''}
              </Text>
            </View>
          </View>

          {user && (
            <>
              <Text style={styles.name}>
                {user.first_name} {user.middle_name} {user.last_name}
              </Text>
              {user.email && (
                <Text style={styles.email}>{user.email}</Text>
              )}
              {user.contact_number && (
                <Text style={styles.contact}>Contact: {user.contact_number}</Text>
              )}
              {user.gender && (
                <Text style={styles.info}>Gender: {user.gender}</Text>
              )}
              {user.birthday && (
                <Text style={styles.info}>Birthday: {user.birthday}</Text>
              )}
              {user.civil_status && (
                <Text style={styles.info}>Civil Status: {user.civil_status}</Text>
              )}
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomNavbar
        currentScreen="ProfileScreen"
        onNavigate={onNavigate}
      />
    </View>
  );
}

