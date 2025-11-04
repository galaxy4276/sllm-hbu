# Button Component

A highly customizable and accessible button component built with React Native and Expo support. Features comprehensive theming, multiple variants, dependency injection, analytics integration, and **integrated Typography system** for consistent text styling.

## Features

- 🎨 **Multiple Variants**: Primary, Secondary, Ghost
- 📏 **Size Options**: Small, Medium, Large
- 🔷 **Shape Options**: Rounded, Rectangle
- 📝 **Typography Integration**: Built-in Pretendard font support
- 🎯 **Dependency Injection**: Custom event handlers
- 📊 **Analytics Integration**: Built-in tracking support
- 📱 **Haptic Feedback**: Tactile feedback on mobile devices
- ⚡ **Debouncing**: Configurable press debouncing
- ♿ **Accessibility**: Full accessibility support
- 🔄 **Loading States**: Built-in loading spinner
- 🎨 **Custom Styling**: Extensive customization options
- 📱 **Platform Support**: iOS, Android, Web

## Installation

The button component requires the following dependencies:

```bash
npm install react-native
```

For haptic feedback (optional):
```bash
npx expo install expo-haptics
```

**Typography System**: The Button component automatically integrates with the Typography system, which requires Pretendard font files to be installed. See the [Typography documentation](../Typography/README.md) for font installation instructions.

## Quick Start

```tsx
import { Button } from './components/Button';

export default function App() {
  return (
    <Button onPress={() => console.log('Pressed')}>
      Click me
    </Button>
  );
}
```

## API Reference

### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Button content |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Button variant |
| `shape` | `'rounded' \| 'rectangle'` | `'rounded'` | Button shape |
| `disabled` | `boolean` | `false` | Disable button |
| `loading` | `boolean` | `false` | Show loading state |
| `fullWidth` | `boolean` | `false` | Full width button |
| `icon` | `ReactNode` | - | Button icon |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon position |
| `eventHandlers` | `ButtonEventHandlers` | - | Custom event handlers |
| `hapticFeedback` | `boolean` | `false` | Enable haptic feedback |
| `debounceMs` | `number` | `0` | Press debounce time |
| `rippleColor` | `string` | - | Android ripple color |
| `style` | `ViewStyle` | - | Custom container style |
| `textStyle` | `TextStyle` | - | Custom text style |

### Event Handlers

```tsx
interface ButtonEventHandlers {
  onPress?: (event: GestureResponderEvent) => void;
  onPressIn?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
```

## Examples

### Basic Variants

```tsx
<Button variant="primary" onPress={handlePress}>
  Primary Button
</Button>

<Button variant="secondary" onPress={handlePress}>
  Secondary Button
</Button>

<Button variant="ghost" onPress={handlePress}>
  Ghost Button
</Button>
```

### Size Variants

```tsx
<Button size="sm" onPress={handlePress}>Small</Button>
<Button size="md" onPress={handlePress}>Medium</Button>
<Button size="lg" onPress={handlePress}>Large</Button>
```

### Shape Variants

```tsx
<Button shape="rounded" onPress={handlePress}>Rounded</Button>
<Button shape="rectangle" onPress={handlePress}>Rectangle</Button>
```

### With Icons

```tsx
<Button icon={<HeartIcon />} iconPosition="left" onPress={handlePress}>
  Like
</Button>

<Button icon={<ArrowIcon />} iconPosition="right" onPress={handlePress}>
  Next
</Button>
```

### Loading State

```tsx
<Button loading={loading} disabled={loading} onPress={handleAsync}>
  {loading ? 'Loading...' : 'Submit'}
</Button>
```

### Full Width

```tsx
<Button fullWidth onPress={handlePress}>
  Full Width Button
</Button>
```

### Dependency Injection

```tsx
import { ButtonEventHandler } from './components/Button';

const eventHandler = new ButtonEventHandler();
eventHandler.register('onPress', (event) => {
  console.log('Custom press handler');
});

<Button
  eventHandlers={eventHandler.createButtonHandlers()}
  onPress={defaultHandler}
>
  Custom Handler Button
</Button>
```

