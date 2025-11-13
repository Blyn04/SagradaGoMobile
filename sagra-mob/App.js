import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import HomePageScreen from './components/HomePageScreen';
import DonationsScreen from './components/DonationsScreen';
import AnnouncementsScreen from './components/AnnouncementsScreen';
import VirtualTourScreen from './components/VirtualTourScreen';
import Profile from './components/Profile';
import ChatBotScreen from './components/ChatBotScreen';

export default function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('HomePageScreen');

  const handleLoginSuccess = (user) => {
    console.log('User logged in:', user);
    setCurrentUser(user);
    setIsLoggedIn(true);
    setCurrentScreen('HomePageScreen');
  };

  const handleSignUpSuccess = (user) => {
    console.log('User signed up:', user);
    setShowSignUp(false);
  };

  const handleSwitchToSignUp = () => {
    setShowSignUp(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignUp(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentScreen('HomePageScreen');
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    if (!isLoggedIn) {
      if (showSignUp) {
        return (
          <SignUpScreen 
            onSignUpSuccess={handleSignUpSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        );
      }
      return (
        <LoginScreen 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignUp={handleSwitchToSignUp}
        />
      );
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
          <ChatBotScreen 
            user={currentUser} 
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <HomePageScreen 
            user={currentUser} 
            onNavigate={handleNavigate}
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
