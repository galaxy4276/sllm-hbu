import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Button } from './Button';

interface Big5Result {
  success: boolean;
  analysis?: string;
  error?: string;
  processing_time?: number;
}

export const Big5Analyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Big5Result | null>(null);
  const [showResult, setShowResult] = useState(false);

  const API_URL = 'http://localhost:8000'; // 개발 환경

  const analyzePersonality = async () => {
    if (!text.trim() || text.length < 10) {
      Alert.alert('입력 오류', '최소 10자 이상 입력해주세요.');
      return;
    }

    if (text.length > 2000) {
      Alert.alert('입력 오류', '최대 2000자까지 입력 가능합니다.');
      return;
    }

    setLoading(true);
    setShowResult(false);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          user_id: 'user_123', // 임시 사용자 ID
        }),
      });

      const data: Big5Result = await response.json();

      if (data.success) {
        setResult(data);
        setShowResult(true);
      } else {
        Alert.alert('분석 오류', data.error || '분석에 실패했습니다.');
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
      Alert.alert(
        '네트워크 오류',
        '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setText('');
    setResult(null);
    setShowResult(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>🧠 Big5 성격 분석</Text>
        <Text style={styles.subtitle}>
          당신의 성격을 5가지 차원으로 분석해드립니다
        </Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>
          성격 특성을 자유롭게 설명해주세요
        </Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={6}
          placeholder="예시: 새로운 기술을 배우는 것을 즐기고, 계획을 철저히 세우는 편입니다. 사람들과 어울리는 것도 좋지만 혼자 있는 시간도 중요하게 생각합니다..."
          value={text}
          onChangeText={setText}
          maxLength={2000}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>
          {text.length}/2000자
        </Text>
      </View>

      <View style={styles.buttonSection}>
        <Button
          onPress={analyzePersonality}
          disabled={loading || !text.trim()}
          loading={loading}
          style={styles.analyzeButton}
        >
          {loading ? '분석 중...' : '🔍 성격 분석하기'}
        </Button>

        <Button
          onPress={clearAll}
          variant="secondary"
          disabled={loading}
          style={styles.clearButton}
        >
          지우기
        </Button>
      </View>

      {showResult && result && (
        <View style={styles.resultSection}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>📊 분석 결과</Text>
            {result.processing_time && (
              <Text style={styles.processingTime}>
                처리 시간: {result.processing_time}초
              </Text>
            )}
          </View>

          <View style={styles.resultContent}>
            <Text style={styles.resultText}>{result.analysis}</Text>
          </View>

          <View style={styles.resultActions}>
            <Button
              onPress={() => {
                // 결과 공유 기능
                Alert.alert('공유', '곧 결과 공유 기능이 추가됩니다!');
              }}
              variant="secondary"
            >
              📤 결과 공유하기
            </Button>
          </View>
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>💡 Big5 5가지 성격 차원</Text>
        <View style={styles.infoList}>
          <Text style={styles.infoItem}>🧠 개방성: 새로운 경험에 대한 열린 태도</Text>
          <Text style={styles.infoItem}>🎯 성실성: 목표 지향적이고 체계적인 성향</Text>
          <Text style={styles.infoItem}>🌟 외향성: 사교적이고 에너지 넘치는 성향</Text>
          <Text style={styles.infoItem}>🤝 우호성: 타인과의 조화와 협력 성향</Text>
          <Text style={styles.infoItem}>😰 신경성: 감정적 안정성과 스트레스 반응</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    lineHeight: 22,
  },
  inputSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#2d3436',
    minHeight: 120,
    backgroundColor: '#f8f9fa',
  },
  charCount: {
    fontSize: 12,
    color: '#636e72',
    textAlign: 'right',
    marginTop: 8,
  },
  buttonSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  analyzeButton: {
    marginBottom: 12,
  },
  clearButton: {
    alignSelf: 'center',
  },
  resultSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  processingTime: {
    fontSize: 12,
    color: '#636e72',
  },
  resultContent: {
    marginBottom: 16,
  },
  resultText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#2d3436',
  },
  resultActions: {
    alignItems: 'center',
  },
  infoSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#f1f8ff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#59AC77',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 12,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 14,
    color: '#636e72',
    lineHeight: 20,
  },
});