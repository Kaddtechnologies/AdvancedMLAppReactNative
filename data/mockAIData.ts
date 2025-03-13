import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface MetricData {
  value: number;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
  historicalData: number[];
  lastUpdated: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  description: string;
}

export interface BaseMetrics {
  [key: string]: MetricData;
}

export interface PerformanceMetrics extends BaseMetrics {
  responseRelevance: MetricData;
  userEngagement: MetricData;
  sentimentAlignment: MetricData;
  topicCoherence: MetricData;
  contextUtilization: MetricData;
}

export interface LearningProgress extends BaseMetrics {
  understandingLevel: MetricData;
  topicMastery: MetricData;
  interactionQuality: MetricData;
  personalizationAccuracy: MetricData;
}

export interface HealthMonitoring extends BaseMetrics {
  modelAccuracy: MetricData;
  responseQuality: MetricData;
  systemPerformance: MetricData;
  learningEffectiveness: MetricData;
}

export interface EnhancedAIMetrics extends BaseMetrics {
  modelHealth: MetricData;
  trainingProgress: MetricData;
  adaptiveCapability: MetricData;
  userPersonalization: MetricData;
  errorRate: MetricData;
  responseTime: MetricData;
}

export const mockPerformanceMetrics: PerformanceMetrics = {
  responseRelevance: {
    value: 0.87,
    trend: 'up',
    changePercentage: 5.2,
    historicalData: [0.82, 0.84, 0.85, 0.86, 0.87],
    lastUpdated: new Date().toISOString(),
    icon: 'target',
    description: 'Measures how well responses match user queries'
  },
  userEngagement: {
    value: 0.92,
    trend: 'up',
    changePercentage: 3.8,
    historicalData: [0.88, 0.89, 0.90, 0.91, 0.92],
    lastUpdated: new Date().toISOString(),
    icon: 'account-group',
    description: 'User interaction and session duration metrics'
  },
  sentimentAlignment: {
    value: 0.83,
    trend: 'stable',
    changePercentage: 0.5,
    historicalData: [0.82, 0.83, 0.83, 0.82, 0.83],
    lastUpdated: new Date().toISOString(),
    icon: 'emoticon-outline',
    description: 'Accuracy in matching emotional context'
  },
  topicCoherence: {
    value: 0.89,
    trend: 'up',
    changePercentage: 4.1,
    historicalData: [0.85, 0.86, 0.87, 0.88, 0.89],
    lastUpdated: new Date().toISOString(),
    icon: 'text-box-check',
    description: 'Consistency in maintaining topic focus'
  },
  contextUtilization: {
    value: 0.85,
    trend: 'up',
    changePercentage: 2.9,
    historicalData: [0.82, 0.83, 0.84, 0.84, 0.85],
    lastUpdated: new Date().toISOString(),
    icon: 'brain',
    description: 'Effective use of conversation context'
  }
};

export const mockLearningProgress: LearningProgress = {
  understandingLevel: {
    value: 0.88,
    trend: 'up',
    changePercentage: 6.2,
    historicalData: [0.82, 0.84, 0.85, 0.87, 0.88],
    lastUpdated: new Date().toISOString(),
    icon: 'school',
    description: 'Depth of concept comprehension'
  },
  topicMastery: {
    value: 0.86,
    trend: 'up',
    changePercentage: 4.7,
    historicalData: [0.81, 0.83, 0.84, 0.85, 0.86],
    lastUpdated: new Date().toISOString(),
    icon: 'bookmark-check',
    description: 'Proficiency in subject areas'
  },
  interactionQuality: {
    value: 0.91,
    trend: 'stable',
    changePercentage: 0.8,
    historicalData: [0.90, 0.90, 0.91, 0.91, 0.91],
    lastUpdated: new Date().toISOString(),
    icon: 'message-text',
    description: 'Quality of communication exchanges'
  },
  personalizationAccuracy: {
    value: 0.84,
    trend: 'up',
    changePercentage: 3.5,
    historicalData: [0.80, 0.81, 0.82, 0.83, 0.84],
    lastUpdated: new Date().toISOString(),
    icon: 'account-check',
    description: 'Accuracy of personalized responses'
  }
};

