import { ReactNode } from 'react';
import {
  PressableProps,
  TextStyle,
  ViewStyle,
  GestureResponderEvent
} from 'react-native';

// Button size variants
export type ButtonSize = 'sm' | 'md' | 'lg';

// Button visual variants
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

// Button shape variants
export type ButtonShape = 'rounded' | 'rectangle';

// Button state types
export type ButtonState = 'default' | 'pressed' | 'disabled' | 'loading';

// Button event handlers interface for dependency injection
export interface ButtonEventHandlers {
  onPress?: (event: GestureResponderEvent) => void | Promise<void>;
  onPressIn?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// Button style configuration
export interface ButtonStyles {
  container: ViewStyle;
  text: TextStyle;
  icon?: TextStyle;
  loading?: ViewStyle;
}

// Button theme configuration
export interface ButtonTheme {
  [key: string]: {
    container: ViewStyle;
    text: TextStyle;
  };
}

// Base button props
export interface BaseButtonProps extends Omit<PressableProps, 'style'> {
  children?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  shape?: ButtonShape;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  testID?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  eventHandlers?: ButtonEventHandlers;
}

// Enhanced button props with additional features
export interface ButtonProps extends BaseButtonProps {
  rippleColor?: string;
  hapticFeedback?: boolean;
  debounceMs?: number;
  analyticsEvent?: {
    eventName: string;
    properties?: Record<string, any>;
  };
}

// Button component reference
export interface ButtonRef {
  press: () => void;
  focus: () => void;
  blur: () => void;
}

// Button factory configuration
export interface ButtonFactoryConfig {
  defaultSize?: ButtonSize;
  defaultVariant?: ButtonVariant;
  defaultShape?: ButtonShape;
  customTheme?: Partial<ButtonTheme>;
  customSizes?: Record<ButtonSize, { height: number; paddingHorizontal: number; fontSize: number }>;
}

// Export all button related types
export type {
  ButtonEventHandlers,
  ButtonStyles,
  ButtonTheme,
  BaseButtonProps,
  ButtonProps,
  ButtonRef,
  ButtonFactoryConfig,
};