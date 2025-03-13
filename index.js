import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import React from 'react';
import SentryService from './services/SentryService';
import FirebaseService from './services/FirebaseService';
import * as Sentry from '@sentry/react-native';
import './App'; // Import App.js for its side effects (LogBox configuration, etc.)

// Disable React DevTools in development
if (__DEV__) {
  const noop = () => {};
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    Object.keys(window.__REACT_DEVTOOLS_GLOBAL_HOOK__).forEach(key => {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] = typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] === 'function' ? noop : null;
    });
  }
}

// Initialize Sentry first
SentryService.initialize();

// Add debug logging
console.log('Starting app initialization from index.js');

// Initialize Firebase
FirebaseService.initialize()
  .then(() => {
    console.log('Firebase initialized successfully');
  })
  .catch(error => {
    console.error('Error initializing Firebase:', error);
    SentryService.captureException(error);
  });

// Create the root component
function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

// Register the root component
registerRootComponent(App);
