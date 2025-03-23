/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * Color scheme for the AdvancedML Testing Metrics App
 * Based on the design guidelines in the specification document
 */

// Primary colors
const primaryDarkBrown = '#1E1A17';
const primaryLightBrown = '#2D2420';

// Secondary colors
const secondaryDarkBrown = '#2A2422';
const secondaryLightBrown = '#3A302C';

// Card colors
const cardDarkBrown = '#2F2A27';
const cardLightBrown = '#3A302C';

// Accent colors
const accentCopper = '#A67C6D';
const accentCopperLight = '#B68E7D';
const accentWarmGray = '#6D6A67';

// Text colors
const textWhite = '#FFFFFF';
const textBrown = '#5A4A40';

export const Colors = {
  // We'll maintain light/dark structure for compatibility, but make them identical
  light: {
    text: textWhite,
    textSecondary: accentWarmGray,
    textOnPrimary: textWhite,
    background: primaryDarkBrown,
    backgroundGradient: {
      colors: [primaryDarkBrown, primaryLightBrown],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    secondaryBackgroundGradient: {
      colors: [secondaryDarkBrown, secondaryLightBrown],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    primaryGradient: {
      colors: [primaryDarkBrown, primaryLightBrown],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    secondaryGradient: {
      colors: [secondaryDarkBrown, secondaryLightBrown],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    cardBackgroundGradient: {
      colors: [cardDarkBrown, cardLightBrown],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    navBarGradient: {
      colors: [primaryDarkBrown, primaryLightBrown],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    accent: accentCopper,
    accentSecondary: accentCopperLight,
    tint: accentCopper,
    tabIconDefault: accentWarmGray,
    tabIconSelected: accentCopper,
    error: '#FF453A',
  },
  // Dark mode is identical to light mode to ensure consistent dark appearance
  dark: {
    text: textWhite,
    textSecondary: accentWarmGray,
    textOnPrimary: textWhite,
    background: primaryDarkBrown,
    backgroundGradient: {
      colors: [primaryDarkBrown, primaryLightBrown],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    secondaryBackgroundGradient: {
      colors: [secondaryDarkBrown, secondaryLightBrown],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    primaryGradient: {
      colors: [primaryDarkBrown, primaryLightBrown],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    secondaryGradient: {
      colors: [secondaryDarkBrown, secondaryLightBrown],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    cardBackgroundGradient: {
      colors: [cardDarkBrown, cardLightBrown],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    navBarGradient: {
      colors: [primaryDarkBrown, primaryLightBrown],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    accent: accentCopper,
    accentSecondary: accentCopperLight,
    tint: accentCopper,
    tabIconDefault: accentWarmGray,
    tabIconSelected: accentCopper,
    error: '#FF453A',
  },
};

export type ColorScheme = keyof typeof Colors;
export type ColorTheme = typeof Colors[ColorScheme];
