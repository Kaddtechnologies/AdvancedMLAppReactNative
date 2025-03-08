import { Platform } from 'react-native';

/**
 * Get the appropriate font family name based on the platform
 * On iOS, we use the font name directly
 * On Android, we need to use the font file name without the extension
 */
export const getFontFamily = (fontName: string): string => {
  return Platform.OS === 'ios' ? fontName : fontName;
};

/**
 * Font weights mapped to font families
 */
export const fontWeightToFamily: Record<string, string> = {
  '300': 'Poppins-Light',
  '400': 'Poppins-Regular',
  '500': 'Poppins-Medium',
  '600': 'Poppins-SemiBold',
  'light': 'Poppins-Light',
  'regular': 'Poppins-Regular',
  'medium': 'Poppins-Medium',
  'semibold': 'Poppins-SemiBold',
};

/**
 * Get the appropriate font family based on the font weight
 */
export const getFontFamilyForWeight = (weight: string): string => {
  return fontWeightToFamily[weight] || 'Poppins-Regular';
};

/**
 * Apply font family to a style object based on the font weight
 */
export const applyFontToStyle = (style: any, weight?: string): any => {
  if (!weight) {
    return style;
  }

  return {
    ...style,
    fontFamily: getFontFamily(getFontFamilyForWeight(weight)),
  };
};