import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  style,
}) => {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const gradientColors = colors.backgroundGradient.colors as [string, string];

  return (
    <View style={[{ flex: 1 }, style]}>
      <LinearGradient
        colors={gradientColors}
        start={colors.backgroundGradient.start}
        end={colors.backgroundGradient.end}
        style={{ flex: 1 }}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

export default GradientBackground;