import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styles from '../../styles/users/ChatBotStyle';
import CustomNavbar from '../../customs/CustomNavbar';

export default function ChatBotScreen({ user, onNavigate }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    if (msg.includes('hello') || msg.includes('hi')) return 'Hello! How can I help you today?';
    if (msg.includes('how are you')) return "I'm just a bot, but I'm doing great!";
    if (msg.includes('bye')) return 'Goodbye! Have a nice day!';
    return "Sorry, I don't understand. Can you rephrase?";
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const botMsg = { id: Date.now() + 1, text: getBotResponse(inputText), sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Chat Bot</Text>
            <Text style={styles.subtitle}>Ask me anything!</Text>
          </View>

          <View style={styles.chatContainer}>
            {messages.map(msg => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <CustomNavbar currentScreen="ChatBotScreen" onNavigate={onNavigate} />
    </>

  );
}
