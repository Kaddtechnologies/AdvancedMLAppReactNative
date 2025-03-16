import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { BorderRadius, Shadows } from '../../constants/Theme';

interface GradientCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  withShadow?: boolean;
  onLayout?: () => void;
}

const GradientCard: React.FC<GradientCardProps> = ({
  children,
  style,
  withShadow = false,
  onLayout,
}) => {
  console.log('GradientCard rendering');
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const gradientColors = colors.cardBackgroundGradient.colors as [string, string];

  return (
    <View
      style={[styles.container, withShadow && Shadows.small, style]}
      onLayout={onLayout}
    >
      <LinearGradient
        colors={gradientColors}
        start={colors.cardBackgroundGradient.start}
        end={colors.cardBackgroundGradient.end}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
    borderRadius: BorderRadius.medium,
  },
});

export default GradientCard;
