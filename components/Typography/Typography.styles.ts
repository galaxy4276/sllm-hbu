import { useMemo } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import {
  TypographyVariant,
  TypographyWeight,
  TypographyColor,
  TypographyDisplay,
  TextAlignment,
  TextDecoration,
  TextTransform,
  TypographyStyles,
} from '../../types/typography';
import {
  theme,
  typographyVariants,
  fontWeights,
  fontFamilies,
  letterSpacing,
  textColors,
} from '../../styles/theme';

// Hook to get typography styles based on props
export const useTypographyStyles = (
  variant: TypographyVariant,
  weight?: TypographyWeight,
  color?: TypographyColor,
  align?: TextAlignment,
  decoration?: TextDecoration,
  transform?: TextTransform,
  display?: TypographyDisplay,
  fontFamily?: string,
  customStyle?: TextStyle
): TypographyStyles => {
  return useMemo(() => {
    const variantConfig = typographyVariants[variant];
    const finalWeight = weight || variantConfig.fontWeight;
    const finalColor = color || 'primary';

    // Get font family
    const getFontFamily = (fontWeight: TypographyWeight, customFamily?: string) => {
      if (customFamily) return customFamily;
      if (fontWeight === 'inherit') return undefined;
      return fontFamilies[fontWeight];
    };

    // Base text styles
    const textStyles: TextStyle = {
      fontSize: variantConfig.fontSize,
      lineHeight: variantConfig.lineHeight,
      fontWeight: fontWeights[finalWeight],
      fontFamily: getFontFamily(finalWeight, fontFamily),
      letterSpacing: variantConfig.letterSpacing
        ? variantConfig.letterSpacing
        : letterSpacing.normal,
      color: finalColor === 'inherit' ? 'inherit' : textColors[finalColor],
      textAlign: align || 'auto',
      textDecorationLine: decoration || 'none',
      textTransform: transform || 'none',
      ...variantConfig,
      // Remove margin/padding from text styles (handle in container)
      marginTop: undefined,
      marginBottom: undefined,
      ...customStyle,
    };

    // Container styles for margin/padding and display
    const containerStyles: ViewStyle = {
      display: display || 'block',
      marginTop: variantConfig.marginTop,
      marginBottom: variantConfig.marginBottom,
    };

    return {
      container: containerStyles,
      text: textStyles,
    };
  }, [
    variant,
    weight,
    color,
    align,
    decoration,
    transform,
    display,
    fontFamily,
    customStyle,
  ]);
};

// Helper function to get responsive font size
export const getResponsiveFontSize = (
  baseSize: number,
  scaleFactor: number = 1
): number => {
  return Math.round(baseSize * scaleFactor);
};

// Helper function to calculate line height from font size
export const calculateLineHeight = (
  fontSize: number,
  lineHeightRatio: number = 1.5
): number => {
  return Math.round(fontSize * lineHeightRatio);
};

// Helper function to get optimal letter spacing
export const getOptimalLetterSpacing = (
  fontSize: number,
  weight: TypographyWeight
): number => {
  // Adjust letter spacing based on font size and weight
  const baseSpacing = fontSize < 14 ? 0.1 : 0;
  const weightAdjustment =
    weight === 'bold' || weight === 'black' ? -0.25 :
    weight === 'light' || weight === 'thin' ? 0.25 : 0;

  return baseSpacing + weightAdjustment;
};

// Function to create custom variant
export const createCustomVariant = (
  name: string,
  config: {
    fontSize: number;
    lineHeight: number;
    fontWeight: TypographyWeight;
    letterSpacing?: number;
    marginTop?: number;
    marginBottom?: number;
  }
) => {
  return {
    [name]: {
      fontSize: config.fontSize,
      lineHeight: config.lineHeight,
      fontWeight: config.fontWeight,
      letterSpacing: config.letterSpacing || 0,
      marginTop: config.marginTop || 0,
      marginBottom: config.marginBottom || 0,
    },
  };
};

// Function to get text color for different backgrounds
export const getAdaptiveTextColor = (
  backgroundColor: string,
  preferLight: boolean = false
): string => {
  // Simple contrast calculation - in real app, use a proper contrast ratio library
  const isDarkBackground = backgroundColor.toLowerCase() === '#000000' ||
    backgroundColor.toLowerCase().startsWith('#1') ||
    backgroundColor.toLowerCase().startsWith('#2') ||
    backgroundColor.toLowerCase().startsWith('#3');

  if (preferLight) {
    return isDarkBackground ? textColors.inverse : textColors.secondary;
  }

  return isDarkBackground ? textColors.inverse : textColors.primary;
};

// Typography style presets for common use cases
export const typographyPresets = {
  // Display text
  display: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: 'bold' as const,
    letterSpacing: -1,
    color: textColors.primary,
  },

  // Hero title
  heroTitle: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: 'bold' as const,
    letterSpacing: -0.75,
    color: textColors.primary,
  },

  // Card title
  cardTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 'semibold' as const,
    letterSpacing: 0,
    color: textColors.primary,
  },

  // Card description
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'regular' as const,
    letterSpacing: 0,
    color: textColors.secondary,
  },

  // Navigation title
  navTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'semibold' as const,
    letterSpacing: 0,
    color: textColors.primary,
  },

  // Tab label
  tabLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'medium' as const,
    letterSpacing: 0.25,
    color: textColors.secondary,
  },

  // Button text
  buttonText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 'semibold' as const,
    letterSpacing: 0,
    color: textColors.inverse,
  },

  // Input placeholder
  inputPlaceholder: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'regular' as const,
    letterSpacing: 0,
    color: textColors.tertiary,
  },

  // Error message
  errorMessage: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'medium' as const,
    letterSpacing: 0,
    color: textColors.error,
  },

  // Success message
  successMessage: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'medium' as const,
    letterSpacing: 0,
    color: textColors.success,
  },
} as const;

export default useTypographyStyles;