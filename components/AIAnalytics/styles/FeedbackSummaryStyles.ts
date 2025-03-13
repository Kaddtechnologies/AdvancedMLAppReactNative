import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../../../constants/Theme';

// Get colors from the app theme
const colors = Colors.dark;

export default StyleSheet.create({
  container: {
    marginBottom: Spacing.l,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.m,
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.m,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBackgroundGradient.colors[0],
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
    ...Shadows.small,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  feedbackTypeContainer: {
    marginTop: Spacing.m,
  },
  feedbackLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  feedbackType: {
    fontSize: 14,
    color: colors.text,
  },
  feedbackPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  progressBar: {
    height: 8,
    borderRadius: BorderRadius.small,
    marginBottom: Spacing.m,
  },
  positiveBar: {
    backgroundColor: '#4CAF50',
  },
  neutralBar: {
    backgroundColor: '#FFC107',
  },
  negativeBar: {
    backgroundColor: '#F44336',
  },
});