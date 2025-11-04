import React from 'react';
import { StyleSheet, View, StatusBar, Dimensions, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  const handleStartTest = () => {
    router.push('/onboarding/test-intro');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
            {/* 캣터스 안내 이미지 */}
            <View style={styles.characterContainer}>
              <View style={styles.characterPlaceholder}>
                <ThemedText style={styles.characterEmoji}>🐱✨</ThemedText>
              </View>
            </View>

            {/* 안내 문구 */}
            <View style={styles.textContainer}>
              <ThemedText style={styles.mainQuestion}>
                당신의 하루는 어떤가요?
              </ThemedText>

              <ThemedText style={styles.description}>
                몇 가지 간단한 질문을 통해{'\n'}캣터스와 친구가 돼주세요
              </ThemedText>

              {/* 보안 안내 */}
              <View style={styles.securityContainer}>
                <View style={styles.securityItem}>
                  <ThemedText style={styles.securityIcon}>🔒</ThemedText>
                  <ThemedText style={styles.securityText}>
                    모든 과정은 기기 내부에서만 이루어져 안전합니다.
                  </ThemedText>
                </View>

                <View style={styles.securityItem}>
                  <ThemedText style={styles.securityIcon}>📱</ThemedText>
                  <ThemedText style={styles.securityText}>
                    어떤 데이터도 누군가에게 전송되지 않습니다.
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* 시작 버튼 */}
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartTest}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.startButtonText}>네, 진행할게요</ThemedText>
            </TouchableOpacity>
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
    paddingVertical: 40,
  },
  characterContainer: {
    marginBottom: 50,
  },
  characterPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#F0F0F0',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#59AC77',
  },
  characterEmoji: {
    fontSize: 60,
    lineHeight: 70,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  mainQuestion: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 40,
    lineHeight: 26,
  },
  securityContainer: {
    width: '100%',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  lastSecurityItem: {
    marginBottom: 0,
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    opacity: 0.8,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 50,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: '#000',
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
    color: '#6B73FF',
  },
});