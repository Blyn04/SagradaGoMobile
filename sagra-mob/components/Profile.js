import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styles from '../styles/ProfileStyle';
import CustomNavbar from '../customs/CustomNavbar';

export default function Profile({ user, onNavigate, onLogout }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
  };
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
          onPress={() => setShowLogoutModal(true)}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomNavbar
        currentScreen="ProfileScreen"
        onNavigate={onNavigate}
      />

      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLogoutModal(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlayInner}
          >
            <View
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}
            >
              <Text style={styles.modalTitle}>Confirm Logout</Text>
              <Text style={styles.modalSubtitle}>
                Are you sure you want to logout?
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowLogoutModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.logoutConfirmButton]}
                  onPress={handleLogoutConfirm}
                >
                  <Text style={styles.logoutConfirmButtonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

