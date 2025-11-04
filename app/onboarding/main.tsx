/**
 * 온보딩 메인 컴포넌트
 * 사용자 답변 수집 및 Big5 분석 플로우 관리
 */

import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, StatusBar, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { OnboardingDataService, OnboardingAnswer } from '../services/OnboardingDataService';

const { width, height } = Dimensions.get('window');

// 온보딩 질문 데이터
const onboardingQuestions = [
  {
    id: 'q1',
    question: '새로운 취미나 활동을 시작할 때 어떤가요?',
    category: 'lifestyle' as const,
    options: [
      '즉시 도전하고 배우는 것을 즐긴다',
      '신중하게 계획을 세우고 시작한다',
      '친구들과 함께 시작하는 것을 선호한다',
      '혼자 조용히 시도해보는 것을 좋아한다'
    ]
  },
  {
    id: 'q2',
    question: '주말에 시간을 보내는 방법은?',
    category: 'personality' as const,
    options: [
      '새로운 장소를 탐험하며 여행한다',
      '계획했던 일들을 처리하고 정리한다',
      '친구들과 만나 즐거운 시간을 보낸다',
      '조용히 독서나 영화 감상을 즐긴다'
    ]
  },
  {
    id: 'q3',
    question: '갈등 상황에서 주로 어떻게 행동하나요?',
    category: 'social' as const,
    options: [
      '창의적인 해결책을 제시한다',
      '원칙과 규칙에 따라 공정하게 해결한다',
      '양쪽 모두의 입장을 이해하고 중재한다',
      '감정적으로 대처하거나 피하고 싶어 한다'
    ]
  },
  {
    id: 'q4',
    question: '새로운 사람들을 만날 때 당신은?',
    category: 'social' as const,
    options: [
      '쉽게 친해지고 대화를 주도한다',
      '신중하게 접근하지만 친절하게 대한다',
      '상대방의 입장에서 먼저 이해하려 노력한다',
      '조금 수줄하고 먼저 관찰한다'
    ]
  },
  {
    id: 'q5',
    question: '스트레스를 받을 때 어떻게 관리하나요?',
    category: 'emotional' as const,
    options: [
      '새로운 활동으로 주의를 돌린다',
      '체계적인 계획으로 문제를 해결한다',
      '친구들과 이야기하며 털어놓는다',
      '혼자 조용한 공간에서 감정을 정리한다'
    ]
  }
];

export default function OnboardingMainScreen() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const dataService = OnboardingDataService.getInstance();

  const currentQuestion = onboardingQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / onboardingQuestions.length) * 100;

  const handleOptionSelect = (option: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption) {
      Alert.alert('답변 필요', '옵션을 선택해주세요.');
      return;
    }

    // 답변 저장
    const answer: OnboardingAnswer = {
      id: currentQuestion.id,
      question: currentQuestion.question,
      answer: selectedOption,
      category: currentQuestion.category
    };

    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < onboardingQuestions.length - 1) {
      // 다음 질문으로
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      // 온보딩 완료 - 데이터 저장 및 분석 시작
      completeOnboarding(updatedAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // 이전 답변 복원
      const previousAnswer = answers[currentQuestionIndex - 1];
      setSelectedOption(previousAnswer?.answer || '');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const completeOnboarding = async (finalAnswers: OnboardingAnswer[]) => {
    // 온보딩 데이터 저장
    dataService.saveOnboardingData(finalAnswers);

    // 성공 진동
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // 로딩 화면으로 이동
    router.push('/onboarding/loading-animated');
  };

  const handleSkip = () => {
    Alert.alert(
      '온보딩 건너뛰기',
      '온보딩을 건너뛰면 정확한 분석이 어려울 수 있습니다. 계속하시겠습니까?',
      [
        {
          text: '계속하기',
          style: 'cancel'
        },
        {
          text: '건너뛰기',
          style: 'destructive',
          onPress: () => router.replace('/(tabs)/')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <ThemedText style={styles.skipButtonText}>건너뛰기</ThemedText>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <ThemedText style={styles.progressText}>
            {currentQuestionIndex + 1}/{onboardingQuestions.length}
          </ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* 캐릭터 */}
          <View style={styles.characterContainer}>
            <ThemedText style={styles.characterEmoji}>🐱🤔</ThemedText>
            <ThemedText style={styles.characterText}>
              당신에 대해 알고 싶어요!
            </ThemedText>
          </View>

          {/* 질문 */}
          <View style={styles.questionContainer}>
            <ThemedText style={styles.questionNumber}>
              질문 {currentQuestionIndex + 1}
            </ThemedText>
            <ThemedText style={styles.questionText}>
              {currentQuestion.question}
            </ThemedText>
          </View>

          {/* 옵션 */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOption === option && styles.optionButtonSelected
                ]}
                onPress={() => handleOptionSelect(option)}
                activeOpacity={0.8}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionRadio,
                    selectedOption === option && styles.optionRadioSelected
                  ]}>
                    {selectedOption === option && (
                      <View style={styles.optionRadioInner} />
                    )}
                  </View>
                  <ThemedText style={[
                    styles.optionText,
                    selectedOption === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* 버튼 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.previousButton,
                currentQuestionIndex === 0 && styles.previousButtonDisabled
              ]}
              onPress={handlePrevious}
              disabled={currentQuestionIndex === 0}
              activeOpacity={0.8}
            >
              <ThemedText style={[
                styles.previousButtonText,
                currentQuestionIndex === 0 && styles.previousButtonTextDisabled
              ]}>
                이전
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.nextButton,
                !selectedOption && styles.nextButtonDisabled
              ]}
              onPress={handleNext}
              disabled={!selectedOption}
              activeOpacity={0.8}
            >
              <ThemedText style={[
                styles.nextButtonText,
                !selectedOption && styles.nextButtonTextDisabled
              ]}>
                {currentQuestionIndex === onboardingQuestions.length - 1 ? '완료' : '다음'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  skipButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#59AC77',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: height - 200,
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  characterEmoji: {
    fontSize: 60,
    lineHeight: 70,
    marginBottom: 16,
  },
  characterText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
  questionContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  questionNumber: {
    fontSize: 14,
    color: '#59AC77',
    fontWeight: '600',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    lineHeight: 28,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 32,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    padding: 16,
    marginBottom: 12,
  },
  optionButtonSelected: {
    backgroundColor: '#F0F9FF',
    borderColor: '#59AC77',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRadioSelected: {
    borderColor: '#59AC77',
  },
  optionRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#59AC77',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
    flex: 1,
  },
  optionTextSelected: {
    color: '#333333',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  previousButton: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  previousButtonDisabled: {
    opacity: 0.5,
  },
  previousButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
  },
  previousButtonTextDisabled: {
    color: '#CCCCCC',
  },
  nextButton: {
    backgroundColor: '#59AC77',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    flex: 1,
  },
  nextButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  nextButtonTextDisabled: {
    color: '#999999',
  },
});