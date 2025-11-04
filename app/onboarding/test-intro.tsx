import React from 'react';
import { StyleSheet, View, StatusBar, Dimensions, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function TestIntroScreen() {
  const router = useRouter();

  const handleStartQuestions = () => {
    router.push('/onboarding/question-1');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* 진행 상태 표시 */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '20%' }]} />
              </View>
              <ThemedText style={styles.progressText}>1/5</ThemedText>
            </View>

            {/* 캣터스 이미지 */}
            <View style={styles.characterContainer}>
              <View style={styles.characterPlaceholder}>
                <ThemedText style={styles.characterEmoji}>🐭🤔</ThemedText>
              </View>
            </View>

            {/* 질문 문구 */}
            <View style={styles.textContainer}>
              <ThemedText style={styles.timeQuestion}>
                요즘 하루 중 가장 마음이 편안해지는 시간대는 언제인가요?
              </ThemedText>

              <ThemedText style={styles.reassurance}>
                잠깐, 준비되셨나요?
              </ThemedText>

              <ThemedText style={styles.description}>
                편안하게 생각나는대로 대답해주세요{'\n\n'}
                5가지 질문이 진행되며, 길게 진행되지 않아요{'\n'}
                집사님의 성향을 캣터스가 파악하고자 해요
              </ThemedText>
            </View>

            {/* 시작 버튼 */}
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartQuestions}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.startButtonText}>네, 진행할게요</ThemedText>
            </TouchableOpacity>
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
    paddingVertical: 60,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#59AC77',
    opacity: 0.8,
  },
  characterContainer: {
    marginBottom: 40,
  },
  characterPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#F8F8F8',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#59AC77',
  },
  characterEmoji: {
    fontSize: 50,
    lineHeight: 60,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  timeQuestion: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 32,
  },
  reassurance: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#59AC77',
    paddingHorizontal: 50,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: '#59AC77',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});