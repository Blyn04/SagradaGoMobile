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
import CustomUploadPDF from './CustomUploadPDF';
import { useAuth } from '../contexts/AuthContext';
import { sacramentRequirements } from '../utils/sacramentRequirements';
import { API_BASE_URL } from '../config/API';
import { Platform } from 'react-native';

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
  const { user } = useAuth();
  const selectedSacrament = initialSacrament || '';
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [pax, setPax] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fullName = user
    ? `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''}`.trim()
    : '';
  const email = user?.email || '';

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

  const uploadableRequirements = selectedSacrament
    ? (sacramentRequirements[selectedSacrament] || []).filter((req) => req.requiresUpload)
    : [];

  const uploadedCount = selectedSacrament
    ? Object.keys(uploadedDocuments[selectedSacrament] || {}).length
    : 0;

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 8000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (selectedSacrament === 'Confession') {
      setPax('1');
    }
  }, [selectedSacrament]);

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
    setUploadedDocuments({});
  };

  const handleDocumentUpload = (requirementId, file) => {
    if (!selectedSacrament) return;
    setUploadedDocuments((prev) => {
      const sacramentDocs = prev[selectedSacrament] || {};
      return {
        ...prev,
        [selectedSacrament]: {
          ...sacramentDocs,
          [requirementId]: file,
        },
      };
    });
  };

  const handleDocumentRemove = (requirementId) => {
    if (!selectedSacrament) return;
    setUploadedDocuments((prev) => {
      const sacramentDocs = { ...(prev[selectedSacrament] || {}) };
      delete sacramentDocs[requirementId];
      const updated = { ...prev };
      if (Object.keys(sacramentDocs).length === 0) {
        delete updated[selectedSacrament];

      } else {
        updated[selectedSacrament] = sacramentDocs;
      }
      
      return updated;
    });
  };

  const handleClose = () => {
    onClose();
  };

  const handleNext = () => {
    if (!selectedSacrament) {
      setErrorMessage('No sacrament selected. Please close and try again.');
      return;
    }

    if (selectedSacrament === 'Baptism') {
      if (!user) {
        setErrorMessage('User information not available. Please try again.');
        return;
      }
      
      const middleName = user.middle_name;
      if (!middleName || middleName.trim() === '') {
        Alert.alert(
          'Middle Name Required',
          'A middle name is required to book a Baptism. Please update your profile with your middle name before proceeding.',
          [
            {
              text: 'OK',
              onPress: () => {
                handleClose();
              }
            }
          ]
        );
        return;
      }
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

    if (uploadableRequirements.length > 0) {
      const missingUploads = uploadableRequirements.filter(
        (req) => !uploadedDocuments[selectedSacrament]?.[req.id]
      );

      if (missingUploads.length > 0) {
        setErrorMessage(
          `Please upload the following documents: ${missingUploads
            .map((req) => req.label)
            .join(', ')}.`
        );
        return;
      }
    }

    setShowQRCode(true);
  };

  const handleSubmitBooking = async () => {
    if (!user?.uid) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      
      formData.append('uid', user.uid);
      formData.append('full_name', fullName);
      formData.append('email', email);
      formData.append('date', date.toISOString());
      formData.append('time', time.toISOString());
      formData.append('attendees', pax.toString());

      const docs = uploadedDocuments[selectedSacrament] || {};
      
      if (selectedSacrament === 'Wedding') {
        formData.append('groom_fullname', weddingForm.groom_fullname || '');
        formData.append('bride_fullname', weddingForm.bride_fullname || '');
        formData.append('contact_number', weddingForm.contact_no || user.contact_number || '');

  
        const weddingDocs = {
          'marriage_license': 'marriage_license',
          'baptismal_certificate': 'groom_baptismal_cert',
          'confirmation_certificate': 'groom_confirmation_cert',
          'pre_marriage_seminar': 'marriage_contract',
          'parental_consent': 'groom_permission',
        };

        Object.keys(docs).forEach((reqId) => {
          const file = docs[reqId];
          if (file && file.uri) {
            const fieldName = weddingDocs[reqId] || reqId;
            formData.append(fieldName, {
              uri: file.uri,
              type: file.mimeType || 'application/pdf',
              name: file.name || `${fieldName}.pdf`,
            });

            console.log(`Appending wedding document: ${reqId} -> ${fieldName}`);
          }
        });

        const weddingImageFields = [
          'marriage_license', 'marriage_contract', 'groom_1x1', 'bride_1x1',
          'groom_baptismal_cert', 'bride_baptismal_cert',
          'groom_confirmation_cert', 'bride_confirmation_cert',
          'groom_cenomar', 'bride_cenomar',
          'groom_banns', 'bride_banns',
          'groom_permission', 'bride_permission'
        ];

        weddingImageFields.forEach((fieldName) => {
          const file = weddingForm[fieldName];
          if (file && file.uri) {
            formData.append(fieldName, {
              uri: file.uri,
              type: file.mimeType || file.type || 'image/jpeg',
              name: file.fileName || file.name || `${fieldName}.jpg`,
            });

            console.log(`Appending wedding image: ${fieldName}`);
          }
        });

        const response = await submitBookingForm(`${API_BASE_URL}/createWedding`, formData);
        if (response) {
          Alert.alert('Success', 'Wedding booking submitted successfully!', [
            { text: 'OK', onPress: handleClose }
          ]);
        }

      } else if (selectedSacrament === 'Baptism') {
        formData.append('contact_number', user.contact_number || '');
        formData.append('main_godfather', JSON.stringify(baptismForm.main_godfather || {}));
        formData.append('main_godmother', JSON.stringify(baptismForm.main_godmother || {}));
        formData.append('additional_godparents', JSON.stringify(baptismForm.additional_godparents || []));

        const baptismDocs = {
          'birth_certificate': 'birth_certificate',
          'parents_marriage_certificate': 'parents_marriage_certificate',
          'godparent_confirmation': 'godparent_confirmation',
          'baptismal_seminar': 'baptismal_seminar',
        };

        Object.keys(docs).forEach((reqId) => {
          const file = docs[reqId];
          if (file && file.uri) {
            const fieldName = baptismDocs[reqId] || reqId;
            formData.append(fieldName, {
              uri: file.uri,
              type: file.mimeType || 'application/pdf',
              name: file.name || `${fieldName}.pdf`,
            });

            console.log(`Appending baptism document: ${reqId} -> ${fieldName}`);
          }
        });

        const response = await submitBookingForm(`${API_BASE_URL}/createBaptism`, formData);
        if (response) {
          Alert.alert('Success', 'Baptism booking submitted successfully!', [
            { text: 'OK', onPress: handleClose }
          ]);
        }

      } else if (selectedSacrament === 'Burial') {
        formData.append('contact_number', user.contact_number || '');
        formData.append('funeral_mass', burialForm.funeral_mass ? 'true' : 'false');
        formData.append('death_anniversary', burialForm.death_anniversary ? 'true' : 'false');
        formData.append('funeral_blessing', burialForm.funeral_blessing ? 'true' : 'false');
        formData.append('tomb_blessing', burialForm.tomb_blessing ? 'true' : 'false');

        const burialDocs = {
          'death_certificate': 'death_certificate',
          'deceased_baptismal': 'deceased_baptismal',
        };

        Object.keys(docs).forEach((reqId) => {
          const file = docs[reqId];
          if (file && file.uri) {
            const fieldName = burialDocs[reqId] || reqId;
            formData.append(fieldName, {
              uri: file.uri,
              type: file.mimeType || 'application/pdf',
              name: file.name || `${fieldName}.pdf`,
            });

            console.log(`Appending burial document: ${reqId} -> ${fieldName}`);
          }
        });

        const response = await submitBookingForm(`${API_BASE_URL}/createBurial`, formData);
        if (response) {
          Alert.alert('Success', 'Burial booking submitted successfully!', [
            { text: 'OK', onPress: handleClose }
          ]);
        }

      } else if (selectedSacrament === 'Confession') {
        if (!user?.uid) {
          Alert.alert('Error', 'User not found. Please log in again.');
          return;
        }

        const payload = {
          uid: user.uid,
          full_name: fullName || '',
          email: email || '',
          date: date.toISOString(),
          time: time.toISOString(),
          attendees: 1,
          transaction_id: `CONF-${Date.now()}`,
          status: 'pending',
        };

        try {
          const response = await fetch(`${API_BASE_URL}/createConfession`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (response.ok) {
            Alert.alert('Success', 'Confession booking submitted successfully!', [
              { text: 'OK', onPress: handleClose }
            ]);
            
          } else {
            throw new Error(data.message || 'Failed to submit Confession booking.');
          }

        } catch (err) {
          console.error('Confession booking error:', err);
          Alert.alert('Error', err.message || 'Failed to submit Confession booking.');
        }

      } else if (selectedSacrament === 'First Communion') {
        formData.append('contact_number', user.contact_number || '');

        const communionDocs = {
          'baptismal_certificate': 'baptismal_certificate',
          'communion_preparation': 'communion_preparation',
          'parent_consent': 'parent_consent',
        };

        Object.keys(docs).forEach((reqId) => {
          const file = docs[reqId];
          if (file && file.uri) {
            const fieldName = communionDocs[reqId] || reqId;
            formData.append(fieldName, {
              uri: file.uri,
              type: file.mimeType || 'application/pdf',
              name: file.name || `${fieldName}.pdf`,
            });

            console.log(`Appending communion document: ${reqId} -> ${fieldName}`);
          }
        });

        const response = await submitBookingForm(`${API_BASE_URL}/createCommunion`, formData);
        if (response) {
          Alert.alert('Success', 'Communion booking submitted successfully!', [
            { text: 'OK', onPress: handleClose }
          ]);
        }

      } else if (selectedSacrament === 'Anointing of the Sick') {
        formData.append('contact_number', user.contact_number || '');
        formData.append('medical_condition', ''); 

        const anointingDocs = {
          'medical_certificate': 'medical_certificate',
        };

        Object.keys(docs).forEach((reqId) => {
          const file = docs[reqId];
          if (file && file.uri) {
            const fieldName = anointingDocs[reqId] || reqId;
            formData.append(fieldName, {
              uri: file.uri,
              type: file.mimeType || 'application/pdf',
              name: file.name || `${fieldName}.pdf`,
            });
            
            console.log(`Appending anointing document: ${reqId} -> ${fieldName}`);
          }
        });

        const response = await submitBookingForm(`${API_BASE_URL}/createAnointing`, formData);
        if (response) {
          Alert.alert('Success', 'Anointing of the Sick booking submitted successfully!', [
            { text: 'OK', onPress: handleClose }
          ]);
        }

      } else if (selectedSacrament === 'Confirmation') {
        formData.append('contact_number', user.contact_number || '');
        formData.append('sponsor_name', ''); 

        const confirmationDocs = {
          'baptismal_certificate': 'baptismal_certificate',
          'first_communion_certificate': 'first_communion_certificate',
          'confirmation_preparation': 'confirmation_preparation',
          'sponsor_certificate': 'sponsor_certificate',
        };

        Object.keys(docs).forEach((reqId) => {
          const file = docs[reqId];
          if (file && file.uri) {
            const fieldName = confirmationDocs[reqId] || reqId;
            formData.append(fieldName, {
              uri: file.uri,
              type: file.mimeType || 'application/pdf',
              name: file.name || `${fieldName}.pdf`,
            });

            console.log(`Appending confirmation document: ${reqId} -> ${fieldName}`);
          }
        });

        const response = await submitBookingForm(`${API_BASE_URL}/createConfirmation`, formData);
        if (response) {
          Alert.alert('Success', 'Confirmation booking submitted successfully!', [
            { text: 'OK', onPress: handleClose }
          ]);
        }
      }

    } catch (error) {
      console.error('Error submitting booking:', error);
      Alert.alert('Error', error.message || 'Failed to submit booking. Please try again.');

    } finally {
      setSubmitting(false);
    }
  };

  const submitBookingForm = async (url, formData) => {
    console.log('Submitting booking to:', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error details:', fetchError);

      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }

      if (fetchError.message === 'Network request failed') {
        throw new Error('Cannot connect to server. Please check:\n1. Your internet connection\n2. The backend server is running\n3. The API URL is correct');
      }

      throw fetchError;
    }

    console.log('Response status:', response.status);
    
    let data;
    try {
      const text = await response.text();
      console.log('Response text:', text);
      data = JSON.parse(text);

    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Invalid response from server');
    }

    if (response.ok) {
      return data;
      
    } else {
      throw new Error(data.message || 'Failed to submit booking. Please try again.');
    }
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

                {uploadableRequirements.length > 0 && (
                  <View style={styles.uploadSection}>
                    <View style={styles.uploadSectionHeader}>
                      <Text style={styles.inputLabel}>Supporting Documents</Text>
                      <Text style={styles.uploadBadge}>
                        {uploadedCount}/{uploadableRequirements.length}
                      </Text>
                    </View>
                    <Text style={styles.uploadHelperText}>
                      Upload PDF copies of the required documents before proceeding.
                    </Text>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={() => setIsUploadModalVisible(true)}
                    >
                      <Ionicons
                        name="cloud-upload-outline"
                        size={20}
                        color="#424242"
                        style={{ marginRight: 10 }}
                      />
                      <Text style={styles.uploadButtonText}>
                        {uploadedCount > 0 ? 'Manage Uploads' : 'Upload PDFs'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

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

                {selectedSacrament !== 'Confession' && (
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
                )}

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

                {selectedSacrament === 'Confession' ? (
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitBooking} // directly submit
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Submit Booking</Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleNext}
                  >
                    <Text style={styles.submitButtonText}>Next</Text>
                  </TouchableOpacity>
                )}

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

      <CustomUploadPDF
        visible={isUploadModalVisible}
        onClose={() => setIsUploadModalVisible(false)}
        sacrament={selectedSacrament}
        requirements={uploadableRequirements}
        uploadedDocs={selectedSacrament ? uploadedDocuments[selectedSacrament] || {} : {}}
        onUpload={handleDocumentUpload}
        onRemove={handleDocumentRemove}
      />

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
              {selectedSacrament !== 'Confession' && (
                <>
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
                </>
              )}

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

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.qrCodeCloseButton, { flex: 1, backgroundColor: '#e0e0e0' }]}
                onPress={() => {
                  setShowQRCode(false);
                }}
              >
                <Text style={[styles.qrCodeCloseButtonText, { color: '#666' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.qrCodeCloseButton, { flex: 1 }]}
                onPress={handleSubmitBooking}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.qrCodeCloseButtonText}>Submit Booking</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

