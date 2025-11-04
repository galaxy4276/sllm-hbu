// Main Typography component
export { default } from './Typography';
export { default as Typography } from './Typography';

// Typography Provider
export { TypographyProvider } from './TypographyProvider';
export { usePretendardFonts, useEssentialFonts } from '../../hooks/useFonts';

// Pre-configured variants
export {
  H1,
  H2,
  H3,
  H4,
  Body,
  Lead,
  Small,
  Caption,
  Label,
  DisplayText,
  ErrorMessage,
  SuccessMessage,
  WarningMessage,
  InfoMessage,
} from './Typography.factory';

// Factory utilities
export {
  createTypographyVariant,
  TypographyUtils,
  TypographyProvider,
  TypographyContext,
  useTypographyContext,
  withTypographyTheme,
} from './Typography.factory';

// Styles and utilities
export {
  useTypographyStyles,
  getResponsiveFontSize,
  calculateLineHeight,
  getOptimalLetterSpacing,
  createCustomVariant,
  getAdaptiveTextColor,
  typographyPresets,
} from './Typography.styles';

// Types
export type {
  TypographyProps,
  TypographyVariant,
  TypographyWeight,
  TypographyColor,
  TextAlignment,
  TextDecoration,
  TextTransform,
  TypographyDisplay,
  TypographyVariantConfig,
  TypographyTheme,
  TypographyStyles,
  TypographyFactoryConfig,
  TypographyContextValue,
} from '../../types/typography';