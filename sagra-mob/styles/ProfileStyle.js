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
    marginBottom: 20,
  },

  title: {
    fontSize: 34,
    fontFamily: 'Poppins_700Bold',
    color: '#222',
  },

  logoutButtonTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: 30,
  },

  logoutButtonTextTop: {
    color: "#424242",
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold'
  },

  // PROFILE CARD
  profileSection: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },

  avatarWrapper: {
    alignItems: "center",
    marginTop: 20,
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
  name: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },

  email: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#444',
    marginBottom: 6,
    textAlign: 'center',
  },

  contact: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#444',
    marginBottom: 6,
    textAlign: 'center',
  },

  info: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },

  // LOGOUT BUTTON
  logoutButton: {
    backgroundColor: '#FF3B30',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 110,
  },

  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
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
    padding: 20,
    width: '100%',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 400,
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
    backgroundColor: '#FF3B30',
  },

  logoutConfirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },

  editButton: {
    backgroundColor: '#3478f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  backButton: {
    paddingTop: 10,
  },
  formContainer: {
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 26,
    textAlign: "center",
    marginTop: 5,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
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
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
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
});

export default styles;
