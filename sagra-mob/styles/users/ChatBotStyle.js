import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  chatbotMainContainer: {
    flex: 1,
  },

  chatbotScrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  chatbotHeaderContainer: {
    alignItems: 'center',
    marginTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  chatbotTitleText: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },

  chatbotSubtitleText: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#6c757d',
  },

  chatbotMessagesContainer: {
    flex: 1,
    paddingBottom: 20,
  },

  chatbotMessageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  chatbotUserMessageBubble: {
    backgroundColor: '#424242',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },

  chatbotBotMessageBubble: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  chatbotUserMessageText: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#ffffff',
    lineHeight: 20,
  },

  chatbotBotMessageText: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#1a1a1a',
    lineHeight: 20,
  },

  chatbotInputWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  chatbotTextInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#1a1a1a',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    maxHeight: 100,
  },

  chatbotSendButton: {
    backgroundColor: '#424242',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#424242',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  chatbotSendButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.5,
  },

  chatbotContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  chatbotContentText: {
    fontSize: 16,
    fontFamily: 'Poppins_-',
    color: '#6c757d',
    textAlign: 'center',
  },

  choiceButtonsContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingBottom: 20,
  },

  choiceButtonsTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },

  choiceButtonsSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#6c757d',
    marginBottom: 20,
    textAlign: 'center',
  },

  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  choiceButtonText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#1a1a1a',
    lineHeight: 20,
  },

  showChoicesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignSelf: 'center',
  },

  showChoicesButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#424242',
    marginLeft: 8,
  },

  landingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#f9f9f9',
  },

  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    padding: 10,
    borderRadius: 50,
  },

  landingTitle: {
    fontSize: 34,
    fontFamily: 'Poppins_700Bold',
    marginTop: 20,
    color: '#1a1a1a',
    letterSpacing: 1,
  },

  landingDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
    lineHeight: 22,
    fontFamily: 'Poppins_500Medium'
  },

  landingButton: {
    marginTop: 30,
    backgroundColor: '#424242',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  landingButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
  },

});

export default styles;
