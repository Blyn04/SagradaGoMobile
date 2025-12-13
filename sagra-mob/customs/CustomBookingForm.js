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
import * as ImagePicker from 'expo-image-picker';

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
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); 
  const [proofOfPayment, setProofOfPayment] = useState(null);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [checkingConflict, setCheckingConflict] = useState(false);

  const fullName = user
    ? `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''}`.trim()
    : '';
  const email = user?.email || '';

  const [weddingForm, setWeddingForm] = useState({
    groom_first_name: '',
    groom_middle_name: '',
    groom_last_name: '',
    bride_first_name: '',
    bride_middle_name: '',
    bride_last_name: '',
    contact_no: '',
    groom_1x1: null,
    bride_1x1: null,
  });

  const [baptismForm, setBaptismForm] = useState({
    candidate_first_name: '',
    candidate_middle_name: '',
    candidate_last_name: '',
    candidate_birthday: '',
    candidate_birth_place: '',

    father_first_name: '',
    father_middle_name: '',
    father_last_name: '',
    father_birth_place: '',

    mother_first_name: '',
    mother_middle_name: '',
    mother_last_name: '',
    mother_birth_place: '',

    marriage_type: '',
    address: '',
    contact_number: '',

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
    if (selectedSacrament === 'Anointing of the Sick') {
      setPax('1');
    }
  }, [selectedSacrament]);

  const resetForm = () => {
    setDate(null);
    setTime(null);
    setPax('');
    setWeddingForm({
      groom_first_name: '',
      groom_middle_name: '',
      groom_last_name: '',
      bride_first_name: '',
      bride_middle_name: '',
      bride_last_name: '',
      contact_no: '',
      groom_1x1: null,
      bride_1x1: null,
    });

    setBaptismForm({
      candidate_first_name: '',
      candidate_middle_name: '',
      candidate_last_name: '',
      candidate_birthday: '',
      candidate_birth_place: '',
      father_first_name: '',
      father_middle_name: '',
      father_last_name: '',
      father_birth_place: '',
      mother_first_name: '',
      mother_middle_name: '',
      mother_last_name: '',
      mother_birth_place: '',
      marriage_type: '',
      address: '',
      contact_number: '',
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
    setShowPaymentMethod(false);
    setPaymentMethod(null);
    setProofOfPayment(null);
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

  const checkBookingConflict = async (selectedDate, selectedTime) => {
    if (!user?.uid || !selectedDate || !selectedTime) {
      return { hasConflict: false, message: '' };
    }

    try {
      setCheckingConflict(true);
      
      const combinedDateTime = new Date(selectedDate);
      combinedDateTime.setHours(selectedTime.getHours());
      combinedDateTime.setMinutes(selectedTime.getMinutes());
      combinedDateTime.setSeconds(0);
      combinedDateTime.setMilliseconds(0);

      const selectedDateTimeISO = combinedDateTime.toISOString();
      const selectedDateStr = dayjs(selectedDate).format('YYYY-MM-DD');
      const selectedTimeStr = dayjs(combinedDateTime).format('HH:mm');

      const userBookings = [];
      
      try {
        const weddingResponse = await fetch(`${API_BASE_URL}/getUserWeddings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid }),
        });
        const weddingData = await weddingResponse.json();
        if (weddingResponse.ok && weddingData.weddings) {
          weddingData.weddings.forEach(wedding => {
            if (wedding.status !== 'cancelled' && wedding.status !== 'rejected') {
              userBookings.push({
                date: wedding.date,
                time: wedding.time,
                sacrament: 'Wedding',
                transaction_id: wedding.transaction_id,
              });
            }
          });
        }

      } catch (error) {
        console.error('Error fetching user weddings:', error);
      }

      try {
        const baptismResponse = await fetch(`${API_BASE_URL}/getUserBaptisms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid }),
        });
        const baptismData = await baptismResponse.json();
        if (baptismResponse.ok && baptismData.baptisms) {
          baptismData.baptisms.forEach(baptism => {
            if (baptism.status !== 'cancelled' && baptism.status !== 'rejected') {
              userBookings.push({
                date: baptism.date,
                time: baptism.time,
                sacrament: 'Baptism',
                transaction_id: baptism.transaction_id,
              });
            }
          });
        }

      } catch (error) {
        console.error('Error fetching user baptisms:', error);
      }

      try {
        const burialResponse = await fetch(`${API_BASE_URL}/getUserBurials`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid }),
        });
        const burialData = await burialResponse.json();
        if (burialResponse.ok && burialData.burials) {
          burialData.burials.forEach(burial => {
            if (burial.status !== 'cancelled' && burial.status !== 'rejected') {
              userBookings.push({
                date: burial.date,
                time: burial.time,
                sacrament: 'Burial',
                transaction_id: burial.transaction_id,
              });
            }
          });
        }

      } catch (error) {
        console.error('Error fetching user burials:', error);
      }

      try {
        const confessionResponse = await fetch(`${API_BASE_URL}/getUserConfessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid }),
        });
        const confessionData = await confessionResponse.json();
        if (confessionResponse.ok && confessionData.confessions) {
          confessionData.confessions.forEach(confession => {
            if (confession.status !== 'cancelled' && confession.status !== 'rejected') {
              userBookings.push({
                date: confession.date,
                time: confession.time,
                sacrament: 'Confession',
                transaction_id: confession.transaction_id,
              });
            }
          });
        }

      } catch (error) {
        console.error('Error fetching user confessions:', error);
      }

      try {
        const anointingResponse = await fetch(`${API_BASE_URL}/getUserAnointings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid }),
        });
        const anointingData = await anointingResponse.json();
        if (anointingResponse.ok && anointingData.anointings) {
          anointingData.anointings.forEach(anointing => {
            if (anointing.status !== 'cancelled' && anointing.status !== 'rejected') {
              userBookings.push({
                date: anointing.date,
                time: anointing.time,
                sacrament: 'Anointing of the Sick',
                transaction_id: anointing.transaction_id,
              });
            }
          });
        }

      } catch (error) {
        console.error('Error fetching user anointings:', error);
      }

      try {
        const communionResponse = await fetch(`${API_BASE_URL}/getUserCommunions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid }),
        });
        const communionData = await communionResponse.json();
        if (communionResponse.ok && communionData.communions) {
          communionData.communions.forEach(communion => {
            if (communion.status !== 'cancelled' && communion.status !== 'rejected') {
              userBookings.push({
                date: communion.date,
                time: communion.time,
                sacrament: 'First Communion',
                transaction_id: communion.transaction_id,
              });
            }
          });
        }

      } catch (error) {
        console.error('Error fetching user communions:', error);
      }

      try {
        const confirmationResponse = await fetch(`${API_BASE_URL}/getUserConfirmations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid }),
        });
        const confirmationData = await confirmationResponse.json();
        if (confirmationResponse.ok && confirmationData.confirmations) {
          confirmationData.confirmations.forEach(confirmation => {
            if (confirmation.status !== 'cancelled' && confirmation.status !== 'rejected') {
              userBookings.push({
                date: confirmation.date,
                time: confirmation.time,
                sacrament: 'Confirmation',
                transaction_id: confirmation.transaction_id,
              });
            }
          });
        }

      } catch (error) {
        console.error('Error fetching user confirmations:', error);
      }

      for (const booking of userBookings) {
        if (!booking.date || !booking.time) continue;

        const bookingDate = new Date(booking.date);
        const bookingTime = new Date(booking.time);
        
        const bookingDateStr = dayjs(bookingDate).format('YYYY-MM-DD');
        if (bookingDateStr === selectedDateStr) {
          const bookingDateTime = new Date(bookingDate);
          bookingDateTime.setHours(bookingTime.getHours());
          bookingDateTime.setMinutes(bookingTime.getMinutes());
          bookingDateTime.setSeconds(0);
          bookingDateTime.setMilliseconds(0);

          const timeDiff = Math.abs(combinedDateTime.getTime() - bookingDateTime.getTime());
          const hoursDiff = timeDiff / (1000 * 60 * 60);

          if (hoursDiff < 1) {
            return {
              hasConflict: true,
              message: `You already have a ${booking.sacrament} booking on ${dayjs(bookingDate).format('MMMM D, YYYY')} at ${dayjs(bookingDateTime).format('h:mm A')}. Please choose a different date or time.`,
            };
          }
        }
      }

      try {
        const allBookingsResponse = await fetch(`${API_BASE_URL}/checkBookingConflict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: selectedDateStr,
            time: selectedTimeStr,
            datetime: selectedDateTimeISO,
          }),
        });

        if (allBookingsResponse.ok) {
          const conflictData = await allBookingsResponse.json();
          if (conflictData.hasConflict) {
            return {
              hasConflict: true,
              message: conflictData.message || `This time slot is already booked. Please choose a different date or time.`,
            };
          }
        }

      } catch (error) {
        console.log('Conflict check endpoint not available, skipping global conflict check:', error);
      }

      return { hasConflict: false, message: '' };

    } catch (error) {
      console.error('Error checking booking conflict:', error);
      return { hasConflict: false, message: '' };

    } finally {
      setCheckingConflict(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleNext = async () => {
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

    // Check for booking conflicts
    setErrorMessage('');
    const conflictCheck = await checkBookingConflict(date, time);
    if (conflictCheck.hasConflict) {
      setErrorMessage(conflictCheck.message);
      return;
    }

    if (selectedSacrament === 'Wedding') {
      if (!weddingForm.groom_first_name || !weddingForm.groom_last_name || 
          !weddingForm.bride_first_name || !weddingForm.bride_last_name || 
          !weddingForm.contact_no) {
        setErrorMessage('Please fill in all required wedding information (groom first & last name, bride first & last name, and contact number).');
        return;
      }

        if (!weddingForm.groom_1x1 || !weddingForm.bride_1x1) {
          setErrorMessage('Please upload both groom and bride 1x1 photos.');
          return;
        }

        const weddingDocs = uploadedDocuments[selectedSacrament] || {};
        const requiredDocs = ['marriage_license', 'marriage_contract', 'groom_baptismal_cert', 'bride_baptismal_cert', 'groom_confirmation_cert', 'bride_confirmation_cert'];
        const hasMarriageDoc = weddingDocs.marriage_license || weddingDocs.marriage_contract;
        const hasGroomBaptismal = weddingDocs.groom_baptismal_cert;
        const hasBrideBaptismal = weddingDocs.bride_baptismal_cert;
        const hasGroomConfirmation = weddingDocs.groom_confirmation_cert;
        const hasBrideConfirmation = weddingDocs.bride_confirmation_cert;

        if (!hasMarriageDoc) {
          setErrorMessage('Please upload either a marriage license or marriage contract.');
          return;
        }

        if (!hasGroomBaptismal) {
          setErrorMessage('Please upload groom baptismal certificate.');
          return;
        }

        if (!hasBrideBaptismal) {
          setErrorMessage('Please upload bride baptismal certificate.');
          return;
        }

        if (!hasGroomConfirmation) {
          setErrorMessage('Please upload groom confirmation certificate.');
          return;
        }

        if (!hasBrideConfirmation) {
          setErrorMessage('Please upload bride confirmation certificate.');
          return;
        }

    } else if (selectedSacrament === 'Baptism') {
      if (!baptismForm.candidate_first_name || !baptismForm.candidate_last_name) {
        setErrorMessage('Please fill in candidate first name and last name.');
        return;
      }
      if (!baptismForm.candidate_birthday) {
        setErrorMessage('Please enter candidate birthday.');
        return;
      }

      const birthdayMatch = baptismForm.candidate_birthday.match(/^\d{2}\/\d{2}\/\d{2,4}$/);
      if (!birthdayMatch) {
        setErrorMessage('Please enter birthday in MM/DD/YY or MM/DD/YYYY format.');
        return;
      }

      if (!baptismForm.candidate_birth_place) {
        setErrorMessage('Please enter candidate birth place.');
        return;
      }

      if (!baptismForm.father_first_name || !baptismForm.father_last_name) {
        setErrorMessage('Please fill in father first name and last name.');
        return;
      }

      if (!baptismForm.father_birth_place) {
        setErrorMessage('Please enter father birth place.');
        return;
      }

      if (!baptismForm.mother_first_name || !baptismForm.mother_last_name) {
        setErrorMessage('Please fill in mother first name and last name.');
        return;
      }

      if (!baptismForm.mother_birth_place) {
        setErrorMessage('Please enter mother birth place.');
        return;
      }

      if (!baptismForm.marriage_type) {
        setErrorMessage('Please enter marriage type.');
        return;
      }

      if (!baptismForm.address) {
        setErrorMessage('Please enter address.');
        return;
      }
      if (!baptismForm.contact_number) {
        setErrorMessage('Please enter contact number.');
        return;
      }

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

    if (selectedSacrament === 'Confession' || selectedSacrament === 'Anointing of the Sick') {
      setPaymentMethod('in_person');
      handleSubmitBooking('in_person');
      return;
    }

    setShowPaymentMethod(true);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === 'gcash') {
      setShowPaymentMethod(false);
      setShowQRCode(true);

    } else if (method === 'in_person') {
      setShowPaymentMethod(false);
      handleSubmitBooking('in_person');
    }
  };

  const pickProofOfPayment = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload proof of payment.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setProofOfPayment({
          uri: asset.uri,
          fileName: asset.fileName || asset.uri.split('/').pop() || 'proof_of_payment.jpg',
          mimeType: asset.mimeType || 'image/jpeg',
          type: asset.mimeType || 'image/jpeg',
        });

        console.log('Proof of payment image selected:', {
          uri: asset.uri,
          fileName: asset.fileName || asset.uri.split('/').pop(),
          mimeType: asset.mimeType || 'image/jpeg',
        });
      }
      
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const handleSubmitBooking = async (overridePaymentMethod = null) => {
    if (!user?.uid) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    let method = overridePaymentMethod;
    if (method && typeof method !== 'string') {
      method = null;
    }
    
    const currentPaymentMethod = method || paymentMethod || 'in_person';
    
    if (typeof currentPaymentMethod !== 'string') {
      console.error('Invalid payment method type:', typeof currentPaymentMethod, currentPaymentMethod);
      Alert.alert('Error', 'Payment method error. Please try again.');
      setSubmitting(false);
      return;
    }

    if (currentPaymentMethod === 'gcash' && !proofOfPayment) {
      Alert.alert('Proof of Payment Required', 'Please upload proof of payment before submitting your booking.');
      return;
    }

    if (date && time) {
      const conflictCheck = await checkBookingConflict(date, time);
      
      if (conflictCheck.hasConflict) {
        Alert.alert('Booking Conflict', conflictCheck.message);
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      
      formData.append('uid', user.uid);
      formData.append('full_name', fullName);
      formData.append('email', email);
      formData.append('attendees', pax.toString());

      if (!date || !time) {
        Alert.alert('Validation Error', 'Please select both date and time.');
        setSubmitting(false);
        return;
      }

      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(time.getHours());
      combinedDateTime.setMinutes(time.getMinutes());
      combinedDateTime.setSeconds(0);
      combinedDateTime.setMilliseconds(0);

      formData.append('date', combinedDateTime.toISOString());
      formData.append('time', combinedDateTime.toISOString());
      
      formData.append('payment_method', currentPaymentMethod);
      formData.append('amount', getSacramentPrice(selectedSacrament).toString());
      
      console.log('Payment method check:', {
        currentPaymentMethod,
        paymentMethodState: paymentMethod,
        hasProofOfPayment: !!proofOfPayment,
        proofOfPaymentUri: proofOfPayment?.uri,
      });
      
      if (currentPaymentMethod === 'gcash' && proofOfPayment && proofOfPayment.uri) {
        try {
          console.log('Attempting to append proof of payment...');
          formData.append('proof_of_payment', {
            uri: proofOfPayment.uri,
            type: proofOfPayment.mimeType || 'image/jpeg',
            name: proofOfPayment.fileName || proofOfPayment.name || 'proof_of_payment.jpg',
          });

          console.log('Proof of payment appended successfully:', {
            uri: proofOfPayment.uri,
            type: proofOfPayment.mimeType || 'image/jpeg',
            name: proofOfPayment.fileName || proofOfPayment.name || 'proof_of_payment.jpg',
          });

        } catch (uploadError) {
          console.error('Error appending proof of payment:', uploadError);
          Alert.alert('Error', 'Failed to attach proof of payment. Please try again.');
          setSubmitting(false);
          return;
        }
      } else {
        console.log('Proof of payment NOT appended. Reason:', {
          isGCash: currentPaymentMethod === 'gcash',
          hasProof: !!proofOfPayment,
          hasUri: !!(proofOfPayment && proofOfPayment.uri)
        });
      }

      const docs = uploadedDocuments[selectedSacrament] || {};
      
      if (selectedSacrament === 'Wedding') {
        if (!weddingForm.groom_first_name || !weddingForm.groom_last_name) {
          Alert.alert('Validation Error', 'Please fill in groom first name and last name.');
          setSubmitting(false);
          return;
        }

        if (!weddingForm.bride_first_name || !weddingForm.bride_last_name) {
          Alert.alert('Validation Error', 'Please fill in bride first name and last name.');
          setSubmitting(false);
          return;
        }

        const groomFullname = `${weddingForm.groom_first_name} ${weddingForm.groom_middle_name || ''} ${weddingForm.groom_last_name}`.trim();
        const brideFullname = `${weddingForm.bride_first_name} ${weddingForm.bride_middle_name || ''} ${weddingForm.bride_last_name}`.trim();
        
        formData.append('groom_fullname', groomFullname);
        formData.append('bride_fullname', brideFullname);
        formData.append('contact_number', weddingForm.contact_no || user.contact_number || '');

        if (weddingForm.groom_1x1 && weddingForm.groom_1x1.uri) {
          formData.append('groom_1x1', {
            uri: weddingForm.groom_1x1.uri,
            type: weddingForm.groom_1x1.mimeType || weddingForm.groom_1x1.type || 'image/jpeg',
            name: weddingForm.groom_1x1.fileName || weddingForm.groom_1x1.name || 'groom_1x1.jpg',
          });

          console.log('Appending groom_1x1 photo');
        }

        if (weddingForm.bride_1x1 && weddingForm.bride_1x1.uri) {
          formData.append('bride_1x1', {
            uri: weddingForm.bride_1x1.uri,
            type: weddingForm.bride_1x1.mimeType || weddingForm.bride_1x1.type || 'image/jpeg',
            name: weddingForm.bride_1x1.fileName || weddingForm.bride_1x1.name || 'bride_1x1.jpg',
          });

          console.log('Appending bride_1x1 photo');
        }

        console.log('Wedding documents to upload:', Object.keys(docs));
        console.log('Total documents:', Object.keys(docs).length);

        Object.keys(docs).forEach((reqId) => {
          const file = docs[reqId];
          if (file && file.uri) {
            const fileUri = file.uri;
            const fileName = file.name || file.fileName || `${reqId}.pdf`;
            const fileType = file.mimeType || file.type || 'application/pdf';

            formData.append(reqId, {
              uri: fileUri,
              type: fileType,
              name: fileName,
            });
            
            console.log(`Appending wedding document: ${reqId}`, {
              uri: fileUri,
              type: fileType,
              name: fileName,
              size: file.size
            });

          } else {
            console.warn(`Warning: ${reqId} file is missing or invalid:`, file);
          }
        });

        console.log('Wedding form submission summary:', {
          groom_fullname: weddingForm.groom_fullname,
          bride_fullname: weddingForm.bride_fullname,
          contact_no: weddingForm.contact_no,
          hasGroom1x1: !!weddingForm.groom_1x1,
          hasBride1x1: !!weddingForm.bride_1x1,
          documentsCount: Object.keys(docs).length,
          documentKeys: Object.keys(docs),
          allDocuments: Object.keys(docs).map(key => ({
            key,
            hasFile: !!docs[key],
            hasUri: !!(docs[key] && docs[key].uri),
            fileName: docs[key]?.name || docs[key]?.fileName
          }))
        });

        const requiredDocKeys = ['marriage_license', 'marriage_contract', 'groom_baptismal_cert', 'bride_baptismal_cert', 'groom_confirmation_cert', 'bride_confirmation_cert'];
        const missingRequiredDocs = requiredDocKeys.filter(key => {
          if (key === 'marriage_license' || key === 'marriage_contract') {
            return !docs.marriage_license && !docs.marriage_contract;
          }
          return !docs[key] || !docs[key].uri;
        });

        if (missingRequiredDocs.length > 0 && !(missingRequiredDocs.includes('marriage_license') && missingRequiredDocs.includes('marriage_contract'))) {
          const actualMissing = missingRequiredDocs.filter(k => k !== 'marriage_license' && k !== 'marriage_contract');

          if (actualMissing.length > 0) {
            Alert.alert('Validation Error', `Missing required documents: ${actualMissing.join(', ')}`);
            setSubmitting(false);
            return;
          }
        }

        const response = await submitBookingForm(`${API_BASE_URL}/createWedding`, formData);
        if (response) {
          Alert.alert('Success', 'Wedding booking submitted successfully!', [
            { text: 'OK', onPress: handleClose }
          ]);
        }

      } else if (selectedSacrament === 'Baptism') {
        if (!baptismForm.main_godfather?.name || !baptismForm.main_godmother?.name) {
          Alert.alert('Validation Error', 'Please fill in both main godfather and main godmother names.');
          setSubmitting(false);
          return;
        }

        if (!baptismForm.candidate_first_name || !baptismForm.candidate_last_name) {
          Alert.alert('Validation Error', 'Please fill in candidate first name and last name.');
          setSubmitting(false);
          return;
        }

        if (!baptismForm.father_first_name || !baptismForm.father_last_name) {
          Alert.alert('Validation Error', 'Please fill in father first name and last name.');
          setSubmitting(false);
          return;
        }

        if (!baptismForm.mother_first_name || !baptismForm.mother_last_name) {
          Alert.alert('Validation Error', 'Please fill in mother first name and last name.');
          setSubmitting(false);
          return;
        }

        let formattedBirthday = '';
        if (baptismForm.candidate_birthday) {
          const dateMatch = baptismForm.candidate_birthday.match(/(\d{2})\/(\d{2})\/(\d{2,4})/);
          if (dateMatch) {
            const [, month, day, year] = dateMatch;
            let fullYear = year;
            if (year.length === 2) {
              const yearNum = parseInt(year, 10);
              fullYear = yearNum <= 29 ? `20${year}` : `19${year}`;
            }

            formattedBirthday = `${fullYear}-${month}-${day}`;

          } else {
            formattedBirthday = baptismForm.candidate_birthday;
          }
        }

        formData.append('candidate_first_name', baptismForm.candidate_first_name);
        formData.append('candidate_middle_name', baptismForm.candidate_middle_name || '');
        formData.append('candidate_last_name', baptismForm.candidate_last_name);
        formData.append('candidate_birthday', formattedBirthday);
        formData.append('candidate_birth_place', baptismForm.candidate_birth_place || '');

        formData.append('father_first_name', baptismForm.father_first_name);
        formData.append('father_middle_name', baptismForm.father_middle_name || '');
        formData.append('father_last_name', baptismForm.father_last_name);
        formData.append('father_birth_place', baptismForm.father_birth_place || '');

        formData.append('mother_first_name', baptismForm.mother_first_name);
        formData.append('mother_middle_name', baptismForm.mother_middle_name || '');
        formData.append('mother_last_name', baptismForm.mother_last_name);
        formData.append('mother_birth_place', baptismForm.mother_birth_place || '');

        formData.append('marriage_type', baptismForm.marriage_type || '');
        formData.append('address', baptismForm.address || '');
        formData.append('contact_number', baptismForm.contact_number || user.contact_number || '');
        
        console.log('Baptism Form Data:');
        console.log('- candidate:', baptismForm.candidate_first_name, baptismForm.candidate_last_name);
        console.log('- father:', baptismForm.father_first_name, baptismForm.father_last_name);
        console.log('- mother:', baptismForm.mother_first_name, baptismForm.mother_last_name);
        console.log('- main_godfather:', baptismForm.main_godfather);
        console.log('- main_godmother:', baptismForm.main_godmother);
        console.log('- additional_godparents:', baptismForm.additional_godparents);

        const mainGodfather = baptismForm.main_godfather || {};
        const mainGodmother = baptismForm.main_godmother || {};
        const additionalGodparents = baptismForm.additional_godparents || [];
        
        formData.append('main_godfather', JSON.stringify(mainGodfather));
        formData.append('main_godmother', JSON.stringify(mainGodmother));
        formData.append('additional_godparents', JSON.stringify(additionalGodparents));

        console.log('Baptism booking payload:');
        console.log('- uid:', user.uid);
        console.log('- full_name:', fullName);
        console.log('- email:', email);
        console.log('- original date:', date?.toISOString());
        console.log('- original time:', time?.toISOString());
        console.log('- combined dateTime:', combinedDateTime.toISOString());
        console.log('- attendees:', pax);
        console.log('- contact_number:', user.contact_number || '');

        const baptismDocs = {
          'birth_certificate': 'birth_certificate',
          'parents_marriage_certificate': 'parents_marriage_certificate',
          'godparent_confirmation': 'godparent_confirmation',
          'baptismal_seminar': 'baptismal_seminar',
        };

        let docCount = 0;
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
            docCount++;
          }
        });

        console.log(`Total documents appended: ${docCount}`);

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

        console.log('About to submit Communion booking...');
        try {
          console.log('Calling submitBookingForm for Communion...');
          const response = await submitBookingForm(`${API_BASE_URL}/createCommunion`, formData);
          console.log('submitBookingForm returned:', response);

          if (response) {
            Alert.alert('Success', 'Communion booking submitted successfully!', [
              { text: 'OK', onPress: handleClose }
            ]);
            resetForm();
          }

        } catch (err) {
          console.error('Communion booking submission error:', err);
          console.error('Error name:', err.name);
          console.error('Error message:', err.message);
          console.error('Error stack:', err.stack);
          Alert.alert('Error', err.message || 'Failed to submit Communion booking. Please try again.');
          throw err; 
        }

      } else if (selectedSacrament === 'Anointing of the Sick') {
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
          contact_number: user.contact_number || '',
          medical_condition: '',
          transaction_id: `ANOINT-${Date.now()}`,
          status: 'pending',
        };

        try {
          const response = await fetch(`${API_BASE_URL}/createAnointing`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (response.ok) {
            Alert.alert('Success', 'Anointing of the Sick booking submitted successfully!', [
              { text: 'OK', onPress: handleClose }
            ]);
            
          } else {
            throw new Error(data.message || 'Failed to submit Anointing of the Sick booking.');
          }

        } catch (err) {
          console.error('Anointing of the Sick booking error:', err);
          Alert.alert('Error', err.message || 'Failed to submit Anointing of the Sick booking.');
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
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      Alert.alert('Error', error.message || 'Failed to submit booking. Please try again.');

    } finally {
      setSubmitting(false);
    }
  };

  const submitBookingForm = async (url, formData) => {
    console.log('Submitting booking to:', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // Increased timeout to 60s for file uploads

    let response;
    try {
      console.log('Starting fetch request...');
      console.log('FormData entries count (approximate):', formData._parts ? formData._parts.length : 'unknown');
      
      if (formData._parts) {
        console.log('FormData parts:', formData._parts.map(part => ({
          field: part[0],
          hasValue: !!part[1],
          valueType: typeof part[1],
          isFile: part[1] && typeof part[1] === 'object' && part[1].uri ? 'file' : 'text'
        })));
      }
      
      response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      console.log('Fetch request completed, status:', response.status);

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
    console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));
    
    let data;
    try {
      const text = await response.text();
      console.log('Response text:', text);
 
      if (text.trim()) {
        try {
          data = JSON.parse(text);

        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError);
          console.error('Raw response text:', text);
          throw new Error(`Server returned invalid JSON. Response: ${text.substring(0, 200)}`);
        }

      } else {
        data = { message: 'Empty response from server' };
      }

    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error(parseError.message || 'Invalid response from server');
    }

    if (response.ok) {
      return data;
      
      } else {
        let errorMsg = '';
        if (response.status === 500 || response.status === 600) {
          errorMsg = `Server error (${response.status}). ${data.message || 'Please check the server logs for more details.'}\n\n`;
          errorMsg += `Check:\n`;
          errorMsg += `- All required fields are provided\n`;
          errorMsg += `- File formats are correct\n`;
          errorMsg += `- Server database connection is working\n`;
          errorMsg += `- All required documents are uploaded\n\n`;

          if (data.error) {
            errorMsg += `Error details: ${JSON.stringify(data.error)}\n`;
          }

          if (data.stack && __DEV__) {
            errorMsg += `Stack: ${data.stack.substring(0, 500)}\n`;
          }
          
        } else {
          errorMsg = data.message || `Failed to submit booking (Status: ${response.status}). Please try again.`;
        }
        
        console.error('Server error response:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          fullResponse: JSON.stringify(data, null, 2)
        });
        
        throw new Error(errorMsg);
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

                {selectedSacrament !== 'Confession' && selectedSacrament !== 'Anointing of the Sick' && (
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
                    user={user}
                  />
                )}

                {selectedSacrament === 'Burial' && (
                  <BurialDocuments
                    burialForm={burialForm}
                    setBurialForm={setBurialForm}
                  />
                )}

                {selectedSacrament === 'Confession' || selectedSacrament === 'Anointing of the Sick' ? (
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => handleSubmitBooking()} // directly submit
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
                    disabled={checkingConflict}
                  >
                    {checkingConflict ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Next</Text>
                    )}
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

      {/* Payment Method Selection Modal */}
      <Modal
        visible={showPaymentMethod}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPaymentMethod(false)}
      >
        <View style={styles.qrCodeModalOverlay}>
          <View style={styles.qrCodeModalContent}>
            <View style={styles.qrCodeHeader}>
              <Text style={styles.qrCodeTitle}>Select Payment Method</Text>
              <TouchableOpacity onPress={() => setShowPaymentMethod(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.qrCodeContainer}>
              <Text style={styles.qrCodeSubtitle}>
                Choose your preferred payment method for your {selectedSacrament} booking
              </Text>
              
              {selectedSacrament !== 'Confession' && selectedSacrament !== 'Anointing of the Sick' && (
                <View style={styles.paymentAmountContainer}>
                  <Text style={styles.paymentAmountLabel}>Amount to Pay:</Text>
                  <Text style={styles.paymentAmount}>
                    ₱{getSacramentPrice(selectedSacrament).toLocaleString()}
                  </Text>
                </View>
              )}

              <View style={styles.paymentMethodContainer}>
                <TouchableOpacity
                  style={[
                    styles.paymentMethodOption,
                    paymentMethod === 'gcash' && styles.paymentMethodOptionSelected
                  ]}
                  onPress={() => handlePaymentMethodSelect('gcash')}
                >
                  <View style={styles.paymentMethodRadio}>
                    {paymentMethod === 'gcash' && <View style={styles.paymentMethodRadioSelected} />}
                  </View>
                  <Ionicons name="phone-portrait-outline" size={24} color={paymentMethod === 'gcash' ? '#4CAF50' : '#666'} />
                  <View style={styles.paymentMethodTextContainer}>
                    <Text style={[styles.paymentMethodText, paymentMethod === 'gcash' && styles.paymentMethodTextSelected]}>
                      GCash
                    </Text>
                    <Text style={styles.paymentMethodSubtext}>
                      Pay via GCash QR code
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentMethodOption,
                    paymentMethod === 'in_person' && styles.paymentMethodOptionSelected
                  ]}
                  onPress={() => handlePaymentMethodSelect('in_person')}
                >
                  <View style={styles.paymentMethodRadio}>
                    {paymentMethod === 'in_person' && <View style={styles.paymentMethodRadioSelected} />}
                  </View>
                  <Ionicons name="person-outline" size={24} color={paymentMethod === 'in_person' ? '#4CAF50' : '#666'} />
                  <View style={styles.paymentMethodTextContainer}>
                    <Text style={[styles.paymentMethodText, paymentMethod === 'in_person' && styles.paymentMethodTextSelected]}>
                      In-Person Payment
                    </Text>
                    <Text style={styles.paymentMethodSubtext}>
                      Pay at the church office
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        visible={showQRCode}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQRCode(false)}
      >
        <View style={styles.qrCodeModalOverlay}>
          <View style={styles.qrCodeModalContent}>
            <View style={styles.qrCodeHeader}>
              <Text style={styles.qrCodeTitle}>GCash Payment</Text>
              <TouchableOpacity onPress={() => {
                setShowQRCode(false);
                setShowPaymentMethod(true);
              }}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.qrCodeScrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.qrCodeContainer}>
                {selectedSacrament !== 'Confession' && selectedSacrament !== 'Anointing of the Sick' && (
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

                {/* Proof of Payment Upload Section */}
                <View style={styles.proofOfPaymentContainer}>
                  <Text style={styles.proofOfPaymentTitle}>Upload Proof of Payment</Text>
                  <Text style={styles.proofOfPaymentSubtext}>
                    Please upload a screenshot or photo of your GCash payment confirmation
                  </Text>
                  
                  {proofOfPayment ? (
                    <View style={styles.proofOfPaymentImageContainer}>
                      <Image
                        source={{ uri: proofOfPayment.uri }}
                        style={styles.proofOfPaymentImage}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.removeProofButton}
                        onPress={() => setProofOfPayment(null)}
                      >
                        <Ionicons name="close-circle" size={24} color="#ff4444" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.uploadProofButton}
                      onPress={pickProofOfPayment}
                    >
                      <Ionicons name="cloud-upload-outline" size={24} color="#666" />
                      <Text style={styles.uploadProofButtonText}>Upload Proof of Payment</Text>
                    </TouchableOpacity>
                  )}
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
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.qrCodeCloseButton, { flex: 1, backgroundColor: '#e0e0e0' }]}
                onPress={() => {
                  setShowQRCode(false);
                  setShowPaymentMethod(true);
                }}
              >
                <Text style={[styles.qrCodeCloseButtonText, { color: '#666' }]}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.qrCodeCloseButton, { flex: 1 }]}
                onPress={() => handleSubmitBooking()}
                disabled={submitting || (paymentMethod === 'gcash' && !proofOfPayment)}
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

