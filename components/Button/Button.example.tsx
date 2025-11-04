import React, { useState, useRef } from 'react';
import { View, ScrollView, Alert, Platform } from 'react-native';
import { GestureResponderEvent } from 'react-native';
import {
  Button,
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  LargePrimaryButton,
  SmallGhostButton,
  RectanglePrimaryButton,
  ButtonEventHandler,
  ButtonAnalytics,
  withButtonAnalytics,
  ButtonProps,
  ButtonRef,
} from './index';
import { H2, H3, Small, Caption } from '../Typography';

// Example icon component
const HeartIcon = ({ size = 16, color = '#59AC77' }) => (
  <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />
);

// Event handlers demonstration
const ExampleEventHandler = () => {
  const handler = new ButtonEventHandler();

  // Register custom event handlers
  handler.register('onPress', (event: GestureResponderEvent) => {
    console.log('Custom press handler called', event);
    Alert.alert('Custom Handler', 'Press event handled by custom handler');
  });

  handler.register('onPressIn', () => {
    console.log('Button pressed in');
  });

  handler.register('onPressOut', () => {
    console.log('Button pressed out');
  });

  return handler;
};

// Analytics integration demonstration
const exampleAnalytics = new ButtonAnalytics((eventName, properties) => {
  console.log('📊 Analytics Event:', eventName, properties);
});

// Create analytics-wrapped buttons
const TrackedLoginButton = withButtonAnalytics(
  Button,
  exampleAnalytics,
  'login_button',
  { screen: 'login', user_type: 'guest' }
);

const TrackedSignupButton = withButtonAnalytics(
  Button,
  exampleAnalytics,
  'signup_button',
  { screen: 'signup', user_type: 'guest' }
);

