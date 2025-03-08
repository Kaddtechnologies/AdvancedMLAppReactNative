import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Shadows } from '../../constants/Theme';
import { BlurView } from 'expo-blur';

interface GradientCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  blurIntensity?: number;
  withShadow?: boolean;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  style,
  blurIntensity = 20,
  withShadow = true,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const gradientConfig = colors.cardBackgroundGradient;

  return (
    <View style={[withShadow && Shadows.medium, styles.container, style]}>
      <BlurView intensity={blurIntensity} tint="dark" style={styles.blurView}>
        <LinearGradient
          colors={gradientConfig.colors}
          start={gradientConfig.start}
          end={gradientConfig.end}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    margin: 8,
  },
  blurView: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: BorderRadius.large,
  },
  gradient: {
    width: '100%',
    height: '100%',
    padding: 16,
  },
});

export default GradientCard;