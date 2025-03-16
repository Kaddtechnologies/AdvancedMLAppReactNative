import React from 'react';
import { Text, TextStyle, TextProps } from 'react-native';
import { Typography } from '../../constants/Theme';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

type FontWeight = '400' | '500' | '600' | '700';

interface StyledTextProps extends TextProps {
  variant?: keyof typeof Typography.fontSize;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  style?: TextStyle;
}

const fontWeightMap: Record<StyledTextProps['weight'], FontWeight> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

const StyledText: React.FC<StyledTextProps> = ({
  variant = 'body',
  weight = 'regular',
  style,
  children,
  ...props
}) => {
  console.log('StyledText rendering:', {
    variant,
    weight,
    hasStyle: !!style,
    text: typeof children === 'string' ? children.substring(0, 20) : 'non-string content'
  });
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const baseStyle: TextStyle = {
    color: colors.text,
    fontSize: Typography.fontSize[variant],
    fontWeight: fontWeightMap[weight],
  };

  return (
    <Text
      style={[baseStyle, style]}
      {...props}
      onLayout={() => {
        console.log('StyledText layout complete:', {
          variant,
          text: typeof children === 'string' ? children.substring(0, 20) : 'non-string content'
        });
      }}
    >
      {children}
    </Text>
  );
};

export default StyledText;
