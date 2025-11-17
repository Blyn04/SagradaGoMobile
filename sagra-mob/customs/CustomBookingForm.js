import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import styles from '../styles/users/CustomBookingStyle';
import CustomCalendar from './CustomCalendar';
import TimePicker from './TimePicker';
import WeddingDocuments from '../components/users/WeddingDocuments';
import BaptismDocuments from '../components/users/BaptismDocuments';
import BurialDocuments from '../components/users/BurialDocuments';

const getMinimumBookingDate = (sacrament) => {
  const dates = {
    'Wedding': '2025-10-17',
    'Baptism': '2025-11-01',
    'Confession': '2025-09-19',
    'Anointing of the Sick': '2025-09-18',
    'First Communion': '2025-11-16',
    'Burial': '2025-09-20',
    'Confirmation': '2025-11-16',
  };
  return dates[sacrament] || dayjs().format('YYYY-MM-DD');
};

const getMinimumBookingDateDisplay = (sacrament) => {
  const dates = {
    'Wedding': 'October 17, 2025',
    'Baptism': 'November 1, 2025',
    'Confession': 'September 19, 2025',
    'Anointing of the Sick': 'September 18, 2025',
    'First Communion': 'November 16, 2025',
    'Burial': 'September 20, 2025',
    'Confirmation': 'November 16, 2025',
  };

  return dates[sacrament] || new Date().toLocaleDateString();
};

const getSacramentPrice = (sacrament) => {
  const prices = {
    'Wedding': 5000,
    'Baptism': 2000,
    'Confession': 0,
    'Anointing of the Sick': 0,
    'First Communion': 1500,
    'Burial': 3000,
    'Confirmation': 1500,
  };

  return prices[sacrament] || 0;
};

