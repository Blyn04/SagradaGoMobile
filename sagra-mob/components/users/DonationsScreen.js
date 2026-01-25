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
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';

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
  const [donationImage, setDonationImage] = useState(null);
  const [gcashReceiptImage, setGcashReceiptImage] = useState(null);

  const GCASH_NUMBER = '09123456789';

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

  useEffect(() => {
    if (paymentMethod === 'In Kind') {
      setAmount('0');
    }
  }, [paymentMethod]);

  const handleAmountChange = (text) => {
    if (paymentMethod === 'In Kind') {
      setAmount('0');
      
    } else {
      setAmount(text);
    }
  };

  const handleConfirmDonation = async () => {
    if (!amount || !paymentMethod) {
      Alert.alert('Error', 'Please enter amount and select payment method');
      return;
  }

  const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || (paymentMethod !== 'In Kind' && amountNum <= 0)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!user?.uid) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    if (paymentMethod === 'In Kind' && !donationImage) {
      Alert.alert('Error', 'Please upload an image of your donation');
      return;
    }

    if (paymentMethod === 'GCash' && !gcashReceiptImage) {
      Alert.alert('Error', 'Please upload your GCash receipt');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('uid', user.uid);
      formData.append('amount', amountNum.toString());
      formData.append('paymentMethod', paymentMethod);
      formData.append('intercession', intercession || '');

      if (donationImage) {
        const imageUri = donationImage.uri;
        const imageName = donationImage.fileName || imageUri.split('/').pop() || 'donation-image.jpg';
        const imageType = donationImage.type || 'image/jpeg';
        
        console.log('Appending image to FormData:', {
          uri: imageUri,
          type: imageType,
          name: imageName,
        });

        formData.append('image', {
          uri: imageUri,
          type: imageType,
          name: imageName,
        });
      }

      if (gcashReceiptImage) {
        const receiptUri = gcashReceiptImage.uri;
        const receiptName = gcashReceiptImage.fileName || receiptUri.split('/').pop() || 'gcash-receipt.jpg';
        const receiptType = gcashReceiptImage.type || 'image/jpeg';
        
        console.log('Appending receipt to FormData:', {
          uri: receiptUri,
          type: receiptType,
          name: receiptName,
        });

        formData.append('receipt', {
          uri: receiptUri,
          type: receiptType,
          name: receiptName,
        });
      }

      console.log('Submitting donation with FormData:');
      console.log('- uid:', user.uid);
      console.log('- amount:', amountNum);
      console.log('- paymentMethod:', paymentMethod);
      console.log('- hasImage:', !!donationImage);
      console.log('- hasReceipt:', !!gcashReceiptImage);
      console.log('- API URL:', `${API_BASE_URL}/createDonation`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); 

      let response;
      try {
        response = await fetch(`${API_BASE_URL}/createDonation`, {
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
        Alert.alert('Success', 'Donation submitted successfully!', [
          {
            text: 'OK',
            onPress: async () => {
              setShowDonationModal(false);
              setAmount('');
              setIntercession('');
              setPaymentMethod('');
              setDonationImage(null);
              setGcashReceiptImage(null);
              await fetchDonations();
              fetchDonationStats();
            },
          },
        ]);

      } else {
        console.error('Donation creation failed:', data);
        Alert.alert('Error', data.message || 'Failed to submit donation. Please try again.');
      }

    } catch (error) {
      console.error('Error creating donation:', error);
      Alert.alert('Error', error.message || 'Network error. Please check your connection and try again.');
      
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowDonationModal(false);
    setAmount('');
    setIntercession('');
    setPaymentMethod('');
    setDonationImage(null);
    setGcashReceiptImage(null);
  };

  const pickImage = async () => {
    if (!ImagePicker) {
      Alert.alert(
        'Image Picker Not Available',
        'Please install expo-image-picker: npx expo install expo-image-picker'
      );
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setDonationImage({
          uri: asset.uri,
          fileName: asset.fileName || asset.uri.split('/').pop() || 'donation-image.jpg',
          type: asset.mimeType || asset.type || 'image/jpeg',
        });
        console.log('Image selected:', {
          uri: asset.uri,
          fileName: asset.fileName || asset.uri.split('/').pop(),
          mimeType: asset.mimeType,
          type: asset.type,
        });
      }

    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const removeImage = () => {
    setDonationImage(null);
  };

  const copyGcashNumber = async () => {
    try {
      await Clipboard.setStringAsync(GCASH_NUMBER);
      Alert.alert('Copied!', 'GCash number copied to clipboard');

    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Error', 'Failed to copy number');
    }
  };

  const pickReceiptImage = async () => {
    if (!ImagePicker) {
      Alert.alert(
        'Image Picker Not Available',
        'Please install expo-image-picker: npx expo install expo-image-picker'
      );
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload receipt images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setGcashReceiptImage({
          uri: asset.uri,
          fileName: asset.fileName || asset.uri.split('/').pop() || 'receipt.jpg',
          type: asset.mimeType || asset.type || 'image/jpeg',
        });
        console.log('Receipt image selected:', {
          uri: asset.uri,
          fileName: asset.fileName || asset.uri.split('/').pop(),
          mimeType: asset.mimeType,
          type: asset.type,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const removeReceiptImage = () => {
    setGcashReceiptImage(null);
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
            <Text style={{ marginTop: 10, color: '#666', fontFamily: 'Poppins_500Medium', textAlign: 'center' }}>Loading donations...</Text>
          </View>
        ) : donations.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#999', fontSize: 14, fontFamily: 'Poppins_500Medium', textAlign: 'center' }}>
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
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.modalContent}>
            <ScrollView
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 20 }}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.modalTitle}>Make a Donation</Text>

              <TextInput
                style={[
                  styles.modalInput,
                  paymentMethod === 'In Kind' && { color: '#333', opacity: 0.7 }
                ]}
                placeholder="Enter Amount"
                placeholderTextColor="#999"
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                editable={paymentMethod !== 'In Kind'}
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

              {paymentMethod === 'In Kind' && (
                <View style={styles.imageUploadContainer}>
                  <Text style={styles.imageUploadLabel}>Upload Image of Donation</Text>
                  
                  {donationImage ? (
                    <View style={styles.imagePreviewContainer}>
                      <Image
                        source={{ uri: donationImage.uri }}
                        style={styles.imagePreview}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={removeImage}
                      >
                        <Ionicons name="close-circle" size={24} color="#F44336" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.uploadImageButton}
                      onPress={pickImage}
                    >
                      <Ionicons name="image-outline" size={24} color="#424242" style={{ marginRight: 8 }} />
                      <Text style={styles.uploadImageButtonText}>Upload Image</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* GCash Section - Only show when "GCash" is selected */}
              {paymentMethod === 'GCash' && (
                <View style={styles.gcashContainer}>
                  <Text style={styles.gcashSectionTitle}>GCash Payment Details</Text>
                  
                  {/* GCash Number with Copy Button */}
                  <View style={styles.gcashNumberContainer}>
                    <View style={styles.gcashNumberWrapper}>
                      <Ionicons name="call-outline" size={20} color="#424242" style={{ marginRight: 8 }} />
                      <Text style={styles.gcashNumberText}>{GCASH_NUMBER}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={copyGcashNumber}
                    >
                      <Ionicons name="copy-outline" size={20} color="#424242" />
                    </TouchableOpacity>
                  </View>

                  {/* QR Code Image */}
                  <View style={styles.qrCodeContainer}>
                    <Text style={styles.qrCodeLabel}>Scan QR Code to Pay</Text>
                    <View style={styles.qrCodeImageWrapper}>
                      <Image
                        source={require('../../assets/qrCodes/qr-1.png')}
                        style={styles.qrCodeImage}
                        resizeMode="contain"
                      />
                    </View>
                  </View>

                  {/* Receipt Upload */}
                  <View style={styles.receiptUploadContainer}>
                    <Text style={styles.receiptUploadLabel}>Upload Payment Receipt</Text>
                    
                    {gcashReceiptImage ? (
                      <View style={styles.imagePreviewContainer}>
                        <Image
                          source={{ uri: gcashReceiptImage.uri }}
                          style={styles.imagePreview}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={styles.removeImageButton}
                          onPress={removeReceiptImage}
                        >
                          <Ionicons name="close-circle" size={24} color="#F44336" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.uploadImageButton}
                        onPress={pickReceiptImage}
                      >
                        <Ionicons name="receipt-outline" size={24} color="#424242" style={{ marginRight: 8 }} />
                        <Text style={styles.uploadImageButtonText}>Upload Receipt</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

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
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <CustomNavbar currentScreen="DonationsScreen" onNavigate={onNavigate} />
    </View>
  );
}
