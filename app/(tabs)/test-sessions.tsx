import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import StyledText from '../../components/ui/StyledText';
import GradientCard from '../../components/ui/GradientCard';
import GradientButton from '../../components/ui/GradientButton';
import { Spacing } from '../../constants/Theme';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAppContext } from '../../contexts/AppContext';
import TestSessionService, {
  TestSession,
  TestSessionType,
  TestSessionStatus
} from '../../services/TestSessionService';
import { format } from 'date-fns';

// Session type options
const sessionTypes: { id: TestSessionType | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'baseline', label: 'Baseline' },
  { id: 'progressive-info', label: 'Progressive Info' },
  { id: 'recall', label: 'Recall' },
  { id: 'persistence', label: 'Persistence' },
  { id: 'contextual', label: 'Contextual' },
];

export default function TestSessionsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const { testSessions, refreshTestSessions, setActiveSession } = useAppContext();

  const [selectedType, setSelectedType] = useState<TestSessionType | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Load test sessions on mount
  useEffect(() => {
    loadTestSessions();
  }, []);

  // Load test sessions
  const loadTestSessions = async () => {
    try {
      setIsLoading(true);
      await refreshTestSessions();
    } catch (error) {
      console.error('Error loading test sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter sessions based on selected type
  const filteredSessions = selectedType === 'all'
    ? testSessions
    : testSessions.filter(session => session.type === selectedType);

  // Navigate to test session detail
  const navigateToTestSession = (sessionId: string) => {
    setActiveSession(sessionId);
    router.push(`/test-session/${sessionId}`);
  };

  // Create a new test session
  const createNewSession = async (type: TestSessionType) => {
    try {
      setIsCreating(true);

      // Create title and description based on type
      let title = '';
      let description = '';

      switch (type) {
        case 'baseline':
          title = 'Baseline Testing';
          description = 'Initial testing to establish baseline AI performance';
          break;
        case 'progressive-info':
          title = `Progressive Information - Session ${testSessions.filter(s => s.type === 'progressive-info').length + 1}`;
          description = 'Sharing personal information with the AI';
          break;
        case 'recall':
          title = 'Recall Testing';
          description = 'Testing AI recall of previously shared information';
          break;
        case 'persistence':
          title = 'Cross-Session Persistence';
          description = 'Testing information retention across sessions';
          break;
        case 'contextual':
          title = 'Contextual Understanding';
          description = 'Testing AI understanding of context and inference';
          break;
      }

      // Create the session
      const session = await TestSessionService.createTestSession(title, description, type);

      // Refresh the sessions list
      await refreshTestSessions();

      // Navigate to the new session
      navigateToTestSession(session.id);
    } catch (error) {
      console.error('Error creating test session:', error);
      alert(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  // Get icon for session type
  const getSessionTypeIcon = (type: TestSessionType): string => {
    switch (type) {
      case 'baseline':
        return 'flag';
      case 'progressive-info':
        return 'info-circle';
      case 'recall':
        return 'refresh';
      case 'persistence':
        return 'database';
      case 'contextual':
        return 'sitemap';
      default:
        return 'question-circle';
    }
  };

  // Get color for session status
  const getStatusColor = (status: TestSessionStatus): string => {
    switch (status) {
      case 'completed':
        return '#4CAF50'; // Green
      case 'in-progress':
        return '#FFC107'; // Yellow
      case 'scheduled':
        return '#2196F3'; // Blue
      case 'failed':
        return '#F44336'; // Red
      default:
        return colors.accentSecondary;
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Render a session item
  const renderSessionItem = ({ item }: { item: TestSession }) => (
    <TouchableOpacity onPress={() => navigateToTestSession(item.id)}>
      <GradientCard style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <View style={styles.sessionTypeIcon}>
            <FontAwesome
              name={getSessionTypeIcon(item.type)}
              size={16}
              color={colors.accent}
            />
          </View>
          <StyledText variant="cardTitle" weight="medium">
            {item.title}
          </StyledText>
        </View>

        <StyledText variant="bodySmall" style={styles.sessionDescription}>
          {item.description}
        </StyledText>

        <View style={styles.sessionDetails}>
          <View style={styles.sessionDate}>
            <FontAwesome
              name="calendar"
              size={12}
              color={colors.accentSecondary}
              style={styles.detailIcon}
            />
            <StyledText variant="secondary">
              {formatDate(item.createdAt)}
            </StyledText>
          </View>

          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) }
          ]}>
            <StyledText variant="secondary" weight="medium">
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </StyledText>
          </View>
        </View>

        {item.status !== 'scheduled' && (
          <View style={styles.sessionMetrics}>
            {item.metrics.personalizationScore !== undefined && (
              <View style={styles.metricItem}>
                <StyledText variant="secondary">
                  Personalization
                </StyledText>
                <StyledText variant="body" weight="semibold">
                  {item.metrics.personalizationScore.toFixed(1)}/5
                </StyledText>
              </View>
            )}

            {item.metrics.recallRate !== undefined && (
              <View style={styles.metricItem}>
                <StyledText variant="secondary">
                  Recall
                </StyledText>
                <StyledText variant="body" weight="semibold">
                  {item.metrics.recallRate}%
                </StyledText>
              </View>
            )}

            {item.metrics.contextualRelevance !== undefined && (
              <View style={styles.metricItem}>
                <StyledText variant="secondary">
                  Relevance
                </StyledText>
                <StyledText variant="body" weight="semibold">
                  {item.metrics.contextualRelevance}/100
                </StyledText>
              </View>
            )}

            {item.metrics.conversationNaturalness !== undefined && (
              <View style={styles.metricItem}>
                <StyledText variant="secondary">
                  Naturalness
                </StyledText>
                <StyledText variant="body" weight="semibold">
                  {item.metrics.conversationNaturalness}/10
                </StyledText>
              </View>
            )}

            {item.metrics.questionCount !== undefined && (
              <View style={styles.metricItem}>
                <StyledText variant="secondary">
                  Questions
                </StyledText>
                <StyledText variant="body" weight="semibold">
                  {item.metrics.questionCount}
                </StyledText>
              </View>
            )}
          </View>
        )}
      </GradientCard>
    </TouchableOpacity>
  );

  // Render the new session card
  const renderNewSessionCard = () => (
    <GradientCard style={styles.newSessionCard}>
      <StyledText variant="cardTitle" weight="medium" style={styles.newSessionTitle}>
        Create New Test Session
      </StyledText>

      <StyledText variant="bodySmall" style={styles.newSessionDescription}>
        Select a test type to create a new session:
      </StyledText>

      <View style={styles.sessionTypeButtons}>
        <GradientButton
          title="Baseline"
          onPress={() => createNewSession('baseline')}
          size="small"
          style={styles.sessionTypeButton}
          disabled={isCreating}
        />

        <GradientButton
          title="Progressive Info"
          onPress={() => createNewSession('progressive-info')}
          size="small"
          style={styles.sessionTypeButton}
          disabled={isCreating}
        />

        <GradientButton
          title="Recall"
          onPress={() => createNewSession('recall')}
          size="small"
          style={styles.sessionTypeButton}
          disabled={isCreating}
        />

        <GradientButton
          title="Persistence"
          onPress={() => createNewSession('persistence')}
          size="small"
          style={styles.sessionTypeButton}
          disabled={isCreating}
        />

        <GradientButton
          title="Contextual"
          onPress={() => createNewSession('contextual')}
          size="small"
          style={styles.sessionTypeButton}
          disabled={isCreating}
        />
      </View>

      {isCreating && (
        <ActivityIndicator color={colors.accent} style={styles.creatingIndicator} />
      )}
    </GradientCard>
  );

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <StyledText variant="largeHeader" weight="semibold">
            Test Sessions
          </StyledText>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {sessionTypes.map(type => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.filterButton,
                selectedType === type.id && { backgroundColor: colors.accent }
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <StyledText
                variant="bodySmall"
                weight={selectedType === type.id ? 'semibold' : 'regular'}
              >
                {type.label}
              </StyledText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isLoading ? (
          <ActivityIndicator color={colors.accent} style={styles.loader} />
        ) : (
          <FlatList
            data={filteredSessions}
            keyExtractor={item => item.id}
            renderItem={renderSessionItem}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={renderNewSessionCard}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <FontAwesome name="list" size={48} color={colors.accentSecondary} />
                <StyledText variant="body" style={styles.emptyStateText}>
                  No test sessions found. Create a new one!
                </StyledText>
              </View>
            }
          />
        )}
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.m,
  },
  header: {
    marginBottom: Spacing.m,
  },
  filterContainer: {
    marginBottom: Spacing.m,
  },
  filterContent: {
    paddingRight: Spacing.m,
  },
  filterButton: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: 20,
    marginRight: Spacing.s,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  sessionCard: {
    marginBottom: Spacing.m,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  sessionTypeIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.s,
  },
  sessionDescription: {
    opacity: 0.7,
    marginBottom: Spacing.m,
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  sessionDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  sessionMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: Spacing.s,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  metricItem: {
    alignItems: 'center',
    minWidth: 80,
    marginBottom: Spacing.s,
  },
  newSessionCard: {
    marginBottom: Spacing.m,
  },
  newSessionTitle: {
    marginBottom: Spacing.s,
  },
  newSessionDescription: {
    opacity: 0.7,
    marginBottom: Spacing.m,
  },
  sessionTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: Spacing.s,
  },
  sessionTypeButton: {
    marginRight: Spacing.s,
    marginBottom: Spacing.s,
    minWidth: 120,
  },
  creatingIndicator: {
    marginTop: Spacing.m,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: Spacing.m,
    opacity: 0.7,
  },
  loader: {
    flex: 1,
    alignSelf: 'center',
  },
});