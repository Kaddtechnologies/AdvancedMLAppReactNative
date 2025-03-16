import 'expo-router/entry';
import { LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

console.log('App.js initializing...');

// Initialize splash screen
const initSplashScreen = async () => {
  try {
    console.log('Preventing splash screen auto-hide...');
    await SplashScreen.preventAutoHideAsync();
    console.log('Splash screen auto-hide prevented successfully');
  } catch (error) {
    if (error.message && error.message.includes('keep awake')) {
      console.log('Ignoring keep-awake activation warning - this is expected behavior');
    } else {
      console.warn('Error preventing splash screen auto hide:', error);
    }
  }
};

// Initialize app
initSplashScreen().catch(error => {
  console.error('Error during app initialization:', error);
});

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'ViewPropTypes will be removed from React Native',
  'AsyncStorage has been extracted from react-native',
  'Unable to deactivate keep awake',
]);

console.log('App.js initialization complete');
