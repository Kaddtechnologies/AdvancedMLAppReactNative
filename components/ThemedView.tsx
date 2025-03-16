import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundValue = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  // Ensure we only use string colors, not gradient objects
  const backgroundColor = typeof backgroundValue === 'string' ? backgroundValue : '#000';

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
