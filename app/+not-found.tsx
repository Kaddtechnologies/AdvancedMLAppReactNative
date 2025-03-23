import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import StyledText from '../components/ui/StyledText';
import GradientBackground from '../components/ui/GradientBackground';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <GradientBackground>
        <View style={styles.container}>
          <StyledText variant="title" weight="bold">This screen doesn't exist.</StyledText>
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
