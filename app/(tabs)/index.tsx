import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import GradientBackground from '../../components/ui/GradientBackground';
import StyledText from '../../components/ui/StyledText';
import MetricCard from '../../components/ui/MetricCard';
import GradientCard from '../../components/ui/GradientCard';
import GradientButton from '../../components/ui/GradientButton';
import LineChart from '../../components/ui/LineChart';
import { Spacing } from '../../constants/Theme';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

// Mock data for demonstration
const mockMetrics = [
  {
    id: '1',
    title: 'Personalization Score',
    value: '4.2',
    description: 'Out of 5',
    trend: 'up',
    trendValue: '0.3',
  },
  {
    id: '2',
    title: 'Information Recall',
    value: '87%',
    description: 'Accuracy rate',
    trend: 'up',
    trendValue: '5%',
  },
  {
    id: '3',
    title: 'Contextual Relevance',
    value: '76',
    description: 'Out of 100',
    trend: 'up',
    trendValue: '12',
  },
  {
    id: '4',
    title: 'Conversation Naturalness',
    value: '8.3',
    description: 'Out of 10',
    trend: 'neutral',
    trendValue: '0.1',
  },
];

const mockSessions = [
  {
    id: '1',
    title: 'Baseline Testing',
    date: '2023-11-15',
    status: 'completed',
    metrics: {
      accuracy: 82,
      responseTime: 1.2,
    },
  },
  {
    id: '2',
    title: 'Progressive Information - Session 1',
    date: '2023-11-16',
    status: 'completed',
    metrics: {
      accuracy: 85,
      responseTime: 1.1,
    },
  },
  {
    id: '3',
    title: 'Recall Testing',
    date: '2023-11-18',
    status: 'in-progress',
    metrics: {
      accuracy: 87,
      responseTime: 0.9,
    },
  },
];

const mockChartData = [
  { x: 1, y: 3.2 },
  { x: 2, y: 3.5 },
  { x: 3, y: 3.4 },
  { x: 4, y: 3.8 },
  { x: 5, y: 4.0 },
  { x: 6, y: 4.2 },
];

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const navigateToTestSession = (id: string) => {
    router.push(`/test-session/${id}`);
  };

  const navigateToMetricDetail = (id: string) => {
    router.push(`/metric-detail/${id}`);
  };

  const startNewSession = () => {
    // Logic to start a new test session
    router.push('/test-sessions/new');
  };

  return (
    <GradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <StyledText variant="largeHeader" weight="semibold">
            Dashboard
          </StyledText>
          <StyledText variant="body" style={styles.subtitle}>
            ML Testing Metrics Overview
          </StyledText>
        </View>

        <View style={styles.section}>
          <StyledText variant="sectionHeader" weight="medium" style={styles.sectionTitle}>
            Key Metrics
          </StyledText>

          <View style={styles.metricsGrid}>
            {mockMetrics.map((metric) => (
              <TouchableOpacity
                key={metric.id}
                style={styles.metricCardContainer}
                onPress={() => navigateToMetricDetail(metric.id)}
              >
                <MetricCard
                  title={metric.title}
                  value={metric.value}
                  description={metric.description}
                  trend={metric.trend as 'up' | 'down' | 'neutral'}
                  trendValue={metric.trendValue}
                  icon={
                    <FontAwesome
                      name="line-chart"
                      size={20}
                      color={colors.accent}
                    />
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <StyledText variant="sectionHeader" weight="medium" style={styles.sectionTitle}>
            Learning Progress
          </StyledText>

          <LineChart
            data={mockChartData}
            title="Personalization Score Over Time"
            description="Tracking how well the AI tailors responses to you"
            xAxisLabel="Test Sessions"
            yAxisLabel="Score"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <StyledText variant="sectionHeader" weight="medium" style={styles.sectionTitle}>
              Recent Test Sessions
            </StyledText>

            <GradientButton
              title="New Session"
              onPress={startNewSession}
              size="small"
            />
          </View>

          {mockSessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              onPress={() => navigateToTestSession(session.id)}
            >
              <GradientCard style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <StyledText variant="cardTitle" weight="medium">
                    {session.title}
                  </StyledText>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: session.status === 'completed' ? '#4CAF50' : '#FFC107' }
                  ]}>
                    <StyledText variant="secondary" weight="medium">
                      {session.status === 'completed' ? 'Completed' : 'In Progress'}
                    </StyledText>
                  </View>
                </View>

                <StyledText variant="bodySmall" style={styles.sessionDate}>
                  {new Date(session.date).toLocaleDateString()}
                </StyledText>

                <View style={styles.sessionMetrics}>
                  <View style={styles.metricItem}>
                    <StyledText variant="bodySmall" weight="medium">
                      Accuracy:
                    </StyledText>
                    <StyledText variant="body" weight="semibold">
                      {session.metrics.accuracy}%
                    </StyledText>
                  </View>

                  <View style={styles.metricItem}>
                    <StyledText variant="bodySmall" weight="medium">
                      Response Time:
                    </StyledText>
                    <StyledText variant="body" weight="semibold">
                      {session.metrics.responseTime}s
                    </StyledText>
                  </View>
                </View>
              </GradientCard>
            </TouchableOpacity>
          ))}

          <GradientButton
            title="View All Sessions"
            onPress={() => router.push('/test-sessions')}
            variant="outline"
            style={styles.viewAllButton}
          />
        </View>
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
  },
  header: {
    marginBottom: Spacing.l,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  sessionCard: {
    marginBottom: Spacing.m,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  sessionDate: {
    opacity: 0.7,
    marginTop: Spacing.xs,
  },
  sessionMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.m,
  },
  metricItem: {
    alignItems: 'center',
  },
  viewAllButton: {
    marginTop: Spacing.s,
  },
});
