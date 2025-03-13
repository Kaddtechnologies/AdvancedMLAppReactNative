import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useEnhancedAI } from '../../hooks/useEnhancedAI';
import GradientCard from '../ui/GradientCard';
import StyledText from '../ui/StyledText';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { format, parseISO } from 'date-fns';
import styles from './styles/PersonalizationViewStyles';

const colors = Colors.dark;

const PersonalizationView: React.FC = () => {
  const {
    loading,
    error,
    userDemographics,
    spiritualJourney,
    learningProgress,
    personalizationMetrics,
    loadPersonalizationData
  } = useEnhancedAI();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <StyledText variant="body" style={styles.loadingText}>
          Loading personalization data...
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
        AI Personalization
      </StyledText>

      {/* User Demographics */}
      {userDemographics && (
        <GradientCard style={styles.card}>
          <StyledText variant="cardTitle" weight="medium" style={styles.cardTitle}>
            User Profile
          </StyledText>
          <View style={styles.profileContainer}>
            <View style={styles.profileAvatar}>
              <FontAwesome name="user-circle" size={60} color={colors.accent} />
            </View>
            <View style={styles.profileInfo}>
              <StyledText variant="body" weight="medium" style={styles.profileName}>
                User ID: {userDemographics.userId.substring(0, 8)}...
              </StyledText>
              <StyledText variant="secondary" style={styles.profileDetail}>
                Joined: {format(parseISO(userDemographics.joinDate), 'MMM d, yyyy')}
              </StyledText>
              {userDemographics.location && (
                <StyledText variant="secondary" style={styles.profileDetail}>
                  Location: {userDemographics.location}
                </StyledText>
              )}
            </View>
          </View>

          {userDemographics.preferences && Object.keys(userDemographics.preferences).length > 0 && (
            <View style={styles.preferencesContainer}>
              <StyledText variant="body" weight="medium" style={styles.sectionSubtitle}>
                Preferences
              </StyledText>
              {Object.entries(userDemographics.preferences).map(([key, value], index) => (
                <View key={index} style={styles.preferenceItem}>
                  <StyledText variant="secondary" style={styles.preferenceKey}>
                    {formatKey(key)}:
                  </StyledText>
                  <StyledText variant="body" style={styles.preferenceValue}>
                    {value}
                  </StyledText>
                </View>
              ))}
            </View>
          )}
        </GradientCard>
      )}

      {/* Personalization Metrics */}
      {Object.keys(personalizationMetrics).length > 0 && (
        <GradientCard style={styles.card}>
          <StyledText variant="cardTitle" weight="medium" style={styles.cardTitle}>
            Personalization Metrics
          </StyledText>
          <View style={styles.metricsContainer}>
            {Object.entries(personalizationMetrics).map(([key, value], index) => (
              <View key={index} style={styles.metricItem}>
                <View style={styles.metricIconContainer}>
                  <FontAwesome
                    name={getMetricIcon(key) as any}
                    size={24}
                    color={colors.accent}
                    style={styles.metricIcon}
                  />
                </View>
                <View style={styles.metricContent}>
                  <StyledText variant="body" weight="medium" style={styles.metricName}>
                    {formatKey(key)}
                  </StyledText>
                  <View style={styles.metricValueContainer}>
                    <View style={[styles.metricValueBar, { width: `${Math.min(value * 100, 100)}%` }]} />
                  </View>
                  <StyledText variant="secondary" style={styles.metricValue}>
                    {formatMetricValue(key, value)}
                  </StyledText>
                </View>
              </View>
            ))}
          </View>
        </GradientCard>
      )}

      {/* Spiritual Journey */}
      {spiritualJourney && spiritualJourney.length > 0 && (
        <GradientCard style={styles.card}>
          <StyledText variant="cardTitle" weight="medium" style={styles.cardTitle}>
            Spiritual Journey
          </StyledText>
          <View style={styles.timelineContainer}>
            {spiritualJourney.map((journey, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLine} />
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <StyledText variant="body" weight="medium" style={styles.timelineTitle}>
                    {journey.milestone}
                  </StyledText>
                  <StyledText variant="secondary" style={styles.timelineDate}>
                    {format(parseISO(journey.milestoneDate), 'MMM d, yyyy')}
                  </StyledText>
                  <StyledText variant="body" style={styles.timelineDescription}>
                    {journey.description}
                  </StyledText>
                  {journey.significance && (
                    <StyledText variant="secondary" style={styles.timelineSignificance}>
                      Significance: {journey.significance}
                    </StyledText>
                  )}
                </View>
              </View>
            ))}
          </View>
        </GradientCard>
      )}

      {/* Learning Progress */}
      {learningProgress && learningProgress.length > 0 && (
        <GradientCard style={styles.card}>
          <StyledText variant="cardTitle" weight="medium" style={styles.cardTitle}>
            Learning Progress
          </StyledText>
          {learningProgress.map((progress, index) => (
            <View key={index} style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <StyledText variant="body" weight="medium" style={styles.progressTopic}>
                  {progress.topic}
                </StyledText>
                <View style={[
                  styles.progressLevel,
                  getProgressLevelStyle(progress.understandingLevel)
                ]}>
                  <StyledText variant="secondary" weight="medium" style={styles.progressLevelText}>
                    Level {progress.understandingLevel}
                  </StyledText>
                </View>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${(progress.understandingLevel / 5) * 100}%` }
                  ]}
                />
              </View>
              <StyledText variant="secondary" style={styles.progressDate}>
                Last discussed: {format(parseISO(progress.lastDiscussed), 'MMM d, yyyy')}
              </StyledText>
              {progress.notes && (
                <StyledText variant="body" style={styles.progressNotes}>
                  {progress.notes}
                </StyledText>
              )}
            </View>
          ))}
        </GradientCard>
      )}
    </ScrollView>
  );
};

// Helper functions
const formatKey = (key: string): string => {
  // Convert camelCase to Title Case with spaces
  const formatted = key.replace(/([A-Z])/g, ' $1').trim();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const getMetricIcon = (metricName: string): string => {
  const name = metricName.toLowerCase();
  if (name.includes('engagement')) return 'handshake-o';
  if (name.includes('satisfaction')) return 'smile-o';
  if (name.includes('understanding')) return 'lightbulb-o';
  if (name.includes('retention')) return 'bookmark';
  if (name.includes('personalization')) return 'user-circle';
  // Use a known valid icon as fallback
  return 'line-chart';
};

const formatMetricValue = (name: string, value: number): string => {
  if (name.toLowerCase().includes('rate') || name.toLowerCase().includes('score')) {
    return `${(value * 100).toFixed(0)}%`;
  }
  return value.toFixed(2);
};

const getProgressLevelStyle = (level: number) => {
  if (level >= 4) return styles.advancedLevel;
  if (level >= 2) return styles.intermediateLevel;
  return styles.beginnerLevel;
};

export default PersonalizationView;