import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, StatusBar, Dimensions, Animated, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Big5AnalyzerService } from '../services/Big5AnalyzerService';
import { OnboardingDataService } from '../services/OnboardingDataService';

const { width, height } = Dimensions.get('window');

export default function LoadingAnimatedScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const analyzer = Big5AnalyzerService.getInstance();
  const dataService = OnboardingDataService.getInstance();

  useEffect(() => {
    // 진동 효과
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // 애니메이션 시작
    startAnimations();

    // Big5 분석 시작
    performAnalysis();

    return () => {
      // Cleanup
    };
  }, []);

  const startAnimations = () => {
    // 페이드인 및 스케일 애니메이션
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

    // 펄스 애니메이션 (분석 중)
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // 분석이 시작되면 펄스 애니메이션 시작
    if (isAnalyzing) {
      pulseAnimation.start();
    }
  };

  const performAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // 1단계: 데이터 준비 (10%)
      updateProgress(10, 0);
      await new Promise(resolve => setTimeout(resolve, 800));

      // 2단계: 텍스트 전처리 (30%)
      updateProgress(30, 1);
      const onboardingData = dataService.getOnboardingData();

      if (!onboardingData || !onboardingData.personalityText) {
        throw new Error('분석할 데이터가 없습니다.');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3단계: 규칙 기반 분석 (60%)
      updateProgress(60, 2);

      // 실제 Big5 분석 수행
      const result = await analyzer.analyzePersonality(onboardingData.personalityText);

      // 페르소나 타입 결정
      const personaType = dataService.determinePersonaType(result.scores);
      const analysisData = {
        ...result,
        personaType
      };

      // 결과 저장
      dataService.saveAnalysisResult(analysisData);

      await new Promise(resolve => setTimeout(resolve, 800));

      // 4단계: 결과 포맷팅 (90%)
      updateProgress(90, 3);
      await new Promise(resolve => setTimeout(resolve, 600));

      // 5단계: 완료 (100%)
      updateProgress(100, 4);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 성공 진동
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // 결과 화면으로 이동
      router.push('/onboarding/result');

    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.');

      // 에러 진동
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      // 3초 후 재시도 옵션 제공
      setTimeout(() => {
        Alert.alert(
          '분석 오류',
          '분석 중 문제가 발생했습니다. 다시 시도하시겠습니까?',
          [
            {
              text: '취소',
              style: 'cancel',
              onPress: () => router.back()
            },
            {
              text: '다시 시도',
              onPress: () => performAnalysis()
            }
          ]
        );
      }, 1000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateProgress = (newProgress: number, stepIndex: number) => {
    setProgress(newProgress);
    setCurrentStep(stepIndex);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const loadingMessages = [
    '당신의 페르소나를 분석중이에요..',
    '캣터스가 당신을 파악하고 있어요...',
    '성격 특성을 분석하는 중...',
    'Big5 5가지 차원을 추출하고 있어요...',
    '거의 다 왔어요! 🎉',
  ];

  const currentMessage = loadingMessages[Math.min(
    Math.floor((progress / 100) * loadingMessages.length),
    loadingMessages.length - 1
  )];

  const analysisSteps = [
    { name: '데이터 준비', icon: '📋' },
    { name: '텍스트 분석', icon: '🔍' },
    { name: 'Big5 분석', icon: '🧠' },
    { name: '결과 생성', icon: '✨' },
    { name: '완료', icon: '🎯' },
  ];

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
          <View style={[
            styles.characterPlaceholder,
            isAnalyzing && styles.analyzingPlaceholder
          ]}>
            <Animated.View
              style={[
                styles.characterEmojiContainer,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <ThemedText style={styles.characterEmoji}>
                {isAnalyzing ? '🐱⚡' : '🐱🔍'}
              </ThemedText>
            </Animated.View>
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
            {analysisSteps.map((step, index) => (
              <View key={index} style={styles.step}>
                <View style={[
                  styles.stepDot,
                  index <= currentStep && styles.stepComplete,
                  index === currentStep && styles.stepActive
                ]}>
                  <ThemedText style={styles.stepIcon}>
                    {step.icon}
                  </ThemedText>
                </View>
                <ThemedText style={[
                  styles.stepText,
                  index <= currentStep && styles.stepTextComplete
                ]}>
                  {step.name}
                </ThemedText>
              </View>
            ))}
          </View>

          {/* 에러 메시지 */}
          {error && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>
                {error}
              </ThemedText>
            </View>
          )}
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
  analyzingPlaceholder: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFB74D',
  },
  characterEmojiContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterEmoji: {
    fontSize: 50,
    lineHeight: 60,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepComplete: {
    backgroundColor: '#59AC77',
  },
  stepActive: {
    backgroundColor: '#FFB74D',
  },
  stepIcon: {
    fontSize: 16,
  },
  stepText: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
  stepTextComplete: {
    color: '#333333',
    fontWeight: '600',
  },
  errorContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
  },
});