import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'card' | 'navbar';
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  style,
  variant = 'primary',
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  let gradientConfig;
  switch (variant) {
    case 'secondary':
      gradientConfig = colors.secondaryBackgroundGradient;
      break;
    case 'card':
      gradientConfig = colors.cardBackgroundGradient;
      break;
    case 'navbar':
      gradientConfig = colors.navBarGradient;
      break;
    case 'primary':
    default:
      gradientConfig = colors.backgroundGradient;
      break;
  }

  return (
    <LinearGradient
      colors={gradientConfig.colors}
      start={gradientConfig.start}
      end={gradientConfig.end}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default GradientBackground;