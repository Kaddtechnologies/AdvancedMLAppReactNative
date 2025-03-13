import { useState, useCallback } from 'react';
import AIAnalyticsService, { AIMetrics, FeedbackStats, LearningMilestone } from '../services/AIAnalyticsService';

type TimeRange = 'day' | 'week' | 'month';

export const useAIAnalytics = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats | null>(null);
  const [learningProgress, setLearningProgress] = useState<LearningMilestone[] | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [error, setError] = useState<string | null>(null);

  /**
   * Load all analytics data
   */
  const loadAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch metrics and feedback stats in parallel
      const [metricsData, feedbackData, progressData] = await Promise.all([
        AIAnalyticsService.fetchMetrics(timeRange),
        AIAnalyticsService.fetchFeedbackStats(timeRange),
        AIAnalyticsService.fetchLearningProgress()
      ]);

      setMetrics(metricsData);
      setFeedbackStats(feedbackData);
      setLearningProgress(progressData);
    } catch (error) {
      console.error('Error loading AI analytics data:', error);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  /**
   * Submit user feedback
   */
  const submitFeedback = useCallback(async (chatId: string, rating: number, comments: string) => {
    try {
      await AIAnalyticsService.submitFeedback(chatId, rating, comments);
      // Refresh feedback stats after submission
      const updatedFeedbackStats = await AIAnalyticsService.fetchFeedbackStats(timeRange);
      setFeedbackStats(updatedFeedbackStats);
      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return false;
    }
  }, [timeRange]);

  return {
    loading,
    metrics,
    feedbackStats,
    learningProgress,
    timeRange,
    error,
    setTimeRange,
    loadAnalyticsData,
    submitFeedback
  };
};