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
  // We'll maintain light/dark structure for compatibility
  light: {
    text: '#000',
    textSecondary: '#666',
    textOnPrimary: '#fff',
    background: '#f5f5f5',
    backgroundGradient: {
      colors: ['#f5f5f5', '#e5e5e5'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    secondaryBackgroundGradient: {
      colors: ['#e5e5e5', '#d5d5d5'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    primaryGradient: {
      colors: ['#007AFF', '#0055FF'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    secondaryGradient: {
      colors: ['#E8E8E8', '#D1D1D1'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    cardBackgroundGradient: {
      colors: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    navBarGradient: {
      colors: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    accent: '#007AFF',
    accentSecondary: '#5856D6',
    tint: '#007AFF',
    tabIconDefault: '#ccc',
    tabIconSelected: '#007AFF',
  },
  // For this app, dark mode will be the same as light mode since the design is dark-themed
  dark: {
    text: '#fff',
    textSecondary: '#aaa',
    textOnPrimary: '#fff',
    background: '#000',
    backgroundGradient: {
      colors: ['#1a1a1a', '#000000'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    secondaryBackgroundGradient: {
      colors: ['#2a2a2a', '#1a1a1a'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    primaryGradient: {
      colors: ['#0A84FF', '#0055FF'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    secondaryGradient: {
      colors: ['#2a2a2a', '#1a1a1a'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    cardBackgroundGradient: {
      colors: ['rgba(40,40,40,0.9)', 'rgba(30,30,30,0.8)'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    navBarGradient: {
      colors: ['rgba(30,30,30,0.9)', 'rgba(20,20,20,0.8)'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    accent: '#0A84FF',
    accentSecondary: '#5E5CE6',
    tint: '#0A84FF',
    tabIconDefault: '#666',
    tabIconSelected: '#0A84FF',
  },
};

export type ColorScheme = keyof typeof Colors;
export type ColorTheme = typeof Colors[ColorScheme];
