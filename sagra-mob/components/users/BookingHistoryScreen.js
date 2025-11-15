import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
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
  },
  {
    id: '2',
    sacrament: 'Baptism',
    date: '2025-11-05',
    time: '2:00 PM',
    status: 'approved',
    bookingDate: '2025-09-20',
  },
  {
    id: '3',
    sacrament: 'Confirmation',
    date: '2025-11-20',
    time: '3:30 PM',
    status: 'cancelled',
    bookingDate: '2025-09-25',
  },
  {
    id: '4',
    sacrament: 'First Communion',
    date: '2025-12-01',
    time: '9:00 AM',
    status: 'approved',
    bookingDate: '2025-10-01',
  },
  {
    id: '5',
    sacrament: 'Burial',
    date: '2025-10-15',
    time: '11:00 AM',
    status: 'cancelled',
    bookingDate: '2025-09-10',
  },
];

export default function BookingHistoryScreen({ user, onNavigate }) {
  const [selectedFilter, setSelectedFilter] = useState('all');

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
              <View key={booking.id} style={styles.bookingCard}>
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
              </View>
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
    </View>
  );
}