### Analytics Integration

```tsx
import { ButtonAnalytics, withButtonAnalytics } from './components/Button';

const analytics = new ButtonAnalytics((eventName, properties) => {
  // Send to your analytics service
  analytics.track(eventName, properties);
});

const TrackedButton = withButtonAnalytics(
  Button,
  analytics,
  'login_button',
  { screen: 'login' }
);

<TrackedButton onPress={handleLogin}>Login</TrackedButton>
```

### Advanced Features

```tsx
<Button
  hapticFeedback={true}
  debounceMs={500}
  rippleColor="#ffffff"
  style={{ backgroundColor: '#custom' }}
  onPress={handlePress}
>
  Advanced Button
</Button>
```

### Programmatic Control

```tsx
import { useRef } from 'react';
import { Button, ButtonRef } from './components/Button';

const MyComponent = () => {
  const buttonRef = useRef<ButtonRef>(null);

  const triggerButton = () => {
    buttonRef.current?.press();
  };

  return (
    <View>
      <Button ref={buttonRef} onPress={handlePress}>
        Pressable Button
      </Button>
      <Button onPress={triggerButton}>
        Trigger Above Button
      </Button>
    </View>
  );
};
```

### Pre-configured Variants

```tsx
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  LargePrimaryButton,
  SmallGhostButton,
  RectanglePrimaryButton
} from './components/Button';

<PrimaryButton onPress={handlePress}>Primary</PrimaryButton>
<SecondaryButton onPress={handlePress}>Secondary</SecondaryButton>
<LargePrimaryButton onPress={handlePress}>Large Primary</LargePrimaryButton>
```

## Customization

### Theme Customization

```tsx
// Modify theme.ts
export const colors = {
  primary: '#59AC77', // Your custom primary color
  // ... other colors
};
```

### Custom Button Factory

```tsx
import { createButtonVariant } from './components/Button';

const CustomButton = createButtonVariant({
  defaultVariant: 'primary',
  defaultSize: 'lg',
  defaultShape: 'rectangle',
});

<CustomButton onPress={handlePress}>Custom Button</CustomButton>
```

## Styling Reference

### Size Configurations

| Size | Height | Padding | Typography Variant | Font Size |
|------|--------|---------|-------------------|-----------|
| `sm` | 32px | 8px | `small` | 14px |
| `md` | 44px | 16px | `p` | 16px |
| `lg` | 56px | 24px | `lead` | 18px |

**Typography Integration**: Each button size automatically uses the appropriate Typography variant for consistent text styling with proper line height and font weight.

### Color Theme

The component uses the primary color `#59AC77` with the following variations:

- **Primary**: `#59AC77` (main)
- **Primary Dark**: `#4A8F62` (pressed state)
- **Primary Light**: `#6FBE8A` (hover state)

## Accessibility

The button component follows W3C accessibility guidelines:

- Semantic button element using `Pressable`
- Proper accessibility labels via `accessibilityLabel` prop
- Disabled state handling
- Screen reader support
- Keyboard navigation support
- Minimum touch targets (44px minimum)

## Performance

- Optimized re-renders with `useMemo`
- Efficient state management
- Minimal layout thrashing
- Built-in debouncing to prevent rapid taps
- Lazy loading of haptics module
- **Typography System**: Efficient font loading and caching through the integrated Typography system
- Optimized text rendering with proper line height management

## Testing

```bash
npm test Button.test.tsx
```

The component includes comprehensive test coverage for:
- All variants and props
- Event handling
- Accessibility features
- Custom handler injection
- Analytics integration
- Programmatic control

## Browser Support

- ✅ iOS Safari 10+
- ✅ Android Chrome 70+
- ✅ Chrome/Edge/Firefox (React Native Web)
- ✅ React Native CLI
- ✅ Expo managed workflow

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure accessibility compliance

## License

MIT License - see LICENSE file for details.