import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import styles from '../../styles/users/DonationsStyle';
import CustomNavbar from '../../customs/CustomNavbar';
import CustomPicker from '../../customs/CustomPicker';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_BASE_URL } from '../../config/API';

export default function DonationsScreen({ user, onNavigate }) {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [intercession, setIntercession] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [donations, setDonations] = useState([]);
  const [allDonations, setAllDonations] = useState([]); // Store all donations for filtering
  const [donationStats, setDonationStats] = useState({ totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const paymentMethods = ['GCash', 'Cash', 'In Kind'];

  const statusOptions = [
    { label: 'All Donations', value: 'all' },
    { label: 'Approved', value: 'confirmed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Rejected', value: 'cancelled' },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const fetchDonations = async () => {
    if (!user?.uid) return;

    try {
      const response = await fetch(`${API_BASE_URL}/getUserDonations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const fetchedDonations = data.donations || [];
        setAllDonations(fetchedDonations);
        filterDonationsByStatus(fetchedDonations, statusFilter);

      } else {
        console.error('Error fetching donations:', data.message);
        setDonations([]);
        setAllDonations([]);
      }

    } catch (error) {
      console.error('Error fetching donations:', error);
      setDonations([]);
      setAllDonations([]);
    }
  };

  const fetchDonationStats = async () => {
    if (!user?.uid) return;

    try {
      const response = await fetch(`${API_BASE_URL}/getDonationStats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDonationStats(data.stats || { totalAmount: 0 });

      } else {
        console.error('Error fetching donation stats:', data.message);
        setDonationStats({ totalAmount: 0 });
      }

    } catch (error) {
      console.error('Error fetching donation stats:', error);
      setDonationStats({ totalAmount: 0 });
    }
  };

  useEffect(() => {
    if (!user?.uid) return;

    let interval;

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDonations(), fetchDonationStats()]);
      setLoading(false);
    };

    loadData();

    interval = setInterval(() => {
      fetchDonations();
      fetchDonationStats();
    }, 5000);

    return () => clearInterval(interval);
  }, [user?.uid]);

  const handleConfirmDonation = async () => {
    if (!amount || !paymentMethod) {
      Alert.alert('Error', 'Please enter amount and select payment method');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!user?.uid) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/createDonation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          amount: amountNum,
          paymentMethod: paymentMethod,
          intercession: intercession || '',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Donation submitted successfully!', [
          {
            text: 'OK',
            onPress: async () => {
              setShowDonationModal(false);
              setAmount('');
              setIntercession('');
              setPaymentMethod('');
              await fetchDonations();
              fetchDonationStats();
            },
          },
        ]);

      } else {
        Alert.alert('Error', data.message || 'Failed to submit donation. Please try again.');
      }

    } catch (error) {
      console.error('Error creating donation:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
      
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowDonationModal(false);
    setAmount('');
    setIntercession('');
    setPaymentMethod('');
  };

  const filterDonationsByStatus = (donationsList, filter) => {
    if (filter === 'all') {
      setDonations(donationsList);

    } else {
      const filtered = donationsList.filter(donation => {
        const donationStatus = (donation.status || 'pending').toLowerCase();
        return donationStatus === filter.toLowerCase();
      });
      
      setDonations(filtered);
    }
  };

  const handleStatusFilterChange = (selectedStatus) => {
    setStatusFilter(selectedStatus);
    filterDonationsByStatus(allDonations, selectedStatus);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>

        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/sagrada.png')}
            style={{ width: 60, height: 60, alignSelf: 'center' }}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.title}>Donations</Text>
            <Text style={styles.subtitle}>Make a donation to support our cause.</Text>
          </View>
        </View>

        {/* SUMMARY SECTION */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryBar} />
          <Text style={styles.summaryLabel}>You have donated a total of:</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#FFC942" style={{ marginTop: 10 }} />
          ) : (
            <Text style={styles.summaryAmount}>
              PHP {donationStats.totalAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </Text>
          )}
        </View>

        {/* RECENT DONATIONS */}
        <View style={styles.filterContainer}>
          <Text style={styles.sectionTitle}>Your Donation History</Text>
          <CustomPicker
            value={statusOptions.find(opt => opt.value === statusFilter)?.label || 'All Donations'}
            onValueChange={handleStatusFilterChange}
            options={statusOptions}
            placeholder="Filter by status"
            iconName="filter-outline"
            style={styles.statusFilterPicker}
          />
        </View>
        {loading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FFC942" />
            <Text style={{ marginTop: 10, color: '#666' }}>Loading donations...</Text>
          </View>
        ) : donations.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#999', fontSize: 14 }}>
              {statusFilter === 'all' 
                ? 'No donations yet. Make your first donation!'
                : `No ${statusOptions.find(opt => opt.value === statusFilter)?.label.toLowerCase()} donations found.`}
            </Text>
          </View>
        ) : (
          <View style={styles.historyContainer}>
            {donations.map((item) => {
              const status = item.status || 'pending';
              const getStatusColor = (status) => {
                switch (status.toLowerCase()) {
                  case 'confirmed':
                    return '#4CAF50';
                  case 'pending':
                    return '#FF9800';
                  case 'cancelled':
                    return '#F44336';
                  default:
                    return '#FF9800';
                }
              };
              const getStatusText = (status) => {
                switch (status.toLowerCase()) {
                  case 'confirmed':
                    return 'Confirmed';
                  case 'pending':
                    return 'Pending';
                  case 'cancelled':
                    return 'Cancelled';
                  default:
                    return 'Pending';
                }
              };

              return (
                <View key={item._id} style={styles.historyItemWrapper}>
                  <View style={styles.historyItemRow}>
                    <View style={[styles.historyItemColor, { backgroundColor: getStatusColor(status) }]} />
                    <View style={styles.historyItemContent}>
                      <View style={styles.historyHeaderRow}>
                        <Text style={styles.historyAmount}>PHP {item.amount?.toFixed(2) || '0.00'}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '20' }]}>
                          <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                            {getStatusText(status)}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.historyMethod}>{item.paymentMethod || 'N/A'}</Text>
                      <View style={styles.historyDateRow}>
                        <Ionicons name="calendar-outline" size={14} color="#999" style={{ marginRight: 4 }} />
                        <Text style={styles.historyDate}>
                          {item.createdAt ? formatDate(item.createdAt) : 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* DONATE BUTTON */}
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.donateButton}
            onPress={() => setShowDonationModal(true)}
          >
            <Text style={styles.donateButtonText}>Make a Donation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* DONATION MODAL */}
      <Modal
        visible={showDonationModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Make a Donation</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Enter Amount"
              placeholderTextColor="#999"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <View style={styles.paymentMethodContainer}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentMethodOption,
                    paymentMethod === method && styles.paymentMethodOptionSelected,
                  ]}
                  onPress={() => setPaymentMethod(method)}
                >
                  <Text
                    style={[
                      styles.paymentMethodText,
                      paymentMethod === method && styles.paymentMethodTextSelected,
                    ]}
                  >
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[styles.modalInput, styles.modalInputMultiline]}
              placeholder="Donation Intercession (Optional)"
              placeholderTextColor="#999"
              value={intercession}
              onChangeText={setIntercession}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />



            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, submitting && { opacity: 0.6 }]}
                onPress={handleConfirmDonation}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <CustomNavbar currentScreen="DonationsScreen" onNavigate={onNavigate} />
    </View>
  );
}
