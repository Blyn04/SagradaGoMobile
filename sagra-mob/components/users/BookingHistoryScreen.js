import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import styles from '../../styles/users/BookingHistoryStyle';
import CustomNavbar from '../../customs/CustomNavbar';
import CustomPicker from '../../customs/CustomPicker';
import { API_BASE_URL } from '../../config/API';

const SUPABASE_PUBLIC_URL = 'https://qpwoatrmswpkgyxmzkjv.supabase.co/storage/v1/object/public/bookings';

const statusColors = {
  confirmed: '#4caf50',
  approved: '#4caf50',
  pending: '#ff9800',
  rejected: '#f44336',
  cancelled: '#9e9e9e',
};

const mapStatus = (status) => {
  if (!status) return 'pending';
  const statusLower = status.toLowerCase();

  if (statusLower === 'confirmed') return 'approved';
  return statusLower;
};

export default function BookingHistoryScreen({ user, onNavigate }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSacrament, setSelectedSacrament] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [proofOfPaymentUrl, setProofOfPaymentUrl] = useState(null);
  const [loadingProofOfPayment, setLoadingProofOfPayment] = useState(false);

  const fetchAllBookings = async (isRefresh = false) => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const bookings = [];

      if (user?.is_priest) {
        try {
          const response = await fetch(`${API_BASE_URL}/getPriestSchedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priest_id: user.uid }),
          });

          const data = await response.json();

          if (response.ok && data.bookings) {
            data.bookings.forEach(booking => {
              bookings.push({
                id: booking._id || booking.transaction_id,
                transaction_id: booking.transaction_id,
                sacrament: booking.sacrament || booking.type,
                date: booking.date,
                time: booking.time,
                status: mapStatus(booking.status),
                bookingDate: booking.createdAt || booking.date,
                attendees: booking.attendees || 0,
                contact_number: booking.contact_number || '',
                priest_name: booking.priest_name || null,
                notes: booking.medical_condition || '',
                payment_method: booking.payment_method,
                amount: booking.amount,
                proof_of_payment: booking.proof_of_payment,
                full_name: booking.full_name || booking.candidate_name || booking.deceased_name ||
                  (booking.groom_name && booking.bride_name ? `${booking.groom_name} & ${booking.bride_name}` : null),
              });
            });
          }

        } catch (error) {
          console.error('Error fetching priest schedule:', error);
        }

        bookings.sort((a, b) => {
          const dateA = new Date(a.bookingDate || a.date);
          const dateB = new Date(b.bookingDate || b.date);
          return dateB - dateA;
        });

        setAllBookings(bookings);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      try {
        const weddingResponse = await fetch(`${API_BASE_URL}/getUserWeddings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid }),
        });

        const weddingData = await weddingResponse.json();

        if (weddingResponse.ok && weddingData.weddings) {
          weddingData.weddings.forEach(wedding => {
            const weddingDocuments = {};
            if (wedding.marriage_docu) weddingDocuments.marriage_license = wedding.marriage_docu;
            if (wedding.marriage_contract) weddingDocuments.marriage_contract = wedding.marriage_contract;
            if (wedding.groom_baptismal_cert) weddingDocuments.groom_baptismal_cert = wedding.groom_baptismal_cert;
            if (wedding.bride_baptismal_cert) weddingDocuments.bride_baptismal_cert = wedding.bride_baptismal_cert;
            if (wedding.groom_confirmation_cert) weddingDocuments.groom_confirmation_cert = wedding.groom_confirmation_cert;
            if (wedding.bride_confirmation_cert) weddingDocuments.bride_confirmation_cert = wedding.bride_confirmation_cert;
            if (wedding.groom_cenomar) weddingDocuments.groom_cenomar = wedding.groom_cenomar;
            if (wedding.bride_cenomar) weddingDocuments.bride_cenomar = wedding.bride_cenomar;
            if (wedding.groom_banns) weddingDocuments.groom_banns = wedding.groom_banns;
            if (wedding.bride_banns) weddingDocuments.bride_banns = wedding.bride_banns;
            if (wedding.groom_permission) weddingDocuments.groom_permission = wedding.groom_permission;
            if (wedding.bride_permission) weddingDocuments.bride_permission = wedding.bride_permission;

            bookings.push({
              id: wedding.transaction_id || wedding._id,
              transaction_id: wedding.transaction_id,
              sacrament: 'Wedding',
              date: wedding.date,
              time: wedding.time,
              status: mapStatus(wedding.status),
              bookingDate: wedding.createdAt,
              attendees: wedding.attendees,
              contact_number: wedding.contact_number,
              priest_name: wedding.priest_name || null,
              notes: '',
              payment_method: wedding.payment_method,
              amount: wedding.amount,
              proof_of_payment: wedding.proof_of_payment,

              groom_pic: wedding.groom_pic,
              bride_pic: wedding.bride_pic,
              groom_first_name: wedding.groom_first_name,
              groom_middle_name: wedding.groom_middle_name,
              groom_last_name: wedding.groom_last_name,
              bride_first_name: wedding.bride_first_name,
              bride_middle_name: wedding.bride_middle_name,
              bride_last_name: wedding.bride_last_name,
              documents: weddingDocuments,
            });
          });
        }

      } catch (error) {
        console.error('Error fetching weddings:', error);
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
            bookings.push({
              id: baptism.transaction_id || baptism._id,
              transaction_id: baptism.transaction_id,
              sacrament: 'Baptism',
              date: baptism.date,
              time: baptism.time,
              status: mapStatus(baptism.status),
              bookingDate: baptism.createdAt,
              attendees: baptism.attendees,
              contact_number: baptism.contact_number,
              priest_name: baptism.priest_name || null,
              notes: '',
              payment_method: baptism.payment_method,
              amount: baptism.amount,
              proof_of_payment: baptism.proof_of_payment,
              documents: {
                birth_certificate: baptism.birth_certificate,
                parents_marriage_certificate: baptism.parents_marriage_certificate,
                godparent_confirmation: baptism.godparent_confirmation,
                baptismal_seminar: baptism.baptismal_seminar,
              },
            });
          });
        }

      } catch (error) {
        console.error('Error fetching baptisms:', error);
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
            bookings.push({
              id: burial.transaction_id || burial._id,
              transaction_id: burial.transaction_id,
              sacrament: 'Burial',
              date: burial.date,
              time: burial.time,
              status: mapStatus(burial.status),
              bookingDate: burial.createdAt,
              attendees: burial.attendees,
              contact_number: burial.contact_number,
              priest_name: burial.priest_name || null,
              notes: '',
              payment_method: burial.payment_method,
              amount: burial.amount,
              proof_of_payment: burial.proof_of_payment,
              documents: {
                death_certificate: burial.death_certificate,
                deceased_baptismal: burial.deceased_baptismal,
              },
            });
          });
        }

      } catch (error) {
        console.error('Error fetching burials:', error);
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
            bookings.push({
              id: communion.transaction_id || communion._id,
              transaction_id: communion.transaction_id,
              sacrament: 'First Communion',
              date: communion.date,
              time: communion.time,
              status: mapStatus(communion.status),
              bookingDate: communion.createdAt,
              attendees: communion.attendees,
              contact_number: communion.contact_number,
              priest_name: communion.priest_name || null,
              notes: '',
              payment_method: communion.payment_method,
              amount: communion.amount,
              proof_of_payment: communion.proof_of_payment,
              documents: {
                baptismal_certificate: communion.baptismal_certificate,
                communion_preparation: communion.communion_preparation,
                parent_consent: communion.parent_consent,
              },
            });
          });
        }

      } catch (error) {
        console.error('Error fetching communions:', error);
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
            bookings.push({
              id: anointing.transaction_id || anointing._id,
              transaction_id: anointing.transaction_id,
              sacrament: 'Anointing of the Sick',
              date: anointing.date,
              time: anointing.time,
              status: mapStatus(anointing.status),
              bookingDate: anointing.createdAt,
              attendees: anointing.attendees,
              contact_number: anointing.contact_number,
              priest_name: anointing.priest_name || null,
              notes: anointing.medical_condition || '',
              payment_method: anointing.payment_method,
              amount: anointing.amount,
              proof_of_payment: anointing.proof_of_payment,
            });
          });
        }

      } catch (error) {
        console.error('Error fetching anointings:', error);
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
            bookings.push({
              id: confirmation.transaction_id || confirmation._id,
              transaction_id: confirmation.transaction_id,
              sacrament: 'Confirmation',
              date: confirmation.date,
              time: confirmation.time,
              status: mapStatus(confirmation.status),
              bookingDate: confirmation.createdAt,
              attendees: confirmation.attendees,
              contact_number: confirmation.contact_number,
              priest_name: confirmation.priest_name || null,
              notes: '',
              payment_method: confirmation.payment_method,
              amount: confirmation.amount,
              proof_of_payment: confirmation.proof_of_payment,
              documents: {
                baptismal_certificate: confirmation.baptismal_certificate,
                first_communion_certificate: confirmation.first_communion_certificate,
                confirmation_preparation: confirmation.confirmation_preparation,
                sponsor_certificate: confirmation.sponsor_certificate,
              },
            });
          });
        }

      } catch (error) {
        console.error('Error fetching confirmations:', error);
      }

      const confessionResponse = await fetch(`${API_BASE_URL}/getUserConfessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid }),
      });

      const confessionData = await confessionResponse.json();

      if (confessionResponse.ok && confessionData.bookings) {
        confessionData.bookings.forEach(confession => {
          bookings.push({
            id: confession._id,
            transaction_id: confession.transaction_id,
            sacrament: 'Confession',
            date: confession.date,
            time: confession.time,
            status: mapStatus(confession.status),
            bookingDate: confession.createdAt,
            attendees: confession.attendees,
            contact_number: confession.contact_number || '',
            priest_name: confession.priest_name || null,
            notes: '',
            payment_method: confession.payment_method,
            amount: confession.amount,
            proof_of_payment: confession.proof_of_payment,
          });
        });
      }

      bookings.sort((a, b) => {
        const dateA = new Date(a.bookingDate || a.date);
        const dateB = new Date(b.bookingDate || b.date);
        return dateB - dateA;
      });

      setAllBookings(bookings);

    } catch (error) {
      console.error('Error fetching bookings:', error);

      if (!isRefresh) {
        Alert.alert('Error', 'Failed to load booking history. Please try again.');
      }

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchAllBookings(true);
  };

  useEffect(() => {
    if (user?.uid) {
      fetchAllBookings();
    }
  }, [user?.uid]);

  const sacramentMap = {
    Wedding: "Wedding",
    Baptism: "Baptism",
    Burial: "Burial",
    "First Communion": "Communion",
    "Anointing of the Sick": "Anointing",
    Confirmation: "Confirmation",
    Confession: "Confession",
  };

  const sacramentOptions = [
    { label: 'All Sacraments', value: 'all' },
    { label: 'Wedding', value: 'Wedding' },
    { label: 'Baptism', value: 'Baptism' },
    { label: 'Burial', value: 'Burial' },
    { label: 'First Communion', value: 'First Communion' },
    { label: 'Anointing of the Sick', value: 'Anointing of the Sick' },
    { label: 'Confirmation', value: 'Confirmation' },
    { label: 'Confession', value: 'Confession' },
  ];

  const monthOptions = [
    { label: 'All Months', value: 'all' },
    { label: 'January', value: '0' },
    { label: 'February', value: '1' },
    { label: 'March', value: '2' },
    { label: 'April', value: '3' },
    { label: 'May', value: '4' },
    { label: 'June', value: '5' },
    { label: 'July', value: '6' },
    { label: 'August', value: '7' },
    { label: 'September', value: '8' },
    { label: 'October', value: '9' },
    { label: 'November', value: '10' },
    { label: 'December', value: '11' },
  ];

  const filteredBookings = useMemo(() => {
    let filtered = allBookings;


    if (selectedFilter !== 'all') {
      const statusMap = {
        'approved': 'confirmed',
        'pending': 'pending',
        'rejected': 'cancelled',
        'cancelled': 'cancelled',
      };

      filtered = filtered.filter(booking => {
        const bookingStatus = booking.status.toLowerCase();
        if (selectedFilter === 'approved') {
          return bookingStatus === 'approved' || bookingStatus === 'confirmed';
        }
        return bookingStatus === selectedFilter.toLowerCase();
      });
    }

    if (selectedSacrament !== 'all') {
      filtered = filtered.filter(booking => booking.sacrament === selectedSacrament);
    }

    if (selectedMonth !== 'all') {
      filtered = filtered.filter(booking => {
        if (!booking.date) return false;
        const bookingDate = new Date(booking.date);

        if (isNaN(bookingDate.getTime())) return false;
        return bookingDate.getMonth() === parseInt(selectedMonth);
      });
    }

    return filtered;

  }, [selectedFilter, selectedSacrament, selectedMonth, allBookings]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';

    if (typeof timeString === 'string' && (timeString.includes('AM') || timeString.includes('PM'))) {
      return timeString;
    }

    if (timeString instanceof Date || (typeof timeString === 'string' && timeString.includes('T'))) {
      const date = new Date(timeString);

      if (isNaN(date.getTime())) return timeString;
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const hour12 = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
      const period = hours >= 12 ? 'PM' : 'AM';
      return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    return timeString;
  };

  const getSupabasePublicUrl = (path) => {
    if (!path) return null;

    if (path.startsWith('http')) {
      return path;
    }

    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${SUPABASE_PUBLIC_URL}/${cleanPath}`;
  };

  const handleOpenDocument = async (documentPath, documentName) => {
    if (!documentPath) {
      Alert.alert('Error', 'Document path not available');
      return;
    }

    try {
      const url = getSupabasePublicUrl(documentPath);
      console.log('Opening document:', documentName, 'URL:', url);

      if (!url) {
        Alert.alert('Error', 'Unable to construct document URL');
        return;
      }

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);

      } else {
        Alert.alert('Error', `Cannot open this document: ${documentName}`);
      }

    } catch (error) {
      console.error('Error opening document:', error);
      Alert.alert('Error', 'Failed to open document. Please try again.');
    }
  };

  const handleCardPress = async (booking) => {
    console.log('Selected booking - Full object:', JSON.stringify(booking, null, 2));
    console.log('Selected booking - Payment info:', {
      payment_method: booking.payment_method,
      payment_method_type: typeof booking.payment_method,
      amount: booking.amount,
      amount_type: typeof booking.amount,
      proof_of_payment: booking.proof_of_payment,
      proof_of_payment_type: typeof booking.proof_of_payment,
      documents: booking.documents,
    });

    setSelectedBooking(booking);
    setIsModalVisible(true);

    setProofOfPaymentUrl(null);
    setLoadingProofOfPayment(false);

    if (booking.payment_method === 'gcash' && booking.proof_of_payment) {
      console.log('Fetching proof of payment for GCash booking:', booking.proof_of_payment);

      if (booking.proof_of_payment.startsWith('http')) {
        console.log('Proof of payment is already a URL:', booking.proof_of_payment);
        setProofOfPaymentUrl(booking.proof_of_payment);
        setLoadingProofOfPayment(false);

      } else {
        setLoadingProofOfPayment(true);
        try {
          console.log('Fetching signed URL for path:', booking.proof_of_payment);
          const response = await fetch(`${API_BASE_URL}/getProofOfPayment?path=${encodeURIComponent(booking.proof_of_payment)}`);
          const data = await response.json();
          console.log('Proof of payment response:', data);
          if (data.url) {
            setProofOfPaymentUrl(data.url);
            setLoadingProofOfPayment(false);

          } else {
            console.warn('No URL in response:', data);
            setLoadingProofOfPayment(false);
          }

        } catch (error) {
          console.error('Error fetching proof of payment URL:', error);
          setLoadingProofOfPayment(false);
        }
      }
    } else {
      console.log('Not fetching proof of payment - payment_method:', booking.payment_method, 'proof_of_payment:', booking.proof_of_payment);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
    setProofOfPaymentUrl(null);
    setLoadingProofOfPayment(false);
  };

  const handleCancelBooking = () => {
    setIsConfirmModalVisible(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;

    try {
      const bookingType = sacramentMap[selectedBooking.sacrament];

      if (!bookingType) throw new Error('Invalid booking type');

      const response = await fetch(`${API_BASE_URL}/cancelBooking`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction_id: selectedBooking.transaction_id || selectedBooking.id,
          bookingType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel booking');
      }

      setAllBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id ? { ...b, status: 'cancelled' } : b
        )
      );

      setIsConfirmModalVisible(false);
      closeModal();
      Alert.alert('Success', data.message || 'Booking cancelled successfully');

    } catch (error) {
      console.error('Cancel booking error:', error);
      Alert.alert('Error', error.message || 'Failed to cancel booking');
    }
  };

  const handleCancelConfirm = () => {
    setIsConfirmModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => onNavigate && onNavigate('ProfileScreen')}
      >
        <Ionicons name="chevron-back" size={28} color="#333" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Image
          source={require('../../assets/sagrada.png')}
          style={{ width: 80, height: 80, marginBottom: 10, alignSelf: 'center' }}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          {user?.is_priest ? 'My Schedule' : 'Booking History'}
        </Text>

        <Text style={styles.subtitle}>
          {user?.is_priest
            ? 'View your assigned bookings and schedule'
            : 'View your past and upcoming bookings'}
        </Text>
      </View>

      {/* Status Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={{ paddingRight: 20, marginHorizontal: 20, gap: 10, height: 40, marginTop: 20 }}
      >
        {['all', 'approved', 'pending', 'rejected', 'cancelled'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.filterButtonTextActive
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sacrament and Month Filters */}
      <View style={[styles.additionalFiltersContainer, { marginTop: -360 }]}>
        <View style={styles.pickerContainer}>
          <CustomPicker
            value={sacramentOptions.find(opt => opt.value === selectedSacrament)?.label}
            onValueChange={(value) => setSelectedSacrament(value)}
            options={sacramentOptions}
            placeholder="All Sacraments"
            iconName="water-outline"
            style={[styles.customPicker]}
          />
        </View>
        <View style={styles.pickerContainer}>
          <CustomPicker
            value={monthOptions.find(opt => opt.value === selectedMonth)?.label}
            onValueChange={(value) => setSelectedMonth(value)}
            options={monthOptions}
            placeholder="All Months"
            iconName="calendar-outline"
            style={[styles.customPicker]}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.bookingsContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FFC942']}
            tintColor="#FFC942"
          />
        }
      >
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FFC942" />
            <Text style={{ marginTop: 10, color: '#666', fontFamily: 'Poppins_500Medium' }}>
              Loading bookings...
            </Text>
          </View>
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              style={styles.bookingCard}
              onPress={() => handleCardPress(booking)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={styles.sacramentName}>{booking.sacrament}</Text>
                  <Text style={styles.bookingDate}>
                    Booked on {formatDate(booking.bookingDate)}
                  </Text>
                </View>

                <View
                  style={{
                    paddingVertical: 4,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    backgroundColor: statusColors[booking.status] || statusColors[mapStatus(booking.status)] || '#ccc',
                  }}
                >
                  <Text style={{ color: '#fff', fontFamily: 'Poppins_600SemiBold', fontSize: 13 }}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#bdbdbdff" style={{ marginRight: 6 }} />
                  <Text style={styles.detailText}>{formatDate(booking.date)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color="#bdbdbdff" style={{ marginRight: 6 }} />
                  <Text style={styles.detailText}>{formatTime(booking.time)}</Text>
                </View>
              </View>

              {booking.full_name && user?.is_priest && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="person-outline" size={16} color="#bdbdbdff" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14, color: '#666', fontFamily: 'Poppins_500Medium' }}>
                    {booking.full_name}
                  </Text>
                </View>
              )}

              {booking.priest_name && !user?.is_priest && booking.status === 'approved' && (
                <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="person-outline" size={16} color="#4CAF50" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14, color: '#4CAF50', fontFamily: 'Poppins_500Medium' }}>
                    Priest: {booking.priest_name}
                  </Text>
                </View>
              )}

              {booking.contact_number && user?.is_priest && (
                <View style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="call-outline" size={16} color="#bdbdbdff" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14, color: '#666', fontFamily: 'Poppins_400Regular' }}>
                    {booking.contact_number}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyText}>
              {selectedFilter !== 'all'
                ? `No ${selectedFilter} bookings found.`
                : user?.is_priest
                  ? 'No bookings assigned to you yet.'
                  : 'No bookings yet. Book a sacrament to get started!'}
            </Text>
          </View>
        )}
      </ScrollView>

      <CustomNavbar
        currentScreen="BookingHistoryScreen"
        onNavigate={onNavigate}
      />

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayTouchable}
            activeOpacity={1}
            onPress={closeModal}
          />
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            {selectedBooking && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedBooking.sacrament}</Text>
                  <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.modalScrollView}
                  contentContainerStyle={styles.modalDetails}
                  showsVerticalScrollIndicator={false}
                >
                  {[
                    { label: "Booking ID", value: selectedBooking.id },
                    { label: "Sacrament", value: selectedBooking.sacrament },
                    { label: "Status", value: selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1) },
                    { label: "Date", value: formatDate(selectedBooking.date), icon: "calendar-outline" },
                    { label: "Time", value: formatTime(selectedBooking.time), icon: "time-outline" },
                    ...(selectedBooking.sacrament === 'Wedding' && selectedBooking.groom_first_name ? [{
                      label: "Groom Name",
                      value: `${selectedBooking.groom_first_name || ''} ${selectedBooking.groom_middle_name || ''} ${selectedBooking.groom_last_name || ''}`.trim(),
                      icon: "person-outline"
                    }] : []),
                    ...(selectedBooking.sacrament === 'Wedding' && selectedBooking.bride_first_name ? [{
                      label: "Bride Name",
                      value: `${selectedBooking.bride_first_name || ''} ${selectedBooking.bride_middle_name || ''} ${selectedBooking.bride_last_name || ''}`.trim(),
                      icon: "person-outline"
                    }] : []),
                    ...(selectedBooking.full_name && user?.is_priest && selectedBooking.sacrament !== 'Wedding' ? [{ label: "Participant", value: selectedBooking.full_name, icon: "person-outline" }] : []),
                    { label: "Attendees", value: selectedBooking.attendees ? `${selectedBooking.attendees} people` : 'N/A', icon: "people-outline" },
                    ...(selectedBooking.contact_number && user?.is_priest ? [{ label: "Contact Number", value: selectedBooking.contact_number, icon: "call-outline" }] : []),
                    { label: "Transaction ID", value: selectedBooking.transaction_id || selectedBooking.id, icon: "receipt-outline" },
                    { label: "Booked on", value: formatDate(selectedBooking.bookingDate), icon: "calendar-outline" },
                    ...(selectedBooking.priest_name && !user?.is_priest ? [{ label: "Assigned Priest", value: selectedBooking.priest_name, icon: "person-outline" }] : []),
                    ...(selectedBooking.payment_method ? [{
                      label: "Payment Method",
                      value: selectedBooking.payment_method === 'gcash' ? 'GCash' : (selectedBooking.payment_method === 'in_person' ? 'In-Person Payment' : selectedBooking.payment_method),
                      icon: selectedBooking.payment_method === 'gcash' ? "phone-portrait-outline" : "person-outline"
                    }] : []),
                    ...(selectedBooking.amount && parseFloat(selectedBooking.amount) > 0 ? [{
                      label: "Amount",
                      value: `₱${parseFloat(selectedBooking.amount).toLocaleString()}`,
                      icon: "wallet-outline"
                    }] : []),
                    ...(selectedBooking.notes ? [{ label: "Notes", value: selectedBooking.notes, icon: "document-text-outline" }] : []),
                  ].map((item, idx) => (
                    <React.Fragment key={idx}>
                      <View style={styles.modalDetailRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                          {item.icon && <Ionicons name={item.icon} size={16} color="#666" style={{ marginRight: 6 }} />}
                          <Text style={styles.modalLabel}>{item.label}</Text>
                        </View>
                        <Text style={styles.modalValue}>{item.value}</Text>
                      </View>
                      <View style={styles.modalDivider} />
                    </React.Fragment>
                  ))}

                  {selectedBooking.notes && (
                    <View style={styles.modalNotesContainer}>
                      <Text style={styles.modalLabel}>Notes</Text>
                      <Text style={styles.modalNotes}>{selectedBooking.notes}</Text>
                    </View>
                  )}

                  {/* Proof of Payment Section - Show if payment method is gcash */}
                  {selectedBooking.payment_method === 'gcash' && (
                    <View style={styles.modalNotesContainer}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="receipt-outline" size={18} color="#666" style={{ marginRight: 6 }} />
                        <Text style={styles.modalLabel}>Proof of Payment</Text>
                      </View>
                      {loadingProofOfPayment ? (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                          <ActivityIndicator size="small" color="#666" />
                          <Text style={[styles.modalNotes, { marginTop: 10 }]}>Loading proof of payment...</Text>
                        </View>
                      ) : proofOfPaymentUrl ? (
                        <Image
                          source={{ uri: proofOfPaymentUrl }}
                          style={styles.proofOfPaymentImage}
                          resizeMode="contain"
                          onError={(error) => {
                            console.error('Error loading proof of payment image:', error);
                            console.error('Failed URL:', proofOfPaymentUrl);
                            setProofOfPaymentUrl(null);
                          }}
                          onLoad={() => {
                            console.log('Proof of payment image loaded successfully:', proofOfPaymentUrl);
                          }}
                        />
                      ) : selectedBooking.proof_of_payment ? (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                          <Text style={[styles.modalNotes, { color: '#ff9800' }]}>
                            Unable to load proof of payment image.
                          </Text>
                          <Text style={[styles.modalNotes, { marginTop: 5, fontSize: 12 }]}>
                            Path: {selectedBooking.proof_of_payment}
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.modalNotes}>No proof of payment uploaded</Text>
                      )}
                    </View>
                  )}

                  {/* Wedding Images Section */}
                  {selectedBooking.sacrament === 'Wedding' && (selectedBooking.groom_pic || selectedBooking.bride_pic) && (
                    <View style={styles.modalNotesContainer}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="images-outline" size={18} color="#666" style={{ marginRight: 6 }} />
                        <Text style={styles.modalLabel}>Photos</Text>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                        {selectedBooking.groom_pic && (
                          <View style={{ flex: 1, minWidth: '45%' }}>
                            <Text style={[styles.modalNotes, { marginBottom: 5, fontSize: 12 }]}>Groom Photo</Text>
                            <Image
                              source={{ uri: getSupabasePublicUrl(selectedBooking.groom_pic) }}
                              style={{
                                width: '100%',
                                height: 150,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: '#ddd',
                              }}
                              resizeMode="cover"
                              onError={(error) => {
                                console.error('Error loading groom photo:', error);
                              }}
                            />
                          </View>
                        )}
                        {selectedBooking.bride_pic && (
                          <View style={{ flex: 1, minWidth: '45%' }}>
                            <Text style={[styles.modalNotes, { marginBottom: 5, fontSize: 12 }]}>Bride Photo</Text>
                            <Image
                              source={{ uri: getSupabasePublicUrl(selectedBooking.bride_pic) }}
                              style={{
                                width: '100%',
                                height: 150,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: '#ddd',
                              }}
                              resizeMode="cover"
                              onError={(error) => {
                                console.error('Error loading bride photo:', error);
                              }}
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                  {/* Documents Section */}
                  {selectedBooking.documents && Object.keys(selectedBooking.documents).filter(key => selectedBooking.documents[key]).length > 0 && (
                    <View style={styles.modalNotesContainer}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="document-text-outline" size={18} color="#666" style={{ marginRight: 6 }} />
                        <Text style={styles.modalLabel}>Uploaded Documents</Text>
                      </View>
                      {Object.entries(selectedBooking.documents).map(([key, path]) => {
                        if (!path) return null;

                        const documentLabels = {
                          // Baptism
                          baptismal_certificate: 'Baptismal Certificate',
                          communion_preparation: 'Communion Preparation',
                          parent_consent: 'Parent Consent',
                          birth_certificate: 'Birth Certificate',
                          parents_marriage_certificate: 'Parents Marriage Certificate',
                          godparent_confirmation: 'Godparent Confirmation',
                          baptismal_seminar: 'Baptismal Seminar',
                          // Burial
                          death_certificate: 'Death Certificate',
                          deceased_baptismal: 'Deceased Baptismal',
                          // Communion
                          first_communion_certificate: 'First Communion Certificate',
                          // Confirmation
                          confirmation_preparation: 'Confirmation Preparation',
                          sponsor_certificate: 'Sponsor Certificate',
                          // Wedding
                          marriage_license: 'Marriage License',
                          marriage_contract: 'Marriage Contract',
                          groom_baptismal_cert: 'Groom Baptismal Certificate',
                          bride_baptismal_cert: 'Bride Baptismal Certificate',
                          groom_confirmation_cert: 'Groom Confirmation Certificate',
                          bride_confirmation_cert: 'Bride Confirmation Certificate',
                          groom_cenomar: 'Groom CENOMAR',
                          bride_cenomar: 'Bride CENOMAR',
                          groom_banns: 'Groom Banns',
                          bride_banns: 'Bride Banns',
                          groom_permission: 'Groom Parental Permission',
                          bride_permission: 'Bride Parental Permission',
                        };

                        const label = documentLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                        return (
                          <TouchableOpacity
                            key={key}
                            style={styles.documentButton}
                            onPress={() => handleOpenDocument(path, label)}
                          >
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                              <Ionicons name="document-outline" size={20} color="#424242" style={{ marginRight: 10 }} />
                              <Text style={styles.documentButtonText}>{label}</Text>
                            </View>
                            <Ionicons name="open-outline" size={20} color="#424242" />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </ScrollView>

                {selectedBooking.status === 'pending' && (
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={handleCancelBooking}
                  >
                    <Text style={styles.modalCancelButtonText}>Cancel Booking</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={isConfirmModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelConfirm}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayTouchable}
            activeOpacity={1}
            onPress={handleCancelConfirm}
          />
          <View style={styles.confirmModalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.confirmModalTitle}>Are you sure you want to cancel this booking?</Text>
            {selectedBooking && (
              <View style={styles.confirmModalTextContainer}>
                <Text style={styles.confirmModalText}>
                  {selectedBooking.sacrament} - {formatDate(selectedBooking.date)} at {selectedBooking.time}
                </Text>
              </View>
            )}
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity
                style={styles.confirmModalButton}
                onPress={handleCancelConfirm}
              >
                <Text style={styles.confirmModalButtonText}>No, Keep Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmModalButton, styles.confirmModalButtonPrimary]}
                onPress={handleConfirmCancel}
              >
                <Text style={[styles.confirmModalButtonText, styles.confirmModalButtonTextPrimary]}>
                  Yes, Cancel Booking
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

