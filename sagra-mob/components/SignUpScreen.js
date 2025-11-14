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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (field, value) => {
    let error = '';

    switch (field) {
      case 'first_name':
        if (!value.trim()) {
          error = 'First name is required';

        } else if (value.trim().length < 2) {
          error = 'First name must be at least 2 characters';
        }
        break;

      case 'last_name':
        if (!value.trim()) {
          error = 'Last name is required';

        } else if (value.trim().length < 2) {
          error = 'Last name must be at least 2 characters';
        }
        break;
        
      case 'gender':
        if (!value.trim()) {
          error = 'Gender is required';
        }
        break;

      case 'contact_number':
        if (!value.trim()) {
          error = 'Contact number is required';
          
        } else if (!/^[0-9+\-\s()]+$/.test(value)) {
          error = 'Please enter a valid contact number';

        } else if (value.replace(/[^0-9]/g, '').length < 10) {
          error = 'Contact number must be at least 10 digits';
        }
        break;

      case 'birthday':
        if (!value.trim()) {
          error = 'Birthday is required';

        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          error = 'Please use format YYYY-MM-DD';

        } else {
          const date = new Date(value);
          const today = new Date();
          if (isNaN(date.getTime())) {
            error = 'Please enter a valid date';

          } else if (date > today) {
            error = 'Birthday cannot be in the future';
          }
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';

        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';

        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters long';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';

        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (touched[field] || errors[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const generateUID = () => {
    return 'UID' + Date.now() + Math.random().toString(36).substr(2, 9);
  };

  const validateForm = () => {
    const fields = ['first_name', 'last_name', 'gender', 'contact_number', 'birthday', 'email', 'password', 'confirmPassword'];
    let hasErrors = false;
    const newErrors = {};

    const newTouched = {};
    fields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    fields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (hasErrors) {
      Alert.alert('Error', 'Please fix the errors in the form');
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
            style={[styles.input, errors.first_name && styles.inputError]}
            placeholder="First Name *"
            placeholderTextColor="#999"
            value={formData.first_name}
            onChangeText={(value) => handleInputChange('first_name', value)}
            onBlur={() => handleBlur('first_name')}
            editable={!loading}
          />
          {errors.first_name && <Text style={styles.errorText}>{errors.first_name}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Middle Name"
            placeholderTextColor="#999"
            value={formData.middle_name}
            onChangeText={(value) => handleInputChange('middle_name', value)}
            editable={!loading}
          />

          <TextInput
            style={[styles.input, errors.last_name && styles.inputError]}
            placeholder="Last Name *"
            placeholderTextColor="#999"
            value={formData.last_name}
            onChangeText={(value) => handleInputChange('last_name', value)}
            onBlur={() => handleBlur('last_name')}
            editable={!loading}
          />
          {errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Gender *</Text>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(value) => {
                handleInputChange('gender', value);
                setTouched(prev => ({ ...prev, gender: true }));
              }}
              enabled={!loading}
              style={[styles.picker, errors.gender && styles.pickerError]}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

          <TextInput
            style={[styles.input, errors.contact_number && styles.inputError]}
            placeholder="Contact Number *"
            placeholderTextColor="#999"
            value={formData.contact_number}
            onChangeText={(value) => handleInputChange('contact_number', value)}
            onBlur={() => handleBlur('contact_number')}
            keyboardType="phone-pad"
            editable={!loading}
          />
          {errors.contact_number && <Text style={styles.errorText}>{errors.contact_number}</Text>}

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
            style={[styles.input, errors.birthday && styles.inputError]}
            placeholder="Birthday * (YYYY-MM-DD)"
            placeholderTextColor="#999"
            value={formData.birthday}
            onChangeText={(value) => handleInputChange('birthday', value)}
            onBlur={() => handleBlur('birthday')}
            editable={!loading}
          />
          {errors.birthday && <Text style={styles.errorText}>{errors.birthday}</Text>}

          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email *"
            placeholderTextColor="#999"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            onBlur={() => handleBlur('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Password *"
            placeholderTextColor="#999"
            value={formData.password}
            onChangeText={(value) => {
              setFormData(prev => {
                const newData = { ...prev, password: value };

                if (touched.confirmPassword || errors.confirmPassword) {
                  let confirmError = '';
                  if (!newData.confirmPassword) {
                    confirmError = 'Please confirm your password';

                  } else if (value !== newData.confirmPassword) {
                    confirmError = 'Passwords do not match';
                  }
                  
                  setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
                }
                return newData;
              });

              if (touched.password || errors.password) {
                const error = validateField('password', value);
                setErrors(prev => ({ ...prev, password: error }));
              }
            }}
            onBlur={() => handleBlur('password')}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            placeholder="Confirm Password *"
            placeholderTextColor="#999"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            onBlur={() => handleBlur('confirmPassword')}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

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
