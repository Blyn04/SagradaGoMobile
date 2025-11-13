import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import styles from '../styles/SignUpStyle';

const API_BASE_URL = 'http://localhost:8080/api';

export default function SignUpScreen({ onSignUpSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    contact_number: '',
    civil_status: '',
    birthday: '',
    email: '',
    password: '',
    confirmPassword: '',
    uid: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateUID = () => {
    return 'UID' + Date.now() + Math.random().toString(36).substr(2, 9);
  };

  const validateForm = () => {
    const fields = [
      { key: 'first_name', label: 'First name' },
      { key: 'last_name', label: 'Last name' },
      { key: 'gender', label: 'Gender' },
      { key: 'contact_number', label: 'Contact number' },
      { key: 'birthday', label: 'Birthday' },
      { key: 'email', label: 'Email' },
      { key: 'password', label: 'Password' },
    ];

    for (let { key, label } of fields) {
      if (!formData[key]?.trim()) {
        Alert.alert('Error', `${label} is required`);
        return false;
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const uid = formData.uid || generateUID();
      const signUpData = {
        first_name: formData.first_name.trim(),
        middle_name: formData.middle_name.trim(),
        last_name: formData.last_name.trim(),
        gender: formData.gender.trim(),
        contact_number: formData.contact_number.trim(),
        civil_status: formData.civil_status.trim(),
        birthday: formData.birthday.trim(),
        email: formData.email.trim(),
        password: formData.password,
        uid: uid,
      };

      const response = await fetch(`${API_BASE_URL}/createUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message, [
          {
            text: 'OK',
            onPress: () => {
              if (onSignUpSuccess) onSignUpSuccess(data.newUser);
              if (onSwitchToLogin) onSwitchToLogin();
            },
          },
        ]);

      } else {
        Alert.alert('Sign Up Failed', data.message || 'Failed to create account. Please try again.');
      }
      
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');

    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign Up</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name *"
            placeholderTextColor="#999"
            value={formData.first_name}
            onChangeText={(value) => handleInputChange('first_name', value)}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Middle Name"
            placeholderTextColor="#999"
            value={formData.middle_name}
            onChangeText={(value) => handleInputChange('middle_name', value)}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name *"
            placeholderTextColor="#999"
            value={formData.last_name}
            onChangeText={(value) => handleInputChange('last_name', value)}
            editable={!loading}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Gender *</Text>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
              enabled={!loading}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Contact Number *"
            placeholderTextColor="#999"
            value={formData.contact_number}
            onChangeText={(value) => handleInputChange('contact_number', value)}
            keyboardType="phone-pad"
            editable={!loading}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Civil Status</Text>
            <Picker
              selectedValue={formData.civil_status}
              onValueChange={(value) => handleInputChange('civil_status', value)}
              enabled={!loading}
              style={styles.picker}
            >
              <Picker.Item label="Select Civil Status" value="" />
              <Picker.Item label="Single" value="Single" />
              <Picker.Item label="Married" value="Married" />
              <Picker.Item label="Widowed" value="Widowed" />
              <Picker.Item label="Divorced" value="Divorced" />
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Birthday * (YYYY-MM-DD)"
            placeholderTextColor="#999"
            value={formData.birthday}
            onChangeText={(value) => handleInputChange('birthday', value)}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Email *"
            placeholderTextColor="#999"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password *"
            placeholderTextColor="#999"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password *"
            placeholderTextColor="#999"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={onSwitchToLogin}
            disabled={loading}
          >
            <Text style={styles.switchText}>
              Already have an account? <Text style={styles.switchTextBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
