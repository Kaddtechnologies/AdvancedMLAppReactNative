import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function ScreenLayout() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        presentation: 'modal',
      }}
    >
      <Stack.Screen
        name="settings"
        options={{
          headerTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="ai-analytics"
        options={{
          headerTitle: 'AI Analytics',
        }}
      />
      <Stack.Screen
        name="enhanced-ai"
        options={{
          headerTitle: 'Enhanced AI',
        }}
      />
      <Stack.Screen
        name="explore"
        options={{
          headerTitle: 'Explore',
        }}
      />
      <Stack.Screen
        name="conversations"
        options={{
          headerTitle: 'Conversations',
        }}
      />
    </Stack>
  );
}
