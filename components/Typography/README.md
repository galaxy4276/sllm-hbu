# Typography Component

A comprehensive typography system built with React Native, featuring Pretendard font family, multiple variants, comfortable color palette, and extensive customization options.

## Features

- 🎨 **Pretendard Font**: Optimal Korean typography with multiple weights
- 📝 **Multiple Variants**: h1-h6, p, lead, small, caption, label, span
- 🌈 **Comfortable Colors**: Eye-friendly color palette instead of harsh black
- ⚖️ **Typography Scale**: Consistent sizing and spacing system
- 🎯 **Semantic Colors**: Success, warning, error, info variants
- 📱 **Responsive Design**: Screen size-based typography scaling
- ♿ **Accessibility**: Full accessibility support with proper roles
- 🎛️ **Customization**: Extensive styling and theming options
- 🔧 **Factory Pattern**: Easy creation of custom variants

## Installation

The typography component requires Pretendard font files to be installed in your project:

### 1. Download Pretendard Font

```bash
# Create fonts directory
mkdir -p assets/fonts

# Download font files
curl -o assets/fonts/Pretendard-Regular.ttf "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-regular.ttf"
curl -o assets/fonts/Pretendard-Medium.ttf "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-medium.ttf"
curl -o assets/fonts/Pretendard-Bold.ttf "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-bold.ttf"
curl -o assets/fonts/Pretendard-Light.ttf "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-light.ttf"
```

### 2. Configure React Native

For **Expo**, add to `app.json`:
```json
{
  "expo": {
    "fonts": [
      "./assets/fonts/Pretendard-Thin.ttf",
      "./assets/fonts/Pretendard-ExtraLight.ttf",
      "./assets/fonts/Pretendard-Light.ttf",
      "./assets/fonts/Pretendard-Regular.ttf",
      "./assets/fonts/Pretendard-Medium.ttf",
      "./assets/fonts/Pretendard-SemiBold.ttf",
      "./assets/fonts/Pretendard-Bold.ttf",
      "./assets/fonts/Pretendard-Black.ttf"
    ]
  }
}
```

For **React Native CLI**, add to `package.json`:
```json
{
  "react-native": {
    "assets": ["./assets/fonts/"]
  }
}
```

### 3. Link fonts
```bash
# For React Native CLI
npx react-native link

# For Expo, fonts are automatically linked
```

## Quick Start

```tsx
import { Typography, H1, H2, Body, Small } from './components/Typography';

export default function App() {
  return (
    <>
      <H1>Main Title</H1>
      <H2>Section Title</H2>
      <Body>Body text content</Body>
      <Small>Small caption text</Small>
    </>
  );
}
```

## API Reference

### Typography Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Text content |
| `variant` | `TypographyVariant` | `'p'` | Typography variant |
| `weight` | `TypographyWeight` | - | Font weight override |
| `color` | `TypographyColor` | `'primary'` | Text color |
| `align` | `TextAlignment` | `'auto'` | Text alignment |
| `decoration` | `TextDecoration` | `'none'` | Text decoration |
| `transform` | `TextTransform` | `'none'` | Text transformation |
| `display` | `TypographyDisplay` | `'block'` | Display type |
| `numberOfLines` | `number` | - | Max lines |
| `selectable` | `boolean` | `true` | Text selection |
| `ellipsizeMode` | `string` | `'tail'` | Text truncation |
| `fontFamily` | `string` | - | Custom font family |
| `style` | `TextStyle` | - | Custom style |
| `accessible` | `boolean` | `true` | Accessibility |
| `accessibilityLabel` | `string` | - | Accessibility label |
| `accessibilityHint` | `string` | - | Accessibility hint |
| `accessibilityRole` | `string` | - | Accessibility role |

### Type Definitions

```tsx
type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'lead' | 'small' | 'caption' | 'label' | 'span';

type TypographyWeight = 'thin' | 'extralight' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'black';

type TypographyColor = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'muted' | 'success' | 'warning' | 'error' | 'info' | 'inverse' | 'inherit';
```

## Typography Variants

### Headings
```tsx
<Typography variant="h1">H1 - Main Title (32px)</Typography>
<Typography variant="h2">H2 - Page Title (28px)</Typography>
<Typography variant="h3">H3 - Section Title (24px)</Typography>
<Typography variant="h4">H4 - Subsection Title (20px)</Typography>
<Typography variant="h5">H5 - Small Title (18px)</Typography>
<Typography variant="h6">H6 - Micro Title (16px)</Typography>
```

### Body Text
```tsx
<Typography variant="lead">Lead paragraph (18px)</Typography>
<Typography variant="p">Body text (16px)</Typography>
<Typography variant="small">Small text (14px)</Typography>
<Typography variant="caption">Caption text (12px)</Typography>
<Typography variant="label">Form label (14px)</Typography>
```

### Pre-configured Components
```tsx
<H1>Pre-configured H1</H1>
<H2>Pre-configured H2</H2>
<Body>Pre-configured body text</Body>
<Small>Pre-configured small text</Small>
<Caption>Pre-configured caption</Caption>
<Label>Pre-configured label</Label>
```

## Color System

### Comfortable Text Colors
- **Primary**: `#2D3748` - Soft black (easy on eyes)
- **Secondary**: `#4A5568` - Muted secondary
- **Tertiary**: `#718096` - Light tertiary
- **Accent**: `#59AC77` - Brand primary
- **Muted**: `#A0AEC0` - Very muted

