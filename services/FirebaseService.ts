import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, User, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get Firebase configuration from app.json extra
const firebaseConfig = Constants.expoConfig?.extra?.firebase || {
  apiKey: "AIzaSyBDcE6W1_l4_tAKSKR6icpcmpdzGizyGuw",
  authDomain: "official-ph-deacons-admin-app.firebaseapp.com",
  projectId: "official-ph-deacons-admin-app",
  storageBucket: "official-ph-deacons-admin-app.appspot.com",
  messagingSenderId: "1080056460636",
  appId: "1:1080056460636:android:dcfa6f34dce663ef507d99"
};

// Initialize Firebase properly for React Native
let app;
let auth;

try {
  // Check if Firebase is already initialized
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    console.log('Firebase initialized successfully with AsyncStorage persistence');
  } else {
    app = getApp();
    auth = getAuth(app);
    console.log('Using existing Firebase instance');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  Sentry.captureException(error, {
    tags: {
      component: 'FirebaseService',
      method: 'initialization',
    },
  });

  // Fallback initialization
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Storage keys
const STORAGE_KEYS = {
  FIREBASE_UID: 'firebase_uid',
  AUTH_TOKEN: 'auth_token',
  USER_EMAIL: 'user_email'
};

// Default user credentials
const DEFAULT_EMAIL = 'DavidRJones3@gmail.com';
const DEFAULT_PASSWORD = 'Kadda!123';
// Fallback UUID to use if authentication fails
const FALLBACK_UUID = 'a6d3028d-a025-493f-a75a-8ee5e88ff52b';

/**
 * Service for Firebase authentication and other Firebase-related functionality
 */
class FirebaseService {
  private currentUser: User | null = null;

  /**
   * Initialize Firebase and authenticate with email
   */
  async initialize(): Promise<string> {
    try {
      // Add breadcrumb for Firebase initialization
      Sentry.addBreadcrumb({
        category: 'firebase',
        message: 'Initializing Firebase',
        level: 'info',
      });

      // Check if we already have a Firebase UID
      const storedUid = await SecureStore.getItemAsync(STORAGE_KEYS.FIREBASE_UID);

      if (storedUid) {
        Sentry.addBreadcrumb({
          category: 'firebase',
          message: 'Using stored Firebase UID',
          level: 'info',
        });
        return storedUid;
      }

      // Try to sign in with email and password
      try {
        Sentry.addBreadcrumb({
          category: 'firebase',
          message: 'Attempting email sign in',
          level: 'info',
          data: { email: DEFAULT_EMAIL }
        });

        const result = await signInWithEmailAndPassword(auth, DEFAULT_EMAIL, DEFAULT_PASSWORD);
        this.currentUser = result.user;
        const uid = result.user.uid;

        // Store the UID and email
        await SecureStore.setItemAsync(STORAGE_KEYS.FIREBASE_UID, uid);
        await SecureStore.setItemAsync(STORAGE_KEYS.USER_EMAIL, DEFAULT_EMAIL);

        Sentry.addBreadcrumb({
          category: 'firebase',
          message: 'Email sign in successful',
          level: 'info',
        });

        return uid;
      } catch (emailError) {
        // Log the authentication error
        console.warn('Email authentication failed, using fallback UUID:', emailError);
        Sentry.addBreadcrumb({
          category: 'firebase',
          message: 'Email authentication failed, using fallback UUID',
          level: 'warning',
          data: { error: emailError.message }
        });

        // Use the fallback UUID instead
        await SecureStore.setItemAsync(STORAGE_KEYS.FIREBASE_UID, FALLBACK_UUID);

        return FALLBACK_UUID;
      }
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      Sentry.captureException(error, {
        tags: {
          component: 'FirebaseService',
          method: 'initialize',
        },
      });
      throw error;
    }
  }

  /**
   * Get the current Firebase user
   */
  getCurrentUser(): User | null {
    return this.currentUser || auth.currentUser;
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
