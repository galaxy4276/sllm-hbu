import { ReactNode, TextStyle } from 'react-native';

// Typography variants
export type TypographyVariant =
  | 'h1'    // Large headlines
  | 'h2'    // Page titles
  | 'h3'    // Section titles
  | 'h4'    // Subsection titles
  | 'h5'    // Small titles
  | 'h6'    // Micro titles
  | 'p'     // Body text
  | 'lead'  // Lead paragraph
  | 'small' // Small text
  | 'caption' // Caption text
  | 'label' // Form labels
  | 'span'; // Inline text

// Typography weights (matching Pretendard font weights)
export type TypographyWeight =
  | 'thin'       // 100
  | 'extralight' // 200
  | 'light'      // 300
  | 'regular'    // 400
  | 'medium'     // 500
  | 'semibold'   // 600
  | 'bold'       // 700
  | 'black';     // 900

// Typography colors (comfortable color palette)
export type TypographyColor =
  | 'primary'    // Main text color
  | 'secondary'  // Secondary text
  | 'tertiary'   // Tertiary text
  | 'accent'     // Accent color
  | 'success'    // Success state
  | 'warning'    // Warning state
  | 'error'      // Error state
  | 'info'       // Info state
  | 'inverse'    // For dark backgrounds
  | 'inherit';   // Inherit from parent

// Text alignment options
export type TextAlignment = 'auto' | 'left' | 'right' | 'center' | 'justify';

// Text decoration options
export type TextDecoration = 'none' | 'underline' | 'line-through' | 'underline line-through';

// Text transform options
export type TextTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase';

// Typography display options
export type TypographyDisplay =
  | 'block'      // Default block display
  | 'inline'     // Inline display
  | 'flex';      // Flex display

// Typography component props
export interface TypographyProps {
  children: ReactNode;
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  color?: TypographyColor;
  align?: TextAlignment;
  decoration?: TextDecoration;
  transform?: TextTransform;
  display?: TypographyDisplay;
  numberOfLines?: number;
  selectable?: boolean;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  testID?: string;
  style?: TextStyle;
  className?: string;
  // Accessibility props
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  // Custom font family override
  fontFamily?: string;
}

// Typography variant configuration
export interface TypographyVariantConfig {
  fontSize: number;
  lineHeight: number;
  fontWeight: TypographyWeight;
  letterSpacing?: number;
  marginTop?: number;
  marginBottom?: number;
}

// Typography theme configuration
export interface TypographyTheme {
  colors: Record<TypographyColor, string>;
  variants: Record<TypographyVariant, TypographyVariantConfig>;
  fontWeights: Record<TypographyWeight, number>;
  fontFamilies: Record<TypographyWeight, string>;
  letterSpacing: Record<string, number>;
  lineHeights: Record<string, number>;
}

// Typography style configuration
export interface TypographyStyles {
  container: TextStyle;
  text: TextStyle;
}

// Typography factory configuration
export interface TypographyFactoryConfig {
  defaultVariant?: TypographyVariant;
  defaultWeight?: TypographyWeight;
  defaultColor?: TypographyColor;
  customTheme?: Partial<TypographyTheme>;
  customVariants?: Record<string, TypographyVariantConfig>;
}

// Typography context value
export interface TypographyContextValue {
  theme: TypographyTheme;
  config: TypographyFactoryConfig;
  updateTheme?: (theme: Partial<TypographyTheme>) => void;
}

// Export all typography related types
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
};