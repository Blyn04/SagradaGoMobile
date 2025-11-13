import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  pickerContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },

  picker: {
    height: 50,
    color: '#000',
  },

  label: {
    marginLeft: 10,
    marginTop: 5,
    fontWeight: '500',
    color: '#333',
  },
});

export default styles;

