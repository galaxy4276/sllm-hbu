import React, { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, Dimensions, Animated } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const fadeAnim = new Animated.Value(0);
  const rotateAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // 진동 효과
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // 애니메이션 시작
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // 회전 애니메이션
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    // 진행 상태 업데이트
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // 3초 후 결과 화면으로 이동
          setTimeout(() => {
            router.push('/onboarding/result');
          }, 1000);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    return () => {
      clearInterval(progressInterval);
      rotateAnimation.stop();
    };
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const loadingMessages = [
    '당신의 페르소나를 분석중이에요..',
    '캣터스가 당신을 파악하고 있어요...',
    '감정 패턴을 분석하는 중...',
    '성향 특징을 추출하고 있어요...',
    '거의 다 왔어요!',
  ];

  const currentMessage = loadingMessages[Math.floor((progress / 100) * loadingMessages.length)];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
          {/* 회전하는 캣터스 */}
          <Animated.View
            style={[
              styles.characterContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { rotate: rotate },
                ],
              },
            ]}
          >
            <View style={styles.characterPlaceholder}>
              <ThemedText style={styles.characterEmoji}>🐱⚡</ThemedText>
            </View>
            <View style={styles.orbitRing} />
          </Animated.View>

          {/* 분석 메시지 */}
          <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
            <ThemedText style={styles.loadingText}>
              {currentMessage}
            </ThemedText>

            {/* 진행 상태 바 */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress}%` }
                  ]}
                />
              </View>
              <ThemedText style={styles.progressPercent}>
                {Math.round(progress)}%
              </ThemedText>
            </View>

            {/* 분석 단계 표시 */}
            <View style={styles.analysisSteps}>
              <View style={styles.step}>
                <View style={[
                  styles.stepDot,
                  progress >= 20 && styles.stepComplete
                ]} />
                <ThemedText style={styles.stepText}>답변 수집</ThemedText>
              </View>
              <View style={styles.step}>
                <View style={[
                  styles.stepDot,
                  progress >= 40 && styles.stepComplete
                ]} />
                <ThemedText style={styles.stepText}>감정 분석</ThemedText>
              </View>
              <View style={styles.step}>
                <View style={[
                  styles.stepDot,
                  progress >= 60 && styles.stepComplete
                ]} />
                <ThemedText style={styles.stepText}>성향 도출</ThemedText>
              </View>
              <View style={styles.step}>
                <View style={[
                  styles.stepDot,
                  progress >= 80 && styles.stepComplete
                ]} />
                <ThemedText style={styles.stepText}>페르소나 생성</ThemedText>
              </View>
              <View style={styles.step}>
                <View style={[
                  styles.stepDot,
                  progress >= 100 && styles.stepComplete
                ]} />
                <ThemedText style={styles.stepText}>완료</ThemedText>
              </View>
            </View>
          </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    width: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  characterContainer: {
    marginBottom: 60,
    position: 'relative',
  },
  characterPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#F8F8F8',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#59AC77',
    zIndex: 2,
  },
  characterEmoji: {
    fontSize: 60,
    lineHeight: 70,
  },
  orbitRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
    top: -20,
    left: -20,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 40,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  progressBar: {
    width: '80%',
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#59AC77',
    borderRadius: 6,
    transition: 'width 0.3s ease',
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#59AC77',
  },
  analysisSteps: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  step: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#CCCCCC',
    marginBottom: 8,
  },
  stepComplete: {
    backgroundColor: '#59AC77',
  },
  stepText: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
});