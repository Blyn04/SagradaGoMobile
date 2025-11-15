import React, { useState, useEffect } from 'react';
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
  Modal,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/SignUpStyle';
import { Ionicons } from "@expo/vector-icons";
import CustomPicker from '../customs/CustomPicker';
import { auth } from '../config/FireBaseConfig';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  deleteUser,
} from "firebase/auth";
import { API_BASE_URL } from '../config/API';

export default function SignUpScreen({ onSignUpSuccess, onSwitchToLogin, onBack }) {
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

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

  const formatDate = (year, month, day) => {
    const monthStr = String(month).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 1900; i--) {
      years.push(i);
    }
    return years;
  };

  const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const generateDays = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  useEffect(() => {
    if (formData.birthday) {
      const date = new Date(formData.birthday);
      if (!isNaN(date.getTime())) {
        setSelectedYear(date.getFullYear());
        setSelectedMonth(date.getMonth() + 1);
        setSelectedDay(date.getDate());
      }
    }
  }, [formData.birthday]);

  useEffect(() => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedYear, selectedMonth]);

  const handleDateConfirm = () => {
    const formattedDate = formatDate(selectedYear, selectedMonth, selectedDay);
    handleInputChange('birthday', formattedDate);
    setTouched(prev => ({ ...prev, birthday: true }));
    setShowDatePicker(false);
  };

  const openDatePicker = () => {
    if (!loading) {
      if (formData.birthday) {
        const date = new Date(formData.birthday);
        if (!isNaN(date.getTime())) {
          setSelectedYear(date.getFullYear());
          setSelectedMonth(date.getMonth() + 1);
          setSelectedDay(date.getDate());
        }
      }

      setShowDatePicker(true);
      setTouched(prev => ({ ...prev, birthday: true }));
    }
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
    try {
      if (!formData.email || !formData.password || !formData.first_name || !formData.last_name) {
        Alert.alert('Error', 'Please fill out all required fields.');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match!');
        return;
      }

      if (!validateForm()) return;

      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );

      const user = userCredential.user;
      const uid = user.uid;

      await sendEmailVerification(user);

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
        uid: uid
      };

      let response;
      let data;
      
      console.log('Attempting to create user in MongoDB via:', `${API_BASE_URL}/createUser`);
      
      try {
        response = await fetch(`${API_BASE_URL}/createUser`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signUpData),
        });

        console.log('API Response status:', response.status);

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
          console.log('API Response data:', data);

        } else {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          data = { message: 'Server returned an invalid response' };
        }

      } catch (fetchError) {
        console.error('API Network Error:', fetchError);

        try {
          await deleteUser(user);
          console.log('Firebase user rolled back due to network error');
          
        } catch (deleteError) {
          console.error('Error deleting Firebase user:', deleteError);
        }

        Alert.alert(
          'Network Error', 
          'Failed to connect to server. Please check your internet connection and try again. Your account was not created.'
        );

        return;
      }

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully! Please verify your email.');
        if (onSwitchToLogin) onSwitchToLogin();

      } else {
        console.error('MongoDB creation failed:', data.message);

        try {
          await deleteUser(user);
          console.log('Firebase user rolled back due to MongoDB failure');

        } catch (deleteError) {
          console.error('Error deleting Firebase user:', deleteError);
        }
        
        Alert.alert(
          'Error', 
          data.message || 'Failed to create account in database. Please try again.'
        );
      }

    } catch (error) {
      console.error('Signup Error:', error.message);
      Alert.alert('Error', error.message || 'Network error. Please check your connection and try again.');
      
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Image
            source={require('../assets/sagrada.png')}
            style={{ width: 100, height: 100, marginBottom: 10, marginTop: 40, alignSelf: 'center' }}
            resizeMode="contain"
          />
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Create a new account</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* FIRST NAME */}
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }, errors.first_name && styles.inputContainerError]}>
              <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="First Name *"
                placeholderTextColor="#999"
                value={formData.first_name}
                onChangeText={(value) => handleInputChange('first_name', value)}
                onBlur={() => handleBlur('first_name')}
                editable={!loading}
              />
            </View>

            {/* LAST NAME */}
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }, errors.last_name && styles.inputContainerError]}>
              <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Last Name *"
                placeholderTextColor="#999"
                value={formData.last_name}
                onChangeText={(value) => handleInputChange('last_name', value)}
                onBlur={() => handleBlur('last_name')}
                editable={!loading}
              />
            </View>
          </View>

          {errors.first_name && <Text style={[styles.errorText, { marginLeft: 0 }]}>{errors.first_name}</Text>}
          {errors.last_name && <Text style={[styles.errorText, { marginLeft: 0 }]}>{errors.last_name}</Text>}

          <View style={[styles.inputContainer, errors.contact_number && styles.inputContainerError]}>
            <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />

            <TextInput
              style={styles.input}
              placeholder="Contact Number *"
              placeholderTextColor="#999"
              value={formData.contact_number}
              onChangeText={(value) => handleInputChange('contact_number', value)}
              onBlur={() => handleBlur('contact_number')}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>
          {errors.contact_number && <Text style={styles.errorText}>{errors.contact_number}</Text>}

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <CustomPicker
              value={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
              options={[
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
                { label: 'Other', value: 'Other' },
              ]}
              iconName="male-outline"
              error={errors.gender}
              placeholder="Gender"
              style={{ flex: 1, marginRight: 10 }}
            />

            <CustomPicker
              value={formData.civil_status}
              onValueChange={(value) => handleInputChange('civil_status', value)}
              options={[
                { label: 'Single', value: 'Single' },
                { label: 'Married', value: 'Married' },
                { label: 'Widowed', value: 'Widowed' },
                { label: 'Divorced', value: 'Divorced' },
              ]}
              iconName="business-outline"
              error={errors.civil_status}
              placeholder="Civil Status"
              style={{ flex: 1, marginLeft: 10 }}
            />
          </View>

          <TouchableOpacity
            onPress={openDatePicker}
            disabled={loading}
            style={[
              styles.datePickerButton,
              errors.birthday && styles.inputContainerError,
              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
            ]}
          >
            <Text
              style={[
                styles.datePickerText,
                !formData.birthday && styles.datePickerPlaceholder,
                { flex: 1, fontFamily: 'Poppins_500Medium', textAlignVertical: 'center' },
              ]}
            >
              {formData.birthday || 'Birthday * (Tap to select)'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#999" />
          </TouchableOpacity>
          {errors.birthday && <Text style={styles.errorText}>{errors.birthday}</Text>}

          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Birthday</Text>

                <View style={styles.datePickerContainer}>
                  <View style={styles.pickerColumn}>
                    <Text style={styles.pickerLabel}>Year</Text>
                    <Picker
                      selectedValue={selectedYear}
                      onValueChange={(itemValue) => setSelectedYear(itemValue)}
                      style={styles.datePicker}
                    >
                      {generateYears().map(year => (
                        <Picker.Item key={year} label={String(year)} value={year} />
                      ))}
                    </Picker>
                  </View>

                  <View style={styles.pickerColumn}>
                    <Text style={styles.pickerLabel}>Month</Text>
                    <Picker
                      selectedValue={selectedMonth}
                      onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                      style={styles.datePicker}
                    >
                      {generateMonths().map(month => (
                        <Picker.Item
                          key={month}
                          label={new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                          value={month}
                        />
                      ))}
                    </Picker>
                  </View>

                  <View style={styles.pickerColumn}>
                    <Text style={styles.pickerLabel}>Day</Text>
                    <Picker
                      selectedValue={selectedDay}
                      onValueChange={(itemValue) => setSelectedDay(itemValue)}
                      style={styles.datePicker}
                    >
                      {generateDays(selectedYear, selectedMonth).map(day => (
                        <Picker.Item key={day} label={String(day)} value={day} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonConfirm]}
                    onPress={handleDateConfirm}
                  >
                    <Text style={styles.modalButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* EMAIL */}
          <View style={[styles.inputContainer, errors.email && styles.inputContainerError]}>
            <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />

            <TextInput
              style={styles.input}
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
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* PASSWORD */}
          <View style={[styles.inputContainer, errors.password && styles.inputContainerError]}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />

            <TextInput
              style={styles.input}
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
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={22}
                color="#999"
                style={{ paddingHorizontal: 4 }}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* CONFIRM PASSWORD */}
          <View style={[styles.inputContainer, errors.confirmPassword && styles.inputContainerError]}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password *"
              placeholderTextColor="#999"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              onBlur={() => handleBlur('confirmPassword')}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={22}
                color="#999"
                style={{ paddingHorizontal: 4 }}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          <TouchableOpacity
            style={[styles.yellowButton, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.yellowButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.separatorContainer}>
            <View style={styles.line} />
            <View>
              <Text style={styles.separatorText}>OR</Text>
            </View>
            <View style={styles.line} />
          </View>

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
