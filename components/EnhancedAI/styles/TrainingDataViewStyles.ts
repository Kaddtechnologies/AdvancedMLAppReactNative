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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.m,
  },
  emptyText: {
    color: colors.textSecondary,
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

  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Category Distribution
  categoryItem: {
    marginBottom: Spacing.m,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  categoryName: {
    fontSize: 16,
    color: colors.text,
  },
  categoryCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  categoryBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.small,
    overflow: 'hidden',
  },
  categoryBar: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: BorderRadius.small,
  },

  // Quality Metrics
  qualityMetricsContainer: {
    marginTop: Spacing.s,
  },
  qualityMetricItem: {
    marginBottom: Spacing.m,
  },
  qualityMetricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  qualityMetricName: {
    fontSize: 16,
    color: colors.text,
  },
  qualityMetricScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  qualityMetricBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.small,
    marginBottom: Spacing.xs,
    overflow: 'hidden',
  },
  qualityMetricBar: {
    height: '100%',
    borderRadius: BorderRadius.small,
  },
  qualityMetricDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Recommendations
  recommendationsContainer: {
    marginTop: Spacing.s,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  recommendationIcon: {
    marginRight: Spacing.s,
  },
  recommendationText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
});