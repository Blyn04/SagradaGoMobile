import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  FB_API,
  FB_AUTH_DOMAIN,
  FB_PROJECT_ID,
  FB_STORAGE_BUCKET,
  FB_SENDER_ID,
  FB_APP_ID,
  FB_MEASUREMENT_ID
} from "@env";

console.log('Firebase Config Check:');
console.log('FB_API exists:', !!FB_API);
console.log('FB_API length:', FB_API?.length || 0);
console.log('FB_API starts with AIza:', FB_API?.startsWith('AIza') || false);
console.log('FB_PROJECT_ID:', FB_PROJECT_ID);

if (!FB_API || FB_API.trim() === '' || !FB_API.startsWith('AIza')) {
  console.error('❌ Firebase Error: FB_API is missing or invalid');
  console.error('Current FB_API value:', FB_API ? `"${FB_API.substring(0, 10)}..."` : 'undefined');
  throw new Error('Firebase API key is missing or invalid. Please check your .env file.');
}

if (!FB_PROJECT_ID || FB_PROJECT_ID.trim() === '') {
  console.error('❌ Firebase Error: FB_PROJECT_ID is missing');
  throw new Error('Firebase Project ID is missing. Please check your .env file.');
}

const firebaseConfig = {
  apiKey: FB_API.trim(),
  authDomain: (FB_AUTH_DOMAIN || `${FB_PROJECT_ID}.firebaseapp.com`).trim(),
  projectId: FB_PROJECT_ID.trim(),
  storageBucket: (FB_STORAGE_BUCKET || `${FB_PROJECT_ID}.appspot.com`).trim(),
  messagingSenderId: FB_SENDER_ID?.trim(),
  appId: FB_APP_ID?.trim(),
  measurementId: FB_MEASUREMENT_ID?.trim()
};

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  console.error('Config used:', {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'missing',
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
  });
  throw error;
}

export const auth = getAuth(app);
export default app;

