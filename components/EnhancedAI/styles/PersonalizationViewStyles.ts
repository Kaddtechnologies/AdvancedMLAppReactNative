import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../../../constants/Theme';

// Get colors from the app theme
const colors = Colors.dark;

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.m,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.m,
    fontSize: 16,
    color: colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.m,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.m,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Spacing.m,
    textAlign: 'center',
    color: colors.text,
  },
  card: {
    marginBottom: Spacing.l,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.m,
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.s,
    color: colors.text,
  },

  // User Profile
  profileContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.m,
  },
  profileAvatar: {
    marginRight: Spacing.m,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: Spacing.xs,
  },
  profileDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  preferencesContainer: {
    marginTop: Spacing.s,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  preferenceKey: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  preferenceValue: {
    fontSize: 14,
    color: colors.text,
  },

  // Metrics
  metricsContainer: {
    marginTop: Spacing.s,
  },
  metricItem: {
    flexDirection: 'row',
    marginBottom: Spacing.m,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  metricIcon: {

  },
  metricContent: {
    flex: 1,
  },
  metricName: {
    fontSize: 16,
    color: colors.text,
    marginBottom: Spacing.xs,
  },
  metricValueContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.small,
    marginBottom: Spacing.xs,
    overflow: 'hidden',
  },
  metricValueBar: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: BorderRadius.small,
  },
  metricValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Timeline
  timelineContainer: {
    marginTop: Spacing.s,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.m,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 12,
    top: 24,
    bottom: -12,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    marginRight: Spacing.m,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: Spacing.s,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: Spacing.xs,
  },
  timelineDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: Spacing.s,
  },
  timelineDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: Spacing.s,
  },
  timelineSignificance: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  // Learning Progress
  progressItem: {
    marginBottom: Spacing.m,
    paddingBottom: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  progressTopic: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  progressLevel: {
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
  beginnerLevel: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  intermediateLevel: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
  },
  advancedLevel: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  progressLevelText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.small,
    marginBottom: Spacing.s,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: BorderRadius.small,
  },
  progressDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  progressNotes: {
    fontSize: 14,
    color: colors.text,
    marginTop: Spacing.xs,
  },
});