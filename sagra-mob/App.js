import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useState } from 'react';

import GetStartedScreen from './components/GetStarted';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import HomePageScreen from './components/HomePageScreen';

import DonationsScreen from './components/users/DonationsScreen';
import AnnouncementsScreen from './components/users/AnnouncementsScreen';
import VirtualTourScreen from './components/users/VirtualTourScreen';
import Profile from './components/Profile';
import ChatBotScreen from './components/users/ChatBotScreen';
import EventsScreen from './components/users/EventsScreen';
import BookingScreen from './components/users/BookingScreen';

import {
  useFonts,
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';

export default function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [currentScreen, setCurrentScreen] = useState('GetStarted');

  const [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View style={{
        flex: 1, justifyContent: 'center',
        alignItems: 'center', backgroundColor: '#1A1A2E'
      }}>
        <ActivityIndicator size="large" color="#1772FF" />
      </View>
    );
  }

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setCurrentScreen('HomePageScreen');
  };

  const handleSignUpSuccess = () => {
    setShowSignUp(false);
    setCurrentScreen('LoginScreen');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentScreen('GetStarted');
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    if (!isLoggedIn) {

      if (currentScreen === 'GetStarted') {
        return (
          <GetStartedScreen
            onLoginPress={() => setCurrentScreen('LoginScreen')}
            onSignUpPress={() => setCurrentScreen('SignUpScreen')}
          />
        );
      }

      if (currentScreen === 'LoginScreen') {
        return (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignUp={() => setCurrentScreen('SignUpScreen')}
            onBack={() => setCurrentScreen('GetStarted')}
          />
        );
      }

      if (currentScreen === 'SignUpScreen') {
        return (
          <SignUpScreen
            onSignUpSuccess={handleSignUpSuccess}
            onSwitchToLogin={() => setCurrentScreen('LoginScreen')}
          />
        );
      }
    }

    switch (currentScreen) {
      case 'DonationsScreen':
        return (
          <DonationsScreen
            user={currentUser}
            onNavigate={handleNavigate}
          />
        );
      case 'AnnouncementsScreen':
        return (
          <AnnouncementsScreen
            user={currentUser}
            onNavigate={handleNavigate}
          />
        );
      case 'EventsScreen':
        return (
          <EventsScreen
            user={currentUser}
            onNavigate={handleNavigate}
          />
        );
      case 'BookingScreen':
        return (
          <BookingScreen
            user={currentUser}
            onNavigate={handleNavigate}
          />
        );
      case 'VirtualTourScreen':
        return (
          <VirtualTourScreen
            user={currentUser}
            onNavigate={handleNavigate}
          />
        );
      case 'ProfileScreen':
        return (
          <Profile
            user={currentUser}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'ChatBotScreen':
        return (
          <ChatBotScreen user={currentUser} onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <HomePageScreen user={currentUser} onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
});
