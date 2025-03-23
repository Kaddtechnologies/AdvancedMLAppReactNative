import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { ActivityIndicator } from 'react-native';
import {
  mockPerformanceMetrics,
  mockLearningProgress,
  mockHealthMonitoring,
  generateUpdatedMetrics,
  PerformanceMetrics,
  LearningProgress,
  HealthMonitoring,
  MetricData
} from '../../data/mockAIData';

const { width } = Dimensions.get('window');

export default function AIAnalyticsScreen() {
  const [loading, setLoading] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>(mockPerformanceMetrics);
  const [learningProgress, setLearningProgress] = useState<LearningProgress>(mockLearningProgress);
  const [healthMonitoring, setHealthMonitoring] = useState<HealthMonitoring>(mockHealthMonitoring);
  const [selectedMetric, setSelectedMetric] = useState<'performance' | 'learning' | 'health'>('performance');
  const [updateInterval, setUpdateInterval] = useState<number>(5000); // 5 seconds default

  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  // Function to update metrics periodically
  const updateMetrics = useCallback(() => {
    setPerformanceMetrics(current => generateUpdatedMetrics<PerformanceMetrics>(current));
    setLearningProgress(current => generateUpdatedMetrics<LearningProgress>(current));
    setHealthMonitoring(current => generateUpdatedMetrics<HealthMonitoring>(current));
  }, []);

  useEffect(() => {
    // Initial load
    setLoading(false);

    // Set up periodic updates
    const interval = setInterval(updateMetrics, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval, updateMetrics]);

  const renderInstructions = () => (
    <BlurView intensity={20} tint="dark" style={styles.instructionsCard}>
      <LinearGradient
        colors={[colors.backgroundGradient.colors[0], colors.backgroundGradient.colors[1]]}
        style={styles.gradientOverlay}
      />
      <MaterialCommunityIcons name="information" size={24} color={colors.accent} />
      <Text style={styles.instructionsTitle}>AI Analytics Dashboard</Text>
      <Text style={styles.instructionsText}>
        Monitor your AI system's performance, learning progress, and health metrics in real-time.
        Use the selector below to switch between different metric categories.
        All metrics update automatically every {updateInterval / 1000} seconds.
      </Text>
    </BlurView>
  );

  const renderTrendIcon = (trend: 'up' | 'down' | 'stable', changePercentage: number) => (
    <View style={styles.trendContainer}>
      <MaterialCommunityIcons
        name={trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'trending-neutral'}
        size={20}
        color={trend === 'up' ? '#4CAF50' : trend === 'down' ? '#f44336' : '#FF9800'}
      />
      <Text style={[styles.trendText, {
        color: trend === 'up' ? '#4CAF50' : trend === 'down' ? '#f44336' : '#FF9800'
      }]}>
        {changePercentage.toFixed(1)}%
      </Text>
    </View>
  );

  const renderMetricCard = (title: string, metric: MetricData) => (
    <BlurView intensity={20} tint="dark" style={styles.metricCard}>
      <LinearGradient
        colors={[colors.backgroundGradient.colors[0], colors.backgroundGradient.colors[1]]}
        style={styles.gradientOverlay}
      />
      <View style={styles.metricHeader}>
        <MaterialCommunityIcons name={metric.icon} size={24} color={colors.accent} />
        <Text style={styles.metricTitle}>{title}</Text>
        {renderTrendIcon(metric.trend, metric.changePercentage)}
      </View>
      <View style={styles.metricContent}>
        <Text style={styles.metricValue}>{(metric.value * 100).toFixed(1)}%</Text>
        <Text style={styles.metricDescription}>{metric.description}</Text>
        <Text style={styles.lastUpdated}>Last updated: {new Date(metric.lastUpdated).toLocaleTimeString()}</Text>
      </View>
      <View style={styles.progressBar}>
        <LinearGradient
          colors={metric.value >= 0.7 ? ['#4CAF50', '#45a049'] : metric.value >= 0.4 ? ['#FF9800', '#f57c00'] : ['#f44336', '#e53935']}
          style={[styles.progressFill, { width: `${metric.value * 100}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
    </BlurView>
  );

  const renderMetricSection = (title: string, metrics: PerformanceMetrics | LearningProgress | HealthMonitoring) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.metricsGrid}>
        {Object.entries(metrics).map(([key, metric]) => (
          <View key={key} style={styles.metricCardContainer}>
            {renderMetricCard(key.split(/(?=[A-Z])/).join(' '), metric as MetricData)}
          </View>
        ))}
      </View>
    </View>
  );

  const renderMetricSelector = () => (
    <View style={styles.selectorContainer}>
      <TouchableOpacity
        style={[styles.selectorButton, selectedMetric === 'performance' && styles.selectorButtonActive]}
        onPress={() => setSelectedMetric('performance')}
      >
        <MaterialCommunityIcons
          name="chart-line"
          size={24}
          color={selectedMetric === 'performance' ? colors.accent : colors.text}
        />
        <Text style={[styles.selectorText, selectedMetric === 'performance' && styles.selectorTextActive]}>
          Performance
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.selectorButton, selectedMetric === 'learning' && styles.selectorButtonActive]}
        onPress={() => setSelectedMetric('learning')}
      >
        <MaterialCommunityIcons
          name="brain"
          size={24}
          color={selectedMetric === 'learning' ? colors.accent : colors.text}
        />
        <Text style={[styles.selectorText, selectedMetric === 'learning' && styles.selectorTextActive]}>
          Learning
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.selectorButton, selectedMetric === 'health' && styles.selectorButtonActive]}
        onPress={() => setSelectedMetric('health')}
      >
        <MaterialCommunityIcons
          name="heart-pulse"
          size={24}
          color={selectedMetric === 'health' ? colors.accent : colors.text}
        />
        <Text style={[styles.selectorText, selectedMetric === 'health' && styles.selectorTextActive]}>
          Health
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading AI Analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {renderInstructions()}

      {renderMetricSelector()}

      {selectedMetric === 'performance' && renderMetricSection('Performance Metrics', performanceMetrics)}
      {selectedMetric === 'learning' && renderMetricSection('Learning Progress', learningProgress)}
      {selectedMetric === 'health' && renderMetricSection('Health Monitoring', healthMonitoring)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
  },
  instructionsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  metricCardContainer: {
    width: '50%',
    padding: 8,
  },
  metricCard: {
    padding: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  metricContent: {
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  metricDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.6,
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 8,
  },
  selectorButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  selectorButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectorText: {
    marginTop: 4,
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  selectorTextActive: {
    opacity: 1,
    fontWeight: '600',
  },
});
