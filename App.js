import 'expo-router/entry';
import { LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(error => {
  if (error.message && error.message.includes('keep awake')) {
    console.log('Ignoring keep-awake activation warning - this is expected behavior');
  } else {
    console.warn('Error preventing splash screen auto hide:', error);
  }
});

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'ViewPropTypes will be removed from React Native',
  'AsyncStorage has been extracted from react-native',
  'Unable to deactivate keep awake',
]);
