import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import styles from '../styles/ChatBotStyle';
import CustomNavbar from '../customs/CustomNavbar';

export default function ChatBotScreen({ user, onNavigate }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Chat Bot</Text>
          <Text style={styles.subtitle}>Ask me anything!</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.contentText}>
            Chat bot functionality will be displayed here.
          </Text>
        </View>
      </ScrollView>

      <CustomNavbar
        currentScreen="ChatBotScreen"
        onNavigate={onNavigate}
      />
    </View>
  );
}

