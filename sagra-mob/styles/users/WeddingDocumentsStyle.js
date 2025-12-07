import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  sacramentFormContainer: {
    marginTop: 10,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sacramentFormTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
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
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 50,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
  },
  inputHelperText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginTop: 5,
    marginLeft: 5,
  },
  fileUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  fileUploadText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#666',
  },
  fileUploadTextSelected: {
    color: '#4CAF50',
  },
});

export default styles;

