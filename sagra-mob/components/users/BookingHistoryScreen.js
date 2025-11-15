import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import styles from '../../styles/users/BookingHistoryStyle';
import CustomNavbar from '../../customs/CustomNavbar';

const sampleBookings = [
  {
    id: '1',
    sacrament: 'Wedding',
    date: '2025-10-20',
    time: '10:00 AM',
    status: 'approved',
    bookingDate: '2025-09-15',
    notes: 'Please arrive 30 minutes early',
  },
  {
    id: '2',
    sacrament: 'Baptism',
    date: '2025-11-05',
    time: '2:00 PM',
    status: 'approved',
    bookingDate: '2025-09-20',
    notes: 'Godparents must be present',
  },
  {
    id: '3',
    sacrament: 'Confirmation',
    date: '2025-11-20',
    time: '3:30 PM',
    status: 'cancelled',
    bookingDate: '2025-09-25',
    notes: 'Cancelled by user',
  },
  {
    id: '4',
    sacrament: 'First Communion',
    date: '2025-12-01',
    time: '9:00 AM',
    status: 'pending',
    bookingDate: '2025-10-01',
    notes: 'Awaiting approval',
  },
  {
    id: '5',
    sacrament: 'Burial',
    date: '2025-10-15',
    time: '11:00 AM',
    status: 'rejected',
    bookingDate: '2025-09-10',
    notes: 'Incomplete requirements',
  },
  {
    id: '6',
    sacrament: 'Confession',
    date: '2025-11-10',
    time: '4:00 PM',
    status: 'pending',
    bookingDate: '2025-10-05',
    notes: 'Under review',
  },
];

export default function BookingHistoryScreen({ user, onNavigate }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const filteredBookings = useMemo(() => {
    if (selectedFilter === 'all') {
      return sampleBookings;
    }

    return sampleBookings.filter(booking => booking.status === selectedFilter);
  }, [selectedFilter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
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

  const handleConfirmCancel = () => {
    // TODO: Implement cancel booking API call
    console.log('Cancel booking:', selectedBooking.id);
    // After successful cancellation, you might want to:
    // - Update the booking status in the list
    // - Close the modal
    // - Show a success message
    setIsConfirmModalVisible(false);
    closeModal();
  };

  const handleCancelConfirm = () => {
    setIsConfirmModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigate && onNavigate('ProfileScreen')}
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Booking History</Text>
          <Text style={styles.subtitle}>View your past and upcoming bookings</Text>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === 'all' && styles.filterButtonTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'approved' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('approved')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === 'approved' && styles.filterButtonTextActive
            ]}>
              Approved
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'pending' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('pending')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === 'pending' && styles.filterButtonTextActive
            ]}>
              Pending
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'rejected' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('rejected')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === 'rejected' && styles.filterButtonTextActive
            ]}>
              Rejected
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              { marginRight: 0 },
              selectedFilter === 'cancelled' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('cancelled')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === 'cancelled' && styles.filterButtonTextActive
            ]}>
              Cancelled
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bookingsContainer}>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <TouchableOpacity 
                key={booking.id} 
                style={styles.bookingCard}
                onPress={() => handleCardPress(booking)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <View>
                      <Text style={styles.sacramentName}>{booking.sacrament}</Text>
                      <Text style={styles.bookingDate}>
                        Booked on {formatDate(booking.bookingDate)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.statusText}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Text>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailText}>{formatDate(booking.date)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailText}>{booking.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No {selectedFilter !== 'all' ? selectedFilter : ''} bookings found
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
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayTouchable}
            activeOpacity={1}
            onPress={closeModal}
          />
          <View 
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            {selectedBooking && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedBooking.sacrament}</Text>
                  <TouchableOpacity 
                    style={styles.modalCloseButton}
                    onPress={closeModal}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalDivider} />

                <ScrollView 
                  style={styles.modalScrollView}
                  contentContainerStyle={styles.modalDetails}
                  showsVerticalScrollIndicator={false}
                >
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalLabel}>Booking ID</Text>
                      <Text style={styles.modalValue}>{selectedBooking.id}</Text>
                    </View>

                    <View style={styles.modalDivider} />

                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalLabel}>Sacrament</Text>
                      <Text style={styles.modalValue}>{selectedBooking.sacrament}</Text>
                    </View>

                    <View style={styles.modalDivider} />

                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalLabel}>Status</Text>
                      <Text style={styles.modalValue}>
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </Text>
                    </View>

                    <View style={styles.modalDivider} />

                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalLabel}>Date</Text>
                      <Text style={styles.modalValue}>{formatDate(selectedBooking.date)}</Text>
                    </View>

                    <View style={styles.modalDivider} />

                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalLabel}>Time</Text>
                      <Text style={styles.modalValue}>{selectedBooking.time}</Text>
                    </View>

                    <View style={styles.modalDivider} />

                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalLabel}>Booked on</Text>
                      <Text style={styles.modalValue}>{formatDate(selectedBooking.bookingDate)}</Text>
                    </View>

                    {selectedBooking.notes && (
                      <>
                        <View style={styles.modalDivider} />
                        <View style={styles.modalNotesContainer}>
                          <Text style={styles.modalLabel}>Notes</Text>
                          <Text style={styles.modalNotes}>{selectedBooking.notes}</Text>
                        </View>
                      </>
                    )}
                </ScrollView>

                {selectedBooking.status === 'pending' && (
                  <>
                    <View style={styles.modalDivider} />
                    <TouchableOpacity
                      style={styles.modalCancelButton}
                      onPress={handleCancelBooking}
                    >
                      <Text style={styles.modalCancelButtonText}>Cancel Booking</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={isConfirmModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelConfirm}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayTouchable}
            activeOpacity={1}
            onPress={handleCancelConfirm}
          />
          <View 
            style={styles.confirmModalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.confirmModalHeader}>
              <Text style={styles.confirmModalTitle}>Confirm Cancellation</Text>
            </View>

            <View style={styles.modalDivider} />

            <View style={styles.confirmModalBody}>
              <Text style={styles.confirmModalText}>
                Are you sure you want to cancel this booking?
              </Text>
              {selectedBooking && (
                <Text style={styles.confirmModalSubtext}>
                  {selectedBooking.sacrament} - {formatDate(selectedBooking.date)} at {selectedBooking.time}
                </Text>
              )}
            </View>

            <View style={styles.modalDivider} />

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

