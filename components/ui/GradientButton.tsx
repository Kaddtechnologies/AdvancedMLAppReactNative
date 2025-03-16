import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
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
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
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
  icon: Icon,
  iconPosition = 'left',
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Determine button size
  let buttonSize;
  let iconSize;
  switch (size) {
    case 'small':
      buttonSize = styles.buttonSmall;
      iconSize = 16;
      break;
    case 'large':
      buttonSize = styles.buttonLarge;
      iconSize = 24;
      break;
    case 'medium':
    default:
      buttonSize = styles.buttonMedium;
      iconSize = 20;
      break;
  }

  // Determine button style based on variant
  let buttonStyle;
  let buttonTextStyle;
  let gradientColors;
  let iconColor;

  switch (variant) {
    case 'secondary':
      gradientColors = [colors.accentSecondary, colors.accentSecondary];
      buttonStyle = styles.buttonSecondary;
      buttonTextStyle = styles.textSecondary;
      iconColor = Colors.light.text;
      break;
    case 'outline':
      gradientColors = ['transparent', 'transparent'];
      buttonStyle = styles.buttonOutline;
      buttonTextStyle = styles.textOutline;
      iconColor = Colors.light.accent;
      break;
    case 'primary':
    default:
      gradientColors = colors.primaryGradient.colors as [string, string];
      buttonStyle = styles.buttonPrimary;
      buttonTextStyle = styles.textPrimary;
      iconColor = Colors.light.text;
      break;
  }

  // Apply opacity if disabled
  const opacity = disabled ? 0.5 : 1;

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={colors.text} size="small" />;
    }

    const iconElement = Icon ? (
      <View style={iconPosition === 'right' ? styles.iconRight : styles.iconLeft}>
        <Icon size={iconSize} color={iconColor} />
      </View>
    ) : null;

    return (
      <View style={styles.contentContainer}>
        {iconPosition === 'left' && iconElement}
        <Text style={[styles.text, buttonTextStyle, textStyle]}>{title}</Text>
        {iconPosition === 'right' && iconElement}
      </View>
    );
  };

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
        {renderContent()}
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
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
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
    fontWeight: '500',
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