import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../styles/users/BookingStyle';
import CustomNavbar from '../../customs/CustomNavbar';

const sacraments = [
  { name: 'Wedding', minDate: 'October 17, 2025' },
  { name: 'Baptism', minDate: 'November 1, 2025' },
  { name: 'Confession', minDate: 'September 19, 2025' },
  { name: 'Anointing of the Sick', minDate: 'September 18, 2025' },
  { name: 'First Communion', minDate: 'November 16, 2025' },
  { name: 'Burial', minDate: 'September 20, 2025' },
  { name: 'Confirmation', minDate: 'November 16, 2025' },
];

const requirements = {
  'Wedding': [
    'Valid marriage license',
    'Baptismal certificate',
    'Confirmation certificate',
    'Pre-marriage seminar certificate',
    'Parental consent (if applicable)',
  ],
  'Baptism': [
    'Birth certificate',
    'Parent\'s marriage certificate',
    'Godparent\'s confirmation certificate',
    'Baptismal seminar attendance',
  ],
  'Confession': [
    'No special requirements',
    'Come with a contrite heart',
    'Examination of conscience',
  ],
  'Anointing of the Sick': [
    'Medical certificate (if applicable)',
    'Family member or guardian present',
    'Contact parish office for scheduling',
  ],
  'First Communion': [
    'Baptismal certificate',
    'First Communion preparation completion',
    'Parent/guardian consent',
    'Regular attendance at catechism classes',
  ],
  'Burial': [
    'Death certificate',
    'Baptismal certificate of deceased',
    'Family contact information',
    'Preferred date and time',
  ],
  'Confirmation': [
    'Baptismal certificate',
    'First Communion certificate',
    'Confirmation preparation completion',
    'Sponsor\'s confirmation certificate',
    'Regular attendance at catechism classes',
  ],
};

const months = [
  'All Months',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function BookingScreen({ user, onNavigate }) {
  const [selectedSacrament, setSelectedSacrament] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('All Months');

  const handleRequirements = (sacramentName) => {
    setSelectedSacrament(sacramentName);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedSacrament(null);
  };

  const filteredSacraments = useMemo(() => {
    let filtered = sacraments;
    
    if (selectedMonth !== 'All Months') {
      filtered = sacraments.filter((sacrament) => {
        const dateParts = sacrament.minDate.split(' ');
        const monthName = dateParts[0]; // e.g., "October"
        return monthName === selectedMonth;
      });
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedMonth]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Select a Sacrament</Text>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter by Month:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
              style={styles.picker}
            >
              {months.map((month) => (
                <Picker.Item key={month} label={month} value={month} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.content}>
          {filteredSacraments.length > 0 ? (
            filteredSacraments.map((sacrament, index) => (
              <View key={index}>
                <View style={styles.sacramentItem}>
                  <View style={styles.sacramentInfo}>
                    <Text style={styles.sacramentName}>{sacrament.name}</Text>
                    <Text style={styles.minBooking}>
                      Minimum booking: {sacrament.minDate}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.requirementsButton}
                    onPress={() => handleRequirements(sacrament.name)}
                  >
                    <Text style={styles.requirementsButtonText}>Requirements</Text>
                  </TouchableOpacity>
                </View>
                {index < filteredSacraments.length - 1 && <View style={styles.divider} />}
              </View>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No sacraments found for {selectedMonth}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <CustomNavbar
        currentScreen="BookingScreen"
        onNavigate={onNavigate}
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.modalTitle}>
              {selectedSacrament} Requirements
            </Text>
            
            <ScrollView style={styles.requirementsList}>
              {selectedSacrament && requirements[selectedSacrament]?.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Text style={styles.requirementBullet}>•</Text>
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

