import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Typography } from '../../constants/Theme';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Determine button size
  let buttonSize;
  switch (size) {
    case 'small':
      buttonSize = styles.buttonSmall;
      break;
    case 'large':
      buttonSize = styles.buttonLarge;
      break;
    case 'medium':
    default:
      buttonSize = styles.buttonMedium;
      break;
  }

  // Determine button style based on variant
  let buttonStyle;
  let buttonTextStyle;
  let gradientColors;

  switch (variant) {
    case 'secondary':
      gradientColors = [colors.accentSecondary, colors.accentSecondary];
      buttonStyle = styles.buttonSecondary;
      buttonTextStyle = styles.textSecondary;
      break;
    case 'outline':
      gradientColors = ['transparent', 'transparent'];
      buttonStyle = styles.buttonOutline;
      buttonTextStyle = styles.textOutline;
      break;
    case 'primary':
    default:
      gradientColors = colors.buttonGradient.colors;
      buttonStyle = styles.buttonPrimary;
      buttonTextStyle = styles.textPrimary;
      break;
  }

  // Apply opacity if disabled
  const opacity = disabled ? 0.5 : 1;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, buttonSize, style, { opacity }]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, buttonStyle]}
      >
        {loading ? (
          <ActivityIndicator color={colors.text} size="small" />
        ) : (
          <Text style={[styles.text, buttonTextStyle, textStyle]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
  },
  buttonSmall: {
    height: 36,
  },
  buttonMedium: {
    height: 48,
  },
  buttonLarge: {
    height: 56,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonPrimary: {
    borderRadius: BorderRadius.medium,
  },
  buttonSecondary: {
    borderRadius: BorderRadius.medium,
  },
  buttonOutline: {
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.light.accent,
  },
  text: {
    fontFamily: Typography.fontFamily.primary,
    fontWeight: Typography.fontWeights.medium,
    fontSize: Typography.fontSize.body,
    letterSpacing: Typography.letterSpacing.default,
  },
  textPrimary: {
    color: Colors.light.text,
  },
  textSecondary: {
    color: Colors.light.text,
  },
  textOutline: {
    color: Colors.light.accent,
  },
});

export default GradientButton;