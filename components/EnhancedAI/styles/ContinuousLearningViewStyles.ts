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
    marginVertical: Spacing.m,
    color: colors.text,
  },

  // Summary Card
  summaryCard: {
    marginBottom: Spacing.l,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.m,
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Chart Card
  chartCard: {
    marginBottom: Spacing.l,
    padding: Spacing.m,
  },

  // Improvements Card
  improvementsCard: {
    marginBottom: Spacing.l,
  },
  improvementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  improvementName: {
    fontSize: 16,
    color: colors.text,
  },
  improvementValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  improvementIcon: {
    marginRight: Spacing.xs,
  },
  improvementValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Cycle Cards
  cycleCard: {
    marginBottom: Spacing.m,
  },
  cycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  cycleTitleContainer: {
    flex: 1,
  },
  cycleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  cycleDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  cycleStatus: {
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
  successStatus: {
    backgroundColor: 'rgba(46, 204, 64, 0.2)',
  },
  failureStatus: {
    backgroundColor: 'rgba(255, 65, 54, 0.2)',
  },
  cycleStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cycleMetrics: {
    marginTop: Spacing.s,
  },
  cycleMetricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  cycleMetricName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cycleMetricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
});