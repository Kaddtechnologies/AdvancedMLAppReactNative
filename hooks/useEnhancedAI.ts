import { useState, useCallback, useEffect } from 'react';
import EnhancedAIService, {
  MonitoringReport,
  ModelHealthStatus,
  LearningCycleResult,
  TrainingDataStats,
  UserDemographic,
  SpiritualJourney,
  LearningProgress
} from '../services/EnhancedAIService';

// Fixed user ID from project specifications
const FIXED_USER_ID = 'a6d3028d-a025-493f-a75a-8ee5e88ff52b';

export const useEnhancedAI = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // AI Monitoring
  const [monitoringReport, setMonitoringReport] = useState<MonitoringReport | null>(null);
  const [modelHealth, setModelHealth] = useState<ModelHealthStatus | null>(null);

  // Continuous Learning
  const [learningCycles, setLearningCycles] = useState<LearningCycleResult[]>([]);

  // Training Data
  const [trainingStats, setTrainingStats] = useState<TrainingDataStats | null>(null);

  // Personalization
  const [userDemographics, setUserDemographics] = useState<UserDemographic | null>(null);
  const [spiritualJourney, setSpiritualJourney] = useState<SpiritualJourney[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [personalizationMetrics, setPersonalizationMetrics] = useState<Record<string, number>>({});

  /**
   * Load monitoring data
   */
  const loadMonitoringData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [report, health] = await Promise.all([
        EnhancedAIService.getMonitoringReport(),
        EnhancedAIService.getModelHealthStatus()
      ]);

      setMonitoringReport(report);
      setModelHealth(health);
    } catch (error) {
      console.error('Error loading monitoring data:', error);
      setError('Failed to load AI monitoring data');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load learning cycle data
   */
  const loadLearningCycleData = useCallback(async (limit: number = 5) => {
    setLoading(true);
    setError(null);

    try {
      const cycles = await EnhancedAIService.getLearningCycleResults(limit);
      setLearningCycles(cycles);
    } catch (error) {
      console.error('Error loading learning cycle data:', error);
      setError('Failed to load learning cycle data');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load training data statistics
   */
  const loadTrainingStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const stats = await EnhancedAIService.getTrainingDataStats();
      setTrainingStats(stats);
    } catch (error) {
      console.error('Error loading training stats:', error);
      setError('Failed to load training data statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load personalization data
   */
  const loadPersonalizationData = useCallback(async (userId: string = FIXED_USER_ID) => {
    setLoading(true);
    setError(null);

    try {
      const [demographics, journey, progress, metrics] = await Promise.all([
        EnhancedAIService.getUserDemographics(userId),
        EnhancedAIService.getSpiritualJourney(userId),
        EnhancedAIService.getLearningProgress(userId),
        EnhancedAIService.getPersonalizationMetrics(userId)
      ]);

      setUserDemographics(demographics);
      setSpiritualJourney(journey);
      setLearningProgress(progress);
      setPersonalizationMetrics(metrics);
    } catch (error) {
      console.error('Error loading personalization data:', error);
      setError('Failed to load personalization data');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load all enhanced AI data
   */
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        loadMonitoringData(),
        loadLearningCycleData(),
        loadTrainingStats(),
        loadPersonalizationData()
      ]);
    } catch (error) {
      console.error('Error loading all enhanced AI data:', error);
      setError('Failed to load AI data');
    } finally {
      setLoading(false);
    }
  }, [loadMonitoringData, loadLearningCycleData, loadTrainingStats, loadPersonalizationData]);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return {
    // State
    loading,
    error,
    monitoringReport,
    modelHealth,
    learningCycles,
    trainingStats,
    userDemographics,
    spiritualJourney,
    learningProgress,
    personalizationMetrics,

    // Actions
    loadMonitoringData,
    loadLearningCycleData,
    loadTrainingStats,
    loadPersonalizationData,
    loadAllData
  };
};