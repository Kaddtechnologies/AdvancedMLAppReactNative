import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import StyledText from '../../components/ui/StyledText';
import GradientCard from '../../components/ui/GradientCard';
import MetricCard from '../../components/ui/MetricCard';
import LineChart from '../../components/ui/LineChart';
import { Spacing } from '../../constants/Theme';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAppContext } from '../../contexts/AppContext';
import { format } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

// Metric types
type MetricType =
  | 'personalizationScore'
  | 'recallRate'
  | 'contextualRelevance'
  | 'conversationNaturalness';

// Metric info
const metricInfo: Record<MetricType, {
  title: string;
  description: string;
  icon: string;
  max: number;
  unit: string;
}> = {
  personalizationScore: {
    title: 'Personalization Score',
    description: 'Measures how well AI tailors responses to you',
    icon: 'user',
    max: 5,
    unit: '/5'
  },
  recallRate: {
    title: 'Information Recall',
    description: 'Measures accuracy in recalling shared information',
    icon: 'refresh',
    max: 100,
    unit: '%'
  },
  contextualRelevance: {
    title: 'Contextual Relevance',
    description: 'Measures how well responses fit conversation context',
    icon: 'sitemap',
    max: 100,
    unit: '/100'
  },
  conversationNaturalness: {
    title: 'Conversation Naturalness',
    description: 'Measures human-like quality of interactions',
    icon: 'comments',
    max: 10,
    unit: '/10'
  }
};

export default function MetricsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const { metricsHistory, refreshMetricsHistory } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('personalizationScore');

  // Load metrics on mount
  useEffect(() => {
    loadMetrics();
  }, []);

  // Load metrics
  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      await refreshMetricsHistory();
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to metric detail
  const navigateToMetricDetail = (metricType: MetricType) => {
    router.push(`/metric-detail/${metricType}`);
  };

  // Get the latest value for a metric
  const getLatestMetricValue = (metricType: MetricType): number | null => {
    const metricData = metricsHistory[metricType];

    if (!metricData || metricData.length === 0) {
      return null;
    }

    return metricData[metricData.length - 1].value;
  };

  // Get the trend for a metric
  const getMetricTrend = (metricType: MetricType): { trend: 'up' | 'down' | 'neutral', value: string } => {
    const metricData = metricsHistory[metricType];

    if (!metricData || metricData.length < 2) {
      return { trend: 'neutral', value: '0' };
    }

    const latest = metricData[metricData.length - 1].value;
    const previous = metricData[metricData.length - 2].value;
    const difference = latest - previous;

    if (difference > 0) {
      return { trend: 'up', value: difference.toFixed(1) };
    } else if (difference < 0) {
      return { trend: 'down', value: Math.abs(difference).toFixed(1) };
    } else {
      return { trend: 'neutral', value: '0' };
    }
  };

  // Format chart data
  const formatChartData = (metricType: MetricType) => {
    const metricData = metricsHistory[metricType];

    if (!metricData || metricData.length === 0) {
      return [{ x: 0, y: 0 }];
    }

    return metricData.map((item, index) => ({
      x: index + 1,
      y: item.value
    }));
  };

  // Get all metrics for summary
  const getAllMetrics = () => {
    return Object.keys(metricInfo).map(key => {
      const metricType = key as MetricType;
      const info = metricInfo[metricType];
      const value = getLatestMetricValue(metricType);
      const trend = getMetricTrend(metricType);

      return {
        type: metricType,
        title: info.title,
        description: info.description,
        icon: info.icon,
        value: value !== null ? `${value}${info.unit}` : 'N/A',
        trend: trend.trend,
        trendValue: trend.value
      };
    });
  };

  // Render the metrics summary
  const renderMetricsSummary = () => {
    const metrics = getAllMetrics();

    return (
      <View style={styles.metricsGrid}>
        {metrics.map(metric => (
          <TouchableOpacity
            key={metric.type}
            style={styles.metricCardContainer}
            onPress={() => {
              setSelectedMetric(metric.type as MetricType);
              navigateToMetricDetail(metric.type as MetricType);
            }}
          >
            <MetricCard
              title={metric.title}
              value={metric.value}
              description={metric.description}
              trend={metric.trend}
              trendValue={metric.trendValue}
              icon={
                <FontAwesome
                  name={metric.icon}
                  size={20}
                  color={colors.accent}
                />
              }
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render the selected metric chart
  const renderMetricChart = () => {
    const metricType = selectedMetric;
    const info = metricInfo[metricType];
    const chartData = formatChartData(metricType);

    return (
      <LineChart
        data={chartData}
        title={`${info.title} Over Time`}
        description={info.description}
        xAxisLabel="Test Sessions"
        yAxisLabel={info.title}
        height={220}
        width={screenWidth - 48}
      />
    );
  };

  // Render the metrics history
  const renderMetricsHistory = () => {
    const metricType = selectedMetric;
    const metricData = metricsHistory[metricType];

    if (!metricData || metricData.length === 0) {
      return (
        <View style={styles.emptyState}>
          <StyledText variant="body" style={styles.emptyStateText}>
            No history data available for this metric.
          </StyledText>
        </View>
      );
    }

    return (
      <GradientCard style={styles.historyCard}>
        <StyledText variant="cardTitle" weight="medium" style={styles.historyTitle}>
          {metricInfo[metricType].title} History
        </StyledText>

        <View style={styles.historyList}>
          {metricData.slice().reverse().map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyDate}>
                <FontAwesome
                  name="calendar"
                  size={12}
                  color={colors.accentSecondary}
                  style={styles.historyIcon}
                />
                <StyledText variant="secondary">
                  {format(new Date(item.date), 'MMM d, yyyy')}
                </StyledText>
              </View>

              <StyledText variant="body" weight="semibold">
                {item.value}{metricInfo[metricType].unit}
              </StyledText>
            </View>
          ))}
        </View>
      </GradientCard>
    );
  };

  return (
    <GradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <StyledText variant="largeHeader" weight="semibold">
            Metrics
          </StyledText>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadMetrics}
            disabled={isLoading}
          >
            <FontAwesome
              name="refresh"
              size={16}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        <StyledText variant="body" style={styles.subtitle}>
          Track AI learning and personalization metrics
        </StyledText>

        {isLoading ? (
          <ActivityIndicator color={colors.accent} style={styles.loader} />
        ) : (
          <>
            <View style={styles.section}>
              <StyledText variant="sectionHeader" weight="medium" style={styles.sectionTitle}>
                Key Metrics
              </StyledText>

              {renderMetricsSummary()}
            </View>

            <View style={styles.section}>
              <StyledText variant="sectionHeader" weight="medium" style={styles.sectionTitle}>
                Learning Progress
              </StyledText>

              {renderMetricChart()}
            </View>

            <View style={styles.section}>
              <StyledText variant="sectionHeader" weight="medium" style={styles.sectionTitle}>
                Metrics History
              </StyledText>

              {renderMetricsHistory()}
            </View>
          </>
        )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.m,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: Spacing.l,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.m,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCardContainer: {
    width: '48%',
    marginBottom: Spacing.m,
  },
  historyCard: {
    marginBottom: Spacing.m,
  },
  historyTitle: {
    marginBottom: Spacing.m,
  },
  historyList: {
    marginTop: Spacing.s,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  historyDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    marginRight: Spacing.xs,
  },
  emptyState: {
    padding: Spacing.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  loader: {
    marginTop: Spacing.xl,
  },
});