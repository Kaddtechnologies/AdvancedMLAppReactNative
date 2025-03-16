import React, { useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity, TextStyle } from 'react-native';
import { useAIAnalytics } from '../../hooks/useAIAnalytics';
import styles from './styles/AIAnalyticsDashboardStyles';
import FeedbackSummary from './FeedbackSummary';
import LearningProgressCard from './LearningProgressCard';
import StyledText from '../ui/StyledText';
import GradientCard from '../ui/GradientCard';
import LineChart from '../ui/LineChart';
import MetricCard from '../ui/MetricCard';
import { Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const screenWidth = Dimensions.get('window').width;
const colors = Colors.dark;

const AIAnalyticsDashboard: React.FC = () => {
  const {
    loading,
    metrics,
    feedbackStats,
    learningProgress,
    timeRange,
    setTimeRange,
    loadAnalyticsData,
    error
  } = useAIAnalytics();

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, loadAnalyticsData]);

  const renderTimeRangeSelector = () => (
    <View style={styles.timeRangeSelector}>
      {(['day', 'week', 'month'] as const).map((range) => (
        <TouchableOpacity
          key={range}
          style={[
            styles.timeRangeButton,
            timeRange === range ? styles.timeRangeButtonActive : null
          ]}
          onPress={() => setTimeRange(range)}
        >
          <StyledText
            variant="body"
            weight={timeRange === range ? 'medium' : 'regular'}
            style={{
              ...styles.timeRangeButtonText,
              ...(timeRange === range ? styles.timeRangeButtonTextActive : {})
            } as TextStyle}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </StyledText>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <StyledText variant="body" style={styles.loadingText}>
          Loading AI learning metrics...
        </StyledText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name="exclamation-triangle" size={40} color="#FF6B6B" />
        <StyledText variant="body" style={styles.errorText}>
          {error}
        </StyledText>
        <TouchableOpacity
          style={[styles.timeRangeButton, styles.timeRangeButtonActive, styles.retryButton]}
          onPress={loadAnalyticsData}
        >
          <StyledText variant="body" weight="medium" style={styles.timeRangeButtonTextActive}>
            Retry
          </StyledText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StyledText variant="sectionHeader" weight="semibold" style={styles.title}>
        AI Learning Progress
      </StyledText>

      {renderTimeRangeSelector()}

      {/* Performance Metrics Section */}
      {metrics && (
        <View style={styles.section}>
          <StyledText variant="cardTitle" weight="medium" style={styles.sectionTitle}>
            Performance Metrics
          </StyledText>
          <View style={styles.metricsContainer}>
            {metrics.accuracy && (
              <MetricCard
                title="Accuracy"
                value={`${metrics.accuracy.current}%`}
                description="Model prediction accuracy"
                trend={metrics.accuracy.change > 0 ? 'up' : metrics.accuracy.change < 0 ? 'down' : 'neutral'}
                trendValue={Math.abs(metrics.accuracy.change).toFixed(1)}
                icon={<FontAwesome name="bullseye" size={20} color={colors.accent} />}
              />
            )}
            {metrics.responseTime && (
              <MetricCard
                title="Response Time"
                value={`${metrics.responseTime.current}ms`}
                description="Average response time"
                trend={metrics.responseTime.change < 0 ? 'up' : metrics.responseTime.change > 0 ? 'down' : 'neutral'}
                trendValue={Math.abs(metrics.responseTime.change).toFixed(1)}
                icon={<FontAwesome name="clock-o" size={20} color={colors.accent} />}
              />
            )}
            {metrics.successRate && (
              <MetricCard
                title="Success Rate"
                value={`${metrics.successRate.current}%`}
                description="Task completion rate"
                trend={metrics.successRate.change > 0 ? 'up' : metrics.successRate.change < 0 ? 'down' : 'neutral'}
                trendValue={Math.abs(metrics.successRate.change).toFixed(1)}
                icon={<FontAwesome name="check-circle" size={20} color={colors.accent} />}
              />
            )}
          </View>
        </View>
      )}

      {/* Learning Progress Chart */}
      {metrics?.progressData && (
        <View style={styles.section}>
          <StyledText variant="cardTitle" weight="medium" style={styles.sectionTitle}>
            Learning Progress Over Time
          </StyledText>
          <GradientCard>
            <LineChart
              data={metrics.progressData.values.map((value, index) => ({
                x: index + 1,
                y: value
              }))}
              title="AI Learning Curve"
              description="Improvement in model performance over time"
              xAxisLabel="Time"
              yAxisLabel="Performance"
              height={220}
              width={screenWidth - 60}
            />
          </GradientCard>
        </View>
      )}

      {/* User Feedback Summary */}
      {feedbackStats && (
        <FeedbackSummary feedbackStats={feedbackStats} />
      )}

      {/* Learning Milestones */}
      {learningProgress && learningProgress.length > 0 && (
        <View style={styles.section}>
          <StyledText variant="cardTitle" weight="medium" style={styles.sectionTitle}>
            Learning Milestones
          </StyledText>
          {learningProgress.map((milestone, index) => (
            <LearningProgressCard key={index} milestone={milestone} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default AIAnalyticsDashboard;