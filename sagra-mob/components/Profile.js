import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import styles from '../styles/ProfileStyle';
import CustomNavbar from '../customs/CustomNavbar';
import CustomPicker from '../customs/CustomPicker';
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '../contexts/AuthContext';

export default function Profile({ user, onNavigate, onLogout, onBack, onSave }) {
  const { updateUser: updateUserProfile, user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentUser = authUser || user;

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    if (onLogout) onLogout();
  };

  const [formData, setFormData] = useState({
    first_name: currentUser?.first_name || "",
    middle_name: currentUser?.middle_name || "",
    last_name: currentUser?.last_name || "",
    email: currentUser?.email || "",
    contact_number: currentUser?.contact_number || "",
    gender: currentUser?.gender || "",
    civil_status: currentUser?.civil_status || "",
    birthday: currentUser?.birthday || "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        first_name: currentUser.first_name || "",
        middle_name: currentUser.middle_name || "",
        last_name: currentUser.last_name || "",
        email: currentUser.email || "",
        contact_number: currentUser.contact_number || "",
        gender: currentUser.gender || "",
        civil_status: currentUser.civil_status || "",
        birthday: currentUser.birthday || "",
      });
    }
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        first_name: currentUser.first_name || "",
        middle_name: currentUser.middle_name || "",
        last_name: currentUser.last_name || "",
        email: currentUser.email || "",
        contact_number: currentUser.contact_number || "",
        gender: currentUser.gender || "",
        civil_status: currentUser.civil_status || "",
        birthday: currentUser.birthday || "",
      });
    }

    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.contact_number) {
      Alert.alert("Validation Error", "Please fill in all required fields (First Name, Last Name, Email, Contact Number).");
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateUserProfile(formData);
      
      if (result.success) {
        Alert.alert("Success", result.message || "Profile updated successfully!");
        setIsEditing(false);

      } else {
        Alert.alert("Error", result.message || "Failed to update profile. Please try again.");
      }

    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    return `${currentUser?.first_name?.charAt(0) || ''}${currentUser?.last_name?.charAt(0) || ''}`.toUpperCase();
  };

  const fullName = `${currentUser?.first_name || ''} ${currentUser?.middle_name || ''} ${currentUser?.last_name || ''}`;

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
        <TouchableOpacity
          style={styles.circularButton}
          onPress={() => setShowLogoutModal(true)}
        >
          <Ionicons name="log-out" size={24} color="#4242424" />
        </TouchableOpacity>

        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
        </View>

        <Text style={styles.title}>{fullName}</Text>
        <Text style={styles.subtitle}>{currentUser?.email || ""}</Text>

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
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              style={[styles.darkButton, { flex: 1 }]}
              onPress={handleCancel}
              disabled={isSaving}
            >
              <Text style={styles.darkButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.yellowButton, { flex: 1 }, isSaving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#424242" />
              ) : (
                <Text style={styles.yellowButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
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