export const mockHealthMonitoring: HealthMonitoring = {
  modelAccuracy: {
    value: 0.93,
    trend: 'up',
    changePercentage: 2.1,
    historicalData: [0.91, 0.91, 0.92, 0.92, 0.93],
    lastUpdated: new Date().toISOString(),
    icon: 'check-circle',
    description: 'Overall model performance accuracy'
  },
  responseQuality: {
    value: 0.89,
    trend: 'up',
    changePercentage: 3.2,
    historicalData: [0.86, 0.87, 0.88, 0.88, 0.89],
    lastUpdated: new Date().toISOString(),
    icon: 'star-check',
    description: 'Quality of AI-generated responses'
  },
  systemPerformance: {
    value: 0.95,
    trend: 'stable',
    changePercentage: 0.3,
    historicalData: [0.94, 0.95, 0.95, 0.95, 0.95],
    lastUpdated: new Date().toISOString(),
    icon: 'speedometer',
    description: 'Overall system efficiency'
  },
  learningEffectiveness: {
    value: 0.87,
    trend: 'up',
    changePercentage: 4.8,
    historicalData: [0.82, 0.84, 0.85, 0.86, 0.87],
    lastUpdated: new Date().toISOString(),
    icon: 'trending-up',
    description: 'Rate of learning and improvement'
  }
};

export const mockEnhancedAIMetrics: EnhancedAIMetrics = {
  modelHealth: {
    value: 0.94,
    trend: 'up',
    changePercentage: 2.5,
    historicalData: [0.91, 0.92, 0.93, 0.93, 0.94],
    lastUpdated: new Date().toISOString(),
    icon: 'heart-pulse',
    description: 'Overall AI model health status'
  },
  trainingProgress: {
    value: 0.88,
    trend: 'up',
    changePercentage: 5.6,
    historicalData: [0.83, 0.84, 0.86, 0.87, 0.88],
    lastUpdated: new Date().toISOString(),
    icon: 'school',
    description: 'Progress in model training cycles'
  },
  adaptiveCapability: {
    value: 0.86,
    trend: 'up',
    changePercentage: 4.2,
    historicalData: [0.82, 0.83, 0.84, 0.85, 0.86],
    lastUpdated: new Date().toISOString(),
    icon: 'auto-fix',
    description: 'System adaptability to new scenarios'
  },
  userPersonalization: {
    value: 0.91,
    trend: 'up',
    changePercentage: 3.7,
    historicalData: [0.87, 0.88, 0.89, 0.90, 0.91],
    lastUpdated: new Date().toISOString(),
    icon: 'account-cog',
    description: 'User-specific customization accuracy'
  },
  errorRate: {
    value: 0.03,
    trend: 'down',
    changePercentage: -15.2,
    historicalData: [0.05, 0.04, 0.04, 0.03, 0.03],
    lastUpdated: new Date().toISOString(),
    icon: 'alert-circle',
    description: 'System error frequency rate'
  },
  responseTime: {
    value: 0.96,
    trend: 'up',
    changePercentage: 1.8,
    historicalData: [0.94, 0.94, 0.95, 0.95, 0.96],
    lastUpdated: new Date().toISOString(),
    icon: 'timer',
    description: 'Average response time performance'
  }
};

// Helper function to generate random changes in metrics
export const generateUpdatedMetrics = <T extends { [K in keyof T]: MetricData }>(
  currentMetrics: T,
  volatility: number = 0.02
): T => {
  const updated = { ...currentMetrics };

  (Object.keys(updated) as Array<keyof T>).forEach(key => {
    const metric = updated[key];
    const change = (Math.random() - 0.5) * volatility;
    const newValue = Math.max(0, Math.min(1, metric.value + change));

    const historicalData = [...metric.historicalData.slice(1), newValue];
    const trend = newValue > metric.value ? 'up' : newValue < metric.value ? 'down' : 'stable';
    const changePercentage = ((newValue - metric.value) / metric.value) * 100;

    updated[key] = {
      ...metric,
      value: newValue,
      trend,
      changePercentage,
      historicalData,
      lastUpdated: new Date().toISOString()
    };
  });

  return updated;
};

// Generate test data for system status
export const generateSystemStatus = () => {
  const statuses = ['healthy', 'degraded', 'error'] as const;
  const randomStatus = statuses[Math.floor(Math.random() * (statuses.length - 0.1))]; // Bias towards healthy

  return {
    status: randomStatus,
    message: randomStatus === 'healthy'
      ? 'All systems operating normally'
      : randomStatus === 'degraded'
      ? 'System performance slightly degraded'
      : 'System experiencing errors',
    timestamp: new Date().toISOString(),
    metrics: {
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      activeUsers: Math.floor(Math.random() * 1000),
      requestsPerMinute: Math.floor(Math.random() * 500)
    }
  };
};