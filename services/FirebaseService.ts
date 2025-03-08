import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';

// Firebase configuration from project specifications
const firebaseConfig = {
  apiKey: "AIzaSyDXQnxRLQBYLOxQpoxhbA9WcxRKXY_fzaE",
  authDomain: "deacons-app.firebaseapp.com",
  projectId: "deacons-app",
  storageBucket: "deacons-app.appspot.com",
  messagingSenderId: "379368428708",
  appId: "1:379368428708:android:74255229f37c30958ac231",
  measurementId: "G-MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Storage keys
const STORAGE_KEYS = {
  FIREBASE_UID: 'firebase_uid',
  AUTH_TOKEN: 'auth_token'
};

/**
 * Service for Firebase authentication and other Firebase-related functionality
 */
class FirebaseService {
  /**
   * Initialize Firebase and authenticate anonymously
   */
  async initialize(): Promise<string> {
    try {
      // Check if we already have a Firebase UID
      const storedUid = await SecureStore.getItemAsync(STORAGE_KEYS.FIREBASE_UID);

      if (storedUid) {
        return storedUid;
      }

      // If not, sign in anonymously
      const result = await signInAnonymously(auth);
      const uid = result.user.uid;

      // Store the UID
      await SecureStore.setItemAsync(STORAGE_KEYS.FIREBASE_UID, uid);

      return uid;
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw error;
    }
  }

  /**
   * Get the current Firebase UID
   */
  async getUid(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.FIREBASE_UID);
    } catch (error) {
      console.error('Error getting Firebase UID:', error);
      return null;
    }
  }

  /**
   * Store authentication token
   */
  async storeAuthToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error storing auth token:', error);
      throw error;
    }
  }

  /**
   * Get authentication token
   */
  async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Clear authentication token
   */
  async clearAuthToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error clearing auth token:', error);
      throw error;
    }
  }
}

export default new FirebaseService();