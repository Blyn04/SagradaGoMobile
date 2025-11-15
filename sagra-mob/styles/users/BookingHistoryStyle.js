import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  scrollView: {
    flex: 1,
    padding: 20,
  },

  header: {
    marginTop: 60,
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

  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 6,
    zIndex: 10,
  },

  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  detailText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#666',
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#424242',
  },

  filterButtonActive: {
    backgroundColor: '#424242',
    color: '#f9f9f9',
  },

  filterButtonText: {
    color: '#424242',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },

  filterButtonTextActive: {
    color: '#fff',
  },

  bookingsContainer: {
    marginBottom: 20,
  },

  bookingCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  cardHeaderLeft: {
    flex: 1,
  },

  sacramentName: {
    marginBottom: 4,
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#222',
  },

  bookingDate: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#777777ff',
  },

  cardDivider: {
    height: 1,
    marginVertical: 5,
    backgroundColor: '#ccc',
  },

  cardDetails: {
    marginTop: 4,
  },

  detailText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#666',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    marginTop: 16,
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  modalOverlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  modalContent: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  modalTitle: {
    flex: 1,
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: '#222',
  },

  modalCloseButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },

  modalScrollView: {
    maxHeight: 400,
  },

  modalDetails: {
    paddingVertical: 4,
  },

  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },

  modalLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#444',
  },

  modalValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#222',
  },

  modalNotesContainer: {
    paddingVertical: 8,
  },

  modalNotes: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#555',
  },

  modalCancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: '#f44336',
    borderRadius: 10,
  },

  modalCancelButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },

  confirmModalContent: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },

  confirmModalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#222',
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center'
  },

  confirmModalTextContainer: {
    backgroundColor: '#f5f5f5ff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 12,
    alignItems: 'center',
  },

  confirmModalText: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
    textAlign: 'center',
  },

  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  confirmModalButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    backgroundColor: '#f5f5f5',
  },

  confirmModalButtonPrimary: {
    backgroundColor: '#FFC942',
    borderColor: '#FFC942',
  },

  confirmModalButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#424242',
  },

  confirmModalButtonTextPrimary: {
    color: '#424242',
  },

});

export default styles;

