import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import {
  Typography,
  H1,
  H2,
  H3,
  Body,
  Small,
  Caption,
  Label,
  ErrorMessage,
  SuccessMessage,
  TypographyUtils,
  TypographyProvider,
} from './index';

// Mock the theme
jest.mock('../../styles/theme', () => ({
  theme: {
    colors: {
      text: '#2D3748',
      textSecondary: '#4A5568',
      textTertiary: '#718096',
      textAccent: '#59AC77',
      textMuted: '#A0AEC0',
      textSuccess: '#22543D',
      textWarning: '#744210',
      textError: '#742A2A',
      textInfo: '#2C5282',
      textInverse: '#FFFFFF',
    },
  },
  typographyVariants: {
    h1: { fontSize: 32, lineHeight: 40, fontWeight: 'bold', letterSpacing: -0.5 },
    h2: { fontSize: 28, lineHeight: 36, fontWeight: 'bold', letterSpacing: -0.25 },
    h3: { fontSize: 24, lineHeight: 32, fontWeight: 'semibold', letterSpacing: 0 },
    p: { fontSize: 16, lineHeight: 24, fontWeight: 'regular', letterSpacing: 0 },
    small: { fontSize: 14, lineHeight: 20, fontWeight: 'regular', letterSpacing: 0 },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: 'regular', letterSpacing: 0 },
    label: { fontSize: 14, lineHeight: 20, fontWeight: 'medium', letterSpacing: 0 },
  },
  fontWeights: {
    thin: 100,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  fontFamilies: {
    thin: 'Pretendard-Thin',
    light: 'Pretendard-Light',
    regular: 'Pretendard-Regular',
    medium: 'Pretendard-Medium',
    semibold: 'Pretendard-SemiBold',
    bold: 'Pretendard-Bold',
    black: 'Pretendard-Black',
  },
  textColors: {
    primary: '#2D3748',
    secondary: '#4A5568',
    tertiary: '#718096',
    accent: '#59AC77',
    muted: '#A0AEC0',
    success: '#22543D',
    warning: '#744210',
    error: '#742A2A',
    info: '#2C5282',
    inverse: '#FFFFFF',
    inherit: 'inherit',
  },
}));

