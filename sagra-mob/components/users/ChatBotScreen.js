import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/users/ChatBotStyle';
import CustomNavbar from '../../customs/CustomNavbar';

const predefinedQuestions = [
  { id: 1, text: 'What sacraments can I book?', category: 'booking' },
  { id: 2, text: 'What are the requirements for Baptism?', category: 'baptism' },
  { id: 3, text: 'What are the requirements for Wedding?', category: 'wedding' },
  { id: 4, text: 'How can I make a donation?', category: 'donation' },
  { id: 5, text: 'What events are happening?', category: 'events' },
  { id: 6, text: 'How can I volunteer?', category: 'volunteer' },
  { id: 7, text: 'What is the Virtual Tour?', category: 'virtualtour' },
  { id: 8, text: 'What are the booking dates for sacraments?', category: 'bookingdates' },
];

const sacramentInfo = {
  'Wedding': { minDate: 'October 17, 2025', requirements: ['Valid marriage license', 'Baptismal certificate', 'Confirmation certificate', 'Pre-marriage seminar certificate', 'Parental consent (if applicable)'] },
  'Baptism': { minDate: 'November 1, 2025', requirements: ['Birth certificate', "Parent's marriage certificate", "Godparent's confirmation certificate", 'Baptismal seminar attendance'] },
  'Confession': { minDate: 'September 19, 2025', requirements: ['No special requirements', 'Come with a contrite heart', 'Examination of conscience'] },
  'Anointing of the Sick': { minDate: 'September 18, 2025', requirements: ['Medical certificate (if applicable)', 'Family member or guardian present', 'Contact parish office for scheduling'] },
  'First Communion': { minDate: 'November 16, 2025', requirements: ['Baptismal certificate', 'First Communion preparation completion', 'Parent/guardian consent', 'Regular attendance at catechism classes'] },
  'Burial': { minDate: 'September 20, 2025', requirements: ['Death certificate', 'Baptismal certificate of deceased', 'Family contact information', 'Preferred date and time'] },
  'Confirmation': { minDate: 'November 16, 2025', requirements: ['Baptismal certificate', 'First Communion certificate', 'Confirmation preparation completion', "Sponsor's confirmation certificate", 'Regular attendance at catechism classes'] },
};

