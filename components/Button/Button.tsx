import React, { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { Pressable, View, ActivityIndicator, Platform, UIManager, LayoutAnimation } from 'react-native';
import { GestureResponderEvent } from 'react-native';
import { ButtonProps, ButtonRef, ButtonState, ButtonEventHandlers } from '../../types/button';
import { Typography } from '../Typography';
import { useButtonStyles } from './Button.styles';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Button = forwardRef<ButtonRef, ButtonProps>(({
  children,
  size = 'md',
  variant = 'primary',
  shape = 'rounded',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  testID,
  style,
  textStyle,
  eventHandlers,
  rippleColor,
  hapticFeedback = false,
  debounceMs = 0,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  onHoverIn,
  onHoverOut,
  onFocus,
  onBlur,
  android_ripple,
  ...pressableProps
}, ref) => {
  const [buttonState, setButtonState] = useState<ButtonState>('default');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Apply styles
  const styles = useButtonStyles(
    size,
    variant,
    shape,
    buttonState,
    disabled,
    loading,
    fullWidth,
    style,
    textStyle
  );

  // Cleanup debounce timer
  React.useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Handle press events with dependency injection support
  const handlePress = useCallback((event: GestureResponderEvent) => {
    if (disabled || loading) return;

    // Handle debouncing
    if (debounceMs > 0) {
      if (debounceTimer) return;

      const timer = setTimeout(() => {
        setDebounceTimer(null);
      }, debounceMs);
      setDebounceTimer(timer);
    }

    // Trigger haptic feedback if enabled
    if (hapticFeedback && Platform.OS !== 'web') {
      // Import haptics dynamically to avoid web compatibility issues
      import('expo-haptics').then(({ ImpactFeedbackStyle, impactAsync }) => {
        impactAsync(ImpactFeedbackStyle.Medium).catch(() => {});
      }).catch(() => {});
    }

    // Execute injected event handler first, then fallback to prop
    if (eventHandlers?.onPress) {
      eventHandlers.onPress(event);
    } else if (onPress) {
      onPress(event);
    }
  }, [disabled, loading, debounceMs, debounceTimer, hapticFeedback, eventHandlers?.onPress, onPress]);

  const handlePressIn = useCallback((event: GestureResponderEvent) => {
    if (disabled || loading) return;

    setButtonState('pressed');

    if (eventHandlers?.onPressIn) {
      eventHandlers.onPressIn(event);
    } else if (onPressIn) {
      onPressIn(event);
    }
  }, [disabled, loading, eventHandlers?.onPressIn, onPressIn]);

  const handlePressOut = useCallback((event: GestureResponderEvent) => {
    if (disabled || loading) return;

    setButtonState('default');

    if (eventHandlers?.onPressOut) {
      eventHandlers.onPressOut(event);
    } else if (onPressOut) {
      onPressOut(event);
    }
  }, [disabled, loading, eventHandlers?.onPressOut, onPressOut]);

  const handleLongPress = useCallback((event: GestureResponderEvent) => {
    if (disabled || loading) return;

    if (eventHandlers?.onLongPress) {
      eventHandlers.onLongPress(event);
    } else if (onLongPress) {
      onLongPress(event);
    }
  }, [disabled, loading, eventHandlers?.onLongPress, onLongPress]);

  const handleHoverIn = useCallback(() => {
    if (disabled || loading) return;

    if (eventHandlers?.onHoverIn) {
      eventHandlers.onHoverIn();
    } else if (onHoverIn) {
      onHoverIn();
    }
  }, [disabled, loading, eventHandlers?.onHoverIn, onHoverIn]);

  const handleHoverOut = useCallback(() => {
    if (disabled || loading) return;

    if (eventHandlers?.onHoverOut) {
      eventHandlers.onHoverOut();
    } else if (onHoverOut) {
      onHoverOut();
    }
  }, [disabled, loading, eventHandlers?.onHoverOut, onHoverOut]);

  const handleFocus = useCallback(() => {
    if (disabled || loading) return;

    if (eventHandlers?.onFocus) {
      eventHandlers.onFocus();
    } else if (onFocus) {
      onFocus();
    }
  }, [disabled, loading, eventHandlers?.onFocus, onFocus]);

  const handleBlur = useCallback(() => {
    if (disabled || loading) return;

    if (eventHandlers?.onBlur) {
      eventHandlers.onBlur();
    } else if (onBlur) {
      onBlur();
    }
  }, [disabled, loading, eventHandlers?.onBlur, onBlur]);

  // Imperative methods
  useImperativeHandle(ref, () => ({
    press: () => {
      if (!disabled && !loading) {
        handlePress({} as GestureResponderEvent);
      }
    },
    focus: handleFocus,
    blur: handleBlur,
  }), [disabled, loading, handlePress, handleFocus, handleBlur]);

  // Configure ripple effect for Android
  const rippleConfig = Platform.OS === 'android' ? {
    color: rippleColor || 'rgba(255, 255, 255, 0.2)',
    borderless: false,
    ...android_ripple,
  } : undefined;

  // Render icon
  const renderIcon = () => {
    if (!icon) return null;

    return (
      <View style={{ marginHorizontal: 4 }}>
        {React.isValidElement(icon)
          ? React.cloneElement(icon, {
              style: [styles.icon, icon.props.style]
            })
          : icon
        }
      </View>
    );
  };

  return (
    <Pressable
      testID={testID}
      style={styles.container}
      disabled={disabled || loading}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={handleLongPress}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      onFocus={handleFocus}
      onBlur={handleBlur}
      android_ripple={rippleConfig}
      {...pressableProps}
    >
      {/* Left Icon */}
      {iconPosition === 'left' && renderIcon()}

      {/* Button Text */}
      {typeof children === 'string' ? (
        <Typography
          variant="span"
          weight="semibold"
          style={styles.text}
          selectable={false}
        >
          {children}
        </Typography>
      ) : (
        <View style={styles.text}>
          {children}
        </View>
      )}

      {/* Right Icon */}
      {iconPosition === 'right' && renderIcon()}

      {/* Loading Spinner */}
      {loading && (
        <ActivityIndicator
          style={styles.loading}
          size="small"
          color={styles.text.color}
        />
      )}
    </Pressable>
  );
});

Button.displayName = 'Button';

export default Button;