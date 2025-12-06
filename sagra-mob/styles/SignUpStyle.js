import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 30,
  },

  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 6,
    zIndex: 10,
  },

  formContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 10,
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: -5,
  },

  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  inputContainerError: {
    borderColor: '#ff3b30',
    borderWidth: 1.5,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
  },

  errorText: {
    color: '#ff3b30',
    fontFamily: 'Poppins_400Regular',
    textAlign: 'right',
    fontSize: 12,
    marginBottom: 10,
    marginTop: -5,
    marginLeft: 5,
  },

  pickerContainer: {
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginLeft: 3,
    fontWeight: '500',
  },

  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginBottom: 0,
  },

  pickerText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
    height: 50,
    justifyContent: 'center',
  },

  pickerError: {
    borderColor: '#ff3b30',
    borderWidth: 1.5,
  },

  datePickerButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    justifyContent: 'center',
  },

  datePickerText: {
    fontSize: 16,
    color: '#333',
  },

  datePickerPlaceholder: {
    color: '#999',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },

  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  pickerColumn: {
    flex: 1,
    marginHorizontal: 5,
  },

  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#666',
  },

  datePicker: {
    height: 150,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  modalButton: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },

  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },

  modalButtonConfirm: {
    backgroundColor: '#007AFF',
  },

  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalButtonTextCancel: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },

  yellowButton: {
    backgroundColor: '#FFC942',
    paddingVertical: 9,
    borderRadius: 20,
    marginVertical: 5,
    width: '100%'
  },

  darkButton: {
    backgroundColor: '#424242',
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 5,
    width: '100%'
  },

  yellowButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#424242',
    textAlign: 'center',
  },

  darkButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    textAlign: 'center',
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#999',
  },

  separatorText: {
    marginHorizontal: 10,
    fontFamily: 'Poppins_500Medium',
    color: '#999',
    fontSize: 14,
  },

  switchButton: {
    alignItems: 'center',
  },

  switchText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },

  switchTextBold: {
    color: '#424242',
    fontFamily: 'Poppins_700Bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },

});

export default styles;

