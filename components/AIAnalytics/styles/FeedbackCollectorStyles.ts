import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../../../constants/Theme';

// Get colors from the app theme
const colors = Colors.dark;

export default StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackgroundGradient.colors[0],
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    marginVertical: Spacing.m,
    ...Shadows.small,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: Spacing.m,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  ratingLabel: {
    fontSize: 16,
    marginBottom: Spacing.s,
    color: colors.text,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: Spacing.s,
  },
  star: {
    marginHorizontal: Spacing.xs,
  },
  commentsContainer: {
    marginBottom: Spacing.m,
  },
  commentsLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: Spacing.xs,
  },
  commentsInput: {
    backgroundColor: colors.background,
    borderRadius: BorderRadius.small,
    padding: Spacing.s,
    color: colors.text,
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: Spacing.s,
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.s,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.accentSecondary,
    opacity: 0.5,
  },
  submitButtonText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});