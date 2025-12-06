import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 30,
  },

  // HEADER
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    padding: 5,
    zIndex: 10,
  },

  header: {
    marginTop: 10,
    marginBottom: -15,
    alignItems: 'center'
  },

  title: {
    fontSize: 24,
    color: '#1a1a1a',
    fontFamily: 'Poppins_700Bold',
  },

  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 30,
    color: '#666',
  },

  // ERROR MESSAGE
  errorText: {
    color: '#d9534f',
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    marginBottom: 10,
  },

  // INPUT FIELDS
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
  },

  // SUBMIT BUTTON
  submitButton: {
    backgroundColor: '#424242',
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 5,
    marginBottom: 20,
    width: '100%'
  },

  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    textAlign: 'center',
  },

  // LOG SECTION
  logContainer: {
    marginTop: 10,
    paddingBottom: 30,
  },

  logTitle: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 15,
  },

  emptyText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#9e9e9e',
  },

  // LOG ITEM CARD
  logItem: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  logText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#424242',
    marginBottom: 4,
  },

  logDate: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: '#999',
    marginTop: 4,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
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
    color: '#424242',
  },

  modalCloseButton: {
    padding: 5,
  },

  modalScrollView: {
    paddingHorizontal: 25,
    paddingTop: 20,
  },
});

export default styles;
