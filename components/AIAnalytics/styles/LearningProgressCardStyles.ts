import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../../../constants/Theme';

// Get colors from the app theme
const colors = Colors.dark;

export default StyleSheet.create({
  container: {
    marginBottom: Spacing.m,
  },
  card: {
    backgroundColor: colors.cardBackgroundGradient.colors[0],
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    ...Shadows.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  improvement: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    marginBottom: Spacing.s,
  },
  progressContainer: {
    marginTop: Spacing.s,
  },
  progressBar: {
    height: 6,
    borderRadius: BorderRadius.small,
    marginTop: Spacing.xs,
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});