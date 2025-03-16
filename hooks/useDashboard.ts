import { useState, useEffect } from 'react';

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

  const fetchDashboardData = async () => {
    console.log('Fetching dashboard data...');
    try {
      setLoading(true);
      setError(null);

      // Add delay to ensure state updates are processed
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('Preparing mock data...');
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
            icon: 'lightbulb-o',
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
            icon: 'comments-o',
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

      console.log('Setting dashboard data...');
      setData(mockData);
      console.log('Dashboard data set successfully:', mockData);
    } catch (error) {
      console.error('Error setting mock dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      console.log('Finishing dashboard data fetch, setting loading to false');
      setLoading(false);

      // Add post-loading state change logging
      setTimeout(() => {
        console.log('Post loading state check:', {
          loading: false,
          hasData: !!data,
          dataKeys: data ? Object.keys(data) : [],
          metricsCount: data?.metrics?.length ?? 0,
          error: error
        });
      }, 0);
    }
  };

  useEffect(() => {
    console.log('useDashboard hook mounted');
    fetchDashboardData();
    return () => {
      console.log('useDashboard hook cleanup');
    };
  }, []);

  // Add effect to monitor state changes
  useEffect(() => {
    console.log('Dashboard state updated:', {
      loading,
      hasData: !!data,
      hasError: !!error
    });
  }, [loading, data, error]);

  return {
    loading,
    error,
    data,
    refresh: fetchDashboardData,
  };
}