### Semantic Colors
- **Success**: `#22543D` - Success messages
- **Warning**: `#744210` - Warning messages
- **Error**: `#742A2A` - Error messages
- **Info**: `#2C5282` - Information messages

```tsx
<Typography color="primary">Primary text</Typography>
<Typography color="secondary">Secondary text</Typography>
<Typography color="accent">Accent text</Typography>
<Typography color="success">Success message</Typography>
<Typography color="error">Error message</Typography>
```

## Font Weights

Pretendard supports 8 font weights:

```tsx
<Typography weight="thin">Thin (100)</Typography>
<Typography weight="light">Light (300)</Typography>
<Typography weight="regular">Regular (400)</Typography>
<Typography weight="medium">Medium (500)</Typography>
<Typography weight="semibold">SemiBold (600)</Typography>
<Typography weight="bold">Bold (700)</Typography>
<Typography weight="black">Black (900)</Typography>
```

## Advanced Usage

### Text Styling
```tsx
<Typography
  variant="h1"
  weight="bold"
  color="accent"
  align="center"
  decoration="underline"
  transform="uppercase"
>
  Styled Text
</Typography>
```

### Custom Styling
```tsx
<Typography
  variant="p"
  style={{
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: 1,
    color: '#custom-color',
  }}
>
  Custom styled text
</Typography>
```

### Responsive Typography
```tsx
import { TypographyUtils } from './components/Typography';

const ResponsiveTitle = TypographyUtils.createResponsive('h2', {
  small: 'h4',    // < 375px
  medium: 'h3',   // 375px - 767px
  large: 'h1',    // >= 768px
});

<ResponsiveTitle screenWidth={screenWidth}>Responsive Title</ResponsiveTitle>
```

### Custom Components
```tsx
import { createTypographyVariant } from './components/Typography';

const CustomTitle = createTypographyVariant({
  defaultVariant: 'h2',
  defaultWeight: 'bold',
  defaultColor: 'accent',
});

<CustomTitle>Custom Title Component</CustomTitle>
```

### Custom Styled Components
```tsx
const StyledText = TypographyUtils.createStyled({
  fontSize: 24,
  fontWeight: '600',
  color: '#59AC77',
  letterSpacing: 0.5,
});

<StyledText>Custom Styled Text</StyledText>
```

### Custom Font Components
```tsx
const CustomFontText = TypographyUtils.createCustomFont('Custom-Font');

<CustomFontText>Text with custom font</CustomFontText>
```

## Theme Provider

```tsx
import { TypographyProvider, Typography } from './components/Typography';

<TypographyProvider
  fontFamily="Custom-Font"
  customColors={{ primary: '#custom-color' }}
>
  <Typography>This uses provider font and color</Typography>
</TypographyProvider>
```

## Semantic Message Components

```tsx
import { SuccessMessage, ErrorMessage, WarningMessage, InfoMessage } from './components/Typography';

<SuccessMessage>✓ Operation completed successfully</SuccessMessage>
<ErrorMessage>✗ An error occurred</ErrorMessage>
<WarningMessage>⚠ Please review this warning</WarningMessage>
<InfoMessage>ℹ Additional information</InfoMessage>
```

## Accessibility

```tsx
<Typography
  variant="h1"
  accessible={true}
  accessibilityLabel="Main title"
  accessibilityHint="Page main heading"
  accessibilityRole="header"
>
  Accessible Title
</Typography>
```

## Typography Scale

| Variant | Font Size | Line Height | Font Weight | Usage |
|---------|-----------|-------------|-------------|-------|
| h1 | 32px | 40px | Bold | Main headlines |
| h2 | 28px | 36px | Bold | Page titles |
| h3 | 24px | 32px | SemiBold | Section titles |
| h4 | 20px | 28px | SemiBold | Subsection titles |
| h5 | 18px | 24px | Medium | Small titles |
| h6 | 16px | 20px | Medium | Micro titles |
| lead | 18px | 28px | Regular | Lead paragraphs |
| p | 16px | 24px | Regular | Body text |
| small | 14px | 20px | Regular | Small text |
| caption | 12px | 16px | Regular | Captions |
| label | 14px | 20px | Medium | Form labels |

## Best Practices

1. **Semantic Usage**: Use appropriate variants for their semantic meaning
2. **Consistent Spacing**: Follow the built-in margin system
3. **Color Hierarchy**: Use the comfortable color palette for better readability
4. **Font Weight**: Use font weights to create visual hierarchy
5. **Responsive Design**: Implement responsive typography for different screen sizes
6. **Accessibility**: Always provide accessibility labels for screen readers

## Performance

- Optimized re-renders with `useMemo`
- Efficient style calculations
- Minimal layout thrashing
- Lazy font loading support

## Browser Support

- ✅ iOS Safari 10+
- ✅ Android Chrome 70+
- ✅ React Native CLI
- ✅ Expo managed workflow

## Testing

```bash
npm test Typography.test.tsx
```

## File Structure

```
/components/Typography/
├── Typography.tsx          # Main component
├── Typography.styles.ts    # Style utilities and hooks
├── Typography.factory.ts   # Factory functions and utilities
├── Typography.example.tsx  # Usage examples
├── Typography.test.tsx     # Test suite
├── index.ts               # Public API exports
└── README.md              # Component documentation
```

## License

MIT License - see LICENSE file for details.