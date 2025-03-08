import { Colors } from './Colors';

export const Typography = {
  fontFamily: {
    primary: 'Poppins', // Will fallback to system font if not loaded
    secondary: 'SF Pro Display', // Will fallback to system font if not loaded
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
  },
  fontSize: {
    largeHeader: 32,
    header: 28,
    sectionHeader: 24,
    cardTitle: 20,
    body: 16,
    bodySmall: 14,
    secondary: 12,
  },
  letterSpacing: {
    default: 0.2,
    tight: 0,
    loose: 0.5,
  },
  lineHeight: {
    default: 1.5,
    tight: 1.2,
    loose: 1.8,
  },
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  small: 4,
  medium: 8,
  large: 16,
  extraLarge: 24,
  round: 9999,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
};

export default Theme;