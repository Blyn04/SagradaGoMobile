import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Modal
} from 'react-native';
import styles from '../../styles/users/VolunteerStyle';
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '../../contexts/AuthContext';

export default function VolunteerScreen({ visible, onClose, event }) {
  const { user: authUser, addVolunteer, loading } = useAuth();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authUser) {
      const fullName = [
        authUser.first_name || '',
        authUser.middle_name || '',
        authUser.last_name || ''
      ].filter(Boolean).join(' ').trim();

      if (fullName) {
        setName(fullName);
      }

      if (authUser.contact_number) {
        setContact(authUser.contact_number);
      }
    }
  }, [authUser]);

  const handleSubmit = async () => {
    if (!name || !contact) {
      setErrorMessage('Please fill all required fields.');
      return;
    }

    if (isSubmitting || loading) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const newVolunteer = {
      name: name,
      contact: contact,
      eventTitle: event?.title || 'General Volunteer',
      eventId: event?._id || null,
      user_id: authUser?.id || authUser?._id,
    };

    const result = await addVolunteer(newVolunteer);

    if (result.success) {
      Alert.alert(
        'Success',
        `Thank you ${name}! You've signed up to volunteer${event?.title ? ` for ${event.title}` : ''}.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setErrorMessage('');

              if (authUser) {
                const fullName = [
                  authUser.first_name || '',
                  authUser.middle_name || '',
                  authUser.last_name || ''
                ].filter(Boolean).join(' ').trim();

                if (fullName) {
                  setName(fullName);
                }

                if (authUser.contact_number) {
                  setContact(authUser.contact_number);
                }
              }

              if (onClose) {
                onClose();
              }
            },
          },
        ]
      );

    } else {
      setErrorMessage(result.message || 'Failed to save volunteer information. Please try again.');
      Alert.alert('Error', result.message || 'Failed to save volunteer information. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Volunteer</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#424242" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Image
                source={require('../../assets/sagrada.png')}
                style={{ width: 80, height: 80, marginBottom: 10, alignSelf: 'center' }}
                resizeMode="contain"
              />
              {event && event.title ? (
                <>
                  <Text style={styles.subtitle}>Volunteering for: {event.title}</Text>
                  {event.date && (
                    <Text style={[styles.subtitle, { fontSize: 14, marginTop: 5, color: '#666' }]}>
                      {new Date(event.date).toDateString()}
                    </Text>
                  )}
                  {(event.time_start || event.time_end) && (
                    <Text style={[styles.subtitle, { fontSize: 14, marginTop: 2, color: '#666' }]}>
                      {event.time_start && event.time_end
                        ? `${event.time_start} - ${event.time_end}`
                        : event.time_start
                        ? `${event.time_start} -`
                        : `- ${event.time_end}`}
                    </Text>
                  )}
                  {event.location && (
                    <Text style={[styles.subtitle, { fontSize: 14, marginTop: 2, color: '#666' }]}>
                      📍 {event.location}
                    </Text>
                  )}
                </>
              ) : (
                <Text style={styles.subtitle}>Fill in all necessary information.</Text>
              )}
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#757575" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#757575" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contact"
                placeholderTextColor="#999"
                value={contact}
                onChangeText={setContact}
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, (isSubmitting || loading) && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={isSubmitting || loading}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting || loading ? 'Saving...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

