import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function AIAnalyticsLayout() {
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
        headerTitle: 'AI Analytics',
        headerBackTitle: 'Back',
      }}
    />
  );
}
