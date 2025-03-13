import React from 'react';
import { View, ScrollView, ActivityIndicator, ViewStyle } from 'react-native';
import { useEnhancedAI } from '../../hooks/useEnhancedAI';
import GradientCard from '../ui/GradientCard';
import StyledText from '../ui/StyledText';
import MetricCard from '../ui/MetricCard';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { formatDistanceToNow } from 'date-fns';
import styles from './styles/AIMonitoringDashboardStyles';

const colors = Colors.dark;

const AIMonitoringDashboard: React.FC = () => {
  const {
    loading,
    error,
    monitoringReport,
    modelHealth,
    loadMonitoringData
  } = useEnhancedAI();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <StyledText variant="body" style={styles.loadingText}>
          Loading AI monitoring data...
        </StyledText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name="exclamation-triangle" size={40} color="#FF6B6B" />
        <StyledText variant="body" style={styles.errorText}>
          {error}
        </StyledText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StyledText variant="sectionHeader" weight="semibold" style={styles.title}>
        AI System Monitoring
      </StyledText>

      {/* Health Status */}
      {modelHealth && (
        <GradientCard style={styles.healthCard}>
          <View style={styles.healthHeader}>
            <StyledText variant="cardTitle" weight="medium" style={styles.healthTitle}>
              System Health
            </StyledText>
            <View style={[
              styles.healthStatus,
              modelHealth.isHealthy ? styles.healthyStatus : styles.unhealthyStatus
            ]}>
              <StyledText variant="body" weight="medium" style={styles.healthStatusText}>
                {modelHealth.isHealthy ? 'Healthy' : 'Issues Detected'}
              </StyledText>
            </View>
          </View>

          <StyledText variant="body" style={styles.lastCheckedText}>
            Last checked: {formatDistanceToNow(new Date(modelHealth.lastChecked))} ago
          </StyledText>

          {modelHealth.issues.length > 0 && (
            <View style={styles.issuesContainer}>
              <StyledText variant="body" weight="medium" style={styles.issuesTitle}>
                Issues:
              </StyledText>
              {modelHealth.issues.map((issue, index) => (
                <View key={index} style={styles.issueItem}>
                  <FontAwesome name="exclamation-circle" size={16} color="#FF6B6B" style={styles.issueIcon} />
                  <StyledText variant="body" style={styles.issueText}>
                    {issue}
                  </StyledText>
                </View>
              ))}
            </View>
          )}
        </GradientCard>
      )}

      {/* Metrics */}
      {monitoringReport && (
        <View style={styles.metricsSection}>
          <StyledText variant="cardTitle" weight="medium" style={styles.sectionTitle}>
            Performance Metrics
          </StyledText>
          <View style={styles.metricsContainer}>
            {Object.entries(monitoringReport.metricTrends).map(([key, trend]) => (
              <MetricCard
                key={key}
                title={trend.metricName}
                value={trend.currentValue.toFixed(2)}
                description={`Baseline: ${trend.baselineValue.toFixed(2)}`}
                trend={trend.percentChange > 0 ? 'up' : trend.percentChange < 0 ? 'down' : 'neutral'}
                trendValue={Math.abs(trend.percentChange).toFixed(1)}
                icon={
                  <FontAwesome
                    name={getIconForMetric(trend.metricName) as any}
                    size={20}
                    color={colors.accent}
                  />
                }
              />
            ))}
          </View>
        </View>
      )}

      {/* Alerts */}
      {monitoringReport && monitoringReport.alerts.length > 0 && (
        <View style={styles.alertsSection}>
          <StyledText variant="cardTitle" weight="medium" style={styles.sectionTitle}>
            Active Alerts
          </StyledText>
          {monitoringReport.alerts.map((alert, index) => {
            // Apply severity-specific styles directly
            let borderStyle = {};
            if (alert.severity === 'Critical') borderStyle = styles.criticalAlert;
            else if (alert.severity === 'High') borderStyle = styles.highAlert;
            else if (alert.severity === 'Medium') borderStyle = styles.mediumAlert;
            else if (alert.severity === 'Low') borderStyle = styles.lowAlert;

            return (
              <GradientCard key={index} style={{...styles.alertCard, ...borderStyle}}>
                <View style={styles.alertHeader}>
                  <FontAwesome
                    name={getAlertIcon(alert.type) as any}
                    size={20}
                    color={getAlertColor(alert.severity)}
                    style={styles.alertIcon}
                  />
                  <View style={styles.alertTitleContainer}>
                    <StyledText variant="body" weight="medium" style={styles.alertTitle}>
                      {formatAlertType(alert.type)}
                    </StyledText>
                    <StyledText variant="secondary" style={styles.alertTimestamp}>
                      {formatDistanceToNow(new Date(alert.timestamp))} ago
                    </StyledText>
                  </View>
                  <View style={[styles.severityBadge, getSeverityStyle(alert.severity)]}>
                    <StyledText variant="secondary" weight="medium" style={styles.severityText}>
                      {alert.severity}
                    </StyledText>
                  </View>
                </View>
                <StyledText variant="body" style={styles.alertMessage}>
                  {alert.message}
                </StyledText>
              </GradientCard>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

// Helper functions
const getIconForMetric = (metricName: string): string => {
  const name = metricName.toLowerCase();
  if (name.includes('accuracy')) return 'bullseye';
  if (name.includes('perplexity')) return 'random';
  if (name.includes('response')) return 'clock-o';
  if (name.includes('success')) return 'check-circle';
  return 'line-chart';
};

const getAlertIcon = (type: string): string => {
  switch (type) {
    case 'AccuracyDrop': return 'arrow-down';
    case 'PerplexityIncrease': return 'arrow-up';
    case 'HealthIssue': return 'heartbeat';
    case 'SystemError': return 'exclamation-triangle';
    default: return 'bell';
  }
};

const getAlertColor = (severity: string): string => {
  switch (severity) {
    case 'Critical': return '#FF4136';
    case 'High': return '#FF851B';
    case 'Medium': return '#FFDC00';
    case 'Low': return '#2ECC40';
    default: return '#7FDBFF';
  }
};

const getSeverityStyle = (severity: string) => {
  switch (severity) {
    case 'Critical': return styles.criticalSeverity;
    case 'High': return styles.highSeverity;
    case 'Medium': return styles.mediumSeverity;
    case 'Low': return styles.lowSeverity;
    default: return {};
  }
};

const formatAlertType = (type: string): string => {
  switch (type) {
    case 'AccuracyDrop': return 'Accuracy Drop';
    case 'PerplexityIncrease': return 'Perplexity Increase';
    case 'HealthIssue': return 'Health Issue';
    case 'SystemError': return 'System Error';
    default: return type;
  }
};

export default AIMonitoringDashboard;