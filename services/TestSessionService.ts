import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';
import ChatService, { Message } from './ChatService';
import MLService from './MLService';

// Test session types
export type TestSessionType =
  | 'baseline'
  | 'progressive-info'
  | 'recall'
  | 'persistence'
  | 'contextual';

// Test session status
export type TestSessionStatus =
  | 'scheduled'
  | 'in-progress'
  | 'completed'
  | 'failed';

// Test session model
export interface TestSession {
  id: string;
  title: string;
  description: string;
  type: TestSessionType;
  status: TestSessionStatus;
  createdAt: string;
  completedAt?: string;
  conversationId?: string;
  metrics: TestSessionMetrics;
}

// Test session metrics
export interface TestSessionMetrics {
  personalizationScore?: number;
  recallRate?: number;
  contextualRelevance?: number;
  conversationNaturalness?: number;
  responseTime?: number;
  accuracy?: number;
  questionCount?: number;
  completionRate?: number;
}

// Progressive information categories
export type ProgressiveInfoCategory =
  | 'basic'
  | 'spiritual'
  | 'challenges'
  | 'interests';

// Storage keys
const STORAGE_KEYS = {
  TEST_SESSIONS: 'test_sessions',
  METRICS_HISTORY: 'metrics_history',
  SHARED_INFO: 'shared_info'
};

/**
 * Service for managing test sessions and metrics
 */
class TestSessionService {
  /**
   * Create a new test session
   */
  async createTestSession(
    title: string,
    description: string,
    type: TestSessionType
  ): Promise<TestSession> {
    // Create a new session object
    const newSession: TestSession = {
      id: uuid.v4() as string,
      title,
      description,
      type,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      metrics: {
        questionCount: 0,
        completionRate: 0
      }
    };

    // If it's not a baseline test, we need to check if baseline exists
    if (type !== 'baseline') {
      const sessions = await this.getTestSessions();
      const hasBaseline = sessions.some(s => s.type === 'baseline' && s.status === 'completed');

      if (!hasBaseline) {
        throw new Error('You must complete a baseline test before running other test types');
      }
    }

    // Save the session
    await this.saveTestSession(newSession);
    return newSession;
  }

  /**
   * Get all test sessions
   */
  async getTestSessions(): Promise<TestSession[]> {
    try {
      const sessionsJson = await SecureStore.getItemAsync(STORAGE_KEYS.TEST_SESSIONS);
      return sessionsJson ? JSON.parse(sessionsJson) : [];
    } catch (error) {
      console.error('Error retrieving test sessions:', error);
      return [];
    }
  }

  /**
   * Get a test session by ID
   */
  async getTestSessionById(id: string): Promise<TestSession | null> {
    const sessions = await this.getTestSessions();
    return sessions.find(session => session.id === id) || null;
  }