export default function CustomBookingForm({ visible, onClose, selectedSacrament: initialSacrament }) {
  const selectedSacrament = initialSacrament || '';
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [pax, setPax] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const [weddingForm, setWeddingForm] = useState({
    groom_fullname: '',
    bride_fullname: '',
    contact_no: '',
    marriage_license: null,
    marriage_contract: null,
    groom_1x1: null,
    bride_1x1: null,
    groom_baptismal_cert: null,
    bride_baptismal_cert: null,
    groom_confirmation_cert: null,
    bride_confirmation_cert: null,
    groom_cenomar: null,
    bride_cenomar: null,
    groom_banns: null,
    bride_banns: null,
    groom_permission: null,
    bride_permission: null,
  });

  const [baptismForm, setBaptismForm] = useState({
    main_godfather: {},
    main_godmother: {},
    additional_godparents: [],
  });

  const [burialForm, setBurialForm] = useState({
    funeral_mass: false,
    death_anniversary: false,
    funeral_blessing: false,
    tomb_blessing: false,
  });

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 8000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const resetForm = () => {
    setDate(null);
    setTime(null);
    setPax('');
    setWeddingForm({
      groom_fullname: '',
      bride_fullname: '',
      contact_no: '',
      marriage_license: null,
      marriage_contract: null,
      groom_1x1: null,
      bride_1x1: null,
      groom_baptismal_cert: null,
      bride_baptismal_cert: null,
      groom_confirmation_cert: null,
      bride_confirmation_cert: null,
      groom_cenomar: null,
      bride_cenomar: null,
      groom_banns: null,
      bride_banns: null,
      groom_permission: null,
      bride_permission: null,
    });

    setBaptismForm({
      main_godfather: {},
      main_godmother: {},
      additional_godparents: [],
    });

    setBurialForm({
      funeral_mass: false,
      death_anniversary: false,
      funeral_blessing: false,
      tomb_blessing: false,
    });

    setErrorMessage('');
    setShowQRCode(false);
  };

  const handleClose = () => {
    onClose();
  };

  const handleNext = () => {
    if (!selectedSacrament) {
      setErrorMessage('No sacrament selected. Please close and try again.');
      return;
    }

    if (!date || !time || !pax) {
      setErrorMessage('Please select a date, time, and number of people.');
      return;
    }

    if (selectedSacrament === 'Wedding') {
      if (!weddingForm.groom_fullname || !weddingForm.bride_fullname || !weddingForm.contact_no) {
        setErrorMessage('Please fill in all required wedding information.');
        return;
      }

    } else if (selectedSacrament === 'Baptism') {
      if (!baptismForm.main_godfather?.name || !baptismForm.main_godmother?.name) {
        setErrorMessage('Please fill in godparent information.');
        return;
      }

    } else if (selectedSacrament === 'Burial') {
      const hasSelection = burialForm.funeral_mass || burialForm.death_anniversary ||
        burialForm.funeral_blessing || burialForm.tomb_blessing;
      if (!hasSelection) {
        setErrorMessage('Please select at least one burial service.');
        return;
      }
    }

    setShowQRCode(true);
  };

  const minDate = selectedSacrament
    ? (() => {
      const dateStr = getMinimumBookingDate(selectedSacrament);
      const parsed = dayjs(dateStr);
      return parsed.isValid() ? parsed : dayjs();
    })()
    : dayjs();

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedSacrament ? `Book ${selectedSacrament}` : 'Book a Sacrament'}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
          >
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#ff4444" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {selectedSacrament ? (
              <>
                <View style={styles.sacramentDisplayContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text style={styles.sacramentDisplayText}>{selectedSacrament}</Text>
                </View>

                <Text style={styles.formSubtitle}>
                  Reserve a date and time for your {selectedSacrament.toLowerCase()} booking.
                </Text>

                <View style={styles.infoContainer}>
                  <Text style={styles.infoText}>
                    Earliest available date: {getMinimumBookingDateDisplay(selectedSacrament)}
                  </Text>
                  <Text style={styles.infoText}>
                    Price: ₱{getSacramentPrice(selectedSacrament).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Select Date</Text>
                  <TouchableOpacity
                    style={styles.inputContainer}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Ionicons name="calendar-outline" size={20} color="#999" style={{ marginRight: 10 }} />
                    <Text style={[styles.inputText, !date && styles.placeholderText]}>
                      {date ? date.toLocaleDateString() : 'Select Date'}
                    </Text>
                    <Ionicons name="chevron-down-outline" size={20} color="#999" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Select Time</Text>
                  <TimePicker
                    value={time}
                    onValueChange={setTime}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Number of People</Text>
                  <View style={[styles.inputContainer, { paddingVertical: 2 }]}>
                    <Ionicons name="people-outline" size={20} color="#999" style={{ marginRight: 10 }} />
                    <TextInput
                      style={styles.textInput}
                      value={pax}
                      onChangeText={setPax}
                      placeholder="Enter number of people"
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                {selectedSacrament === 'Wedding' && (
                  <WeddingDocuments
                    weddingForm={weddingForm}
                    setWeddingForm={setWeddingForm}
                  />
                )}

                {selectedSacrament === 'Baptism' && (
                  <BaptismDocuments
                    baptismForm={baptismForm}
                    setBaptismForm={setBaptismForm}
                  />
                )}

                {selectedSacrament === 'Burial' && (
                  <BurialDocuments
                    burialForm={burialForm}
                    setBurialForm={setBurialForm}
                  />
                )}

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleNext}
                >
                  <Text style={styles.submitButtonText}>Next</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.noSacramentContainer}>
                <Ionicons name="alert-circle-outline" size={48} color="#ffa726" />
                <Text style={styles.noSacramentText}>
                  No sacrament selected. Please close and select a sacrament first.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.datePickerModalOverlay}>
          <View style={styles.datePickerModalContent}>
            <CustomCalendar
              selectedDate={date}
              onDateSelect={(selectedDate) => {
                setDate(selectedDate);
                setShowDatePicker(false);
              }}
              minDate={minDate.toDate()}
              initialDate={minDate}
            />
            <TouchableOpacity
              onPress={() => setShowDatePicker(false)}
              style={styles.datePickerCloseButton}
            >
              <Text style={styles.datePickerCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showQRCode}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQRCode(false)}
      >
        <View style={styles.qrCodeModalOverlay}>
          <View style={styles.qrCodeModalContent}>
            <View style={styles.qrCodeHeader}>
              <Text style={styles.qrCodeTitle}>Payment QR Code</Text>
              <TouchableOpacity onPress={() => {
                setShowQRCode(false);
                handleClose();
              }}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.qrCodeContainer}>
              <Text style={styles.qrCodeSubtitle}>
                Scan this QR code to pay for your {selectedSacrament} booking
              </Text>
              <View style={styles.paymentAmountContainer}>
                <Text style={styles.paymentAmountLabel}>Amount to Pay:</Text>
                <Text style={styles.paymentAmount}>
                  ₱{getSacramentPrice(selectedSacrament).toLocaleString()}
                </Text>
              </View>
              <View style={styles.qrCodeImageWrapper}>
                <Image
                  source={require('../assets/qrCodes/qr-1.png')}
                  style={styles.qrCodeImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.bookingDetailsContainer}>
                <Text style={styles.bookingDetailsTitle}>Booking Details</Text>
                <View style={styles.bookingDetailRow}>
                  <Ionicons name="calendar-outline" size={18} color="#666" />
                  <Text style={styles.bookingDetailText}>
                    {date ? date.toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
                <View style={styles.bookingDetailRow}>
                  <Ionicons name="time-outline" size={18} color="#666" />
                  <Text style={styles.bookingDetailText}>
                    {time ? (() => {
                      const hours = time.getHours();
                      const minutes = time.getMinutes();
                      const hour12 = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
                      const period = hours >= 12 ? 'PM' : 'AM';
                      return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
                    })() : 'N/A'}
                  </Text>
                </View>
                <View style={styles.bookingDetailRow}>
                  <Ionicons name="people-outline" size={18} color="#666" />
                  <Text style={styles.bookingDetailText}>
                    {pax || 'N/A'} {pax ? 'people' : ''}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.qrCodeCloseButton}
              onPress={() => {
                setShowQRCode(false);
                handleClose();
              }}
            >
              <Text style={styles.qrCodeCloseButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

