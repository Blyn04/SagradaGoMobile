import { Platform } from 'react-native';
import { API_IP } from '@env';

/**
 * API Base URL Configuration
 * 
 * The API IP address is configured in the .env file.
 * To change it, update API_IP in sagra-mob/.env
 * 
 * Platform-specific behavior:
 * - Android Emulator: Uses 10.0.2.2 (special alias for host machine's localhost)
 * - iOS Simulator: Uses localhost (works directly)
 * - Physical Device: Uses API_IP from .env file
 */
const getBaseURL = () => {
  // For physical devices, use IP address from .env file
  // Make sure your phone and computer are on the same Wi-Fi network
  if (API_IP) {
    const url = `http://${API_IP}:8080/api`;
    console.log(`📱 Using API_IP from .env: ${url}`);
    return url;
  }
  
  // Fallback to platform-specific defaults if API_IP is not set
  if (Platform.OS === 'android') {
    const url = 'http://10.0.2.2:8080/api'; // Android emulator
    console.log(`📱 Android Emulator - Using: ${url}`);
    return url;
  } else {
    const url = 'http://localhost:8080/api'; // iOS simulator
    console.log(`📱 iOS Simulator - Using: ${url}`);
    return url;
  }
};

export const API_BASE_URL = getBaseURL();
// export const API_BASE_URL = 'https://sagradagoapi.onrender.com/api';
console.log(`🌐 API_BASE_URL configured as: ${API_BASE_URL}`);