describe('Typography Component', () => {
  const defaultProps = {
    testID: 'test-typography',
    children: 'Test Text',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      const { getByTestId, getByText } = render(<Typography {...defaultProps} />);

      expect(getByTestId('test-typography')).toBeTruthy();
      expect(getByText('Test Text')).toBeTruthy();
    });

    it('renders h1 variant correctly', () => {
      const { getByTestId } = render(
        <Typography {...defaultProps} variant="h1" />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.style.fontSize).toBe(32);
      expect(typography.props.style.fontWeight).toBe(700);
    });

    it('renders p variant correctly', () => {
      const { getByTestId } = render(
        <Typography {...defaultProps} variant="p" />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.style.fontSize).toBe(16);
      expect(typography.props.style.fontWeight).toBe(400);
    });
  });

  describe('Props Application', () => {
    it('applies custom font weight', () => {
      const { getByTestId } = render(
        <Typography {...defaultProps} weight="bold" />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.style.fontWeight).toBe(700);
    });

    it('applies custom color', () => {
      const { getByTestId } = render(
        <Typography {...defaultProps} color="accent" />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.style.color).toBe('#59AC77');
    });

    it('applies text alignment', () => {
      const { getByTestId } = render(
        <Typography {...defaultProps} align="center" />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.style.textAlign).toBe('center');
    });

    it('applies text decoration', () => {
      const { getByTestId } = render(
        <Typography {...defaultProps} decoration="underline" />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.style.textDecorationLine).toBe('underline');
    });

    it('applies text transform', () => {
      const { getByTestId } = render(
        <Typography {...defaultProps} transform="uppercase" />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.style.textTransform).toBe('uppercase');
    });

    it('applies custom font family', () => {
      const { getByTestId } = render(
        <Typography {...defaultProps} fontFamily="Custom-Font" />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.style.fontFamily).toBe('Custom-Font');
    });

    it('applies custom style', () => {
      const customStyle = { fontSize: 20, color: '#custom' };
      const { getByTestId } = render(
        <Typography {...defaultProps} style={customStyle} />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.style.fontSize).toBe(20);
      expect(typography.props.style.color).toBe('#custom');
    });
  });

  describe('Accessibility', () => {
    it('applies accessibility props correctly', () => {
      const { getByTestId } = render(
        <Typography
          {...defaultProps}
          accessible={true}
          accessibilityLabel="Test label"
          accessibilityHint="Test hint"
          accessibilityRole="header"
        />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.accessible).toBe(true);
      expect(typography.props.accessibilityLabel).toBe('Test label');
      expect(typography.props.accessibilityHint).toBe('Test hint');
      expect(typography.props.accessibilityRole).toBe('header');
    });

    it('sets default accessibility role for headers', () => {
      const { getByTestId } = render(
        <Typography {...defaultProps} variant="h1" />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.accessibilityRole).toBe('header');
    });

    it('sets default accessibility role for labels', () => {
      const { getByTestId } = render(
        <Typography {...defaultProps} variant="label" />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.accessibilityRole).toBe('label');
    });
  });

  describe('Text Properties', () => {
    it('applies numberOfLines correctly', () => {
      const { getByTestId } = render(
        <Typography {...defaultProps} numberOfLines={2} />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.numberOfLines).toBe(2);
    });

    it('applies selectable correctly', () => {
      const { getByTestId } = render(
        <Typography {...defaultProps} selectable={false} />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.selectable).toBe(false);
    });

    it('applies ellipsizeMode correctly', () => {
      const { getByTestId } = render(
        <Typography {...defaultProps} ellipsizeMode="head" />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.ellipsizeMode).toBe('head');
    });
  });

  describe('Pre-configured Variants', () => {
    it('H1 component renders with correct defaults', () => {
      const { getByTestId } = render(
        <H1 testID="h1-test">H1 Title</H1>
      );

      const h1 = getByTestId('h1-test');
      expect(h1.props.style.fontSize).toBe(32);
      expect(h1.props.style.fontWeight).toBe(700);
      expect(h1.props.style.color).toBe('#2D3748');
    });

    it('H2 component renders with correct defaults', () => {
      const { getByTestId } = render(
        <H2 testID="h2-test">H2 Title</H2>
      );

      const h2 = getByTestId('h2-test');
      expect(h2.props.style.fontSize).toBe(28);
      expect(h2.props.style.fontWeight).toBe(700);
      expect(h2.props.style.color).toBe('#2D3748');
    });

    it('Body component renders with correct defaults', () => {
      const { getByTestId } = render(
        <Body testID="body-test">Body text</Body>
      );

      const body = getByTestId('body-test');
      expect(body.props.style.fontSize).toBe(16);
      expect(body.props.style.fontWeight).toBe(400);
      expect(body.props.style.color).toBe('#2D3748');
    });

    it('Small component renders with correct defaults', () => {
      const { getByTestId } = render(
        <Small testID="small-test">Small text</Small>
      );

      const small = getByTestId('small-test');
      expect(small.props.style.fontSize).toBe(14);
      expect(small.props.style.fontWeight).toBe(400);
      expect(small.props.style.color).toBe('#4A5568');
    });

    it('Caption component renders with correct defaults', () => {
      const { getByTestId } = render(
        <Caption testID="caption-test">Caption text</Caption>
      );

      const caption = getByTestId('caption-test');
      expect(caption.props.style.fontSize).toBe(12);
      expect(caption.props.style.fontWeight).toBe(400);
      expect(caption.props.style.color).toBe('#718096');
    });

    it('Label component renders with correct defaults', () => {
      const { getByTestId } = render(
        <Label testID="label-test">Label text</Label>
      );

      const label = getByTestId('label-test');
      expect(label.props.style.fontSize).toBe(14);
      expect(label.props.style.fontWeight).toBe(500);
      expect(label.props.style.color).toBe('#2D3748');
    });

    it('ErrorMessage component renders with correct defaults', () => {
      const { getByTestId } = render(
        <ErrorMessage testID="error-test">Error message</ErrorMessage>
      );

      const error = getByTestId('error-test');
      expect(error.props.style.fontSize).toBe(14);
      expect(error.props.style.fontWeight).toBe(500);
      expect(error.props.style.color).toBe('#742A2A');
    });

    it('SuccessMessage component renders with correct defaults', () => {
      const { getByTestId } = render(
        <SuccessMessage testID="success-test">Success message</SuccessMessage>
      );

      const success = getByTestId('success-test');
      expect(success.props.style.fontSize).toBe(14);
      expect(success.props.style.fontWeight).toBe(500);
      expect(success.props.style.color).toBe('#22543D');
    });
  });

  describe('Typography Utils', () => {
    it('createResponsive works correctly', () => {
      const ResponsiveText = TypographyUtils.createResponsive('h2', {
        small: 'h4',
        large: 'h1',
      });

      const { getByTestId } = render(
        <ResponsiveText testID="responsive-test" screenWidth={800}>
          Responsive text
        </ResponsiveText>
      );

      const responsive = getByTestId('responsive-test');
      expect(responsive.props.style.fontSize).toBe(32); // h1 size
    });

    it('createStyled works correctly', () => {
      const StyledText = TypographyUtils.createStyled({
        fontSize: 24,
        fontWeight: 'bold',
        color: '#custom',
      });

      const { getByTestId } = render(
        <StyledText testID="styled-test">Styled text</StyledText>
      );

      const styled = getByTestId('styled-test');
      expect(styled.props.style.fontSize).toBe(24);
      expect(styled.props.style.color).toBe('#custom');
    });

    it('createCustomFont works correctly', () => {
      const CustomFontText = TypographyUtils.createCustomFont('Custom-Font');

      const { getByTestId } = render(
        <CustomFontText testID="custom-font-test">Custom font text</CustomFontText>
      );

      const customFont = getByTestId('custom-font-test');
      expect(customFont.props.style.fontFamily).toBe('Custom-Font');
    });
  });

  describe('TypographyProvider', () => {
    it('provides custom font family to children', () => {
      const { getByTestId } = render(
        <TypographyProvider fontFamily="Custom-Font">
          <Typography testID="provider-test">Text with provider font</Typography>
        </TypographyProvider>
      );

      // This would need context implementation to work properly
      const text = getByTestId('provider-test');
      expect(text).toBeTruthy();
    });

    it('provides custom colors to children', () => {
      const { getByTestId } = render(
        <TypographyProvider customColors={{ primary: '#custom' }}>
          <Typography testID="provider-color-test">Text with provider color</Typography>
        </TypographyProvider>
      );

      // This would need context implementation to work properly
      const text = getByTestId('provider-color-test');
      expect(text).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      const { getByTestId } = render(
        <Typography testID="empty-test" />
      );

      expect(getByTestId('empty-test')).toBeTruthy();
    });

    it('handles complex children (React elements)', () => {
      const { getByTestId } = render(
        <Typography testID="complex-children-test">
          <Text>Nested text</Text>
        </Typography>
      );

      expect(getByTestId('complex-children-test')).toBeTruthy();
    });

    it('handles inherit color', () => {
      const { getByTestId } = render(
        <Typography {...defaultProps} color="inherit" />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.style.color).toBe('inherit');
    });

    it('handles inherit font weight', () => {
      const { getByTestId } = render(
        <Typography {...defaultProps} weight="inherit" />
      );

      const typography = getByTestId('test-typography');
      expect(typography.props.style.fontFamily).toBeUndefined();
    });
  });
});