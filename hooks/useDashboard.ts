import { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import * as SecureStore from 'expo-secure-store';

export interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: string;
  details?: {
    previousValue: string;
    changePercentage: number;
    lastUpdated: string;
    insights: string[];
  };
}

export interface DashboardData {
  metrics: DashboardMetric[];
  chartData: { x: number; y: number }[];
  lastUpdated: string;
  insights: {
    title: string;
    description: string;
    type: 'improvement' | 'warning' | 'info';
  }[];
}

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const { apiClient } = useAppContext();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the Firebase UID from secure storage
      const firebaseUid = await SecureStore.getItemAsync('firebase_uid');
      if (!firebaseUid) {
        throw new Error('User not authenticated');
      }

      // Fetch data from your API
      const response = await apiClient.get(`/api/dashboard/${firebaseUid}`);

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const dashboardData = await response.json();

      // Transform the data into the format we need
      const transformedData: DashboardData = {
        metrics: dashboardData.metrics.map((metric: any) => ({
          id: metric.id,
          title: metric.name,
          value: metric.value.toString(),
          description: metric.description,
          trend: metric.trend,
          trendValue: metric.trendValue.toString(),
          icon: getMetricIcon(metric.name),
        })),
        chartData: dashboardData.progressData.map((point: any, index: number) => ({
          x: index + 1,
          y: point.value,
        })),
        lastUpdated: new Date().toISOString(),
        insights: dashboardData.insights || [],
      };

      setData(transformedData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');

      // Enhanced mock data for MVP demo
      const mockData: DashboardData = {
        metrics: [
          {
            id: '1',
            title: 'Personalization Score',
            value: '89',
            description: 'Understanding & Adaptation',
            trend: 'up',
            trendValue: '12',
            icon: 'user',
            details: {
              previousValue: '77',
              changePercentage: 15.58,
              lastUpdated: '2 hours ago',
              insights: [
                'Improved spiritual topic recognition',
                'Better memory of personal preferences',
                'More contextual scripture references'
              ]
            }
          },
          {
            id: '2',
            title: 'Information Recall',
            value: '94%',
            description: 'Memory & Context',
            trend: 'up',
            trendValue: '7%',
            icon: 'brain',
            details: {
              previousValue: '87%',
              changePercentage: 8.05,
              lastUpdated: '1 hour ago',
              insights: [
                'Successfully recalled past conversations',
                'Maintained context across sessions',
                'Improved long-term memory retention'
              ]
            }
          },
          {
            id: '3',
            title: 'Contextual Relevance',
            value: '92',
            description: 'Response Accuracy',
            trend: 'up',
            trendValue: '16',
            icon: 'bullseye',
            details: {
              previousValue: '76',
              changePercentage: 21.05,
              lastUpdated: '30 minutes ago',
              insights: [
                'Enhanced topic understanding',
                'Better spiritual guidance alignment',
                'Improved response targeting'
              ]
            }
          },
          {
            id: '4',
            title: 'Conversation Naturalness',
            value: '9.4',
            description: 'Human-like Interaction',
            trend: 'up',
            trendValue: '1.1',
            icon: 'comments',
            details: {
              previousValue: '8.3',
              changePercentage: 13.25,
              lastUpdated: '15 minutes ago',
              insights: [
                'More natural conversation flow',
                'Better emotional understanding',
                'Improved response timing'
              ]
            }
          },
        ],
        chartData: [
          // Generate realistic learning curve data
          ...Array.from({ length: 30 }, (_, i) => ({
            x: i + 1,
            y: Math.min(
              95,
              65 + // Base level
              (25 * (1 - Math.exp(-i/10))) + // Learning curve
              (Math.random() * 3 - 1.5) // Small random variation
            )
          }))
        ],
        lastUpdated: new Date().toISOString(),
        insights: [
          {
            title: 'Significant Learning Progress',
            description: 'AI has shown remarkable improvement in understanding spiritual contexts and personal preferences over the last 30 days.',
            type: 'improvement'
          },
          {
            title: 'Enhanced Personalization',
            description: 'Successfully adapted responses based on your spiritual journey and communication style.',
            type: 'improvement'
          },
          {
            title: 'Conversation Quality',
            description: 'Achieved more natural and meaningful dialogue with better context retention.',
            type: 'info'
          }
        ]
      };
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    loading,
    error,
    data,
    refresh: fetchDashboardData,
  };
}

// Helper function to get appropriate icon for each metric
function getMetricIcon(metricName: string): string {
  switch (metricName) {
    case 'Personalization Score':
      return 'user';
    case 'Information Recall':
      return 'brain';
    case 'Contextual Relevance':
      return 'bullseye';
    case 'Conversation Naturalness':
      return 'comments';
    default:
      return 'chart-line';
  }
}