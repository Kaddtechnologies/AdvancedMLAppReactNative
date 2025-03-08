import React from 'react';
import { StyleSheet, View, Dimensions, ViewStyle } from 'react-native';
import { LineChart as VictoryLineChart } from 'victory-native';
import { VictoryTheme, VictoryAxis, VictoryLabel } from 'victory-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/Theme';
import GradientCard from './GradientCard';
import StyledText from './StyledText';

interface DataPoint {
  x: number | Date;
  y: number;
}

interface LineChartProps {
  data: DataPoint[];
  title?: string;
  description?: string;
  style?: ViewStyle;
  height?: number;
  width?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  showCard?: boolean;
}

const screenWidth = Dimensions.get('window').width;

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  description,
  style,
  height = 200,
  width = screenWidth - 40,
  xAxisLabel,
  yAxisLabel,
  color,
  showCard = true,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const chartColor = color || colors.accent;

  const chartComponent = (
    <View style={styles.chartContainer}>
      {title && (
        <StyledText variant="cardTitle" weight="medium" style={styles.title}>
          {title}
        </StyledText>
      )}

      <View style={styles.chart}>
        <VictoryLineChart
          height={height}
          width={width}
          data={data}
          theme={VictoryTheme.material}
          style={{
            data: {
              stroke: chartColor,
              strokeWidth: 3,
            },
            parent: {
              backgroundColor: 'transparent',
            },
          }}
          padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
        >
          <VictoryAxis
            style={{
              axis: { stroke: colors.accentSecondary, opacity: 0.5 },
              tickLabels: {
                fill: colors.text,
                opacity: 0.7,
                fontSize: 10,
              },
              grid: {
                stroke: colors.accentSecondary,
                opacity: 0.1,
              },
            }}
            label={xAxisLabel}
            axisLabelComponent={
              <VictoryLabel
                style={{ fill: colors.text, opacity: 0.7 }}
                dy={20}
              />
            }
          />

          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: colors.accentSecondary, opacity: 0.5 },
              tickLabels: {
                fill: colors.text,
                opacity: 0.7,
                fontSize: 10,
              },
              grid: {
                stroke: colors.accentSecondary,
                opacity: 0.1,
              },
            }}
            label={yAxisLabel}
            axisLabelComponent={
              <VictoryLabel
                style={{ fill: colors.text, opacity: 0.7 }}
                dx={-30}
              />
            }
          />
        </VictoryLineChart>
      </View>

      {description && (
        <StyledText variant="bodySmall" style={styles.description}>
          {description}
        </StyledText>
      )}
    </View>
  );

  if (showCard) {
    return (
      <GradientCard style={[styles.container, style]}>
        {chartComponent}
      </GradientCard>
    );
  }

  return chartComponent;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    padding: 0,
  },
  chartContainer: {
    padding: Spacing.m,
  },
  title: {
    marginBottom: Spacing.s,
  },
  chart: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    marginTop: Spacing.s,
    opacity: 0.7,
  },
});

export default LineChart;