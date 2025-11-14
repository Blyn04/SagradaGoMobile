import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    marginBottom: 30,
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 6,
    zIndex: 10,
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
  forgotPasswordButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#424242',
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
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
  // Modal Styles (Forgot Password)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 5,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    marginLeft: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;

