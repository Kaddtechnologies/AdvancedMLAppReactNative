import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { ActivityIndicator } from 'react-native';
import {
  mockEnhancedAIMetrics,
  generateUpdatedMetrics,
  generateSystemStatus,
  EnhancedAIMetrics,
  MetricData
} from '../../data/mockAIData';

export default function EnhancedAIScreen() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<EnhancedAIMetrics>(mockEnhancedAIMetrics);
  const [systemStatus, setSystemStatus] = useState(generateSystemStatus());
  const [updateInterval] = useState<number>(5000); // 5 seconds default

  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  // Function to update metrics periodically
  const updateMetrics = useCallback(() => {
    setMetrics(current => generateUpdatedMetrics(current));
    setSystemStatus(generateSystemStatus());
  }, []);

  useEffect(() => {
    // Initial load
    setLoading(false);

    // Set up periodic updates
    const interval = setInterval(updateMetrics, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval, updateMetrics]);

  const renderSystemStatus = () => (
    <BlurView intensity={20} tint="dark" style={styles.statusCard}>
      <LinearGradient
        colors={[colors.backgroundGradient.colors[0], colors.backgroundGradient.colors[1]]}
        style={styles.gradientOverlay}
      />
      <View style={styles.statusHeader}>
        <MaterialCommunityIcons
          name={
            systemStatus.status === 'healthy'
              ? 'check-circle'
              : systemStatus.status === 'degraded'
              ? 'alert'
              : 'alert-circle'
          }
          size={24}
          color={
            systemStatus.status === 'healthy'
              ? '#4CAF50'
              : systemStatus.status === 'degraded'
              ? '#FF9800'
              : '#f44336'
          }
        />
        <Text style={styles.statusTitle}>System Status: {systemStatus.status}</Text>
      </View>
      <Text style={styles.statusMessage}>{systemStatus.message}</Text>
      <View style={styles.statusMetrics}>
        <View style={styles.statusMetric}>
          <MaterialCommunityIcons name="cpu-64-bit" size={20} color={colors.accent} />
          <Text style={styles.statusMetricText}>
            CPU: {systemStatus.metrics.cpuUsage.toFixed(1)}%
          </Text>
        </View>
        <View style={styles.statusMetric}>
          <MaterialCommunityIcons name="memory" size={20} color={colors.accent} />
          <Text style={styles.statusMetricText}>
            Memory: {systemStatus.metrics.memoryUsage.toFixed(1)}%
          </Text>
        </View>
        <View style={styles.statusMetric}>
          <MaterialCommunityIcons name="account-group" size={20} color={colors.accent} />
          <Text style={styles.statusMetricText}>
            Active Users: {systemStatus.metrics.activeUsers}
          </Text>
        </View>
        <View style={styles.statusMetric}>
          <MaterialCommunityIcons name="chart-line" size={20} color={colors.accent} />
          <Text style={styles.statusMetricText}>
            Requests/min: {systemStatus.metrics.requestsPerMinute}
          </Text>
        </View>
      </View>
    </BlurView>
  );

  const renderInstructions = () => (
    <BlurView intensity={20} tint="dark" style={styles.instructionsCard}>
      <LinearGradient
        colors={[colors.backgroundGradient.colors[0], colors.backgroundGradient.colors[1]]}
        style={styles.gradientOverlay}
      />
      <MaterialCommunityIcons name="information" size={24} color={colors.accent} />
      <Text style={styles.instructionsTitle}>Enhanced AI Dashboard</Text>
      <Text style={styles.instructionsText}>
        Monitor your AI system's enhanced capabilities and real-time performance metrics.
        The dashboard updates automatically every {updateInterval / 1000} seconds to provide
        the most current information about your AI system's health and capabilities.
      </Text>
    </BlurView>
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
        <View style={styles.trendContainer}>
          <MaterialCommunityIcons
            name={metric.trend === 'up' ? 'trending-up' : metric.trend === 'down' ? 'trending-down' : 'trending-neutral'}
            size={20}
            color={metric.trend === 'up' ? '#4CAF50' : metric.trend === 'down' ? '#f44336' : '#FF9800'}
          />
          <Text style={[styles.trendText, {
            color: metric.trend === 'up' ? '#4CAF50' : metric.trend === 'down' ? '#f44336' : '#FF9800'
          }]}>
            {metric.changePercentage.toFixed(1)}%
          </Text>
        </View>
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading Enhanced AI Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {renderInstructions()}
      {renderSystemStatus()}

      <View style={styles.metricsGrid}>
        {Object.entries(metrics).map(([key, metric]) => (
          <View key={key} style={styles.metricCardContainer}>
            {renderMetricCard(key.split(/(?=[A-Z])/).join(' '), metric)}
          </View>
        ))}
      </View>
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
  statusCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  statusMessage: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 16,
  },
  statusMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statusMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    padding: 8,
  },
  statusMetricText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 8,
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
});
