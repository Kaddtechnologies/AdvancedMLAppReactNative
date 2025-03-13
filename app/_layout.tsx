 import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme, View, Text, ActivityIndicator, LogBox } from 'react-native';
import { Colors } from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../contexts/AppContext';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import ErrorBoundary from expo-router
import { ErrorBoundary } from 'expo-router';
// Re-export it
export { ErrorBoundary };

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

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: 'transparent',
      primary: colors.accent,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <ThemeProvider value={theme}>
          <StatusBar style="light" />
          <Drawer screenOptions={{
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
            drawerStyle: {
              backgroundColor: colors.background,
            },
            drawerActiveTintColor: colors.accent,
            drawerInactiveTintColor: colors.text,
          }}>
            <Drawer.Screen
              name="(tabs)"
              options={{
                drawerLabel: 'Home',
                title: 'Home',
                drawerIcon: ({ size, color }) => (
                  <FontAwesome name="home" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="ai-analytics"
              options={{
                drawerLabel: 'AI Analytics',
                title: 'AI Analytics',
                drawerIcon: ({ size, color }) => (
                  <FontAwesome name="bar-chart" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="enhanced-ai"
              options={{
                drawerLabel: 'Enhanced AI',
                title: 'Enhanced AI',
                drawerIcon: ({ size, color }) => (
                  <FontAwesome name="lightbulb-o" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="conversations"
              options={{
                drawerLabel: 'Conversations',
                title: 'Conversations',
                drawerIcon: ({ size, color }) => (
                  <FontAwesome name="comments" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="settings"
              options={{
                drawerLabel: 'Settings',
                title: 'Settings',
                drawerIcon: ({ size, color }) => (
                  <FontAwesome name="cog" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="explore"
              options={{
                drawerLabel: 'Explore',
                title: 'Explore',
                drawerIcon: ({ size, color }) => (
                  <FontAwesome name="compass" size={size} color={color} />
                ),
              }}
            />
          </Drawer>
        </ThemeProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
