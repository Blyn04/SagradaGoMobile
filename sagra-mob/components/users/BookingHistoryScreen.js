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
  RefreshControl
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import styles from '../../styles/users/BookingHistoryStyle';
import CustomNavbar from '../../customs/CustomNavbar';
import { API_BASE_URL } from '../../config/API';

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
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

      try {
        const weddingResponse = await fetch(`${API_BASE_URL}/getUserWeddings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid }),
        });

        const weddingData = await weddingResponse.json();

        if (weddingResponse.ok && weddingData.weddings) {
          weddingData.weddings.forEach(wedding => {
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
              notes: '',
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
              notes: '',
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
              notes: '',
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
              notes: '',
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
              notes: anointing.medical_condition || '',
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
              notes: '',
            });
          });
        }

      } catch (error) {
        console.error('Error fetching confirmations:', error);
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
  };

  const filteredBookings = useMemo(() => {
    if (selectedFilter === 'all') {
      return allBookings;
    }

    const statusMap = {
      'approved': 'confirmed',
      'pending': 'pending',
      'rejected': 'cancelled', 
      'cancelled': 'cancelled',
    };

    const backendStatus = statusMap[selectedFilter] || selectedFilter;
    
    return allBookings.filter(booking => {
      const bookingStatus = booking.status.toLowerCase();
      if (selectedFilter === 'approved') {
        return bookingStatus === 'approved' || bookingStatus === 'confirmed';
      }

      return bookingStatus === selectedFilter.toLowerCase();
    });

  }, [selectedFilter, allBookings]);

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

  const handleCardPress = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
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
        <Text style={styles.title}>Booking History</Text>
        <Text style={styles.subtitle}>View your past and upcoming bookings</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={{ paddingRight: 20, margin: 20, gap: 10, height: 40, marginBottom: 60 }}
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

      <ScrollView
        style={styles.scrollView}
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
        <View style={styles.bookingsContainer}>
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
                    <Ionicons name="calendar-outline" size={16} color="#666" style={{ marginRight: 6 }} />
                    <Text style={styles.detailText}>{formatDate(booking.date)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color="#666" style={{ marginRight: 6 }} />
                    <Text style={styles.detailText}>{formatTime(booking.time)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" style={{ marginBottom: 10 }} />
              <Text style={styles.emptyText}>
                {selectedFilter !== 'all' 
                  ? `No ${selectedFilter} bookings found` 
                  : 'No bookings yet. Book a sacrament to get started!'}
              </Text>
            </View>
          )}
        </View>
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
                    { label: "Attendees", value: selectedBooking.attendees ? `${selectedBooking.attendees} people` : 'N/A', icon: "people-outline" },
                    { label: "Transaction ID", value: selectedBooking.transaction_id || selectedBooking.id, icon: "receipt-outline" },
                    { label: "Booked on", value: formatDate(selectedBooking.bookingDate), icon: "calendar-outline" },
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