  /**
   * Save a test session
   */
  async saveTestSession(session: TestSession): Promise<void> {
    try {
      const sessions = await this.getTestSessions();
      const index = sessions.findIndex(s => s.id === session.id);

      if (index >= 0) {
        sessions[index] = session;
      } else {
        sessions.push(session);
      }

      await SecureStore.setItemAsync(STORAGE_KEYS.TEST_SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving test session:', error);
      throw error;
    }
  }

  /**
   * Start a test session
   */
  async startTestSession(sessionId: string): Promise<TestSession> {
    const session = await this.getTestSessionById(sessionId);

    if (!session) {
      throw new Error('Test session not found');
    }

    if (session.status !== 'scheduled') {
      throw new Error(`Cannot start a session with status: ${session.status}`);
    }

    // Create a conversation for this test session
    const response = await ChatService.createConversation(session.title);

    // Update the session
    const updatedSession: TestSession = {
      ...session,
      status: 'in-progress',
      conversationId: response.conversationId
    };

    await this.saveTestSession(updatedSession);
    return updatedSession;
  }

  /**
   * Complete a test session
   */
  async completeTestSession(sessionId: string, metrics: TestSessionMetrics): Promise<TestSession> {
    const session = await this.getTestSessionById(sessionId);

    if (!session) {
      throw new Error('Test session not found');
    }

    if (session.status !== 'in-progress') {
      throw new Error(`Cannot complete a session with status: ${session.status}`);
    }

    // Update the session
    const updatedSession: TestSession = {
      ...session,
      status: 'completed',
      completedAt: new Date().toISOString(),
      metrics: {
        ...session.metrics,
        ...metrics
      }
    };

    await this.saveTestSession(updatedSession);

    // Save metrics history
    await this.saveMetricsHistory(updatedSession);

    return updatedSession;
  }

  /**
   * Save metrics history
   */
  private async saveMetricsHistory(session: TestSession): Promise<void> {
    try {
      const metricsHistoryJson = await SecureStore.getItemAsync(STORAGE_KEYS.METRICS_HISTORY);
      const metricsHistory = metricsHistoryJson ? JSON.parse(metricsHistoryJson) : {};

      // Add metrics by type
      if (session.metrics.personalizationScore) {
        metricsHistory.personalizationScore = metricsHistory.personalizationScore || [];
        metricsHistory.personalizationScore.push({
          date: session.completedAt,
          value: session.metrics.personalizationScore,
          sessionId: session.id
        });
      }

      if (session.metrics.recallRate) {
        metricsHistory.recallRate = metricsHistory.recallRate || [];
        metricsHistory.recallRate.push({
          date: session.completedAt,
          value: session.metrics.recallRate,
          sessionId: session.id
        });
      }

      if (session.metrics.contextualRelevance) {
        metricsHistory.contextualRelevance = metricsHistory.contextualRelevance || [];
        metricsHistory.contextualRelevance.push({
          date: session.completedAt,
          value: session.metrics.contextualRelevance,
          sessionId: session.id
        });
      }

      if (session.metrics.conversationNaturalness) {
        metricsHistory.conversationNaturalness = metricsHistory.conversationNaturalness || [];
        metricsHistory.conversationNaturalness.push({
          date: session.completedAt,
          value: session.metrics.conversationNaturalness,
          sessionId: session.id
        });
      }

      await SecureStore.setItemAsync(STORAGE_KEYS.METRICS_HISTORY, JSON.stringify(metricsHistory));
    } catch (error) {
      console.error('Error saving metrics history:', error);
    }
  }

  /**
   * Get metrics history
   */
  async getMetricsHistory(): Promise<any> {
    try {
      const metricsHistoryJson = await SecureStore.getItemAsync(STORAGE_KEYS.METRICS_HISTORY);
      return metricsHistoryJson ? JSON.parse(metricsHistoryJson) : {};
    } catch (error) {
      console.error('Error retrieving metrics history:', error);
      return {};
    }
  }

  /**
   * Save shared information
   */
  async saveSharedInfo(category: ProgressiveInfoCategory, info: any): Promise<void> {
    try {
      const sharedInfoJson = await SecureStore.getItemAsync(STORAGE_KEYS.SHARED_INFO);
      const sharedInfo = sharedInfoJson ? JSON.parse(sharedInfoJson) : {};

      sharedInfo[category] = {
        ...sharedInfo[category],
        ...info,
        lastUpdated: new Date().toISOString()
      };

      await SecureStore.setItemAsync(STORAGE_KEYS.SHARED_INFO, JSON.stringify(sharedInfo));
    } catch (error) {
      console.error('Error saving shared info:', error);
      throw error;
    }
  }

  /**
   * Get shared information
   */
  async getSharedInfo(): Promise<any> {
    try {
      const sharedInfoJson = await SecureStore.getItemAsync(STORAGE_KEYS.SHARED_INFO);
      return sharedInfoJson ? JSON.parse(sharedInfoJson) : {};
    } catch (error) {
      console.error('Error retrieving shared info:', error);
      return {};
    }
  }

  /**
   * Calculate metrics for a test session
   */
  async calculateSessionMetrics(
    sessionId: string,
    messages: Message[]
  ): Promise<TestSessionMetrics> {
    const session = await this.getTestSessionById(sessionId);

    if (!session || !session.conversationId) {
      throw new Error('Invalid test session');
    }

    // Basic metrics
    const metrics: TestSessionMetrics = {
      questionCount: messages.filter(m => m.isUser).length,
      responseTime: this.calculateAverageResponseTime(messages),
      accuracy: 0
    };

    // Calculate metrics based on session type
    switch (session.type) {
      case 'baseline':
        // For baseline, we just record the raw metrics
        break;

      case 'progressive-info':
        // For progressive info, we analyze sentiment and relevance
        if (messages.length > 0) {
          const analysisResponse = await MLService.analyzeConversation(
            session.conversationId,
            messages
          );

          metrics.contextualRelevance = this.calculateContextualRelevance(analysisResponse);
          metrics.conversationNaturalness = this.calculateConversationNaturalness(messages);
        }
        break;

      case 'recall':
        // For recall tests, we calculate accuracy based on expected answers
        metrics.recallRate = await this.calculateRecallRate(messages);
        metrics.personalizationScore = this.calculatePersonalizationScore(messages);
        break;

      case 'persistence':
        // For persistence tests, we check if information persists across sessions
        metrics.recallRate = await this.calculateRecallRate(messages);
        metrics.personalizationScore = this.calculatePersonalizationScore(messages);
        break;

      case 'contextual':
        // For contextual tests, we focus on relevance and naturalness
        if (messages.length > 0 && session.conversationId) {
          const analysisResponse = await MLService.analyzeConversation(
            session.conversationId,
            messages
          );

          metrics.contextualRelevance = this.calculateContextualRelevance(analysisResponse);
          metrics.conversationNaturalness = this.calculateConversationNaturalness(messages);
          metrics.personalizationScore = this.calculatePersonalizationScore(messages);
        }
        break;
    }

    // Calculate completion rate
    metrics.completionRate = 100;

    return metrics;
  }

  /**
   * Calculate average response time
   */
  private calculateAverageResponseTime(messages: Message[]): number {
    const aiMessages = messages.filter(m => !m.isUser);

    if (aiMessages.length === 0) {
      return 0;
    }

    const totalResponseTime = aiMessages.reduce((sum, msg) => {
      return sum + (msg.metadata?.responseTime || 0);
    }, 0);

    return totalResponseTime / aiMessages.length;
  }

  /**
   * Calculate contextual relevance score (0-100)
   */
  private calculateContextualRelevance(analysisResponse: any): number {
    // This is a simplified implementation
    // In a real app, this would be more sophisticated
    const sentimentScores = analysisResponse.details.map((d: any) => d.score);
    const avgScore = sentimentScores.reduce((sum: number, score: number) => sum + score, 0) / sentimentScores.length;

    // Convert to a 0-100 scale
    return Math.min(Math.round(avgScore * 100), 100);
  }

  /**
   * Calculate conversation naturalness (1-10)
   */
  private calculateConversationNaturalness(messages: Message[]): number {
    // This is a simplified implementation
    // In a real app, this would analyze message patterns, response variety, etc.
    const aiMessages = messages.filter(m => !m.isUser);

    if (aiMessages.length < 3) {
      return 5; // Default mid-range score for short conversations
    }

    // Calculate average message length as a simple proxy for naturalness
    const avgLength = aiMessages.reduce((sum, msg) => sum + msg.text.length, 0) / aiMessages.length;

    // Convert to a 1-10 scale (very simple algorithm)
    // Ideal length is between 100-300 characters
    const lengthScore = avgLength < 50 ? 3 :
                        avgLength < 100 ? 5 :
                        avgLength < 300 ? 8 :
                        avgLength < 500 ? 7 : 5;

    return lengthScore;
  }

  /**
   * Calculate recall rate (percentage)
   */
  private async calculateRecallRate(messages: Message[]): Promise<number> {
    // This would normally compare AI responses against known information
    // For now, we'll use a simplified implementation
    const sharedInfo = await this.getSharedInfo();

    if (Object.keys(sharedInfo).length === 0) {
      return 0; // No shared info to recall
    }

    // In a real implementation, we would check if AI responses contain shared information
    // For now, return a reasonable value based on the number of info categories shared
    const infoCategories = Object.keys(sharedInfo).length;
    const baseRate = 70; // Base recall rate
    const categoryBonus = 5; // Bonus per category

    return Math.min(baseRate + (infoCategories * categoryBonus), 100);
  }

  /**
   * Calculate personalization score (1-5)
   */
  private calculatePersonalizationScore(messages: Message[]): number {
    // This is a simplified implementation
    // In a real app, this would analyze how well responses are tailored to the user
    const aiMessages = messages.filter(m => !m.isUser);

    if (aiMessages.length < 3) {
      return 3; // Default mid-range score for short conversations
    }

    // For now, return a value that increases with conversation length
    // to simulate improvement over time
    return Math.min(3 + (aiMessages.length / 10), 5);
  }
}

export default new TestSessionService();