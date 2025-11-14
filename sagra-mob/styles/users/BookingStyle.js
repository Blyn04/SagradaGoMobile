import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },

  scrollView: {
    flex: 1,
    padding: 20,
  },

  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },

  filterContainer: {
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },

  picker: {
    height: 50,
    color: '#333',
  },

  content: {
    flex: 1,
  },

  noResultsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  sacramentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },

  sacramentInfo: {
    flex: 1,
    marginRight: 12,
  },

  sacramentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },

  minBooking: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'normal',
  },

  requirementsButton: {
    backgroundColor: '#6b8e23',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 110,
    alignItems: 'center',
  },

  requirementsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 0,
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
    maxHeight: '80%',
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
    marginBottom: 20,
    color: '#1a1a1a',
    textAlign: 'center',
  },

  requirementsList: {
    maxHeight: 300,
    marginBottom: 20,
  },

  requirementItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingRight: 10,
  },

  requirementBullet: {
    fontSize: 18,
    color: '#6b8e23',
    marginRight: 10,
    fontWeight: 'bold',
  },

  requirementText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },

  closeButton: {
    backgroundColor: '#6b8e23',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default styles;

