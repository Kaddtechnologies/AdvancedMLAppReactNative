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
    marginBottom: Spacing.m,
  },
  retryButton: {
    marginTop: Spacing.m,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Spacing.m,
    textAlign: 'center',
    color: colors.text,
  },
  section: {
    marginBottom: Spacing.l,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.s,
    color: colors.text,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  timeRangeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.m,
  },
  timeRangeButton: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.medium,
  },
  timeRangeButtonActive: {
    backgroundColor: colors.accent,
  },
  timeRangeButtonText: {
    color: colors.text,
    fontSize: 14,
  },
  timeRangeButtonTextActive: {
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: Spacing.m,
    alignSelf: 'center',
  },
});