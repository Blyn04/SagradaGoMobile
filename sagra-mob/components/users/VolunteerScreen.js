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

export default function VolunteerScreen({ user, onNavigate }) {
  const { user: authUser } = useAuth();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [volunteerLog, setVolunteerLog] = useState([]);

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

  const handleSubmit = () => {
    if (!name || !contact || !role) {
      setErrorMessage('Please fill all required fields.');
      return;
    }

    const newVolunteer = {
      id: Date.now().toString(),
      name: name,
      contact: contact,
      role: role,
      date: new Date().toLocaleDateString(),
    };

    setVolunteerLog([newVolunteer, ...volunteerLog]);

    Alert.alert(
      'Success',
      `Thank you ${name}! You've signed up as ${role}.`,
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
          <Text style={styles.subtitle}>Fill in all necessary information.</Text>
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

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <View style={styles.logContainer}>
          <Text style={styles.logTitle}>Volunteer Log</Text>
          {volunteerLog.length === 0 ? (
            <Text style={styles.emptyText}>No volunteer records yet.</Text>
          ) : (
            volunteerLog.map((item) => (
              <View key={item.id} style={styles.logItem}>
                <Text style={styles.logText}>{item.name} - {item.role}</Text>
                <Text style={styles.logText}>{item.contact}</Text>
                <Text style={styles.logDate}>{item.date}</Text>
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

