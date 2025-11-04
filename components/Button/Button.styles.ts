import { useMemo } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, typographyVariants, fontWeights } from '../../styles/theme';
import { ButtonSize, ButtonVariant, ButtonShape, ButtonState, ButtonStyles, ButtonTheme } from '../../types/button';

// Size configurations integrated with typography system
const sizeConfig = {
  sm: {
    height: 32,
    paddingHorizontal: spacing.sm,
    typographyVariant: 'small' as const,
    iconSize: 14,
  },
  md: {
    height: 44,
    paddingHorizontal: spacing.md,
    typographyVariant: 'p' as const,
    iconSize: 16,
  },
  lg: {
    height: 56,
    paddingHorizontal: spacing.lg,
    typographyVariant: 'lead' as const,
    iconSize: 20,
  },
} as const;

// Button theme configurations
export const buttonTheme: ButtonTheme = {
  primary: {
    default: {
      container: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        borderWidth: 1,
      },
      text: {
        color: colors.textInverse,
        fontWeight: fontWeights.semibold,
      },
    },
    pressed: {
      container: {
        backgroundColor: colors.primaryDark,
        borderColor: colors.primaryDark,
        transform: [{ scale: 0.98 }],
      },
      text: {
        color: colors.textInverse,
      },
    },
    disabled: {
      container: {
        backgroundColor: colors.border,
        borderColor: colors.border,
        opacity: 0.6,
      },
      text: {
        color: colors.textSecondary,
      },
    },
  },
  secondary: {
    default: {
      container: {
        backgroundColor: 'transparent',
        borderColor: colors.primary,
        borderWidth: 1,
      },
      text: {
        color: colors.primary,
        fontWeight: fontWeights.semibold,
      },
    },
    pressed: {
      container: {
        backgroundColor: colors.primary + '10', // 10% opacity
        borderColor: colors.primaryDark,
        transform: [{ scale: 0.98 }],
      },
      text: {
        color: colors.primaryDark,
      },
    },
    disabled: {
      container: {
        backgroundColor: 'transparent',
        borderColor: colors.border,
        opacity: 0.6,
      },
      text: {
        color: colors.textTertiary,
      },
    },
  },
  ghost: {
    default: {
      container: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 1,
      },
      text: {
        color: colors.primary,
        fontWeight: fontWeights.semibold,
      },
    },
    pressed: {
      container: {
        backgroundColor: colors.primary + '15', // 15% opacity
        borderColor: 'transparent',
        transform: [{ scale: 0.98 }],
      },
      text: {
        color: colors.primaryDark,
      },
    },
    disabled: {
      container: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        opacity: 0.6,
      },
      text: {
        color: colors.textTertiary,
      },
    },
  },
} as const;

// Hook to get button styles based on props
export const useButtonStyles = (
  size: ButtonSize,
  variant: ButtonVariant,
  shape: ButtonShape,
  state: ButtonState,
  disabled?: boolean,
  loading?: boolean,
  fullWidth?: boolean,
  customStyle?: ViewStyle,
  customTextStyle?: TextStyle
): ButtonStyles => {
  return useMemo(() => {
    const baseSize = sizeConfig[size];
    const themeVariant = buttonTheme[variant];
    const themeState = disabled ? 'disabled' : state === 'pressed' ? 'pressed' : 'default';
    const currentTheme = themeVariant[themeState];

    // Container styles
    const container: ViewStyle = {
      height: baseSize.height,
      paddingHorizontal: baseSize.paddingHorizontal,
      borderRadius: shape === 'rounded' ? borderRadius.full : borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: baseSize.height * 2, // Ensure minimum touch target
      ...currentTheme.container,
      ...(fullWidth && { width: '100%' }),
      ...(loading && { opacity: 0.7 }),
      ...customStyle,
    };

    // Get typography variant configuration
    const typographyConfig = typographyVariants[baseSize.typographyVariant];

    // Text styles - integrated with typography system
    const text: TextStyle = {
      fontSize: typographyConfig.fontSize,
      lineHeight: typographyConfig.lineHeight,
      textAlign: 'center',
      ...currentTheme.text,
      ...(loading && { opacity: 0 }),
      ...customTextStyle,
    };

    // Icon styles
    const icon: TextStyle = {
      fontSize: baseSize.iconSize,
      ...currentTheme.text,
    };

    // Loading spinner styles
    const loadingSpinner: ViewStyle = {
      position: 'absolute',
      width: baseSize.iconSize,
      height: baseSize.iconSize,
    };

    return {
      container,
      text,
      icon,
      loading: loadingSpinner,
    };
  }, [size, variant, shape, state, disabled, loading, fullWidth, customStyle, customTextStyle]);
};

// Helper function to get shape border radius
export const getShapeBorderRadius = (shape: ButtonShape, size: ButtonSize): number => {
  if (shape === 'rounded') {
    return sizeConfig[size].height / 2;
  }
  return borderRadius.md;
};

// Export size config for external use
export { sizeConfig };