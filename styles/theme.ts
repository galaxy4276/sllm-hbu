import { TextStyle, ViewStyle } from 'react-native';

// Primary color as specified
export const PRIMARY_COLOR = '#59AC77';

// Color palette
export const colors = {
  primary: PRIMARY_COLOR,
  primaryDark: '#4A8F62',
  primaryLight: '#6FBE8A',

  secondary: '#6B7280',
  secondaryDark: '#4B5563',
  secondaryLight: '#9CA3AF',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  background: '#FFFFFF',
  backgroundSecondary: '#F3F4F6',
  backgroundTertiary: '#E5E7EB',

  // Comfortable text colors - easier on the eyes
  text: '#2D3748',           // Soft black (instead of pure #111827)
  textSecondary: '#4A5568',   // Muted secondary
  textTertiary: '#718096',    // Light tertiary
  textInverse: '#FFFFFF',     // White for dark backgrounds
  textAccent: '#59AC77',      // Primary brand color
  textMuted: '#A0AEC0',       // Very muted text

  // Additional semantic colors
  textSuccess: '#22543D',     // Dark green
  textWarning: '#744210',     // Dark yellow
  textError: '#742A2A',       // Dark red
  textInfo: '#2C5282',        // Dark blue

  border: '#E5E7EB',
  borderDark: '#D1D5DB',

  transparent: 'transparent',
} as const;

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Typography
export const typography = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  base: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 20, lineHeight: 30 },
  '2xl': { fontSize: 24, lineHeight: 36 },
  '3xl': { fontSize: 30, lineHeight: 45 },
} as const;

// Pretendard font weights mapping
export const fontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
} as const;

// Pretendard font families (OTF files)
export const fontFamilies = {
  thin: 'Pretendard-Thin',
  extralight: 'Pretendard-ExtraLight',
  light: 'Pretendard-Light',
  regular: 'Pretendard-Regular',
  medium: 'Pretendard-Medium',
  semibold: 'Pretendard-SemiBold',
  bold: 'Pretendard-Bold',
  black: 'Pretendard-Black',
} as const;

// Letter spacing values
export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
} as const;

// Typography variants with comfortable sizing
export const typographyVariants = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 'bold' as const,
    letterSpacing: -0.5,
    marginTop: 0,
    marginBottom: 16,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: 'bold' as const,
    letterSpacing: -0.25,
    marginTop: 24,
    marginBottom: 12,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'semibold' as const,
    letterSpacing: 0,
    marginTop: 20,
    marginBottom: 8,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 'semibold' as const,
    letterSpacing: 0,
    marginTop: 16,
    marginBottom: 8,
  },
  h5: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'medium' as const,
    letterSpacing: 0,
    marginTop: 12,
    marginBottom: 6,
  },
  h6: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 'medium' as const,
    letterSpacing: 0,
    marginTop: 8,
    marginBottom: 4,
  },
  p: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'regular' as const,
    letterSpacing: 0,
    marginTop: 0,
    marginBottom: 12,
  },
  lead: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: 'regular' as const,
    letterSpacing: 0,
    marginTop: 0,
    marginBottom: 16,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'regular' as const,
    letterSpacing: 0,
    marginTop: 0,
    marginBottom: 8,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'regular' as const,
    letterSpacing: 0,
    marginTop: 0,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'medium' as const,
    letterSpacing: 0,
    marginTop: 0,
    marginBottom: 4,
  },
  span: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'inherit' as const,
    letterSpacing: 0,
    marginTop: 0,
    marginBottom: 0,
  },
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Shadow presets
export const shadows = {
  none: {},
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
} as const;

// Z-index scale
export const zIndex = {
  base: 0,
  overlay: 10,
  modal: 100,
  toast: 200,
  tooltip: 300,
} as const;

// Opacity scale
export const opacity = {
  transparent: 0,
  light: 0.1,
  medium: 0.5,
  heavy: 0.75,
  opaque: 1,
} as const;

// Breakpoints (for responsive design if needed)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// Animation durations
export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Typography text color mapping
export const textColors = {
  primary: colors.text,
  secondary: colors.textSecondary,
  tertiary: colors.textTertiary,
  accent: colors.textAccent,
  muted: colors.textMuted,
  success: colors.textSuccess,
  warning: colors.textWarning,
  error: colors.textError,
  info: colors.textInfo,
  inverse: colors.textInverse,
  inherit: 'inherit',
} as const;

export type ThemeType = {
  colors: typeof colors;
  spacing: typeof spacing;
  typography: typeof typography;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  zIndex: typeof zIndex;
  opacity: typeof opacity;
  breakpoints: typeof breakpoints;
  animation: typeof animation;
  fontWeights: typeof fontWeights;
  fontFamilies: typeof fontFamilies;
  letterSpacing: typeof letterSpacing;
  typographyVariants: typeof typographyVariants;
  textColors: typeof textColors;
};

export const theme: ThemeType = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  zIndex,
  opacity,
  breakpoints,
  animation,
  fontWeights,
  fontFamilies,
  letterSpacing,
  typographyVariants,
  textColors,
};

// Default theme context value
export const defaultTheme = theme;