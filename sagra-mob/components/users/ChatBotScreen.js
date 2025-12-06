import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/users/ChatBotStyle';

const predefinedQuestions = [
  { id: 1, text: 'What sacraments can I book?', category: 'booking' },
  { id: 2, text: 'How can I make a donation?', category: 'donation' },
  { id: 3, text: 'What events are happening?', category: 'events' },
  { id: 4, text: 'How can I volunteer?', category: 'volunteer' },
  { id: 5, text: 'What are the booking dates for sacraments?', category: 'bookingdates' },
];

const sacramentInfo = {
  Wedding: {
    minDate: 'October 17, 2025',
    requirements: [
      'Valid marriage license',
      'Baptismal certificate',
      'Confirmation certificate',
      'Pre-marriage seminar certificate',
      'Parental consent (if applicable)',
    ],
  },
  Baptism: {
    minDate: 'November 1, 2025',
    requirements: [
      'Birth certificate',
      "Parent's marriage certificate",
      "Godparent's confirmation certificate",
      'Baptismal seminar attendance',
    ],
  },
  Confession: {
    minDate: 'September 19, 2025',
    requirements: [
      'No special requirements',
      'Come with a contrite heart',
      'Examination of conscience',
    ],
  },
  'Anointing of the Sick': {
    minDate: 'September 18, 2025',
    requirements: [
      'Medical certificate (if applicable)',
      'Family member or guardian present',
      'Contact parish office for scheduling',
    ],
  },
  'First Communion': {
    minDate: 'November 16, 2025',
    requirements: [
      'Baptismal certificate',
      'First Communion preparation completion',
      'Parent/guardian consent',
      'Regular attendance at catechism classes',
    ],
  },
  Burial: {
    minDate: 'September 20, 2025',
    requirements: [
      'Death certificate',
      'Baptismal certificate of deceased',
      'Family contact information',
      'Preferred date and time',
    ],
  },
  Confirmation: {
    minDate: 'November 16, 2025',
    requirements: [
      'Baptismal certificate',
      'First Communion certificate',
      'Confirmation preparation completion',
      "Sponsor's confirmation certificate",
      'Regular attendance at catechism classes',
    ],
  },
};

