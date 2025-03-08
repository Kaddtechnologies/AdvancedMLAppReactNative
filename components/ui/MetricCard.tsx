import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import GradientCard from './GradientCard';
import StyledText from './StyledText';
import { Spacing } from '../../constants/Theme';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onPress?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  style,
  trend,
  trendValue,
  onPress,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Determine trend color
  let trendColor;
  let trendPrefix;

  switch (trend) {
    case 'up':
      trendColor = '#4CAF50'; // Green
      trendPrefix = '+';
      break;
    case 'down':
      trendColor = '#F44336'; // Red
      trendPrefix = '-';
      break;
    case 'neutral':
    default:
      trendColor = colors.accentSecondary;
      trendPrefix = '';
      break;
  }

  return (
    <GradientCard style={[styles.container, style]} withShadow={true}>
      <View style={styles.header}>
        <StyledText variant="cardTitle" weight="medium">
          {title}
        </StyledText>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>

      <View style={styles.valueContainer}>
        <StyledText variant="largeHeader" weight="semibold" style={styles.value}>
          {value}
        </StyledText>

        {trend && trendValue && (
          <View style={styles.trendContainer}>
            <StyledText
              variant="bodySmall"
              style={{ color: trendColor }}
            >
              {trendPrefix}{trendValue}
            </StyledText>
          </View>
        )}
      </View>

      {description && (
        <StyledText variant="bodySmall" style={styles.description}>
          {description}
        </StyledText>
      )}
    </GradientCard>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  iconContainer: {
    marginLeft: Spacing.s,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: Spacing.s,
  },
  value: {
    marginRight: Spacing.s,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    marginTop: Spacing.s,
    opacity: 0.7,
  },
});

export default MetricCard;