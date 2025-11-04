import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Button, ButtonEventHandler, ButtonAnalytics, withButtonAnalytics } from './index';
import { GestureResponderEvent } from 'react-native';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  ImpactFeedbackStyle: {
    Medium: 'Medium',
  },
  impactAsync: jest.fn(),
}));

// Mock Typography component
jest.mock('../Typography', () => {
  const MockTypography = ({ children, style, ...props }: any) => (
    React.createElement('Text', { style, ...props }, children)
  );
  return {
    __esModule: true,
    default: MockTypography,
    Typography: MockTypography,
  };
});

describe('Button Component', () => {
  const defaultProps = {
    testID: 'test-button',
    children: 'Test Button',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByTestId, getByText } = render(<Button {...defaultProps} />);

    expect(getByTestId('test-button')).toBeTruthy();
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('handles press events', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<Button {...defaultProps} onPress={onPressMock} />);

    fireEvent.press(getByTestId('test-button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('handles disabled state correctly', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button {...defaultProps} disabled onPress={onPressMock} />
    );

    fireEvent.press(getByTestId('test-button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('handles loading state correctly', () => {
    const onPressMock = jest.fn();
    const { getByTestId, queryByText } = render(
      <Button {...defaultProps} loading onPress={onPressMock} />
    );

    fireEvent.press(getByTestId('test-button'));
    expect(onPressMock).not.toHaveBeenCalled();
    expect(getByTestId('test-button').props.disabled).toBe(true);
  });

  it('applies correct variant styles', () => {
    const { getByTestId, rerender } = render(
      <Button {...defaultProps} variant="primary" />
    );

    const primaryButton = getByTestId('test-button');
    expect(primaryButton.props.style.backgroundColor).toBe('#59AC77');

    rerender(<Button {...defaultProps} variant="secondary" />);
    const secondaryButton = getByTestId('test-button');
    expect(secondaryButton.props.style.backgroundColor).toBe('transparent');
  });

  it('applies correct size styles', () => {
    const { getByTestId, rerender } = render(
      <Button {...defaultProps} size="sm" />
    );

    const smallButton = getByTestId('test-button');
    expect(smallButton.props.style.height).toBe(32);

    rerender(<Button {...defaultProps} size="lg" />);
    const largeButton = getByTestId('test-button');
    expect(largeButton.props.style.height).toBe(56);
  });

  it('applies correct shape styles', () => {
    const { getByTestId, rerender } = render(
      <Button {...defaultProps} shape="rectangle" />
    );

    const rectangleButton = getByTestId('test-button');
    expect(rectangleButton.props.style.borderRadius).toBe(8);

    rerender(<Button {...defaultProps} shape="rounded" />);
    const roundedButton = getByTestId('test-button');
    expect(roundedButton.props.style.borderRadius).toBeGreaterThan(8);
  });

  it('renders icons correctly', () => {
    const icon = <View testID="test-icon" />;
    const { getByTestId } = render(
      <Button {...defaultProps} icon={icon} iconPosition="left" />
    );

    expect(getByTestId('test-icon')).toBeTruthy();
  });

  it('handles full width correctly', () => {
    const { getByTestId } = render(
      <Button {...defaultProps} fullWidth />
    );

    const fullWidthButton = getByTestId('test-button');
    expect(fullWidthButton.props.style.width).toBe('100%');
  });

  it('handles custom event handlers through dependency injection', () => {
    const customHandler = jest.fn();
    const eventHandler = new ButtonEventHandler();
    eventHandler.register('onPress', customHandler);

    const { getByTestId } = render(
      <Button
        {...defaultProps}
        eventHandlers={eventHandler.createButtonHandlers()}
      />
    );

    fireEvent.press(getByTestId('test-button'));
    expect(customHandler).toHaveBeenCalledTimes(1);
  });

  it('handles debouncing correctly', async () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button {...defaultProps} debounceMs={100} onPress={onPressMock} />
    );

    const button = getByTestId('test-button');

    // Press multiple times quickly
    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);

    // Wait for debounce to complete
    await waitFor(() => {
      fireEvent.press(button);
      expect(onPressMock).toHaveBeenCalledTimes(2);
    }, { timeout: 200 });
  });

  it('handles haptic feedback on non-web platforms', () => {
    const { haptics } = require('expo-haptics');

    const { getByTestId } = render(
      <Button {...defaultProps} hapticFeedback={true} />
    );

    fireEvent.press(getByTestId('test-button'));

    // Check if haptics was called (mocked)
    expect(haptics.impactAsync).toHaveBeenCalledWith('Medium');
  });

  it('passes through additional props to Pressable', () => {
    const { getByTestId } = render(
      <Button
        {...defaultProps}
        accessible={true}
        accessibilityLabel="Test button"
      />
    );

    const button = getByTestId('test-button');
    expect(button.props.accessible).toBe(true);
    expect(button.props.accessibilityLabel).toBe('Test button');
  });

  it('handles ref imperative methods', () => {
    const ref = React.createRef<any>();
    const onPressMock = jest.fn();

    render(
      <Button {...defaultProps} ref={ref} onPress={onPressMock} />
    );

    // Test programmatic press
    ref.current?.press();
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});

