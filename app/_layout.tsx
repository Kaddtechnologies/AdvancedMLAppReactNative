import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme, View, Text, ActivityIndicator, LogBox } from 'react-native';
import { Colors } from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../contexts/AppContext';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../components/navigation/CustomDrawerContent';
import { Home } from 'lucide-react-native';

// Import ErrorBoundary from expo-router
import { ErrorBoundary } from 'expo-router';
// Re-export it
export { ErrorBoundary };

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'ViewPropTypes will be removed from React Native',
  'AsyncStorage has been extracted from react-native',
  'Unable to deactivate keep awake',
]);

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('RootLayout mounted, initializing app...');
        // Add a small delay to ensure all components are mounted
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Attempting to hide splash screen...');
        await SplashScreen.hideAsync();
        console.log('Splash screen hidden successfully');
      } catch (error) {
        console.warn('Error during app initialization:', error);
      }
    };

    initializeApp();
  }, []);

  console.log('Rendering RootLayout');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
        <AppProvider>
          <Drawer
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerTintColor: colors.text,
              headerTitleStyle: {
                fontWeight: '600',
              },
              drawerStyle: {
                backgroundColor: colors.background,
                width: '80%',
              },
              drawerActiveTintColor: colors.accent,
              drawerInactiveTintColor: colors.accentSecondary,
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            <Drawer.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                drawerLabel: 'Home',
                drawerIcon: ({ color }) => <Home color={color} size={24} />,
              }}
            />
          </Drawer>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </AppProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
