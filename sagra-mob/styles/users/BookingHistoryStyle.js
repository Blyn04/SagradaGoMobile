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
    marginTop: 40,
    marginBottom: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  title: {
    marginBottom: 8,
  },

  subtitle: {
    marginBottom: 20,
  },

  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  filterButtonActive: {
    backgroundColor: '#424242',
    borderColor: '#424242',
  },

  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#666',
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
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#222',
  },

  bookingDate: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#999',
  },

  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: '#666',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },

  cardDivider: {
    height: 1,
    marginVertical: 12,
    backgroundColor: '#f0f0f0',
  },

  cardDetails: {
    marginTop: 4,
  },

  detailRow: {
    marginBottom: 8,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    maxHeight: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  modalTitle: {
    flex: 1,
    marginRight: 16,
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#222',
  },

  modalCloseButton: {
    padding: 4,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalDivider: {
    height: 1,
    marginVertical: 12,
    backgroundColor: '#e0e0e0',
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
    paddingVertical: 8,
  },

  modalLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#666',
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
    marginTop: 8,
  },

  modalCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f44336',
    borderRadius: 8,
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
    elevation: 8,
  },

  confirmModalHeader: {
    marginBottom: 16,
  },

  confirmModalTitle: {
    marginBottom: 0,
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#222',
  },

  confirmModalBody: {
    paddingVertical: 8,
  },

  confirmModalText: {
    marginBottom: 12,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
  },

  confirmModalSubtext: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#666',
  },

  confirmModalButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },

  confirmModalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  confirmModalButtonPrimary: {
    backgroundColor: '#f44336',
    borderColor: '#f44336',
  },

  confirmModalButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#666',
  },

  confirmModalButtonTextPrimary: {
    color: '#fff',
  },
});

export default styles;

