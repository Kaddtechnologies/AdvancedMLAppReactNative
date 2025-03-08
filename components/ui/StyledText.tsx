import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Theme';

type TextVariant =
  | 'largeHeader'
  | 'header'
  | 'sectionHeader'
  | 'cardTitle'
  | 'body'
  | 'bodySmall'
  | 'secondary';

type TextWeight = 'light' | 'regular' | 'medium' | 'semibold';

interface StyledTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  weight?: TextWeight;
  style?: TextStyle;
  color?: string;
  onPress?: () => void;
  numberOfLines?: number;
  adjustsFontSizeToFit?: boolean;
  onBrown?: boolean;
}

export const StyledText: React.FC<StyledTextProps> = ({
  children,
  variant = 'body',
  weight = 'regular',
  style,
  color,
  onPress,
  numberOfLines,
  adjustsFontSizeToFit,
  onBrown = false,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Determine text color
  const textColor = color
    ? color
    : onBrown
      ? colors.textSecondary
      : colors.text;

  // Determine text variant style
  let variantStyle;
  switch (variant) {
    case 'largeHeader':
      variantStyle = styles.largeHeader;
      break;
    case 'header':
      variantStyle = styles.header;
      break;
    case 'sectionHeader':
      variantStyle = styles.sectionHeader;
      break;
    case 'cardTitle':
      variantStyle = styles.cardTitle;
      break;
    case 'bodySmall':
      variantStyle = styles.bodySmall;
      break;
    case 'secondary':
      variantStyle = styles.secondary;
      break;
    case 'body':
    default:
      variantStyle = styles.body;
      break;
  }

  // Determine text weight style
  let weightStyle;
  switch (weight) {
    case 'light':
      weightStyle = styles.light;
      break;
    case 'medium':
      weightStyle = styles.medium;
      break;
    case 'semibold':
      weightStyle = styles.semibold;
      break;
    case 'regular':
    default:
      weightStyle = styles.regular;
      break;
  }

  return (
    <Text
      style={[
        styles.text,
        variantStyle,
        weightStyle,
        { color: textColor },
        style,
      ]}
      onPress={onPress}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: Typography.fontFamily.primary,
    letterSpacing: Typography.letterSpacing.default,
    lineHeight: Typography.fontSize.body * Typography.lineHeight.default,
  },
  // Variants
  largeHeader: {
    fontSize: Typography.fontSize.largeHeader,
    lineHeight: Typography.fontSize.largeHeader * Typography.lineHeight.tight,
  },
  header: {
    fontSize: Typography.fontSize.header,
    lineHeight: Typography.fontSize.header * Typography.lineHeight.tight,
  },
  sectionHeader: {
    fontSize: Typography.fontSize.sectionHeader,
    lineHeight: Typography.fontSize.sectionHeader * Typography.lineHeight.tight,
  },
  cardTitle: {
    fontSize: Typography.fontSize.cardTitle,
    lineHeight: Typography.fontSize.cardTitle * Typography.lineHeight.tight,
  },
  body: {
    fontSize: Typography.fontSize.body,
    lineHeight: Typography.fontSize.body * Typography.lineHeight.default,
  },
  bodySmall: {
    fontSize: Typography.fontSize.bodySmall,
    lineHeight: Typography.fontSize.bodySmall * Typography.lineHeight.default,
  },
  secondary: {
    fontSize: Typography.fontSize.secondary,
    lineHeight: Typography.fontSize.secondary * Typography.lineHeight.default,
  },
  // Weights
  light: {
    fontWeight: '300',
  },
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semibold: {
    fontWeight: '600',
  },
});

export default StyledText;