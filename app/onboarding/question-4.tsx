import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, Dimensions, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Question4Screen() {
  const router = useRouter();
  const [userInput, setUserInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = {
    id: 4,
    title: '우호성',
    text: '주변 사람들이 힘들어할 때 어떻게 행동하시는 편인가요?',
    hint: '예: 먼저 다가가서 위로해요, 조용히 곁을 지켜줘요 등'
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    setIsSubmitting(true);

    console.log('Question 4 Answer:', userInput);

    setTimeout(() => {
      router.push('/onboarding/question-5');
    }, 500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
              {/* 진행 상태 표시 */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '80%' }]} />
                </View>
                <ThemedText style={styles.progressText}>4/5</ThemedText>
              </View>

              {/* 질문 번호와 제목 */}
              <View style={styles.questionHeader}>
                <ThemedText style={styles.questionNumber}>질문 {question.id}</ThemedText>
                <ThemedText style={styles.questionTitle}>{question.title}</ThemedText>
              </View>

              {/* 캣터스 이미지 */}
              <View style={styles.characterContainer}>
                <View style={styles.characterPlaceholder}>
                  <ThemedText style={styles.characterEmoji}>🐱❤️</ThemedText>
                </View>
              </View>

              {/* 질문 텍스트 */}
              <View style={styles.textContainer}>
                <ThemedText style={styles.questionText}>
                  {question.text}
                </ThemedText>
                <ThemedText style={styles.hintText}>
                  {question.hint}
                </ThemedText>
              </View>

              {/* 답변 입력 영역 */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={userInput}
                  onChangeText={setUserInput}
                  placeholder="자유롭게 답변해주세요..."
                  placeholderTextColor="#999999"
                  multiline
                  maxLength={500}
                  textAlignVertical="top"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                <ThemedText style={styles.charCount}>
                  {userInput.length}/500
                </ThemedText>
              </View>

              {/* 다음 버튼 */}
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  (!userInput.trim() || isSubmitting) && styles.disabledButton
                ]}
                onPress={handleSubmit}
                disabled={!userInput.trim() || isSubmitting}
                activeOpacity={0.8}
              >
                <ThemedText style={styles.nextButtonText}>
                  {isSubmitting ? '저장 중...' : '다음'}
                </ThemedText>
              </TouchableOpacity>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height,
  },
  content: {
    flex: 1,
    width: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#59AC77',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#59AC77',
  },
  questionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  questionNumber: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  characterContainer: {
    marginBottom: 30,
  },
  characterPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#F8F8F8',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#59AC77',
  },
  characterEmoji: {
    fontSize: 40,
    lineHeight: 50,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 28,
  },
  hintText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  textInput: {
    width: '100%',
    height: 120,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#333333',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'right',
    marginTop: 8,
  },
  nextButton: {
    backgroundColor: '#59AC77',
    paddingHorizontal: 40,
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
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});