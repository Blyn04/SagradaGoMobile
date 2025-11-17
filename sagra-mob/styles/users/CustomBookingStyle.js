import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: '#1a1a1a',
  },
  modalScrollView: {
    padding: 20,
  },
  formSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    width: '80%',
    alignSelf: 'center'
  },
  sacramentDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  sacramentDisplayText: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#2e7d32',
    marginLeft: 10,
  },
  noSacramentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noSacramentText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
  },

  // Input Styles
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  inputHelperText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginTop: 5,
    marginLeft: 5,
  },

  // Info Container
  infoContainer: {
    backgroundColor: '#fff9e6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#FFC942',
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#666',
    marginBottom: 4,
  },

  // Error Styles
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#ff4444',
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#ff4444',
    marginLeft: 8,
  },

  // Date Picker Modal
  datePickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  datePickerModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  datePickerCloseButton: {
    backgroundColor: '#FFC942',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  datePickerCloseButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#424242',
  },

  // Submit Button
  submitButton: {
    backgroundColor: '#FFC942',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#424242',
  },

  // QR Code Modal Styles
  qrCodeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrCodeModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  qrCodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  qrCodeTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: '#1a1a1a',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrCodeSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  paymentAmountContainer: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    alignItems: 'center',
  },
  paymentAmountLabel: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#666',
    marginBottom: 5,
  },
  paymentAmount: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#2e7d32',
  },
  qrCodeImageWrapper: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeImage: {
    width: 250,
    height: 250,
  },
  bookingDetailsContainer: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  bookingDetailsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    marginBottom: 12,
  },
  bookingDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingDetailText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginLeft: 10,
  },
  qrCodeCloseButton: {
    backgroundColor: '#FFC942',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  qrCodeCloseButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#424242',
  },
});

export default styles;

