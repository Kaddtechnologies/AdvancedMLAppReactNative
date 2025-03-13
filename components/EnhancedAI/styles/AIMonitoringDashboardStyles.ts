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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.m,
    color: colors.text,
  },

  // Health Card
  healthCard: {
    marginBottom: Spacing.l,
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  healthStatus: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.medium,
  },
  healthyStatus: {
    backgroundColor: 'rgba(46, 204, 64, 0.2)',
  },
  unhealthyStatus: {
    backgroundColor: 'rgba(255, 65, 54, 0.2)',
  },
  healthStatusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  lastCheckedText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: Spacing.m,
  },
  issuesContainer: {
    marginTop: Spacing.s,
  },
  issuesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
    color: colors.text,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  issueIcon: {
    marginRight: Spacing.xs,
  },
  issueText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },

  // Metrics Section
  metricsSection: {
    marginBottom: Spacing.l,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Alerts Section
  alertsSection: {
    marginBottom: Spacing.l,
  },
  alertCard: {
    marginBottom: Spacing.m,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  alertIcon: {
    marginRight: Spacing.s,
  },
  alertTitleContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  alertTimestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  alertMessage: {
    fontSize: 14,
    color: colors.text,
  },
  severityBadge: {
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
    marginLeft: Spacing.s,
  },
  severityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Severity styles
  criticalSeverity: {
    backgroundColor: 'rgba(255, 65, 54, 0.2)',
  },
  highSeverity: {
    backgroundColor: 'rgba(255, 133, 27, 0.2)',
  },
  mediumSeverity: {
    backgroundColor: 'rgba(255, 220, 0, 0.2)',
  },
  lowSeverity: {
    backgroundColor: 'rgba(46, 204, 64, 0.2)',
  },

  // Alert card styles
  criticalAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF4136',
  },
  highAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF851B',
  },
  mediumAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFDC00',
  },
  lowAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#2ECC40',
  },
});