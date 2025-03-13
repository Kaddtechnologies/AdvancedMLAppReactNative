import { Redirect } from 'expo-router';

// This is the main entry point for the app
// Redirect to the tabs layout
export default function Index() {
  return <Redirect href="/(tabs)" />;
}