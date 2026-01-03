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
import axios from 'axios';

export default function Profile({ user, onNavigate, onLogout, onBack, onSave }) {
  const { updateUser: updateUserProfile, user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showVolunteerLogModal, setShowVolunteerLogModal] = useState(false);
  const [volunteerRecords, setVolunteerRecords] = useState([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);
  const [activityFilter, setActivityFilter] = useState('all'); // 'all', 'event', 'activity'
  const [alertModal, setAlertModal] = useState({ visible: false, title: '', message: '', type: 'error' });

  const currentUser = authUser || user;

  const showAlert = (title, message, type = 'error') => {
    setAlertModal({ visible: true, title, message, type });
  };

  const closeAlert = () => {
    setAlertModal({ visible: false, title: '', message: '', type: 'error' });
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

  const fetchVolunteerRecords = async () => {
    if (!currentUser?.uid) return;
    
    try {
      setLoadingVolunteers(true);
      const response = await axios.post(`${API_BASE_URL}/getUserVolunteers`, {
        user_id: currentUser.uid,
      });
      const volunteers = response.data.volunteers || [];
   
      const volunteersWithEvents = await Promise.all(
        volunteers.map(async (volunteer) => {
          if (volunteer.event_id) {
            try {
              const eventResponse = await axios.get(`${API_BASE_URL}/getEvent/${volunteer.event_id}`);
              return {
                ...volunteer,
                event: eventResponse.data.event,
              };

            } catch (error) {
              console.error(`Error fetching event ${volunteer.event_id}:`, error);
              return volunteer;
            }
          }
          return volunteer;
        })
      );
      
      setVolunteerRecords(volunteersWithEvents);

    } catch (error) {
      console.error("Error fetching volunteer records:", error);

    } finally {
      setLoadingVolunteers(false);
    }
  };

  useEffect(() => {
    if (showVolunteerLogModal && currentUser?.uid) {
      fetchVolunteerRecords();
      setActivityFilter('all');
    }
  }, [showVolunteerLogModal, currentUser?.uid]);

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
          <Ionicons name="log-out" size={24} color="#424242" />
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
              placeholderTextColor="#999"
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
              placeholderTextColor="#999"
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
              placeholderTextColor="#999"
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
            placeholderTextColor="#999"
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
            placeholderTextColor="#999"
            autoCapitalize="none"
            editable={isEditing}
            value={formData.email}
            onChangeText={(v) => handleInputChange("email", v)}
            onBlur={() => handleBlur("email")}
          />
        </View>

        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

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

        {/* Activity Log Button (HIDE IF PRIEST) */}
        {!currentUser?.is_priest && (
          <TouchableOpacity
            style={styles.bookingHistoryButton}
            onPress={() => setShowVolunteerLogModal(true)}
          >
            <Ionicons name="people-outline" size={20} color="#424242" style={{ marginRight: 8 }} />
            <Text style={styles.bookingHistoryButtonText}>Activity Log</Text>
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
              <Text style={styles.volunteerLogModalTitle}>Activity Log</Text>
              <TouchableOpacity
                onPress={() => setShowVolunteerLogModal(false)}
                style={styles.volunteerLogModalCloseButton}
              >
                <Ionicons name="close" size={24} color="#424242" />
              </TouchableOpacity>
            </View>

            {/* Filter Buttons */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10, gap: 10 }}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activityFilter === 'all' && styles.filterButtonActive
                ]}
                onPress={() => setActivityFilter('all')}
              >
                <Text style={[
                  styles.filterButtonText,
                  activityFilter === 'all' && styles.filterButtonTextActive
                ]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activityFilter === 'event' && styles.filterButtonActive
                ]}
                onPress={() => setActivityFilter('event')}
              >
                <Text style={[
                  styles.filterButtonText,
                  activityFilter === 'event' && styles.filterButtonTextActive
                ]}>Events</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activityFilter === 'activity' && styles.filterButtonActive
                ]}
                onPress={() => setActivityFilter('activity')}
              >
                <Text style={[
                  styles.filterButtonText,
                  activityFilter === 'activity' && styles.filterButtonTextActive
                ]}>Activities</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.volunteerLogScrollView}>
              {loadingVolunteers ? (
                <View style={styles.volunteerLogEmptyContainer}>
                  <ActivityIndicator size="large" color="#FFC942" />
                  <Text style={styles.volunteerLogEmptyText}>Loading your events...</Text>
                </View>
              ) : (() => {
                // Filter records based on activityFilter
                const filteredRecords = volunteerRecords.filter(item => {
                  if (activityFilter === 'all') return true;
                  const event = item.event || {};
                  if (activityFilter === 'event') return event.type === 'event';
                  if (activityFilter === 'activity') return event.type === 'activity';
                  return true;
                });

                return filteredRecords.length > 0 ? (
                  filteredRecords.map((item, index) => {
                  const capitalize = (str) =>
                    str ? str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase() : '';

                  const currentFullName = [
                    capitalize(currentUser?.first_name),
                    capitalize(currentUser?.middle_name),
                    capitalize(currentUser?.last_name)
                  ].filter(Boolean).join(' ');

                  const event = item.event || {};
                  const eventDate = event.date ? new Date(event.date) : null;
                  const now = new Date();
                  now.setHours(0, 0, 0, 0);
                  const isPast = eventDate && eventDate < now;
                  const isToday = eventDate && eventDate.toDateString() === now.toDateString();
                  
                  let statusText = '';
                  let statusColor = '#666';
                  if (isPast) {
                    statusText = 'Finished';
                    statusColor = '#999';
                  } else if (isToday) {
                    statusText = 'Ongoing';
                    statusColor = '#4CAF50';
                  } else {
                    statusText = 'Registered';
                    statusColor = '#2196F3';
                  }

                  return (
                    <View key={item._id || item.id || index} style={styles.volunteerLogItem}>
                      <View style={styles.volunteerLogItemHeader}>
                        <Ionicons 
                          name={event.type === "activity" ? "hand-left-outline" : "calendar-outline"} 
                          size={20} 
                          color="#FFC942" 
                          style={{ marginRight: 8 }} 
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.volunteerLogItemName}>
                            {event.title || item.eventTitle || 'General Volunteer'}
                          </Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <View style={{ 
                              backgroundColor: statusColor + '20', 
                              paddingHorizontal: 8, 
                              paddingVertical: 2, 
                              borderRadius: 12 
                            }}>
                              <Text style={{ 
                                fontSize: 12, 
                                fontFamily: 'Poppins_600SemiBold', 
                                color: statusColor 
                              }}>
                                {statusText}
                              </Text>
                            </View>
                            {event.type && (
                              <View style={{ 
                                backgroundColor: event.type === "event" ? '#2196F320' : '#4CAF5020', 
                                paddingHorizontal: 8, 
                                paddingVertical: 2, 
                                borderRadius: 12,
                                marginLeft: 8
                              }}>
                                <Text style={{ 
                                  fontSize: 12, 
                                  fontFamily: 'Poppins_500Medium', 
                                  color: event.type === "event" ? '#2196F3' : '#4CAF50'
                                }}>
                                  {event.type === "event" ? "Event" : "Activity"}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                      
                      {eventDate && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                          <Ionicons name="calendar-outline" size={16} color="#666" style={{ marginRight: 6 }} />
                          <Text style={styles.volunteerLogItemEvent}>
                            {eventDate.toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </Text>
                        </View>
                      )}
                      
                      {event.location && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                          <Ionicons name="location-outline" size={16} color="#666" style={{ marginRight: 6 }} />
                          <Text style={styles.volunteerLogItemEvent}>{event.location}</Text>
                        </View>
                      )}
                      
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Ionicons name="person-outline" size={16} color="#666" style={{ marginRight: 6 }} />
                        <Text style={styles.volunteerLogItemContact}>{currentFullName || item.name}</Text>
                      </View>
                      
                      <Text style={styles.volunteerLogItemDate}>
                        Registered: {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
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
                    <Text style={styles.volunteerLogEmptyText}>
                      {activityFilter === 'all' 
                        ? 'No activity records yet.' 
                        : activityFilter === 'event'
                        ? 'No event registrations yet.'
                        : 'No activity registrations yet.'}
                    </Text>
                    <Text style={styles.volunteerLogEmptySubtext}>
                      {activityFilter === 'all'
                        ? 'Start volunteering at events to see your log here!'
                        : `Start ${activityFilter === 'event' ? 'registering for events' : 'volunteering for activities'} to see them here!`}
                    </Text>
                  </View>
                );
              })()}
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
