import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from 'react-native';
import styles from '../styles/ProfileStyle';
import CustomNavbar from '../customs/CustomNavbar';
import CustomPicker from '../customs/CustomPicker';
import { Ionicons } from "@expo/vector-icons";

export default function Profile({ user, onNavigate, onLogout, onBack, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    if (onLogout) onLogout();
  };

  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    middle_name: user.middle_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    contact_number: user.contact_number || "",
    gender: user.gender || "",
    civil_status: user.civil_status || "",
    birthday: user.birthday || "",
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getInitials = () => {
    return `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase();
  };

  const fullName = `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''}`;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topButtonsContainer}>
          {/* Booking Button */}
          <TouchableOpacity
            style={styles.circularButton}
          >
            <Ionicons name="calendar" size={24} color="#4242424" />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.circularButton}
            onPress={() => setShowLogoutModal(true)}
          >
            <Ionicons name="log-out" size={24} color="#4242424" />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
        </View>

        <Text style={styles.title}>{fullName}</Text>
        <Text style={styles.subtitle}>{user.email || ""}</Text>

        {/* Booking History Button */}
        <TouchableOpacity
          style={styles.bookingHistoryButton}
          onPress={() => onNavigate && onNavigate('BookingHistoryScreen')}
        >
          <Ionicons name="time-outline" size={20} color="#424242" style={{ marginRight: 8 }} />
          <Text style={styles.bookingHistoryButtonText}>Booking History</Text>
          <Ionicons name="chevron-forward" size={20} color="#424242" />
        </TouchableOpacity>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              editable={isEditing}
              value={formData.first_name}
              onChangeText={(v) => handleInputChange("first_name", v)}
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginHorizontal: 5 }]}>
            <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Middle"
              editable={isEditing}
              value={formData.middle_name}
              onChangeText={(v) => handleInputChange("middle_name", v)}
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
            <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              editable={isEditing}
              value={formData.last_name}
              onChangeText={(v) => handleInputChange("last_name", v)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            editable={isEditing}
            keyboardType="phone-pad"
            value={formData.contact_number}
            onChangeText={(v) => handleInputChange("contact_number", v)}
          />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15, marginBottom: -10 }}>
          <CustomPicker
            value={formData.gender}
            onValueChange={(v) => handleInputChange("gender", v)}
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" },
            ]}
            placeholder="Gender"
            style={{ flex: 1, marginRight: 10 }}
            disabled={!isEditing}
          />

          <CustomPicker
            value={formData.civil_status}
            onValueChange={(v) => handleInputChange("civil_status", v)}
            options={[
              { label: "Single", value: "Single" },
              { label: "Married", value: "Married" },
              { label: "Widowed", value: "Widowed" },
            ]}
            placeholder="Civil Status"
            style={{ flex: 1, marginLeft: 10 }}
            disabled={!isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            editable={isEditing}
            value={formData.email}
            onChangeText={(v) => handleInputChange("email", v)}
          />
        </View>

        {!isEditing ? (
          <TouchableOpacity
            style={styles.darkButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.darkButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.yellowButton}
            onPress={() => {
              // onSave(formData);
              setIsEditing(false);
            }}
          >
            <Text style={styles.yellowButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalSubtitle}>Are you sure you want to logout?</Text>

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
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}
