import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
    padding: 20,
  },

  header: {
    marginTop: 40,
    marginBottom: 20,
  },

  title: {
    fontSize: 34,
    fontFamily: 'Poppins_700Bold',
    color: '#222',
  },

  avatarWrapper: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: 10,
  },

  avatarCircle: {
    width: 120,
    height: 120,
    backgroundColor: "#ffbd2f",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  avatarText: {
    fontSize: 50,
    color: "#333",
    fontFamily: 'Poppins_700Bold',
    paddingTop: 10
  },

  // MODAL OVERLAY
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',

  },

  modalOverlayInner: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    width: '100%',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    elevation: 8,
  },

  modalTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 6,
    color: '#222',
    textAlign: 'center',
  },

  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
    textAlign: 'center',
  },

  // BUTTONS
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: '#f2f2f2',
  },

  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },

  logoutConfirmButton: {
    backgroundColor: '#424242',
  },

  logoutConfirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },

  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 30,
    textAlign: "center",
    marginTop: 5,
    marginBottom: -5,
  },

  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
  },

  inputContainerError: {
    borderColor: '#ff3b30',
    borderWidth: 1.5,
    backgroundColor: "#fff",
  },

  inputIcon: {
    marginRight: 6,
  },

  input: {
    flex: 1,
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
  },

  errorText: {
    color: '#ff3b30',
    fontFamily: 'Poppins_400Regular',
    textAlign: 'right',
    fontSize: 12,
    marginBottom: 5,
    marginTop: -5,
    marginLeft: 5,
  },

  yellowButton: {
    backgroundColor: '#FFC942',
    paddingVertical: 9,
    borderRadius: 20,
    marginVertical: 5,
    width: '100%',
    marginTop: 20
  },

  darkButton: {
    backgroundColor: '#424242',
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 5,
    width: '100%',
    marginTop: 20
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

  circularButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },

  bookingHistoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  bookingHistoryButtonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#424242',
  },

  // Volunteer Log Modal Styles
  volunteerLogModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  volunteerLogModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },

  volunteerLogModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  volunteerLogModalTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: '#424242',
  },

  volunteerLogModalCloseButton: {
    padding: 5,
  },

  volunteerLogScrollView: {
    padding: 20,
  },

  volunteerLogItem: {
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

  volunteerLogItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  volunteerLogItemName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#424242',
  },

  volunteerLogItemRole: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#666',
    marginBottom: 4,
  },

  volunteerLogItemEvent: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 4,
  },

  volunteerLogItemContact: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 4,
  },

  volunteerLogItemDate: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#999',
    marginTop: 4,
  },

  volunteerLogEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  volunteerLogEmptyText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#666',
    marginBottom: 5,
  },

  volunteerLogEmptySubtext: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#999',
    textAlign: 'center',
  },

});

export default styles;
