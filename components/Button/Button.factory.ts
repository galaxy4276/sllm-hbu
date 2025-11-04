import React from 'react';
import { ButtonProps, ButtonFactoryConfig, ButtonSize, ButtonVariant, ButtonShape } from '../../types/button';
import Button from './Button';

// Factory function to create customized button variants
export const createButtonVariant = (config: ButtonFactoryConfig) => {
  const {
    defaultSize = 'md',
    defaultVariant = 'primary',
    defaultShape = 'rounded',
    customTheme,
    customSizes,
  } = config;

  // Return a new component with default props
  const CustomButton = React.forwardRef<any, Omit<ButtonProps, 'size' | 'variant' | 'shape'>>((props, ref) => {
    return (
      <Button
        ref={ref}
        size={props.size || defaultSize}
        variant={props.variant || defaultVariant}
        shape={props.shape || defaultShape}
        {...props}
      />
    );
  });

  CustomButton.displayName = `CustomButton(${defaultVariant}-${defaultSize}-${defaultShape})`;

  return CustomButton;
};

// Pre-configured button variants
export const PrimaryButton = createButtonVariant({
  defaultVariant: 'primary',
  defaultSize: 'md',
  defaultShape: 'rounded',
});

export const SecondaryButton = createButtonVariant({
  defaultVariant: 'secondary',
  defaultSize: 'md',
  defaultShape: 'rounded',
});

export const GhostButton = createButtonVariant({
  defaultVariant: 'ghost',
  defaultSize: 'md',
  defaultShape: 'rounded',
});

export const LargePrimaryButton = createButtonVariant({
  defaultVariant: 'primary',
  defaultSize: 'lg',
  defaultShape: 'rounded',
});

export const SmallGhostButton = createButtonVariant({
  defaultVariant: 'ghost',
  defaultSize: 'sm',
  defaultShape: 'rounded',
});

export const RectanglePrimaryButton = createButtonVariant({
  defaultVariant: 'primary',
  defaultSize: 'md',
  defaultShape: 'rectangle',
});

// Event handler factory for dependency injection
export class ButtonEventHandler {
  private handlers: Record<string, Function> = {};

  // Register event handlers
  register(eventName: string, handler: Function) {
    this.handlers[eventName] = handler;
  }

  // Unregister event handlers
  unregister(eventName: string) {
    delete this.handlers[eventName];
  }

  // Get all registered handlers
  getHandlers() {
    return { ...this.handlers };
  }

  // Create event handlers object for Button component
  createButtonHandlers() {
    return {
      onPress: this.handlers['onPress'],
      onPressIn: this.handlers['onPressIn'],
      onPressOut: this.handlers['onPressOut'],
      onLongPress: this.handlers['onLongPress'],
      onHoverIn: this.handlers['onHoverIn'],
      onHoverOut: this.handlers['onHoverOut'],
      onFocus: this.handlers['onFocus'],
      onBlur: this.handlers['onBlur'],
    };
  }

  // Clear all handlers
  clear() {
    this.handlers = {};
  }
}

// Analytics integration example
export class ButtonAnalytics {
  private trackEvent: (eventName: string, properties?: Record<string, any>) => void;

  constructor(trackEvent: (eventName: string, properties?: Record<string, any>) => void) {
    this.trackEvent = trackEvent;
  }

  // Create analytics-enabled event handlers
  createAnalyticsHandlers(eventName: string, baseProperties?: Record<string, any>) {
    return {
      onPress: (event: any) => {
        this.trackEvent('button_press', {
          button_name: eventName,
          timestamp: Date.now(),
          ...baseProperties,
        });
      },
      onPressIn: () => {
        this.trackEvent('button_press_in', {
          button_name: eventName,
          timestamp: Date.now(),
          ...baseProperties,
        });
      },
      onLongPress: () => {
        this.trackEvent('button_long_press', {
          button_name: eventName,
          timestamp: Date.now(),
          ...baseProperties,
        });
      },
    };
  }
}

// Higher-order component for analytics
export const withButtonAnalytics = (
  WrappedButton: React.ComponentType<any>,
  analytics: ButtonAnalytics,
  eventName: string,
  properties?: Record<string, any>
) => {
  return React.forwardRef<any, any>((props, ref) => {
    const analyticsHandlers = analytics.createAnalyticsHandlers(eventName, properties);

    return (
      <WrappedButton
        ref={ref}
        eventHandlers={{
          ...analyticsHandlers,
          ...props.eventHandlers, // Allow overriding specific handlers
        }}
        {...props}
      />
    );
  });
};

// Usage example:
// const analytics = new ButtonAnalytics((eventName, properties) => {
//   console.log('Analytics:', eventName, properties);
// });
//
// const TrackedButton = withButtonAnalytics(Button, analytics, 'login_button');
//
// <TrackedButton onPress={handleLogin}>Login</TrackedButton>