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
  ActivityIndicator,
  Image
} from 'react-native';
import styles from '../styles/ProfileStyle';
import CustomNavbar from '../customs/CustomNavbar';
import CustomPicker from '../customs/CustomPicker';
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config/API';
import { Alert } from 'react-native';

export default function Profile({ user, onNavigate, onLogout, onBack, onSave }) {
  const { updateUser: updateUserProfile, user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showVolunteerLogModal, setShowVolunteerLogModal] = useState(false);
  const [alertModal, setAlertModal] = useState({ visible: false, title: '', message: '', type: 'error' });
  const [testingNotification, setTestingNotification] = useState(false);

  const currentUser = authUser || user;

  const showAlert = (title, message, type = 'error') => {
    setAlertModal({ visible: true, title, message, type });
  };

  const closeAlert = () => {
    setAlertModal({ visible: false, title: '', message: '', type: 'error' });
  };

  const testPushNotification = async () => {
    if (!currentUser?.uid) {
      Alert.alert('Error', 'User ID not found. Please login again.');
      return;
    }

    setTestingNotification(true);
    try {
      console.log('[TEST] Sending test notification to user:', currentUser.uid);
      
      const response = await fetch(`${API_BASE_URL}/test-fcm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        Alert.alert(
          '✅ Test Sent!',
          'Push notification sent! Check your phone notifications. If you don\'t see it, check:\n\n1. App is running (not force-closed)\n2. Notification permissions enabled\n3. Backend logs for errors',
          [{ text: 'OK' }]
        );
        console.log('[TEST] ✅ Notification sent successfully');
      } else {
        Alert.alert(
          '❌ Test Failed',
          data.message || 'Failed to send notification. Check backend logs.',
          [{ text: 'OK' }]
        );
        console.log('[TEST] ❌ Failed:', data.message);
      }
    } catch (error) {
      console.error('[TEST] Error:', error);
      Alert.alert(
        '❌ Error',
        `Failed to test notification: ${error.message}\n\nMake sure backend is running!`,
        [{ text: 'OK' }]
      );
    } finally {
      setTestingNotification(false);
    }
  };

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
    // gender: currentUser?.gender || "",
    // civil_status: currentUser?.civil_status || "",
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
        // gender: currentUser.gender || "",
        // civil_status: currentUser.civil_status || "",
        birthday: currentUser.birthday || "",
      });
    }
  }, [currentUser]);

  const validateField = (field, value) => {
    let error = '';

    switch (field) {
      case 'first_name':
        if (!value.trim()) {
          error = 'First name is required';

        } else if (!/^[a-zA-Z\s\-']+$/.test(value.trim())) {
          error = 'First name must contain only letters';

        } else if (value.trim().length < 2) {
          error = 'First name must be at least 2 characters';
        }
        break;

      case 'last_name':
        if (!value.trim()) {
          error = 'Last name is required';

        } else if (!/^[a-zA-Z\s\-']+$/.test(value.trim())) {
          error = 'Last name must contain only letters';

        } else if (value.trim().length < 2) {
          error = 'Last name must be at least 2 characters';
        }
        break;

      case 'middle_name':
        if (value.trim() && !/^[a-zA-Z\s\-']+$/.test(value.trim())) {
          error = 'Middle name must contain only letters';
        }
        break;

      case 'contact_number':
        if (!value.trim()) {
          error = 'Contact number is required';

        } else if (!/^[0-9]+$/.test(value)) {
          error = 'Contact number must contain only digits';

        } else if (value.length !== 11) {
          error = 'Contact number must be exactly 11 digits';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';

        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Please enter a valid email address';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleInputChange = (field, value) => {
    let filteredValue = value;

    if (field === 'first_name' || field === 'last_name' || field === 'middle_name') {
      filteredValue = value.replace(/[^a-zA-Z\s\-']/g, '');

    } else if (field === 'contact_number') {
      filteredValue = value.replace(/[^0-9]/g, '').slice(0, 11);
    }

    setFormData(prev => ({ ...prev, [field]: filteredValue }));

    if (touched[field] || errors[field]) {
      const error = validateField(field, filteredValue);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        first_name: currentUser.first_name || "",
        middle_name: currentUser.middle_name || "",
        last_name: currentUser.last_name || "",
        email: currentUser.email || "",
        contact_number: currentUser.contact_number || "",
        // gender: currentUser.gender || "",
        // civil_status: currentUser.civil_status || "",
        birthday: currentUser.birthday || "",
      });
    }

    setErrors({});
    setTouched({});
    setIsEditing(false);
  };

  const validateForm = () => {
    const fields = ['first_name', 'last_name', 'email', 'contact_number'];
    let hasErrors = false;
    const newErrors = {};
    const newTouched = {};

    fields.forEach(field => {
      newTouched[field] = true;
      const error = validateField(field, formData[field]);

      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    if (formData.middle_name && formData.middle_name.trim()) {
      const middleError = validateField('middle_name', formData.middle_name);

      if (middleError) {
        newErrors.middle_name = middleError;
        hasErrors = true;
      }
    }

    setTouched(newTouched);
    setErrors(newErrors);

    return !hasErrors;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showAlert("Validation Error", "Please fix the errors in the form.", 'error');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateUserProfile(formData);

      if (result.success) {
        showAlert("Success", result.message || "Profile updated successfully!", 'success');
        setIsEditing(false);

      } else {
        showAlert("Error", result.message || "Failed to update profile. Please try again.", 'error');
      }

    } catch (error) {
      console.error("Save error:", error);
      showAlert("Error", "An unexpected error occurred. Please try again.", 'error');

    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    return `${currentUser?.first_name?.charAt(0) || ''}${currentUser?.last_name?.charAt(0) || ''}`.toUpperCase();
  };

  const capitalize = (str) =>
    str ? str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase() : '';

  const fullName = [
    capitalize(currentUser?.first_name),
    capitalize(currentUser?.middle_name),
    capitalize(currentUser?.last_name)
  ].filter(Boolean).join(' ');

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
            {currentUser?.profilePicture ? (
              <Image
                source={
                  currentUser.profilePicture === 'female-avatar'
                    ? require('../assets/avatars/female-avatar.png')
                    : currentUser.profilePicture === 'male-avatar'
                      ? require('../assets/avatars/male-avatar.png')
                      : currentUser.profilePicture && currentUser.profilePicture.startsWith('http')
                        ? { uri: currentUser.profilePicture }
                        : require('../assets/defaultpfp.jpg')
                }
                style={{ width: 120, height: 120, borderRadius: 60 }}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.avatarText}>{getInitials()}</Text>
            )}
          </View>
        </View>

        <Text style={styles.title}>{fullName}</Text>
        <Text style={styles.subtitle}>{currentUser?.email || ""}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }, errors.first_name && styles.inputContainerError]}>
            <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              editable={isEditing}
              value={formData.first_name}
              onChangeText={(v) => handleInputChange("first_name", v)}
              onBlur={() => handleBlur("first_name")}
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginHorizontal: 5 }, errors.middle_name && styles.inputContainerError]}>
            <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Middle"
              editable={isEditing}
              value={formData.middle_name}
              onChangeText={(v) =>
                handleInputChange("middle_name", v.charAt(0).toUpperCase() + v.slice(1))
              }
              onBlur={() => handleBlur("middle_name")}
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }, errors.last_name && styles.inputContainerError]}>
            <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              editable={isEditing}
              value={formData.last_name}
              onChangeText={(v) =>
                handleInputChange("last_name", v.charAt(0).toUpperCase() + v.slice(1))
              }
              onBlur={() => handleBlur("last_name")}
            />
          </View>
        </View>

        {errors.first_name && <Text style={[styles.errorText, { marginLeft: 0 }]}>{errors.first_name}</Text>}
        {errors.middle_name && <Text style={[styles.errorText, { marginLeft: 0 }]}>{errors.middle_name}</Text>}
        {errors.last_name && <Text style={[styles.errorText, { marginLeft: 0 }]}>{errors.last_name}</Text>}

        <View style={[styles.inputContainer, errors.contact_number && styles.inputContainerError]}>
          <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            editable={isEditing}
            keyboardType="phone-pad"
            value={formData.contact_number}
            onChangeText={(v) => handleInputChange("contact_number", v)}
            onBlur={() => handleBlur("contact_number")}
          />
        </View>

        {errors.contact_number && <Text style={styles.errorText}>{errors.contact_number}</Text>}

        {/* <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15, marginBottom: -10 }}>
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
        </View> */}

        <View style={[styles.inputContainer, errors.email && styles.inputContainerError]}>
          <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            editable={isEditing}
            value={formData.email}
            onChangeText={(v) => handleInputChange("email", v)}
            onBlur={() => handleBlur("email")}
          />
        </View>

        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Test Push Notification Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#FFC942',
            padding: 15,
            borderRadius: 10,
            marginTop: 20,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={testPushNotification}
          disabled={testingNotification}
        >
          {testingNotification ? (
            <>
              <ActivityIndicator size="small" color="#424242" style={{ marginRight: 10 }} />
              <Text style={{ color: '#424242', fontWeight: 'bold', fontSize: 16 }}>
                Testing...
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="notifications-outline" size={20} color="#424242" style={{ marginRight: 8 }} />
              <Text style={{ color: '#424242', fontWeight: 'bold', fontSize: 16 }}>
                Test Push Notification
              </Text>
            </>
          )}
        </TouchableOpacity>

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

        {/* Booking History Button (HIDE IF PRIEST) */}
        {!currentUser?.is_priest && (
          <TouchableOpacity
            style={[styles.bookingHistoryButton, { marginTop: 20 }]}
            onPress={() => onNavigate && onNavigate('BookingHistoryScreen')}
          >
            <Ionicons name="time-outline" size={20} color="#424242" style={{ marginRight: 8 }} />
            <Text style={styles.bookingHistoryButtonText}>Booking History</Text>
            <Ionicons name="chevron-forward" size={20} color="#424242" />
          </TouchableOpacity>
        )}

        {/* Volunteer Log Button (HIDE IF PRIEST) */}
        {!currentUser?.is_priest && (
          <TouchableOpacity
            style={styles.bookingHistoryButton}
            onPress={() => setShowVolunteerLogModal(true)}
          >
            <Ionicons name="people-outline" size={20} color="#424242" style={{ marginRight: 8 }} />
            <Text style={styles.bookingHistoryButtonText}>Volunteer Log</Text>
            <Ionicons name="chevron-forward" size={20} color="#424242" />
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

      {/* Volunteer Log Modal */}
      <Modal
        visible={showVolunteerLogModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowVolunteerLogModal(false)}
      >
        <View style={styles.volunteerLogModalOverlay}>
          <View style={styles.volunteerLogModalContent}>
            <View style={styles.volunteerLogModalHeader}>
              <Text style={styles.volunteerLogModalTitle}>Volunteer Log</Text>
              <TouchableOpacity
                onPress={() => setShowVolunteerLogModal(false)}
                style={styles.volunteerLogModalCloseButton}
              >
                <Ionicons name="close" size={24} color="#424242" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.volunteerLogScrollView}>
              {currentUser?.volunteers && Array.isArray(currentUser.volunteers) && currentUser.volunteers.length > 0 ? (
                currentUser.volunteers.map((item, index) => {
                  const capitalize = (str) =>
                    str ? str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase() : '';

                  const currentFullName = [
                    capitalize(currentUser?.first_name),
                    capitalize(currentUser?.middle_name),
                    capitalize(currentUser?.last_name)
                  ].filter(Boolean).join(' ');

                  return (
                    <View key={item._id || item.id || index} style={styles.volunteerLogItem}>
                      <View style={styles.volunteerLogItemHeader}>
                        <Ionicons name="person-outline" size={20} color="#FFC942" style={{ marginRight: 8 }} />
                        <Text style={styles.volunteerLogItemName}>{currentFullName || item.name}</Text>
                      </View>
                      <Text style={styles.volunteerLogItemRole}>Role: {item.role}</Text>
                      {item.eventTitle && (
                        <Text style={styles.volunteerLogItemEvent}>Event: {item.eventTitle}</Text>
                      )}
                      <Text style={styles.volunteerLogItemContact}>Contact: {item.contact}</Text>
                      <Text style={styles.volunteerLogItemDate}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <View style={styles.volunteerLogEmptyContainer}>
                  <Ionicons name="people-outline" size={48} color="#ccc" style={{ marginBottom: 10 }} />
                  <Text style={styles.volunteerLogEmptyText}>No volunteer records yet.</Text>
                  <Text style={styles.volunteerLogEmptySubtext}>Start volunteering at events to see your log here!</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={alertModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAlert}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeAlert}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{alertModal.title}</Text>
            <Text style={styles.modalSubtitle}>{alertModal.message}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  alertModal.type === 'success'
                    ? styles.successButton
                    : styles.logoutConfirmButton
                ]}
                onPress={closeAlert}
              >
                <Text style={styles.logoutConfirmButtonText}>
                  {alertModal.type === 'success' ? 'OK' : 'Close'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

    </KeyboardAvoidingView>
  );
}
