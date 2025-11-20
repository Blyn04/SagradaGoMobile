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
  Image
} from 'react-native';
import styles from '../../styles/users/VolunteerStyle';
import CustomNavbar from '../../customs/CustomNavbar';
import CustomPicker from '../../customs/CustomPicker';
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '../../contexts/AuthContext';

const volunteerRoles = [
  { label: 'Choir Member', value: 'Choir Member' },
  { label: 'Usher', value: 'Usher' },
  { label: 'Catechist', value: 'Catechist' },
  { label: 'Tech Team', value: 'Tech Team' },
  { label: 'Others', value: 'Others' },
];

export default function VolunteerScreen({ user, onNavigate, event }) {
  const { user: authUser, addVolunteer, loading } = useAuth();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [volunteerLog, setVolunteerLog] = useState([]);
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

      if (authUser.volunteers && Array.isArray(authUser.volunteers)) {
        setVolunteerLog(authUser.volunteers);
      }
    }
  }, [authUser]);

  const handleSubmit = async () => {
    if (!name || !contact || !role) {
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
      role: role,
      eventTitle: event?.title || 'General Volunteer',
      eventId: event?.id || null,
    };

    const result = await addVolunteer(newVolunteer);

    if (result.success) {
      if (result.user && result.user.volunteers) {
        setVolunteerLog(result.user.volunteers);

      } else {
        setVolunteerLog([newVolunteer, ...volunteerLog]);
      }

      Alert.alert(
        'Success',
        `Thank you ${name}! You've signed up as ${role}${event?.title ? ` for ${event.title}` : ''}.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setRole('');
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => onNavigate('EventsScreen')}
      >
        <Ionicons name="arrow-back-circle-outline" size={32} color="#424242" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/sagrada.png')}
            style={{ width: 100, height: 100, marginBottom: 10, alignSelf: 'center' }}
            resizeMode="contain"
          />
          <Text style={styles.title}>Volunteer</Text>
          {event && event.title ? (
            <Text style={styles.subtitle}>Volunteering for: {event.title}</Text>
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
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#757575" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contact"
            value={contact}
            onChangeText={setContact}
            keyboardType="phone-pad"
          />
        </View>

        <CustomPicker
          value={role}
          onValueChange={setRole}
          options={volunteerRoles}
          placeholder="Role"
        />

        <TouchableOpacity 
          style={[styles.submitButton, (isSubmitting || loading) && { opacity: 0.6 }]} 
          onPress={handleSubmit}
          disabled={isSubmitting || loading}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting || loading ? 'Saving...' : 'Submit'}
          </Text>
        </TouchableOpacity>

        <View style={styles.logContainer}>
          <Text style={styles.logTitle}>Volunteer Log</Text>
          {volunteerLog.length === 0 ? (
            <Text style={styles.emptyText}>No volunteer records yet.</Text>
          ) : (
            volunteerLog.map((item, index) => (
              <View key={item._id || item.id || index} style={styles.logItem}>
                <Text style={styles.logText}>{item.name} - {item.role}</Text>
                {item.eventTitle && (
                  <Text style={styles.logText}>Event: {item.eventTitle}</Text>
                )}
                <Text style={styles.logText}>{item.contact}</Text>
                <Text style={styles.logDate}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <CustomNavbar
        currentScreen="VolunteerScreen"
        onNavigate={onNavigate}
      />
    </KeyboardAvoidingView>
  );
}