export default function ChatBotScreen({ user, onNavigate }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showChoices, setShowChoices] = useState(true);
  const [talkToAdmin, setTalkToAdmin] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const scrollViewRef = useRef(null);

  const formatTime = (date) => {
    const h = date.getHours();
    const m = date.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hrs = h % 12 || 12;
    return `${hrs}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  useEffect(() => {
    if (!showLanding) {
      const now = new Date();
      const welcomeMsg = {
        id: 0,
        text: 'Welcome to SagradaGo\nParish Information System!\n\nI can help you with:\n• Mass schedules and events\n• Parish activities and programs\n• Sacramental services\n• Donations and offerings\n• General parish information\n\nHow may I assist you today?',
        sender: 'bot',
        timeSent: formatTime(now),
      };

      setMessages([welcomeMsg]);
    }
  }, [showLanding]);

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (/(hello|hi|hey)/.test(msg))
      return 'Hello! Welcome to Sagrada Familia Parish! How can I assist you today?';

    if (msg.includes('booking date') || msg.includes('when can i book') || msg.includes('minimum date')) {
      let response = 'Here are the minimum booking dates:\n\n';
      Object.entries(sacramentInfo).forEach(([sacrament, info]) => {
        response += `• ${sacrament}: ${info.minDate}\n`;
      });
      return response;
    }

    for (const sacrament of Object.keys(sacramentInfo)) {
      if (msg.includes(sacrament.toLowerCase())) {
        const info = sacramentInfo[sacrament];
        return `${sacrament} Requirements:\n\nMinimum Booking Date: ${info.minDate}\n\nRequirements:\n${info.requirements.map(r => `• ${r}`).join('\n')}`;
      }
    }

    if (msg.includes('sacrament') || msg.includes('what sacraments') || msg.includes('booking'))
      return `You can book the following sacraments: ${Object.keys(sacramentInfo).join(', ')}.`;

    if (msg.includes('donation'))
      return 'You can make donations through the Donations section in the app.';

    if (msg.includes('event'))
      return 'You can view our parish events in the Events section.';

    if (msg.includes('volunteer'))
      return 'You can volunteer through the Events section of the app.';

    if (msg.includes('tour'))
      return 'The Virtual Tour allows a 360° exploration of the church.';

    if (msg.includes('bye'))
      return 'Thank you for visiting! God bless! 🙏';

    return "I'm here to help! You can ask about sacraments, donations, events, volunteering, or the virtual tour.";
  };

  const addMessage = (text, sender) => {
    const now = new Date();
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text, sender, timeSent: formatTime(now) },
    ]);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    addMessage(userText, 'user');
    setShowChoices(false);
    setInputText('');

    setTimeout(() => {
      addMessage(getBotResponse(userText), 'bot');
    }, 500);
  };

  const handleQuestionTap = (text) => {
    addMessage(text, 'user');
    setShowChoices(false);

    setTimeout(() => {
      addMessage(getBotResponse(text), 'bot');
    }, 500);
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.6)).current;
  const buttonSlide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    if (showLanding) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonSlide, {
          toValue: 0,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showLanding]);

  return (
    <>
      {/* Landing Page */}
      {showLanding && (
        <Animated.View style={[styles.landingContainer, { opacity: fadeAnim }]}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigate('HomePageScreen')}
          >
            <Ionicons name="arrow-back" size={26} color="#333" />
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: iconScale }] }}>
            <Image
              source={require('../../assets/sagrada.png')}
              style={{ width: 100, height: 100, marginBottom: 10, alignSelf: 'center' }}
              resizeMode="contain"
            />
          </Animated.View>

          <Text style={styles.landingTitle}>SagradaBot</Text>
          <Text style={styles.landingDescription}>
            Your smart assistant for parish information and quick guidance.
          </Text>

          <Animated.View style={{ transform: [{ translateY: buttonSlide }] }}>
            <TouchableOpacity
              style={styles.landingButton}
              onPress={() => setShowLanding(false)}
            >
              <Text style={styles.landingButtonText}>Start Chat</Text>
            </TouchableOpacity>
          </Animated.View>

        </Animated.View>
      )}

      {!showLanding && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* BACK BUTTON */}
          <View style={{ position: 'absolute', top: 50, left: 20, zIndex: 10 }}>
            <TouchableOpacity onPress={() => onNavigate('HomePageScreen')}>
              <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.chatbotHeaderContainer}>
            <Text style={styles.chatbotTitleText}>SagradaBot</Text>
            <Text style={styles.chatbotSubtitleText}>Ask me anything!</Text>
          </View>

          <ScrollView
            style={styles.chatbotScrollView}
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            <View style={styles.chatbotMessagesContainer}>
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.chatbotMessageBubble,
                    msg.sender === 'user'
                      ? styles.chatbotUserMessageBubble
                      : styles.chatbotBotMessageBubble,
                  ]}
                >
                  <Text
                    style={
                      msg.sender === 'user'
                        ? styles.chatbotUserMessageText
                        : styles.chatbotBotMessageText
                    }
                  >
                    {msg.text}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      marginTop: 4,
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      color: msg.sender === 'user' ? '#fff' : '#141414',
                      fontFamily: 'Poppins_500Medium',
                    }}
                  >
                    {msg.timeSent}
                  </Text>
                </View>
              ))}

              {showChoices && (
                <View style={styles.choiceButtonsContainer}>
                  <Text style={styles.choiceButtonsTitle}>Quick Questions</Text>

                  <TouchableOpacity
                    style={styles.choiceButton}
                    onPress={() => setTalkToAdmin(true)}
                  >
                    <Ionicons name="people-outline" size={18} style={{ marginRight: 10 }} />
                    <Text style={styles.choiceButtonText}>Chat with Admin</Text>
                    <Ionicons name="chevron-forward" size={18} />
                  </TouchableOpacity>

                  {predefinedQuestions.map((q) => (
                    <TouchableOpacity
                      key={q.id}
                      style={styles.choiceButton}
                      onPress={() => handleQuestionTap(q.text)}
                    >
                      <Ionicons name="chatbubble-outline" size={18} style={{ marginRight: 10 }} />
                      <Text style={styles.choiceButtonText}>{q.text}</Text>
                      <Ionicons name="chevron-forward" size={18} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {!talkToAdmin && !showChoices && messages.length > 1 && (
                <TouchableOpacity
                  style={styles.showChoicesButton}
                  onPress={() => setShowChoices(true)}
                >
                  <Ionicons name="list-outline" size={18} />
                  <Text style={styles.showChoicesButtonText}>Show quick questions</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          <View style={styles.chatbotInputWrapper}>
            <TextInput
              style={styles.chatbotTextInput}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.chatbotSendButton} onPress={sendMessage}>
              <Text style={styles.chatbotSendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </>
  );

}
