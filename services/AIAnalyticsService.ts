import apiClient from './ApiConfig';

// Types for AI Analytics
export interface MetricData {
  current: number;
  change: number;
  history?: number[];
}

export interface ProgressData {
  labels: string[];
  values: number[];
}

export interface LearningMilestone {
  date: string;
  title: string;
  description: string;
  improvement: number;
}

export interface AIMetrics {
  accuracy?: MetricData;
  responseTime?: MetricData;
  successRate?: MetricData;
  progressData?: ProgressData;
  learningProgress?: LearningMilestone[];
}

export interface FeedbackStats {
  positive: number;
  neutral: number;
  negative: number;
  totalFeedback: number;
  averageRating: number;
}

/**
 * Service for interacting with the AI Analytics API
 */
class AIAnalyticsService {
  /**
   * Fetch AI metrics data
   */
  async fetchMetrics(timeRange: 'day' | 'week' | 'month'): Promise<AIMetrics> {
    try {
      const response = await apiClient.get(`/api/ML/metrics`, {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching AI metrics:', error);
      throw error;
    }
  }

  /**
   * Fetch AI learning progress data
   */
  async fetchLearningProgress(): Promise<LearningMilestone[]> {
    try {
      const response = await apiClient.get('/api/ML/learning-progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching learning progress:', error);
      throw error;
    }
  }

  /**
   * Fetch user feedback statistics
   */
  async fetchFeedbackStats(timeRange: 'day' | 'week' | 'month'): Promise<FeedbackStats> {
    try {
      const response = await apiClient.get(`/api/Chat/feedback-stats`, {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
      throw error;
    }
  }

  /**
   * Submit user feedback for a chat interaction
   */
  async submitFeedback(chatId: string, rating: number, comments: string): Promise<void> {
    try {
      await apiClient.post('/api/Chat/feedback', {
        chatId,
        rating,
        comments
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }
}

export default new AIAnalyticsService();