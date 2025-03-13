import React from 'react';
import { View, Text } from 'react-native';
import { FeedbackStats } from '../../services/AIAnalyticsService';
import styles from './styles/FeedbackSummaryStyles';
import GradientCard from '../ui/GradientCard';
import StyledText from '../ui/StyledText';

interface FeedbackSummaryProps {
  feedbackStats: FeedbackStats;
}

const FeedbackSummary: React.FC<FeedbackSummaryProps> = ({ feedbackStats }) => {
  const { positive, neutral, negative, totalFeedback, averageRating } = feedbackStats;

  const positivePercentage = totalFeedback > 0 ? (positive / totalFeedback) * 100 : 0;
  const neutralPercentage = totalFeedback > 0 ? (neutral / totalFeedback) * 100 : 0;
  const negativePercentage = totalFeedback > 0 ? (negative / totalFeedback) * 100 : 0;

  const renderProgressBar = (percentage: number, type: 'positive' | 'neutral' | 'negative') => {
    const barStyle = [
      styles.progressBar,
      type === 'positive' ? styles.positiveBar :
      type === 'neutral' ? styles.neutralBar : styles.negativeBar
    ];

    return (
      <View style={{ width: `${percentage}%` }}>
        <View style={barStyle} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StyledText variant="sectionHeader" weight="medium" style={styles.title}>
        User Feedback Summary
      </StyledText>

      <View style={styles.statsContainer}>
        <GradientCard style={styles.statCard}>
          <StyledText variant="cardTitle" weight="bold" style={styles.statValue}>
            {totalFeedback}
          </StyledText>
          <StyledText variant="secondary" style={styles.statLabel}>
            Total Feedback
          </StyledText>
        </GradientCard>

        <GradientCard style={styles.statCard}>
          <StyledText variant="cardTitle" weight="bold" style={styles.statValue}>
            {averageRating.toFixed(1)}
          </StyledText>
          <StyledText variant="secondary" style={styles.statLabel}>
            Average Rating
          </StyledText>
        </GradientCard>
      </View>

      <View style={styles.feedbackTypeContainer}>
        <View style={styles.feedbackLabel}>
          <StyledText variant="body" style={styles.feedbackType}>
            Positive
          </StyledText>
          <StyledText variant="body" weight="medium" style={styles.feedbackPercentage}>
            {positivePercentage.toFixed(0)}%
          </StyledText>
        </View>
        {renderProgressBar(positivePercentage, 'positive')}

        <View style={styles.feedbackLabel}>
          <StyledText variant="body" style={styles.feedbackType}>
            Neutral
          </StyledText>
          <StyledText variant="body" weight="medium" style={styles.feedbackPercentage}>
            {neutralPercentage.toFixed(0)}%
          </StyledText>
        </View>
        {renderProgressBar(neutralPercentage, 'neutral')}

        <View style={styles.feedbackLabel}>
          <StyledText variant="body" style={styles.feedbackType}>
            Negative
          </StyledText>
          <StyledText variant="body" weight="medium" style={styles.feedbackPercentage}>
            {negativePercentage.toFixed(0)}%
          </StyledText>
        </View>
        {renderProgressBar(negativePercentage, 'negative')}
      </View>
    </View>
  );
};

export default FeedbackSummary;