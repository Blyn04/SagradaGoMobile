import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
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

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  
  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  forgotPasswordButton: {
    marginTop: 15,
    alignItems: 'center',
  },

  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },

  switchButton: {
    marginTop: 15,
    alignItems: 'center',
  },

  switchText: {
    color: '#666',
    fontSize: 14,
  },

  switchTextBold: {
    color: '#007AFF',
    fontWeight: 'bold',
  },

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

