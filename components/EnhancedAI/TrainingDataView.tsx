import React from 'react';
import { View, ScrollView, ActivityIndicator, TextStyle } from 'react-native';
import { useEnhancedAI } from '../../hooks/useEnhancedAI';
import GradientCard from '../ui/GradientCard';
import StyledText from '../ui/StyledText';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { format, parseISO } from 'date-fns';
import { Dimensions } from 'react-native';
import styles from './styles/TrainingDataViewStyles';

const colors = Colors.dark;
const screenWidth = Dimensions.get('window').width;

const TrainingDataView: React.FC = () => {
  const {
    loading,
    error,
    trainingStats,
    loadTrainingStats
  } = useEnhancedAI();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <StyledText variant="body" style={styles.loadingText}>
          Loading training data statistics...
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

  if (!trainingStats) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="database" size={40} color={colors.accentSecondary} />
        <StyledText variant="body" style={styles.emptyText}>
          No training data statistics available
        </StyledText>
      </View>
    );
  }

  // Calculate percentages for category distribution
  const calculatePercentage = (count: number) => {
    return ((count / trainingStats.totalExamples) * 100).toFixed(1);
  };

  return (
    <ScrollView style={styles.container}>
      <StyledText variant="sectionHeader" weight="semibold" style={styles.title}>
        Training Data Statistics
      </StyledText>

      {/* Summary Card */}
      <GradientCard style={styles.card}>
        <StyledText variant="cardTitle" weight="medium" style={styles.cardTitle}>
          Dataset Summary
        </StyledText>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome name="database" size={24} color={colors.accent} style={styles.statIcon} />
            <StyledText variant="body" weight="medium" style={styles.statValue}>
              {trainingStats.totalExamples.toLocaleString()}
            </StyledText>
            <StyledText variant="secondary" style={styles.statLabel}>
              Total Examples
            </StyledText>
          </View>
          <View style={styles.statItem}>
            <FontAwesome name="calendar" size={24} color={colors.accent} style={styles.statIcon} />
            <StyledText variant="body" weight="medium" style={styles.statValue}>
              {format(parseISO(trainingStats.lastUpdated), 'MMM d, yyyy')}
            </StyledText>
            <StyledText variant="secondary" style={styles.statLabel}>
              Last Updated
            </StyledText>
          </View>
          <View style={styles.statItem}>
            <FontAwesome name="star" size={24} color={colors.accent} style={styles.statIcon} />
            <StyledText variant="body" weight="medium" style={styles.statValue}>
              {trainingStats.qualityScore.toFixed(1)}
            </StyledText>
            <StyledText variant="secondary" style={styles.statLabel}>
              Quality Score
            </StyledText>
          </View>
        </View>
      </GradientCard>

      {/* Category Distribution */}
      <GradientCard style={styles.card}>
        <StyledText variant="cardTitle" weight="medium" style={styles.cardTitle}>
          Category Distribution
        </StyledText>
        {Object.entries(trainingStats.categoryCounts).map(([category, count], index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <StyledText variant="body" weight="medium" style={styles.categoryName}>
                {formatCategoryName(category)}
              </StyledText>
              <StyledText variant="body" style={styles.categoryCount}>
                {count.toLocaleString()} ({calculatePercentage(count as number)}%)
              </StyledText>
            </View>
            <View style={styles.categoryBarContainer}>
              <View
                style={[
                  styles.categoryBar,
                  { width: `${(count as number) / trainingStats.totalExamples * 100}%` }
                ]}
              />
            </View>
          </View>
        ))}
      </GradientCard>

      {/* Quality Metrics */}
      <GradientCard style={styles.card}>
        <StyledText variant="cardTitle" weight="medium" style={styles.cardTitle}>
          Data Quality Metrics
        </StyledText>
        <View style={styles.qualityMetricsContainer}>
          <QualityMetricItem
            name="Diversity"
            score={0.85}
            description="Variety of examples across different contexts"
          />
          <QualityMetricItem
            name="Completeness"
            score={0.92}
            description="Coverage of all required information"
          />
          <QualityMetricItem
            name="Balance"
            score={0.78}
            description="Even distribution across categories"
          />
          <QualityMetricItem
            name="Accuracy"
            score={0.95}
            description="Correctness of labels and annotations"
          />
        </View>
      </GradientCard>

      {/* Recommendations */}
      <GradientCard style={styles.card}>
        <StyledText variant="cardTitle" weight="medium" style={styles.cardTitle}>
          Recommendations
        </StyledText>
        <View style={styles.recommendationsContainer}>
          <View style={styles.recommendationItem}>
            <FontAwesome name="plus-circle" size={20} color="#4CAF50" style={styles.recommendationIcon} />
            <StyledText variant="body" style={styles.recommendationText}>
              Add more examples for underrepresented categories
            </StyledText>
          </View>
          <View style={styles.recommendationItem}>
            <FontAwesome name="refresh" size={20} color="#2196F3" style={styles.recommendationIcon} />
            <StyledText variant="body" style={styles.recommendationText}>
              Update examples with recent user interactions
            </StyledText>
          </View>
          <View style={styles.recommendationItem}>
            <FontAwesome name="check-circle" size={20} color="#FF9800" style={styles.recommendationIcon} />
            <StyledText variant="body" style={styles.recommendationText}>
              Validate examples with low confidence scores
            </StyledText>
          </View>
        </View>
      </GradientCard>
    </ScrollView>
  );
};

// Quality Metric Item Component
const QualityMetricItem = ({ name, score, description }: { name: string; score: number; description: string }) => (
  <View style={styles.qualityMetricItem}>
    <View style={styles.qualityMetricHeader}>
      <StyledText variant="body" weight="medium" style={styles.qualityMetricName}>
        {name}
      </StyledText>
      <StyledText variant="body" weight="medium" style={{
        ...styles.qualityMetricScore,
        color: getScoreColor(score)
      } as TextStyle}>
        {(score * 10).toFixed(1)}/10
      </StyledText>
    </View>
    <View style={styles.qualityMetricBarContainer}>
      <View
        style={[
          styles.qualityMetricBar,
          { width: `${score * 100}%`, backgroundColor: getScoreColor(score) }
        ]}
      />
    </View>
    <StyledText variant="secondary" style={styles.qualityMetricDescription}>
      {description}
    </StyledText>
  </View>
);

// Helper functions
const formatCategoryName = (name: string): string => {
  // Convert camelCase or snake_case to Title Case with spaces
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const getScoreColor = (score: number): string => {
  if (score >= 0.9) return '#4CAF50'; // Green
  if (score >= 0.7) return '#8BC34A'; // Light Green
  if (score >= 0.5) return '#FFC107'; // Amber
  if (score >= 0.3) return '#FF9800'; // Orange
  return '#F44336'; // Red
};

export default TrainingDataView;