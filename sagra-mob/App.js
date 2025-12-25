import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import notificationHandler from './utils/NotificationHandler';
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
import BookingHistoryScreen from './components/users/BookingHistoryScreen';
import NotificationsScreen from './components/notificationsScreen';
import VolunteerScreen from './components/users/VolunteerScreen';

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

function AppContent() {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  // Testing
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('GetStarted');
  const [navigationParams, setNavigationParams] = useState({});

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

  useEffect(() => {
    // Initialize notification handler when app starts
    notificationHandler.initialize().catch(err => {
      console.error('Failed to initialize notification handler:', err);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentUser(user);
      setIsLoggedIn(true);

      if (currentScreen === 'LoginScreen' || currentScreen === 'GetStarted' || currentScreen === 'SignUpScreen') {
        setCurrentScreen('HomePageScreen');
      }

    } else if (!isAuthenticated) {
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
  }, [isAuthenticated, user]);

  const isOnLoginScreen = currentScreen === 'LoginScreen';
  
  if (!fontsLoaded || (authLoading && !isOnLoginScreen)) {
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
    setCurrentScreen('HomePageScreen');

    // Testing
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleSignUpSuccess = () => {
    setCurrentScreen('LoginScreen');

    // Testing
    setShowSignUp(false);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentScreen('GetStarted');

    // Testing
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleNavigate = (screen, params = {}) => {
    setCurrentScreen(screen);
    setNavigationParams(params);
  };

  const renderScreen = () => {
    // With Account
    // if (!isAuthenticated) {

    // Testing
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
            onBack={() => setCurrentScreen('GetStarted')}
          />
        );
      }
    }

    switch (currentScreen) {
      case 'DonationsScreen':
        return (
          <DonationsScreen
            // user={user}

            // Testing
            user={currentUser}
            onNavigate={handleNavigate}
          />
        );
      case 'AnnouncementsScreen':
        return (
          <AnnouncementsScreen
            // user={user}

            // Testing
            user={currentUser}
            onNavigate={handleNavigate}
          />
        );
      case 'EventsScreen':
        return (
          <EventsScreen
            // user={user}

            // Testing
            user={currentUser}
            onNavigate={handleNavigate}
          />
        );
      case 'BookingScreen':
        return (
          <BookingScreen
            // user={user}

            // Testing
            user={currentUser}
            onNavigate={handleNavigate}
          />
        );
      case 'VirtualTourScreen':
        return (
          <VirtualTourScreen
            // user={user}

            // Testing
            user={currentUser}
            onNavigate={handleNavigate}
          />
        );
      case 'ProfileScreen':
        return (
          <Profile
            // user={user}

            // Testing
            user={currentUser}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'ChatBotScreen':
        return (
          // <ChatBotScreen user={user} onNavigate={handleNavigate} />

          // Testing
          <ChatBotScreen user={currentUser} onNavigate={handleNavigate}/>
        );
      case 'BookingHistoryScreen':
        return (
          <BookingHistoryScreen
            // user={user}

            // Testing
            user={currentUser}
            onNavigate={handleNavigate}
          />
        );
      case 'NotificationsScreen':
        return (
          <NotificationsScreen
            // user={user}

            // Testing
            user={currentUser}
            onNavigate={handleNavigate}
          />
        );
      // VolunteerScreen is now a modal, accessed from EventsScreen only
      // case 'VolunteerScreen':
      //   return (
      //     <VolunteerScreen
      //       user={currentUser}
      //       onNavigate={handleNavigate}
      //       event={navigationParams.event}
      //     />
      //   );
      default:
        return (
          // <HomePageScreen user={user} onNavigate={handleNavigate}/>
          <HomePageScreen user={currentUser} onNavigate={handleNavigate}/>
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
