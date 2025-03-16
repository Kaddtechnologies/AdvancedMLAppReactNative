import React from 'react';
import { View, ScrollView, ActivityIndicator, StyleProp, TextStyle } from 'react-native';
import { useEnhancedAI } from '../../hooks/useEnhancedAI';
import GradientCard from '../ui/GradientCard';
import StyledText from '../ui/StyledText';
import LineChart from '../ui/LineChart';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { format, parseISO } from 'date-fns';
import { Dimensions } from 'react-native';
import styles from './styles/ContinuousLearningViewStyles';

const colors = Colors.dark;
const screenWidth = Dimensions.get('window').width;

const ContinuousLearningView: React.FC = () => {
  const {
    loading,
    error,
    learningCycles,
    loadLearningCycleData
  } = useEnhancedAI();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <StyledText variant="body" style={styles.loadingText}>
          Loading learning data...
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
      </View>
    );
  }

  // Prepare chart data
  const prepareChartData = (metricName: string) => {
    return learningCycles.map((cycle, index) => ({
      x: index + 1,
      y: cycle.metrics[metricName] || 0
    }));
  };

  // Get improvement data
  const getImprovementData = () => {
    if (learningCycles.length === 0) return {};

    const latestCycle = learningCycles[0];
    return latestCycle.improvements || {};
  };

  return (
    <ScrollView style={styles.container}>
      <StyledText variant="sectionHeader" weight="semibold" style={styles.title}>
        Continuous Learning
      </StyledText>

      {/* Learning Cycles Summary */}
      <GradientCard style={styles.summaryCard}>
        <StyledText variant="cardTitle" weight="medium" style={styles.cardTitle}>
          Learning Cycles Summary
        </StyledText>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <StyledText variant="body" weight="medium" style={styles.statValue}>
              {learningCycles.length}
            </StyledText>
            <StyledText variant="secondary" style={styles.statLabel}>
              Total Cycles
            </StyledText>
          </View>
          <View style={styles.statItem}>
            <StyledText variant="body" weight="medium" style={styles.statValue}>
              {learningCycles.filter(cycle => cycle.success).length}
            </StyledText>
            <StyledText variant="secondary" style={styles.statLabel}>
              Successful
            </StyledText>
          </View>
          <View style={styles.statItem}>
            <StyledText variant="body" weight="medium" style={styles.statValue}>
              {learningCycles.length > 0
                ? format(parseISO(learningCycles[0].timestamp), 'MMM d')
                : 'N/A'
              }
            </StyledText>
            <StyledText variant="secondary" style={styles.statLabel}>
              Last Cycle
            </StyledText>
          </View>
        </View>
      </GradientCard>

      {/* Accuracy Chart */}
      {learningCycles.length > 0 && (
        <GradientCard style={styles.chartCard}>
          <StyledText variant="cardTitle" weight="medium" style={styles.cardTitle}>
            Accuracy Improvement
          </StyledText>
          <LineChart
            data={prepareChartData('accuracy')}
            title="Model Accuracy"
            description="Accuracy improvement over learning cycles"
            xAxisLabel="Cycle"
            yAxisLabel="Accuracy"
            height={200}
            width={screenWidth - 60}
          />
        </GradientCard>
      )}

      {/* Response Time Chart */}
      {learningCycles.length > 0 && (
        <GradientCard style={styles.chartCard}>
          <StyledText variant="cardTitle" weight="medium" style={styles.cardTitle}>
            Response Time Improvement
          </StyledText>
          <LineChart
            data={prepareChartData('responseTime')}
            title="Response Time"
            description="Response time improvement over learning cycles"
            xAxisLabel="Cycle"
            yAxisLabel="Time (ms)"
            height={200}
            width={screenWidth - 60}
          />
        </GradientCard>
      )}

      {/* Improvements */}
      {learningCycles.length > 0 && (
        <GradientCard style={styles.improvementsCard}>
          <StyledText variant="cardTitle" weight="medium" style={styles.cardTitle}>
            Latest Improvements
          </StyledText>
          {Object.entries(getImprovementData()).map(([key, value], index) => (
            <View key={index} style={styles.improvementItem}>
              <StyledText variant="body" style={styles.improvementName}>
                {formatMetricName(key)}
              </StyledText>
              <View style={styles.improvementValueContainer}>
                <FontAwesome
                  name={(value as number) > 0 ? 'arrow-up' : 'arrow-down'}
                  size={16}
                  color={(value as number) > 0 ? '#4CAF50' : '#F44336'}
                  style={styles.improvementIcon}
                />
                <StyledText
                  variant="body"
                  weight="medium"
                  style={{
                    ...styles.improvementValue,
                    color: (value as number) > 0 ? '#4CAF50' : '#F44336'
                  } as TextStyle}
                >
                  {Math.abs(value as number).toFixed(2)}%
                </StyledText>
              </View>
            </View>
          ))}
        </GradientCard>
      )}

      {/* Learning Cycles History */}
      <StyledText variant="cardTitle" weight="medium" style={styles.sectionTitle}>
        Learning Cycles History
      </StyledText>
      {learningCycles.map((cycle, index) => (
        <GradientCard key={index} style={styles.cycleCard}>
          <View style={styles.cycleHeader}>
            <View style={styles.cycleTitleContainer}>
              <StyledText variant="body" weight="medium" style={styles.cycleTitle}>
                Learning Cycle #{learningCycles.length - index}
              </StyledText>
              <StyledText variant="secondary" style={styles.cycleDate}>
                {format(parseISO(cycle.timestamp), 'MMM d, yyyy h:mm a')}
              </StyledText>
            </View>
            <View style={[
              styles.cycleStatus,
              cycle.success ? styles.successStatus : styles.failureStatus
            ]}>
              <StyledText variant="secondary" weight="medium" style={styles.cycleStatusText}>
                {cycle.success ? 'Success' : 'Failed'}
              </StyledText>
            </View>
          </View>

          <View style={styles.cycleMetrics}>
            {Object.entries(cycle.metrics).map(([key, value], metricIndex) => (
              <View key={metricIndex} style={styles.cycleMetricItem}>
                <StyledText variant="secondary" style={styles.cycleMetricName}>
                  {formatMetricName(key)}:
                </StyledText>
                <StyledText variant="body" weight="medium" style={styles.cycleMetricValue}>
                  {formatMetricValue(key, value as number)}
                </StyledText>
              </View>
            ))}
          </View>
        </GradientCard>
      ))}
    </ScrollView>
  );
};

// Helper functions
const formatMetricName = (name: string): string => {
  // Convert camelCase to Title Case with spaces
  const formatted = name.replace(/([A-Z])/g, ' $1').trim();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const formatMetricValue = (name: string, value: number): string => {
  if (name.toLowerCase().includes('time')) {
    return `${value.toFixed(0)}ms`;
  }
  if (name.toLowerCase().includes('rate') || name.toLowerCase().includes('accuracy')) {
    return `${(value * 100).toFixed(1)}%`;
  }
  return value.toFixed(2);
};

export default ContinuousLearningView;