// Button Examples Component
export const ButtonExamples = () => {
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<ButtonRef>(null);
  const eventHandler = ExampleEventHandler();

  // Basic press handler
  const handlePress = () => {
    Alert.alert('Button Pressed', 'Default press handler executed');
  };

  // Async press handler with loading state
  const handleAsyncPress = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Async operation completed');
    } catch (error) {
      Alert.alert('Error', 'Async operation failed');
    } finally {
      setLoading(false);
    }
  };

  // Programmatic button press
  const handleProgrammaticPress = () => {
    buttonRef.current?.press();
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#f8f9fa' }}>
      <View style={{ gap: 16 }}>

        {/* Basic Button Variants */}
        <View>
          <H3>기본 버튼 변형</H3>
          <View style={{ marginBottom: 8 }}>
            <Button variant="primary" onPress={handlePress}>
              Primary Button
            </Button>
            <Caption>기본 프라이머리 버튼 (Typography 적용됨)</Caption>
          </View>
          <View style={{ marginBottom: 8 }}>
            <Button variant="secondary" onPress={handlePress}>
              Secondary Button
            </Button>
            <Caption>세컨더리 버튼 (Typography 적용됨)</Caption>
          </View>
          <View style={{ marginBottom: 8 }}>
            <Button variant="ghost" onPress={handlePress}>
              Ghost Button
            </Button>
            <Caption>고스트 버튼 (Typography 적용됨)</Caption>
          </View>
        </View>

        {/* Size Variants */}
        <View>
          <H3>크기 변형 (Typography 연동)</H3>
          <View style={{ marginBottom: 8 }}>
            <Button size="sm" variant="primary" onPress={handlePress}>
              Small Button
            </Button>
            <Caption>Small (14px Typography)</Caption>
          </View>
          <View style={{ marginBottom: 8 }}>
            <Button size="md" variant="primary" onPress={handlePress}>
              Medium Button
            </Button>
            <Caption>Medium (16px Typography)</Caption>
          </View>
          <View style={{ marginBottom: 8 }}>
            <Button size="lg" variant="primary" onPress={handlePress}>
              Large Button
            </Button>
            <Caption>Large (18px Typography)</Caption>
          </View>
        </View>

        {/* Shape Variants */}
        <View>
          <View style={{ marginBottom: 8 }}>
            <Button shape="rounded" variant="primary" onPress={handlePress}>
              Rounded Button
            </Button>
          </View>
          <View style={{ marginBottom: 8 }}>
            <Button shape="rectangle" variant="primary" onPress={handlePress}>
              Rectangle Button
            </Button>
          </View>
        </View>

        {/* Full Width Button */}
        <View style={{ marginBottom: 8 }}>
          <Button fullWidth variant="primary" onPress={handlePress}>
            Full Width Button
          </Button>
        </View>

        {/* Buttons with Icons */}
        <View>
          <View style={{ marginBottom: 8 }}>
            <Button
              variant="primary"
              icon={<HeartIcon />}
              iconPosition="left"
              onPress={handlePress}
            >
              Button with Left Icon
            </Button>
          </View>
          <View style={{ marginBottom: 8 }}>
            <Button
              variant="secondary"
              icon={<HeartIcon />}
              iconPosition="right"
              onPress={handlePress}
            >
              Button with Right Icon
            </Button>
          </View>
        </View>

        {/* Loading State */}
        <View style={{ marginBottom: 8 }}>
          <Button
            variant="primary"
            loading={loading}
            disabled={loading}
            onPress={handleAsyncPress}
          >
            {loading ? 'Loading...' : 'Async Operation'}
          </Button>
        </View>

        {/* Disabled State */}
        <View style={{ marginBottom: 8 }}>
          <Button variant="primary" disabled onPress={handlePress}>
            Disabled Button
          </Button>
        </View>

        {/* Pre-configured Variants */}
        <View>
          <H3>미리 설정된 변형 (Typography 통합)</H3>
          <View style={{ marginBottom: 8 }}>
            <PrimaryButton onPress={handlePress}>
              Primary Button (Pre-configured)
            </PrimaryButton>
            <Caption>Typography 시스템과 통합된 기본 버튼</Caption>
          </View>
          <View style={{ marginBottom: 8 }}>
            <SecondaryButton onPress={handlePress}>
              Secondary Button (Pre-configured)
            </SecondaryButton>
            <Caption>Typography 시스템과 통합된 세컨더리 버튼</Caption>
          </View>
          <View style={{ marginBottom: 8 }}>
            <GhostButton onPress={handlePress}>
              Ghost Button (Pre-configured)
            </GhostButton>
            <Caption>Typography 시스템과 통합된 고스트 버튼</Caption>
          </View>
          <View style={{ marginBottom: 8 }}>
            <LargePrimaryButton onPress={handlePress}>
              Large Primary Button (Pre-configured)
            </LargePrimaryButton>
            <Caption>Large 사이즈 + Typography (18px)</Caption>
          </View>
          <View style={{ marginBottom: 8 }}>
            <SmallGhostButton onPress={handlePress}>
              Small Ghost Button (Pre-configured)
            </SmallGhostButton>
            <Caption>Small 사이즈 + Typography (14px)</Caption>
          </View>
          <View style={{ marginBottom: 8 }}>
            <RectanglePrimaryButton onPress={handlePress}>
              Rectangle Primary Button (Pre-configured)
            </RectanglePrimaryButton>
            <Caption>Rectangle 모양 + Typography</Caption>
          </View>
        </View>

        {/* Dependency Injection - Custom Event Handlers */}
        <View>
          <View style={{ marginBottom: 8 }}>
            <Button
              variant="primary"
              eventHandlers={eventHandler.createButtonHandlers()}
            >
              Button with Custom Event Handlers
            </Button>
          </View>
        </View>

        {/* Analytics Integration */}
        <View>
          <View style={{ marginBottom: 8 }}>
            <TrackedLoginButton variant="primary">
              Login Button (With Analytics)
            </TrackedLoginButton>
          </View>
          <View style={{ marginBottom: 8 }}>
            <TrackedSignupButton variant="secondary">
              Signup Button (With Analytics)
            </TrackedSignupButton>
          </View>
        </View>

        {/* Advanced Features */}
        <View>
          <View style={{ marginBottom: 8 }}>
            <Button
              variant="primary"
              hapticFeedback={true}
              debounceMs={500}
              onPress={() => console.log('Debounced press')}
            >
              Haptic + Debounced Button
            </Button>
          </View>
          {Platform.OS === 'android' && (
            <View style={{ marginBottom: 8 }}>
              <Button
                variant="primary"
                rippleColor="#ffffff"
                onPress={handlePress}
              >
                Android Custom Ripple
              </Button>
            </View>
          )}
        </View>

        {/* Programmatic Control */}
        <View>
          <View style={{ marginBottom: 8 }}>
            <Button
              variant="secondary"
              onPress={handleProgrammaticPress}
            >
              Trigger Next Button Programmatically
            </Button>
          </View>
          <View style={{ marginBottom: 8 }}>
            <Button
              ref={buttonRef}
              variant="primary"
              onPress={() => Alert.alert('Programmatic', 'This button was pressed programmatically')}
            >
              Programmatically Pressable Button
            </Button>
          </View>
        </View>

        {/* Custom Styling */}
        <View>
          <View style={{ marginBottom: 8 }}>
            <Button
              variant="primary"
              style={{ backgroundColor: '#FF6B6B', borderColor: '#FF6B6B' }}
              textStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
              onPress={handlePress}
            >
              Custom Styled Button
            </Button>
          </View>
        </View>

      </View>
    </ScrollView>
  );
};

export default ButtonExamples;