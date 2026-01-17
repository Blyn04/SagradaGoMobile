import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/users/BurialDocumentsStyle';
import CustomPicker from '../../customs/CustomPicker';

export default function BurialDocuments({ burialForm, setBurialForm }) {
  const burialServices = [
    { key: 'funeral_mass', label: 'Funeral Mass' },
    { key: 'death_anniversary', label: 'Death Anniversary' },
    { key: 'funeral_blessing', label: 'Funeral Blessing' },
    { key: 'tomb_blessing', label: 'Tomb Blessing' },
  ];

  const civilStatusOptions = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Widowed', value: 'Widowed' },
  ];

  const toggleService = (key) => {
    setBurialForm({
      ...burialForm,
      [key]: !burialForm[key],
    });
  };

  const updateField = (field, value) => {
    setBurialForm({
      ...burialForm,
      [field]: value,
    });
  };

  return (
    <ScrollView style={styles.sacramentFormContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.sacramentFormTitle}>Deceased Information</Text>
      
      {/* Deceased Name */}
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Deceased Name *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={burialForm.deceased_name || ''}
            onChangeText={(text) => updateField('deceased_name', text)}
            placeholder="Enter deceased name"
                        placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Age */}
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Age *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={burialForm.deceased_age || ''}
            onChangeText={(text) => updateField('deceased_age', text)}
            placeholder="Enter age"
                        placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Civil Status */}
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Civil Status *</Text>
        <CustomPicker
          value={burialForm.deceased_civil_status || ''}
          onValueChange={(value) => updateField('deceased_civil_status', value)}
          options={civilStatusOptions}
          placeholder="Select civil status"
        />
      </View>

      {/* Requested By */}
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Requested By *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={burialForm.requested_by || ''}
            onChangeText={(text) => updateField('requested_by', text)}
            placeholder="Enter name of person requesting"
                        placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Relationship to Deceased */}
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Relationship to Deceased *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="people-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={burialForm.relationship_to_deceased || ''}
            onChangeText={(text) => updateField('relationship_to_deceased', text)}
            placeholder="e.g., Son, Daughter, Spouse, etc."
                        placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Address */}
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Address *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={burialForm.address || ''}
            onChangeText={(text) => updateField('address', text)}
            placeholder="Enter address"
            multiline
            numberOfLines={3}
                        placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Contact Number */}
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Contact Number *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={burialForm.contact_number || ''}
            onChangeText={(text) => {
              const numericOnly = text.replace(/\D/g, '');
              if (numericOnly.length <= 11) {
                updateField('contact_number', numericOnly);
              }
            }}
            placeholder="Enter contact number"
            keyboardType="phone-pad"
            maxLength={11}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Place of Mass */}
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Place of Mass</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="church-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={burialForm.place_of_mass || ''}
            onChangeText={(text) => updateField('place_of_mass', text)}
            placeholder="Enter place of mass"
                        placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Mass Address */}
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Mass Address</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={burialForm.mass_address || ''}
            onChangeText={(text) => updateField('mass_address', text)}
            placeholder="Enter mass address"
            multiline
                        placeholderTextColor="#999"
            numberOfLines={3}
          />
        </View>
      </View>

      <Text style={[styles.sacramentFormTitle, { marginTop: 20, marginBottom: 10 }]}>Burial Services</Text>
      <Text style={styles.sacramentFormSubtitle}>Select the services you need:</Text>

      {burialServices.map((service) => (
        <TouchableOpacity
          key={service.key}
          style={[
            styles.checkboxContainer,
            burialForm[service.key] && styles.checkboxContainerSelected
          ]}
          onPress={() => toggleService(service.key)}
        >
          <View style={[
            styles.checkbox,
            burialForm[service.key] && styles.checkboxSelected
          ]}>
            {burialForm[service.key] && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
          <Text style={[
            styles.checkboxLabel,
            burialForm[service.key] && styles.checkboxLabelSelected
          ]}>
            {service.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

