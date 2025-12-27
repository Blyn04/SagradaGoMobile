import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/users/WeddingDocumentsStyle';

let ImagePicker = null;
try {
  ImagePicker = require('expo-image-picker');
} catch (e) {
  console.warn('expo-image-picker not available');
}

export default function WeddingDocuments({ weddingForm, setWeddingForm }) {
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handlePhoneChange = (text) => {
    const input = text.replace(/\D/g, '');
    if (input.length <= 11) {
      setWeddingForm({ ...weddingForm, contact_no: input });
    }
  };

  const pickImage = async (fieldName) => {
    if (!ImagePicker) {
      Alert.alert(
        'Image Picker Not Available',
        'Please install expo-image-picker: npx expo install expo-image-picker'
      );
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload documents.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setWeddingForm({
          ...weddingForm,
          [fieldName]: {
            ...result.assets[0],
            fileName: result.assets[0].uri.split('/').pop() || 'image.jpg',
          },
        });
      }

    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const nameFields = [
    { key: 'groom_first_name', label: 'Groom First Name', type: 'text' },
    { key: 'groom_middle_name', label: 'Groom Middle Name', type: 'text' },
    { key: 'groom_last_name', label: 'Groom Last Name', type: 'text' },
    { key: 'bride_first_name', label: 'Bride First Name', type: 'text' },
    { key: 'bride_middle_name', label: 'Bride Middle Name', type: 'text' },
    { key: 'bride_last_name', label: 'Bride Last Name', type: 'text' },
  ];

  const documentFields = [
    { key: 'groom_1x1', label: 'Groom 1x1 Photo', type: 'file' },
    { key: 'bride_1x1', label: 'Bride 1x1 Photo', type: 'file' },
  ];

  return (
    <View style={styles.sacramentFormContainer}>
      <Text style={styles.sacramentFormTitle}>Wedding Information</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Contact Number</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={formatPhoneNumber(weddingForm.contact_no)}
            onChangeText={handlePhoneChange}
            placeholder="09XX-XXX-XXXX"
            keyboardType="phone-pad"
            maxLength={13}
            placeholderTextColor="#999"
          />
        </View>
        <Text style={styles.inputHelperText}>Enter 11-digit PH mobile number (e.g., 09171234567)</Text>
      </View>

      {nameFields.map((field) => (
        <View key={field.key} style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>{field.label}</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.textInput}
              value={weddingForm[field.key] || ''}
              onChangeText={(text) => setWeddingForm({ ...weddingForm, [field.key]: text })}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      ))}

      {documentFields.map((field) => (
        <View key={field.key} style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>{field.label}</Text>
          {field.type === 'text' ? (
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.textInput}
                value={weddingForm[field.key] || ''}
                onChangeText={(text) => setWeddingForm({ ...weddingForm, [field.key]: text })}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                placeholderTextColor="#999"
              />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.fileUploadButton}
              onPress={() => pickImage(field.key)}
            >
              <Ionicons
                name={weddingForm[field.key] ? "checkmark-circle" : "document-attach-outline"}
                size={20}
                color={weddingForm[field.key] ? "#4CAF50" : "#666"}
                style={{ marginRight: 10 }}
              />
              <Text style={[
                styles.fileUploadText,
                weddingForm[field.key] && styles.fileUploadTextSelected
              ]}>
                {weddingForm[field.key]
                  ? weddingForm[field.key].fileName || 'File Selected'
                  : `Upload ${field.label}`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

