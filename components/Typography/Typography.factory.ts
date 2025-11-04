import React from 'react';
import { TypographyProps, TypographyFactoryConfig, TypographyVariant, TypographyWeight, TypographyColor } from '../../types/typography';
import Typography from './Typography';

// Factory function to create customized typography variants
export const createTypographyVariant = (config: TypographyFactoryConfig) => {
  const {
    defaultVariant = 'p',
    defaultWeight = 'regular',
    defaultColor = 'primary',
    customTheme,
    customVariants,
  } = config;

  // Return a new component with default props
  const CustomTypography = React.forwardRef<any, Omit<TypographyProps, 'variant' | 'weight' | 'color'>>((props, ref) => {
    return (
      <Typography
        ref={ref}
        variant={props.variant || defaultVariant}
        weight={props.weight || defaultWeight}
        color={props.color || defaultColor}
        {...props}
      />
    );
  });

  CustomTypography.displayName = `CustomTypography(${defaultVariant}-${defaultWeight}-${defaultColor})`;

  return CustomTypography;
};

// Pre-configured typography variants
export const H1 = createTypographyVariant({
  defaultVariant: 'h1',
  defaultWeight: 'bold',
  defaultColor: 'primary',
});

export const H2 = createTypographyVariant({
  defaultVariant: 'h2',
  defaultWeight: 'bold',
  defaultColor: 'primary',
});

export const H3 = createTypographyVariant({
  defaultVariant: 'h3',
  defaultWeight: 'semibold',
  defaultColor: 'primary',
});

export const H4 = createTypographyVariant({
  defaultVariant: 'h4',
  defaultWeight: 'semibold',
  defaultColor: 'primary',
});

export const Body = createTypographyVariant({
  defaultVariant: 'p',
  defaultWeight: 'regular',
  defaultColor: 'primary',
});

export const Lead = createTypographyVariant({
  defaultVariant: 'lead',
  defaultWeight: 'regular',
  defaultColor: 'secondary',
});

export const Small = createTypographyVariant({
  defaultVariant: 'small',
  defaultWeight: 'regular',
  defaultColor: 'secondary',
});

export const Caption = createTypographyVariant({
  defaultVariant: 'caption',
  defaultWeight: 'regular',
  defaultColor: 'tertiary',
});

export const Label = createTypographyVariant({
  defaultVariant: 'label',
  defaultWeight: 'medium',
  defaultColor: 'primary',
});

// Specialized typography components
export const DisplayText = createTypographyVariant({
  defaultVariant: 'h1',
  defaultWeight: 'bold',
  defaultColor: 'primary',
});

export const ErrorMessage = createTypographyVariant({
  defaultVariant: 'small',
  defaultWeight: 'medium',
  defaultColor: 'error',
});

export const SuccessMessage = createTypographyVariant({
  defaultVariant: 'small',
  defaultWeight: 'medium',
  defaultColor: 'success',
});

export const WarningMessage = createTypographyVariant({
  defaultVariant: 'small',
  defaultWeight: 'medium',
  defaultColor: 'warning',
});

export const InfoMessage = createTypographyVariant({
  defaultVariant: 'small',
  defaultWeight: 'medium',
  defaultColor: 'info',
});

// Utility functions for typography
export const TypographyUtils = {
  // Create a responsive typography component
  createResponsive: (baseVariant: TypographyVariant, breakpoints: {
    small?: TypographyVariant;
    medium?: TypographyVariant;
    large?: TypographyVariant;
  }) => {
    return React.forwardRef<any, TypographyProps & { screenWidth?: number }>((props, ref) => {
      const { screenWidth, variant = baseVariant, ...rest } = props;

      let selectedVariant = variant;
      if (screenWidth) {
        if (screenWidth < 375 && breakpoints.small) {
          selectedVariant = breakpoints.small;
        } else if (screenWidth >= 768 && breakpoints.large) {
          selectedVariant = breakpoints.large;
        } else if (screenWidth >= 375 && breakpoints.medium) {
          selectedVariant = breakpoints.medium;
        }
      }

      return <Typography ref={ref} variant={selectedVariant} {...rest} />;
    });
  },

  // Create a typography component with custom styling
  createStyled: (customStyles: React.CSSProperties) => {
    return React.forwardRef<any, TypographyProps>((props, ref) => {
      return <Typography ref={ref} style={customStyles} {...props} />;
    });
  },

  // Create a typography component with custom font
  createCustomFont: (fontFamily: string) => {
    return React.forwardRef<any, TypographyProps>((props, ref) => {
      return <Typography ref={ref} fontFamily={fontFamily} {...props} />;
    });
  },
};

// Typography context for theme management
export const TypographyContext = React.createContext<{
  theme?: any;
  fontFamily?: string;
  customColors?: Record<string, string>;
}>({});

// Hook to use typography context
export const useTypographyContext = () => {
  const context = React.useContext(TypographyContext);
  if (!context) {
    return {
      theme: undefined,
      fontFamily: undefined,
      customColors: undefined,
    };
  }
  return context;
};

// Typography provider component
export const TypographyProvider: React.FC<{
  theme?: any;
  fontFamily?: string;
  customColors?: Record<string, string>;
  children: React.ReactNode;
}> = ({ theme, fontFamily, customColors, children }) => {
  const value = {
    theme,
    fontFamily,
    customColors,
  };

  return (
    <TypographyContext.Provider value={value}>
      {children}
    </TypographyContext.Provider>
  );
};

// Higher-order component for theming
export const withTypographyTheme = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return React.forwardRef<any, P>((props, ref) => {
    const { fontFamily, customColors } = useTypographyContext();

    return (
      <WrappedComponent
        ref={ref}
        fontFamily={fontFamily}
        color={customColors?.primary}
        {...props}
      />
    );
  });
};

// Usage example:
/*
// Responsive typography
const ResponsiveTitle = TypographyUtils.createResponsive('h2', {
  small: 'h4',
  medium: 'h3',
  large: 'h1',
});

// Custom styled typography
const CustomTitle = TypographyUtils.createStyled({
  fontSize: 24,
  fontWeight: 'bold',
  color: '#custom-color',
});

// Custom font typography
const CustomFontText = TypographyUtils.createCustomFont('Custom-Font');

// With context
<TypographyProvider fontFamily="Custom-Font" customColors={{ primary: '#59AC77' }}>
  <Typography>This will use custom font and color</Typography>
</TypographyProvider>
*/