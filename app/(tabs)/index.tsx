import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { TouchableOpacity, Image } from 'react-native';
import { TouchRipple } from '@/components/TouchRipple/TouchRipple';
import {
  useFonts,
  Nunito_700Bold,
  Nunito_600SemiBold,
} from '@expo-google-fonts/nunito';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRef(useRouter());

  let [fontsLoaded] = useFonts({
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  // Reanimated shared values for cat logo animation
  const catScale = useSharedValue(1);
  const catRotate = useSharedValue(0);
  const catTranslateY = useSharedValue(0);
  const catTranslateX = useSharedValue(0);
  const catSkewX = useSharedValue(0);
  const animationTime = useSharedValue(0);

  // Reanimated shared values for button animation
  const buttonScale = useSharedValue(1);
  const buttonPulse = useSharedValue(0);
  const buttonFloatY = useSharedValue(0);
  const isAnimating = useRef(false);

  // Cat logo and button animation effect
  useEffect(() => {
    const startCatAnimation = () => {
      // Scale animation: breathe effect
      catScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.95, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
          withTiming(1.05, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        false
      );

      // Rotation animation: gentle wobble
      catRotate.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 800, easing: Easing.inOut(Easing.quad) }),
          withTiming(5, { duration: 600, easing: Easing.inOut(Easing.quad) }),
          withTiming(-3, { duration: 700, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 900, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        false
      );

      // Vertical movement: floating
      catTranslateY.value = withRepeat(
        withSequence(
          withTiming(-15, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
          withTiming(10, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(-5, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );

      // Horizontal movement: subtle sway
      catTranslateX.value = withRepeat(
        withSequence(
          withTiming(8, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          withTiming(-6, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
          withTiming(3, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2800, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );

      // Skew animation: playful tilt
      catSkewX.value = withRepeat(
        withSequence(
          withTiming(5, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
          withTiming(-8, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
          withTiming(3, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        false
      );
    };

    // Button floating animation
    buttonFloatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(5, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(-3, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    startCatAnimation();

    return () => {
      cancelAnimation(catScale);
      cancelAnimation(catRotate);
      cancelAnimation(catTranslateY);
      cancelAnimation(catTranslateX);
      cancelAnimation(catSkewX);
      cancelAnimation(buttonFloatY);
    };
  }, []);

  // Animated style for cat logo
  const catAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: catScale.value },
        { rotate: `${catRotate.value}deg` },
        { translateY: catTranslateY.value },
        { translateX: catTranslateX.value },
        { skewX: `${catSkewX.value}deg` },
      ],
    };
  });

  // Animated style for button
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: buttonScale.value },
      { translateY: buttonFloatY.value }
    ],
    shadowOpacity: 0.3 + (buttonPulse.value * 0.4),
  }));

  const handleStartOnboarding = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    // Stop cat animation when user interacts
    cancelAnimation(catScale);
    cancelAnimation(catRotate);
    cancelAnimation(catTranslateY);
    cancelAnimation(catTranslateX);
    cancelAnimation(catSkewX);

    // Stop button floating animation
    cancelAnimation(buttonFloatY);

    // Quick cat bounce animation before navigation
    catScale.value = withSequence(
      withSpring(1.3, { damping: 15, stiffness: 400 }),
      withSpring(1, { damping: 20, stiffness: 300 })
    );

    catRotate.value = withSequence(
      withTiming(360, { duration: 500, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 100, easing: Easing.inOut(Easing.quad) })
    );

    // Button bounce effect
    buttonFloatY.value = withSequence(
      withSpring(-15, { damping: 12, stiffness: 200 }),
      withSpring(0, { damping: 15, stiffness: 300 })
    );

    // 둥둥 떨는 애니메이션
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1.05, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    // 펄스 효과
    buttonPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0, { duration: 600 })
      ),
      -1,
      false
    );

    // 애니메이션 후 네비게이션
    setTimeout(() => {
      router.current.push('/onboarding/welcome');
      isAnimating.current = false;
    }, 1500);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.webWrapper}>
        <View style={styles.mobileContainer}>
          <TouchRipple>
            <View style={styles.content}>
              {/* 앱 로고 강조 */}
              <View style={styles.logoContainer}>
                <Animated.Image
                  source={require('@/assets/images/logo-cat.png')}
                  style={[styles.logoImage, catAnimatedStyle]}
                  resizeMode="contain"
                />
                <ThemedText style={[styles.logoText, { fontFamily: 'Nunito_700Bold' }]}>CATUS</ThemedText>
                <ThemedText style={styles.subtitle}>귀여운 고양이와 함께하는 감정 교류</ThemedText>
              </View>

              {/* 개인정보 안내 */}
              <View style={styles.privacyContainer}>
                <ThemedText style={styles.privacyText}>
                  개인정보처리방침
                </ThemedText>
              </View>
            </View>
          </TouchRipple>

          {/* 시작 버튼 - 애니메이션 적용 */}
          <Animated.View
            style={[
              styles.startButton,
              buttonAnimatedStyle
            ]}
          >
            <TouchableOpacity
              style={styles.startButtonInner}
              onPress={handleStartOnboarding}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.startButtonText, { fontFamily: 'Nunito_600SemiBold' }]}>
                시작하기
              </ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        padding: 20,
      },
      default: {},
    }),
  },
  mobileContainer: {
    width: Platform.OS === 'web' ? 360 : width,
    maxWidth: width,
    height: Platform.OS === 'web' ? '100%' : height,
    maxHeight: height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    width: Platform.OS === 'web' ? width * 0.9 : width * 0.9,
    maxWidth: Platform.OS === 'web' ? 324 : undefined,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: Platform.OS === 'web' ? height * 0.7 : height * 0.6,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 164,
    height: 164,
    marginBottom: 25,
  },
  logoText: {
    fontSize: Platform.OS === 'web' ? 52 : 46,
    fontWeight: 'bold',
    color: '#59AC77',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: Platform.OS === 'web' ? 60 : 54,
    height: Platform.OS === 'web' ? 60 : 54,
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    color: '#666666',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 4,
    lineHeight: Platform.OS === 'web' ? 24 : 22,
  },
  startButton: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 100 : 120,
    backgroundColor: '#59AC77',
    paddingHorizontal: 50,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: '#59AC77',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  startButtonInner: {
    width: '100%',
    alignItems: 'center',
  },
  privacyContainer: {
    position: 'absolute',
    bottom: 40,
  },
  privacyText: {
    fontSize: 12,
    color: '#666666',
    opacity: 0.7,
    textDecorationLine: 'underline',
  },
});
