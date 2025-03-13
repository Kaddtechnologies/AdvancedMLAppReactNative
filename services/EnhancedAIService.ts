import apiClient from './ApiConfig';

// Types for Enhanced AI Monitoring
export interface MetricTrend {
  metricName: string;
  currentValue: number;
  baselineValue: number;
  percentChange: number;
  timestamp: string;
}

export interface Alert {
  type: 'AccuracyDrop' | 'PerplexityIncrease' | 'HealthIssue' | 'SystemError';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  timestamp: string;
}

export interface MonitoringReport {
  timestamp: string;
  isHealthy: boolean;
  metricTrends: Record<string, MetricTrend>;
  alerts: Alert[];
  issues: string[];
}

// Types for Continuous Learning
export interface ModelHealthStatus {
  isHealthy: boolean;
  lastChecked: string;
  metrics: Record<string, number>;
  issues: string[];
}

export interface LearningCycleResult {
  success: boolean;
  timestamp: string;
  metrics: Record<string, number>;
  improvements: Record<string, number>;
}

// Types for Training Data
export interface TrainingDataStats {
  totalExamples: number;
  categoryCounts: Record<string, number>;
  lastUpdated: string;
  qualityScore: number;
}

// Types for Enhanced Personalization
export interface UserDemographic {
  userId: string;
  age?: number;
  gender?: string;
  location?: string;
  joinDate: string;
  preferences: Record<string, string>;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  age?: number;
  notes?: string;
}

export interface SpiritualJourney {
  id: string;
  userId: string;
  milestone: string;
  milestoneDate: string;
  description: string;
  significance: string;
}

export interface LearningProgress {
  id: string;
  userId: string;
  topic: string;
  understandingLevel: number;
  lastDiscussed: string;
  notes?: string;
}

export interface PersonalizationMetrics {
  userId: string;
  metricType: string;
  metricValue: number;
  timestamp: string;
}

/**
 * Service for interacting with the Enhanced AI features
 */
class EnhancedAIService {
  /**
   * Get AI monitoring report
   */
  async getMonitoringReport(): Promise<MonitoringReport> {
    try {
      const response = await apiClient.get('/api/ML/monitoring-report');
      return response.data;
    } catch (error) {
      console.error('Error fetching monitoring report:', error);
      throw error;
    }
  }

  /**
   * Get model health status
   */
  async getModelHealthStatus(): Promise<ModelHealthStatus> {
    try {
      const response = await apiClient.get('/api/ML/model-health');
      return response.data;
    } catch (error) {
      console.error('Error fetching model health status:', error);
      throw error;
    }
  }

  /**
   * Get learning cycle results
   */
  async getLearningCycleResults(limit: number = 5): Promise<LearningCycleResult[]> {
    try {
      const response = await apiClient.get('/api/ML/learning-cycles', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching learning cycle results:', error);
      throw error;
    }
  }

  /**
   * Get training data statistics
   */
  async getTrainingDataStats(): Promise<TrainingDataStats> {
    try {
      const response = await apiClient.get('/api/ML/training-data-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching training data stats:', error);
      throw error;
    }
  }

  /**
   * Get user demographics
   */
  async getUserDemographics(userId: string): Promise<UserDemographic> {
    try {
      const response = await apiClient.get(`/api/ML/user-demographics/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user demographics:', error);
      throw error;
    }
  }

  /**
   * Get user's spiritual journey
   */
  async getSpiritualJourney(userId: string): Promise<SpiritualJourney[]> {
    try {
      const response = await apiClient.get(`/api/ML/spiritual-journey/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching spiritual journey:', error);
      throw error;
    }
  }

  /**
   * Get user's learning progress
   */
  async getLearningProgress(userId: string): Promise<LearningProgress[]> {
    try {
      const response = await apiClient.get(`/api/ML/learning-progress/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching learning progress:', error);
      throw error;
    }
  }

  /**
   * Get personalization metrics
   */
  async getPersonalizationMetrics(userId: string): Promise<Record<string, number>> {
    try {
      const response = await apiClient.get(`/api/ML/personalization-metrics/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching personalization metrics:', error);
      throw error;
    }
  }
}

export default new EnhancedAIService();