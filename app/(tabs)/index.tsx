import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import GradientBackground from '../../components/ui/GradientBackground';
import StyledText from '../../components/ui/StyledText';
import MetricCard from '../../components/ui/MetricCard';
import GradientCard from '../../components/ui/GradientCard';
import LineChart from '../../components/ui/LineChart';
import { Spacing } from '../../constants/Theme';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useDashboard } from '../../hooks/useDashboard';

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const { loading, error, data, refresh } = useDashboard();

  const navigateToMetricDetail = (metricId: string) => {
    router.push(`/metric-detail/${metricId}`);
  };

  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <StyledText style={{ fontSize: 16 }}>Loading dashboard data...</StyledText>
        </View>
      </GradientBackground>
    );
  }

  if (error) {
    return (
      <GradientBackground>
        <View style={styles.errorContainer}>
          <StyledText style={{ ...styles.errorText, fontSize: 16 }}>
            {error}
          </StyledText>
          <TouchableOpacity onPress={refresh} style={styles.retryButton}>
            <StyledText style={{ fontSize: 16 }}>Retry</StyledText>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        <View style={styles.header}>
          <StyledText style={{ fontSize: 24, fontWeight: '600' }}>
            Dashboard
          </StyledText>
          <StyledText style={styles.subtitle}>
            ML Testing Metrics Overview
          </StyledText>
          <StyledText style={styles.instructions}>
            This dashboard shows how the AI system is learning and adapting to your interactions.
            All metrics update automatically as you use the chat feature.
          </StyledText>
        </View>

        <View style={styles.section}>
          <StyledText style={{ ...styles.sectionTitle, fontSize: 18, fontWeight: '500' }}>
            Key Metrics
          </StyledText>
          <StyledText style={styles.sectionDescription}>
            These metrics reflect your personal interaction with the AI. Tap any card to see detailed history and insights.
          </StyledText>

          <View style={styles.metricsContainer}>
            {data?.metrics.map((metric) => (
              <TouchableOpacity
                key={metric.id}
                style={styles.metricCardContainer}
                onPress={() => navigateToMetricDetail(metric.id)}
              >
                <MetricCard
                  title={metric.title}
                  value={metric.value}
                  description={metric.description}
                  trend={metric.trend}
                  trendValue={metric.trendValue}
                  icon={
                    <FontAwesome
                      name={metric.icon as any}
                      size={20}
                      color={colors.accent}
                    />
                  }
                  instructions={getMetricInstructions(metric.title)}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <StyledText style={{ ...styles.sectionTitle, fontSize: 18, fontWeight: '500' }}>
            Learning Progress
          </StyledText>
          <StyledText style={styles.sectionDescription}>
            This chart shows how the AI's understanding of your needs improves over time.
            Each point represents a test session, and the trend should increase as you interact more.
          </StyledText>

          <GradientCard>
            <LineChart
              data={data?.chartData || []}
              title="Personalization Score Over Time"
              description="Tracking how well the AI tailors responses to you"
              xAxisLabel="Test Sessions"
              yAxisLabel="Score"
            />
          </GradientCard>
        </View>

        <View style={styles.section}>
          <StyledText style={styles.updateNote}>
            Data updates automatically every few minutes. Pull down to refresh manually.
          </StyledText>
          <StyledText style={styles.lastUpdated}>
            Last updated: {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'Never'}
          </StyledText>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

// Helper function to get instructions for each metric
function getMetricInstructions(metricTitle: string): string {
  switch (metricTitle) {
    case 'Personalization Score':
      return 'This score increases as the AI learns your preferences and communication style. Regular chat interactions help improve this metric. A higher score means better personalized responses.';
    case 'Information Recall':
      return 'Shows how well the AI remembers details from your past conversations. This improves naturally as you have more chat sessions. Higher percentages mean better context retention.';
    case 'Contextual Relevance':
      return 'Measures the AI\'s ability to stay on topic and provide relevant responses. This improves with your feedback and corrections. A higher score indicates more accurate and focused responses.';
    case 'Conversation Naturalness':
      return 'Evaluates how human-like and flowing the conversations feel. This develops as the AI learns your communication patterns. Higher scores mean more natural dialogue.';
    default:
      return '';
  }
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
  metricsContainer: {
    flexDirection: 'column',
  },
  metricCardContainer: {
    width: '100%',
    marginBottom: Spacing.m,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  retryButton: {
    padding: Spacing.m,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  lastUpdated: {
    textAlign: 'center',
    opacity: 0.6,
  },
  instructions: {
    marginTop: Spacing.m,
    opacity: 0.8,
    lineHeight: 20,
  },
  sectionDescription: {
    marginBottom: Spacing.m,
    opacity: 0.8,
    lineHeight: 20,
  },
  updateNote: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: Spacing.s,
  },
});