export default function ChatBotScreen({ user, onNavigate }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showChoices, setShowChoices] = useState(true);
  const [talkToAdmin, setTalkToAdmin] = useState(false);
  const scrollViewRef = useRef();

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  React.useEffect(() => {
    const now = new Date();
    const welcomeMsg = {
      id: 0,
      text: 'Welcome to SagradaGo\nParish Information System!\n\nI can help you with:\n• Mass schedules and events\n• Parish activities and programs\n• Sacramental services\n• Donations and offerings\n• General parish information\n\nHow may I assist you today?',
      sender: 'bot',
      timeSent: formatTime(now),
    };

    setMessages([welcomeMsg]);
  }, []);

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return 'Hello! Welcome to Sagrada Familia Parish! How can I assist you today? You can ask me about sacraments, events, donations, volunteering, or the virtual tour.';
    }

    if (msg.includes('booking date') || msg.includes('when can i book') || msg.includes('minimum date')) {
      let response = 'Here are the minimum booking dates for each sacrament:\n\n';
      Object.entries(sacramentInfo).forEach(([sacrament, info]) => {
        response += `• ${sacrament}: ${info.minDate}\n`;
      });

      return response;
    }

    for (const sacrament of Object.keys(sacramentInfo)) {
      const sacramentLower = sacrament.toLowerCase();
      if (msg.includes(sacramentLower)) {
        const info = sacramentInfo[sacrament];
        return `${sacrament} Requirements:\n\nMinimum Booking Date: ${info.minDate}\n\nRequirements:\n${info.requirements.map(req => `• ${req}`).join('\n')}\n\nYou can book through the Booking section in the app!`;
      }
    }

    if (msg.includes('sacrament') || msg.includes('what sacraments') || (msg.includes('booking') && !msg.includes('date'))) {
      const sacramentList = Object.keys(sacramentInfo).join(', ');
      return `You can book the following sacraments: ${sacramentList}. Each sacrament has specific requirements and minimum booking dates. Would you like to know more about a specific sacrament?`;
    }

    if (msg.includes('donation') || msg.includes('donate')) {
      return `You can make donations through the Donations section in the app! We accept:\n\n• GCash\n• Cash\n• In Kind donations\n\nYour donations help support the parish and its various activities. You can also add a donation intercession (optional) when making a donation.`;
    }

    if (msg.includes('event') || msg.includes('what events') || msg.includes('activities')) {
      return `We have various events happening in our parish! You can view upcoming events in the Events section. Events include community activities, workshops, and special parish gatherings. You can also volunteer for events directly from the Events section.`;
    }

    if (msg.includes('volunteer') || msg.includes('how can i help')) {
      return `Thank you for your interest in volunteering! You can volunteer in various roles:\n\n• Choir Member\n• Usher\n• Catechist\n• Tech Team\n• Others\n\nYou can sign up as a volunteer through the Events section by selecting an event and clicking the Volunteer button. Your service is greatly appreciated!`;
    }

    if (msg.includes('virtual tour') || msg.includes('360') || msg.includes('tour')) {
      return `Our Virtual Tour feature allows you to explore the church in 360°! You can view:\n\n• The Facade - The magnificent entrance of our parish\n• The Altar - The sacred heart of our parish where the Holy Eucharist is celebrated\n• The Pews - The peaceful space where congregation gathers for Mass\n\nYou can access it through the Virtual Tour section. Drag left or right to explore the 360° view!`;
    }

    if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('see you')) {
      return 'Thank you for visiting! If you have more questions, feel free to ask. God bless! 🙏';
    }

    if (msg.includes('help') || msg.includes('what can you do')) {
      return 'I can help you with information about:\n\n• Sacraments and their requirements\n• Booking dates\n• Donations\n• Events\n• Volunteering\n• Virtual Tour\n\nJust ask me anything about these topics!';
    }

    return "I'm here to help you with information about Sagrada Familia Parish! You can ask me about sacraments, booking dates, donations, events, volunteering, or the virtual tour. How can I assist you?";
  };

  const handleQuestionTap = (questionText) => {
    const now = new Date();

    const userMsg = {
      id: Date.now(),
      text: questionText,
      sender: 'user',
      timeSent: formatTime(now),
    };

    setMessages(prev => [...prev, userMsg]);
    setShowChoices(false);

    setTimeout(() => {
      const botNow = new Date();
      const botMsg = {
        id: Date.now() + 1,
        text: getBotResponse(questionText),
        sender: 'bot',
        timeSent: formatTime(botNow),
      };

      setMessages(prev => [...prev, botMsg]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 500);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    const now = new Date();

    const userMsg = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timeSent: formatTime(now),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setShowChoices(false);

    setTimeout(() => {
      const botNow = new Date();
      const botMsg = {
        id: Date.now() + 1,
        text: getBotResponse(messageText),
        sender: 'bot',
        timeSent: formatTime(botNow),
      };

      setMessages(prev => [...prev, botMsg]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 500);
  };

  const showChoicesAgain = () => {
    setShowChoices(true);
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.chatbotMainContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View style={styles.chatbotHeaderContainer}>
          <Text style={styles.chatbotTitleText}>SagradaBot</Text>
          <Text style={styles.chatbotSubtitleText}>Ask me anything!</Text>
        </View>

        <ScrollView
          style={styles.chatbotScrollView}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
        >


          <View style={styles.chatbotMessagesContainer}>
            {messages.map(msg => (
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
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 10,
                    color: msg.sender === 'user' ? '#f9f9f9' : '#424242',
                    marginTop: 4,
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  {msg.timeSent}
                </Text>
              </View>
            ))}

           {showChoices && messages.length > 0 && (
              <View style={styles.choiceButtonsContainer}>
                <Text style={styles.choiceButtonsTitle}>Quick Questions</Text>
                <Text style={styles.choiceButtonsSubtitle}>Tap a question below</Text>

                {/* New option for Admin Chat */}
                <TouchableOpacity
                  style={styles.choiceButton}
                  onPress={() => setTalkToAdmin(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="people-outline" size={18} color="#424242" style={{ marginRight: 10 }} />
                  <Text style={styles.choiceButtonText}>Chat or Message with Admin</Text>
                  <Ionicons name="chevron-forward" size={18} color="#999" />
                </TouchableOpacity>

                {predefinedQuestions.map((question) => (
                  <TouchableOpacity
                    key={question.id}
                    style={styles.choiceButton}
                    onPress={() => handleQuestionTap(question.text)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chatbubble-outline" size={18} color="#424242" style={{ marginRight: 10 }} />
                    <Text style={styles.choiceButtonText}>{question.text}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#999" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* {!showChoices && messages.length > 1 && (
              <TouchableOpacity
                style={styles.showChoicesButton}
                onPress={showChoicesAgain}
                activeOpacity={0.7}
              >
                <Ionicons name="list-outline" size={18} color="#424242" />
                <Text style={styles.showChoicesButtonText}>Show quick questions</Text>
              </TouchableOpacity>
            )} */}

            {!talkToAdmin && !showChoices && messages.length > 1 && (
              <TouchableOpacity
                style={styles.showChoicesButton}
                onPress={showChoicesAgain}
                activeOpacity={0.7}
              >
                <Ionicons name="list-outline" size={18} color="#424242" />
                <Text style={styles.showChoicesButtonText}>Show quick questions</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <View style={styles.chatbotInputWrapper}>
          <TextInput
            style={styles.chatbotTextInput}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline={false}
          />
          <TouchableOpacity style={styles.chatbotSendButton} onPress={sendMessage}>
            <Text style={styles.chatbotSendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <CustomNavbar currentScreen="ChatBotScreen" onNavigate={onNavigate} />
    </>
  );
}
