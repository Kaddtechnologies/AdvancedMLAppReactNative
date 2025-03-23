import { Link, Stack, useRouter } from 'expo-router';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import StyledText from '../components/ui/StyledText';
import GradientBackground from '../components/ui/GradientBackground';
import { ArrowLeft } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

export default function NotFoundScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Oops!',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <ArrowLeft color={colors.text} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      <GradientBackground>
        <View style={styles.container}>
          <StyledText variant="header" weight="bold">This screen doesn't exist.</StyledText>
          <Link href="/" style={styles.link}>
            <StyledText style={{ color: '#3498db' }}>Go to home screen!</StyledText>
          </Link>
        </View>
      </GradientBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
