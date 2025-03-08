import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../contexts/AppContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const { isLoading } = useAppContext();

  // If the app is still loading, show nothing
  if (isLoading) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  // Always use dark theme for this app
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
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="test-session/[id]"
          options={{
            title: 'Test Session',
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
            headerBackTitle: 'Back',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="chat/[id]"
          options={{
            title: 'Chat',
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
            headerBackTitle: 'Back',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="metric-detail/[id]"
          options={{
            title: 'Metric Detail',
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
            headerBackTitle: 'Back',
            presentation: 'card',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
