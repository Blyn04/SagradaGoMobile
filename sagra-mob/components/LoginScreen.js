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
} from 'react-native';
import styles from '../styles/LoginStyle';
import ForgotPasswordModal from './ForgotPasswordModal';
import { Ionicons } from "@expo/vector-icons";

const API_BASE_URL = 'http://localhost:8080/api';

export default function LoginScreen({ onLoginSuccess, onSwitchToSignUp, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async () => {
    if (onLoginSuccess) {
      onLoginSuccess({
        uid: 'test-uid',
        email: email.trim() || 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
      });
    }
    return;

    // if (!email.trim() || !password.trim()) {
    //   Alert.alert('Error', 'Please enter both email and password');
    //   return;
    // }

    // setLoading(true);
    // try {
    //   const response = await fetch(`${API_BASE_URL}/login`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       email: email.trim(),
    //       password: password,
    //     }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     Alert.alert('Success', data.message);
    //     if (onLoginSuccess) {
    //       onLoginSuccess(data.user);
    //     }
    //     setEmail('');
    //     setPassword('');

    //   } else {
    //     Alert.alert('Login Failed', data.message || 'Invalid email or password');
    //   }
    // } catch (error) {
    //   console.error('Login error:', error);
    //   Alert.alert('Error', 'Network error. Please check your connection and try again.');

    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="chevron-back" size={28} color="#333" />
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Sign In to continue</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.yellowButton, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.yellowButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => setShowForgotPassword(true)}
          disabled={loading}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
          onPress={onSwitchToSignUp}
          disabled={loading}
        >
          <Text style={styles.switchText}>
            Don't have an account? <Text style={styles.switchTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <ForgotPasswordModal
        visible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        apiBaseUrl={API_BASE_URL}
      />
    </KeyboardAvoidingView>
  );
}