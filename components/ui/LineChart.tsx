import React from 'react';
import { View, StyleSheet, Dimensions, TextStyle, ViewStyle } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { Spacing } from '../../constants/Theme';
import StyledText from './StyledText';

interface LineChartProps {
  data: { x: number; y: number }[];
  title?: string;
  description?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  width?: number;
}

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  description: TextStyle;
  chartContainer: ViewStyle;
  chartWrapper: ViewStyle;
  xAxisLabel: TextStyle;
  yAxisLabel: TextStyle;
}

const screenWidth = Dimensions.get('window').width;

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  description,
  xAxisLabel = '',
  yAxisLabel = '',
  height = 220,
  width = screenWidth - 48,
}) => {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const chartData = {
    labels: data.map(point => point.x.toString()),
    datasets: [
      {
        data: data.map(point => point.y),
        color: () => colors.accent,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 1,
    color: () => colors.accent,
    labelColor: () => colors.textSecondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.accent,
    },
  };

  const titleStyle: TextStyle = {
    ...styles.title,
    fontSize: 18,
    fontWeight: '600',
  };

  const descriptionStyle: TextStyle = {
    ...styles.description,
    fontSize: 14,
  };

  const yAxisStyle: TextStyle = {
    ...styles.yAxisLabel,
    fontSize: 12,
  };

  const xAxisStyle: TextStyle = {
    ...styles.xAxisLabel,
    fontSize: 12,
  };

  return (
    <View style={styles.container}>
      {title && (
        <StyledText style={titleStyle}>
          {title}
        </StyledText>
      )}
      {description && (
        <StyledText style={descriptionStyle}>
          {description}
        </StyledText>
      )}

      <View style={styles.chartContainer}>
        {yAxisLabel && (
          <StyledText style={yAxisStyle}>
            {yAxisLabel}
          </StyledText>
        )}

        <View style={styles.chartWrapper}>
          <RNLineChart
            data={chartData}
            width={width}
            height={height}
            chartConfig={chartConfig}
            bezier
            withInnerLines={false}
            withOuterLines={true}
            withVerticalLines={false}
            withHorizontalLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            fromZero
          />
        </View>

        {xAxisLabel && (
          <StyledText style={xAxisStyle}>
            {xAxisLabel}
          </StyledText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    padding: Spacing.m,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  description: {
    marginBottom: Spacing.m,
    opacity: 0.7,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartWrapper: {
    marginVertical: Spacing.m,
    borderRadius: 16,
    overflow: 'hidden',
  },
  xAxisLabel: {
    textAlign: 'center',
    marginTop: Spacing.s,
    opacity: 0.7,
  },
  yAxisLabel: {
    transform: [{ rotate: '-90deg' }] as unknown as TextStyle['transform'],
    position: 'absolute',
    left: -30,
    width: 100,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default LineChart;
