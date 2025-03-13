import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../../../constants/Theme';

// Get colors from the app theme
const colors = Colors.dark;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackgroundGradient.colors[0],
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.medium,
    marginHorizontal: Spacing.m,
    marginTop: Spacing.m,
    ...Shadows.small,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.s,
    alignItems: 'center',
    borderRadius: BorderRadius.small,
  },
  activeTabButton: {
    backgroundColor: colors.accent,
  },
  tabButtonText: {
    fontSize: 12,
    color: colors.text,
  },
  activeTabButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
});