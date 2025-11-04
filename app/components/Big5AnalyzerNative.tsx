import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Button } from './Button';
import { Big5AnalyzerService, AnalysisResult } from '../services/Big5AnalyzerService';

const { width } = Dimensions.get('window');

interface ScoreBarProps {
  label: string;
  score: number;
  color: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ label, score, color }) => {
  const barWidth = (score / 10) * (width - 80); // 최대 너비 계산

  return (
    <View style={styles.scoreContainer}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <View style={styles.scoreBarContainer}>
        <View style={[styles.scoreBar, { width: barWidth, backgroundColor: color }]} />
        <Text style={styles.scoreValue}>{score.toFixed(1)}/10</Text>
      </View>
    </View>
  );
};

export const Big5AnalyzerNative: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [llmAvailable, setLlmAvailable] = useState<boolean | null>(null);
  const [showDetailed, setShowDetailed] = useState(false);

  const analyzer = Big5AnalyzerService.getInstance();

  // LLM 서버 연결 상태 확인
  useEffect(() => {
    checkLLMAvailability();
  }, []);

  const checkLLMAvailability = async () => {
    setLlmAvailable(null);
    try {
      const available = await analyzer.checkLLMAvailability();
      setLlmAvailable(available);
    } catch (error) {
      setLlmAvailable(false);
    }
  };

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
      const analysisResult = await analyzer.analyzePersonality(text.trim());
      setResult(analysisResult);
      setShowResult(true);
    } catch (error) {
      console.error('분석 오류:', error);
      Alert.alert(
        '분석 오류',
        '분석 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setText('');
    setResult(null);
    setShowResult(false);
    setShowDetailed(false);
  };

  const retryAnalysis = () => {
    if (text.trim()) {
      analyzePersonality();
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>🧠 Big5 성격 분석</Text>
        <Text style={styles.subtitle}>
          당신의 성격을 5가지 차원으로 분석해드립니다
        </Text>

        {/* LLM 서버 상태 표시 */}
        <View style={styles.statusContainer}>
          {llmAvailable === null && (
            <View style={styles.statusItem}>
              <ActivityIndicator size="small" color="#59AC77" />
              <Text style={styles.statusText}>서버 연결 확인 중...</Text>
            </View>
          )}
          {llmAvailable === false && (
            <View style={styles.statusItem}>
              <Text style={[styles.statusText, styles.statusError]}>⚠️ 서버 연결 실패</Text>
              <TouchableOpacity onPress={checkLLMAvailability}>
                <Text style={styles.retryLink}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          )}
          {llmAvailable === true && (
            <View style={styles.statusItem}>
              <Text style={[styles.statusText, styles.statusSuccess]}>✅ 서버 연결 정상</Text>
            </View>
          )}
        </View>
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
            <Text style={styles.processingTime}>
              처리 시간: {result.processing_time}초
            </Text>
          </View>

          {/* Big5 점수 시각화 */}
          <View style={styles.scoresSection}>
            <ScoreBar
              label="🧠 개방성"
              score={result.scores.openness}
              color="#FF6B6B"
            />
            <ScoreBar
              label="🎯 성실성"
              score={result.scores.conscientiousness}
              color="#4ECDC4"
            />
            <ScoreBar
              label="🌟 외향성"
              score={result.scores.extraversion}
              color="#45B7D1"
            />
            <ScoreBar
              label="🤝 우호성"
              score={result.scores.agreeableness}
              color="#96CEB4"
            />
            <ScoreBar
              label="😰 신경성"
              score={result.scores.neuroticism}
              color="#FECA57"
            />
          </View>

          {/* 상세 분석 전환 */}
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowDetailed(!showDetailed)}
          >
            <Text style={styles.toggleButtonText}>
              {showDetailed ? '간단히 보기 ▲' : '상세 분석 보기 ▼'}
            </Text>
          </TouchableOpacity>

          {showDetailed && (
            <View style={styles.detailedResult}>
              <Text style={styles.resultText}>{result.report}</Text>
            </View>
          )}

          {/* AI 통찰 표시 */}
          <View style={styles.insightSection}>
            <Text style={styles.insightTitle}>💡 AI 통찰</Text>
            <Text style={styles.insightText}>
              {llmAvailable ? result.llm_insights : '서버 연결이 필요합니다.'}
            </Text>
          </View>

          {/* 결과 액션 */}
          <View style={styles.resultActions}>
            <Button
              onPress={() => {
                Alert.alert('공유', '곧 결과 공유 기능이 추가됩니다!');
              }}
              variant="secondary"
              style={styles.actionButton}
            >
              📤 결과 공유하기
            </Button>

            {!llmAvailable && (
              <Button
                onPress={retryAnalysis}
                variant="secondary"
                style={styles.actionButton}
              >
                🔄 서버 재연결 후 분석
              </Button>
            )}
          </View>
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>💡 Big5 5가지 성격 차원</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>🧠</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoItemTitle}>개방성</Text>
              <Text style={styles.infoItemDesc}>새로운 경험에 대한 열린 태도</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>🎯</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoItemTitle}>성실성</Text>
              <Text style={styles.infoItemDesc}>목표 지향적이고 체계적인 성향</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>🌟</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoItemTitle}>외향성</Text>
              <Text style={styles.infoItemDesc}>사교적이고 에너지 넘치는 성향</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>🤝</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoItemTitle}>우호성</Text>
              <Text style={styles.infoItemDesc}>타인과의 조화와 협력 성향</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>😰</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoItemTitle}>신경성</Text>
              <Text style={styles.infoItemDesc}>감정적 안정성과 스트레스 반응</Text>
            </View>
          </View>
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
    marginBottom: 16,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#636e72',
  },
  statusSuccess: {
    color: '#00b894',
  },
  statusError: {
    color: '#e17055',
  },
  retryLink: {
    fontSize: 14,
    color: '#0984e3',
    textDecorationLine: 'underline',
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
    marginBottom: 20,
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
  scoresSection: {
    marginBottom: 20,
  },
  scoreContainer: {
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 8,
  },
  scoreBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  scoreBar: {
    height: '100%',
    borderRadius: 12,
    marginRight: 12,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    minWidth: 50,
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f1f8ff',
    borderRadius: 8,
    marginBottom: 16,
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#0984e3',
    fontWeight: '600',
  },
  detailedResult: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#2d3436',
  },
  insightSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f1f8ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#59AC77',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#636e72',
  },
  resultActions: {
    gap: 12,
  },
  actionButton: {
    alignSelf: 'center',
  },
  infoSection: {
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
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  infoEmoji: {
    fontSize: 24,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 2,
  },
  infoItemDesc: {
    fontSize: 12,
    color: '#636e72',
    lineHeight: 16,
  },
});