describe('ButtonEventHandler', () => {
  it('registers and retrieves handlers correctly', () => {
    const handler = new ButtonEventHandler();
    const customPress = jest.fn();

    handler.register('onPress', customPress);
    const handlers = handler.getHandlers();

    expect(handlers.onPress).toBe(customPress);
  });

  it('unregisters handlers correctly', () => {
    const handler = new ButtonEventHandler();
    const customPress = jest.fn();

    handler.register('onPress', customPress);
    handler.unregister('onPress');
    const handlers = handler.getHandlers();

    expect(handlers.onPress).toBeUndefined();
  });

  it('clears all handlers correctly', () => {
    const handler = new ButtonEventHandler();

    handler.register('onPress', jest.fn());
    handler.register('onPressIn', jest.fn());
    handler.clear();

    const handlers = handler.getHandlers();
    expect(Object.keys(handlers)).toHaveLength(0);
  });
});

describe('ButtonAnalytics', () => {
  it('tracks analytics events correctly', () => {
    const trackEvent = jest.fn();
    const analytics = new ButtonAnalytics(trackEvent);

    const handlers = analytics.createAnalyticsHandlers('test_button', { screen: 'home' });

    if (handlers.onPress) {
      handlers.onPress({} as GestureResponderEvent);
    }

    expect(trackEvent).toHaveBeenCalledWith('button_press', {
      button_name: 'test_button',
      timestamp: expect.any(Number),
      screen: 'home',
    });
  });
});

describe('withButtonAnalytics HOC', () => {
  it('wraps component with analytics handlers', () => {
    const trackEvent = jest.fn();
    const analytics = new ButtonAnalytics(trackEvent);

    const TrackedButton = withButtonAnalytics(
      Button,
      analytics,
      'tracked_button'
    );

    const { getByTestId } = render(
      <TrackedButton testID="tracked-button">
        Tracked Button
      </TrackedButton>
    );

    fireEvent.press(getByTestId('tracked-button'));

    expect(trackEvent).toHaveBeenCalledWith('button_press', {
      button_name: 'tracked_button',
      timestamp: expect.any(Number),
    });
  });

  it('allows overriding analytics handlers', () => {
    const trackEvent = jest.fn();
    const analytics = new ButtonAnalytics(trackEvent);
    const customHandler = jest.fn();

    const TrackedButton = withButtonAnalytics(
      Button,
      analytics,
      'tracked_button'
    );

    const { getByTestId } = render(
      <TrackedButton
        testID="tracked-button"
        eventHandlers={{ onPress: customHandler }}
      >
        Tracked Button
      </TrackedButton>
    );

    fireEvent.press(getByTestId('tracked-button'));

    expect(customHandler).toHaveBeenCalled();
    expect(trackEvent).toHaveBeenCalled();
  });
});