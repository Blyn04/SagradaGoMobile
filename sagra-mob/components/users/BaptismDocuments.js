import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/users/BaptismDocumentsStyle';
import CustomPicker from '../../customs/CustomPicker';

export default function BaptismDocuments({ baptismForm, setBaptismForm, user }) {
  const [showAddGodparent, setShowAddGodparent] = useState(false);

  const updateField = (field, value) => {
    setBaptismForm({
      ...baptismForm,
      [field]: value,
    });
  };

  const formatBirthday = (text) => {
    const cleaned = text.replace(/\D/g, '');

    const limited = cleaned.slice(0, 8);

    let formatted = limited;
    if (limited.length > 2) {
      formatted = `${limited.slice(0, 2)}/${limited.slice(2)}`;
    }

    if (limited.length > 4) {
      formatted = `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
    }

    updateField('candidate_birthday', formatted);
  };

  const marriageTypeOptions = [
    { label: 'Church', value: 'Church' },
    { label: 'Civil', value: 'Civil' },
    { label: 'Catholic', value: 'Catholic' },
    { label: 'Other', value: 'Other' },
  ];

  const updateGodparent = (type, field, value) => {
    setBaptismForm({
      ...baptismForm,
      [type]: {
        ...baptismForm[type],
        [field]: value,
      },
    });
  };

  const addGodparent = () => {
    const newGodparent = { name: '', relationship: '' };
    setBaptismForm({
      ...baptismForm,
      additional_godparents: [...baptismForm.additional_godparents, newGodparent],
    });
    setShowAddGodparent(false);
  };

  const removeGodparent = (index) => {
    const updated = baptismForm.additional_godparents.filter((_, i) => i !== index);
    setBaptismForm({
      ...baptismForm,
      additional_godparents: updated,
    });
  };

  const updateAdditionalGodparent = (index, field, value) => {
    const updated = [...baptismForm.additional_godparents];
    updated[index] = { ...updated[index], [field]: value };
    setBaptismForm({
      ...baptismForm,
      additional_godparents: updated,
    });
  };


  return (
    <View style={styles.sacramentFormContainer}>
      <Text style={styles.sacramentFormTitle}>Baptism Information</Text>

      {/* Candidate Information */}
      <Text style={styles.sectionTitle}>Baby Information</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>First Name *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.candidate_first_name || ''}
            onChangeText={(text) => updateField('candidate_first_name', text)}
            placeholder="Enter First Name"
            placeholderTextColor="#999"

          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Middle Name</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.candidate_middle_name || ''}
            onChangeText={(text) => updateField('candidate_middle_name', text)}
            placeholder="Enter Middle Name"
            placeholderTextColor="#999"

          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Last Name *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.candidate_last_name || ''}
            onChangeText={(text) => updateField('candidate_last_name', text)}
            placeholder="Enter Last Name"
            placeholderTextColor="#999"

          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Birthday *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.candidate_birthday || ''}
            onChangeText={formatBirthday}
            placeholder="MM/DD/YY or MM/DD/YYYY"
            placeholderTextColor="#999"

            keyboardType="numeric"
            maxLength={10}
          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Birth Place *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.candidate_birth_place || ''}
            onChangeText={(text) => updateField('candidate_birth_place', text)}
            placeholder="Enter Birth Place"
            placeholderTextColor="#999"

          />
        </View>
      </View>

      {/* Father Information */}
      <Text style={styles.sectionTitle}>Father Information</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>First Name *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.father_first_name || ''}
            onChangeText={(text) => updateField('father_first_name', text)}
            placeholder="Enter father's first name"
          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Middle Name</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.father_middle_name || ''}
            onChangeText={(text) => updateField('father_middle_name', text)}
            placeholder="Enter father's middle name"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Last Name *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.father_last_name || ''}
            onChangeText={(text) => updateField('father_last_name', text)}
            placeholder="Enter father's last name"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Birth Place *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.father_birth_place || ''}
            onChangeText={(text) => updateField('father_birth_place', text)}
            placeholder="Enter father's birth place"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Mother Information */}
      <Text style={styles.sectionTitle}>Mother Information</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>First Name *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.mother_first_name || ''}
            onChangeText={(text) => updateField('mother_first_name', text)}
            placeholder="Enter mother's first name"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Middle Name</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.mother_middle_name || ''}
            onChangeText={(text) => updateField('mother_middle_name', text)}
            placeholder="Enter mother's middle name"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Last Name *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.mother_last_name || ''}
            onChangeText={(text) => updateField('mother_last_name', text)}
            placeholder="Enter mother's last name"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Birth Place *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.mother_birth_place || ''}
            onChangeText={(text) => updateField('mother_birth_place', text)}
            placeholder="Enter mother's birth place"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Other Information */}
      <Text style={styles.sectionTitle}>Other Information</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Marriage Type *</Text>
        <CustomPicker
          value={baptismForm.marriage_type || ''}
          onValueChange={(value) => updateField('marriage_type', value)}
          options={marriageTypeOptions}
          iconName="heart-outline"
          placeholder="Select marriage type"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Address *</Text>
        <View style={[styles.inputContainer, styles.multilineInputContainer]}>
          <Ionicons name="home-outline" size={20} color="#999" style={{ marginRight: 10, alignSelf: 'flex-start', marginTop: 12 }} />
          <TextInput
            style={[styles.textInput, styles.multilineTextInput]}
            value={baptismForm.address || ''}
            onChangeText={(text) => updateField('address', text)}
            placeholder="Enter address"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Contact Number *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.contact_number || ''}
            onChangeText={(text) => updateField('contact_number', text)}
            placeholder="Enter contact number"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Godparents Section */}
      <Text style={styles.sectionTitle}>Godparents</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Main Godfather *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.main_godfather?.name || ''}
            onChangeText={(text) => updateGodparent('main_godfather', 'name', text)}
            placeholder="Enter godfather's name"
            placeholderTextColor="#999"
          />
        </View>
        <View style={[styles.inputContainer, { marginTop: 10 }]}>
          <Ionicons name="link-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.main_godfather?.relationship || ''}
            onChangeText={(text) => updateGodparent('main_godfather', 'relationship', text)}
            placeholder="Relationship"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Main Godmother *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.main_godmother?.name || ''}
            onChangeText={(text) => updateGodparent('main_godmother', 'name', text)}
            placeholder="Enter godmother's name"
            placeholderTextColor="#999"
          />
        </View>
        <View style={[styles.inputContainer, { marginTop: 10 }]}>
          <Ionicons name="link-outline" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            value={baptismForm.main_godmother?.relationship || ''}
            onChangeText={(text) => updateGodparent('main_godmother', 'relationship', text)}
            placeholder="Relationship"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={styles.inputLabel}>Additional Godparents</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddGodparent(true)}
          >
            <Ionicons name="add-circle-outline" size={20} color="#FFC942" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {baptismForm.additional_godparents?.map((godparent, index) => (
          <View key={index} style={styles.additionalItemContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.textInput}
                value={godparent.name || ''}
                onChangeText={(text) => updateAdditionalGodparent(index, 'name', text)}
                placeholder="Godparent name"
              />
            </View>

            <View style={[styles.inputContainer, { marginTop: 10 }]}>
              <Ionicons name="link-outline" size={20} color="#999" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.textInput}
                value={godparent.relationship || ''}
                onChangeText={(text) => updateAdditionalGodparent(index, 'relationship', text)}
                placeholder="Relationship"
              />
            </View>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeGodparent(index)}
            >
              <Ionicons name="trash-outline" size={18} color="#ff4444" />
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        {showAddGodparent && (
          <View style={styles.addGodparentContainer}>
            <Text style={styles.inputLabel}>New Godparent</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#999" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter name"
                onChangeText={(text) => {
                  const newGodparent = { name: text, relationship: '' };
                  setBaptismForm({
                    ...baptismForm,
                    additional_godparents: [...baptismForm.additional_godparents, newGodparent],
                  });
                  setShowAddGodparent(false);
                }}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
