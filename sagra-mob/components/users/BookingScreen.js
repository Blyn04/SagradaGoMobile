import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../styles/users/BookingStyle';
import CustomNavbar from '../../customs/CustomNavbar';
import CustomPicker from '../../customs/CustomPicker';
import { Ionicons } from "@expo/vector-icons";
import CustomBookingForm from '../../customs/CustomBookingForm';
import { useAuth } from '../../contexts/AuthContext';

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

export default function BookingScreen({ user: userProp, onNavigate }) {
  const { user: authUser } = useAuth();
  const user = authUser || userProp;
  const [selectedSacrament, setSelectedSacrament] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [bookingSacrament, setBookingSacrament] = useState(null);

  const handleRequirements = (sacramentName) => {
    setSelectedSacrament(sacramentName);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedSacrament(null);
  };

  const handleBookNow = (sacramentName) => {
    if (sacramentName === 'Baptism') {
      if (!user) {
        Alert.alert(
          'Error',
          'User information not available. Please try again.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      const middleName = user.middle_name;
      if (!middleName || middleName.trim() === '') {
        Alert.alert(
          'Middle Name Required',
          'A middle name is required to book a Baptism. Please update your profile with your middle name before proceeding.',
          [
            {
              text: 'Go to Profile',
              onPress: () => {
                if (onNavigate) {
                  onNavigate('ProfileScreen');
                }
              },
              style: 'default'
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
        return;
      }
    }
    
    setBookingSacrament(sacramentName);
    setIsBookingModalVisible(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalVisible(false);
    setBookingSacrament(null);
  };

  const filteredSacraments = useMemo(() => {
    return sacraments.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/sagrada.png')}
            style={{ width: 100, height: 100, marginBottom: 10, alignSelf: 'center' }}
            resizeMode="contain"
          />
          <Text style={styles.title}>Select a Sacrament</Text>
          <Text style={styles.subtitle}>Click a card to view its requirements.</Text>
        </View>

        <View style={styles.content}>
          {filteredSacraments.length > 0 ? (
            filteredSacraments.map((sacrament, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={styles.sacramentCard}
                  onPress={() => handleRequirements(sacrament.name)}
                  activeOpacity={0.8}
                >
                  <View style={styles.sacramentInfo}>
                    <Text style={styles.sacramentName}>{sacrament.name}</Text>

                    <View style={styles.minBookingRow}>
                      <Ionicons name="calendar-outline" size={18} color="#e0a40dff" />
                      <Text style={styles.minBookingText}>{sacrament.minDate}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.bookIconButton}
                    onPress={() => handleBookNow(sacrament.name)}
                  >
                    <Ionicons name="arrow-forward-circle-outline" size={32} color="#424242" />
                  </TouchableOpacity>
                </TouchableOpacity>

                {index < filteredSacraments.length - 1 && <View style={styles.spacer} />}
              </View>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No sacraments found.
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
            <Text style={[styles.subtitle, { fontSize: 13, textAlign: 'center' }]}>Please complete the following requirements:</Text>

            <ScrollView style={styles.requirementsList}>
              {selectedSacrament &&
                requirements[selectedSacrament]?.map((req, index) => (
                  <View key={index} style={styles.requirementCard}>
                    <Ionicons name="checkmark-circle-outline" size={22} color="#e0a40dff" />
                    <Text style={styles.requirementCardText}>{req}</Text>
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

      <CustomBookingForm
        visible={isBookingModalVisible}
        onClose={handleCloseBookingModal}
        selectedSacrament={bookingSacrament}
      />
    </View>
  );
}

