import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar, Dimensions, ScrollView, TouchableOpacity, Share } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Svg, Path, Circle, Text as SvgText, Polygon } from 'react-native-svg';
import { OnboardingDataService, Big5AnalysisData } from '../services/OnboardingDataService';

const { width, height } = Dimensions.get('window');

export default function ResultAnimatedScreen() {
  const router = useRouter();
  const [animationProgress, setAnimationProgress] = useState(0);
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<Big5AnalysisData | null>(null);
  const [showFullReport, setShowFullReport] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const dataService = OnboardingDataService.getInstance();

  useEffect(() => {
    // 분석 결과 가져오기
    const result = dataService.getAnalysisResult();

    if (!result) {
      // 결과가 없으면 온보딩으로 돌아가기
      router.replace('/onboarding');
      return;
    }

    setAnalysisData(result);

    // 성공 진동
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // 애니메이션 시작
    startAnimations();

    // 진행 애니메이션
    const animationTimer = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(animationTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(animationTimer);
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 방사형 그래프 생성 (실제 데이터 사용)
  const createRadarChart = () => {
    if (!analysisData) return null;

    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    const data = analysisData.scores;
    const traits = Object.keys(data) as Array<keyof typeof data>;

    // 점수를 백분위로 변환 (1-10점 → 0-100%)
    const percentData = traits.map(trait => data[trait] * 10);

    // 5개의 각도 (360도 / 5 = 72도)
    const angles = traits.map((_, index) => (index * 72 - 90) * (Math.PI / 180));

    // 데이터 포인트
    const dataPoints = traits.map((trait, index) => {
      const value = percentData[index];
      const distance = (value / 100) * radius;
      const x = centerX + Math.cos(angles[index]) * distance;
      const y = centerY + Math.sin(angles[index]) * distance;
      return `${x},${y}`;
    });

    // 그리드 라인
    const gridLines = [];
    for (let i = 1; i <= 5; i++) {
      const gridRadius = (radius / 5) * i;
      const gridPoints = angles.map((angle, index) => {
        const x = centerX + Math.cos(angle) * gridRadius;
        const y = centerY + Math.sin(angle) * gridRadius;
        return `${x},${y}`;
      });
      gridLines.push(
        <Polygon
          key={`grid-${i}`}
          points={gridPoints.join(' ')}
          fill="none"
          stroke="#E0E0E0"
          strokeWidth="1"
        />
      );
    }

    // 축 라인
    const axisLines = angles.map((angle, index) => {
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      return (
        <Path
          key={`axis-${index}`}
          d={`M ${centerX} ${centerY} L ${x} ${y}`}
          stroke="#CCCCCC"
          strokeWidth="1"
        />
      );
    });

    return (
      <Svg width="300" height="300" viewBox="0 0 300 300">
        {gridLines}
        {axisLines}

        {/* 데이터 폴리곤 */}
        <Polygon
          points={dataPoints.join(' ')}
          fill="rgba(89,172,119,0.2)"
          stroke="#59AC77"
          strokeWidth="2"
        />

        {/* 데이터 포인트 */}
        {dataPoints.map((point, index) => {
          const [x, y] = point.split(',').map(Number);
          return (
            <Circle
              key={`point-${index}`}
              cx={x}
              cy={y}
              r="6"
              fill="#59AC77"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          );
        })}

        {/* 라벨 */}
        {traits.map((trait, index) => {
          const labelRadius = radius + 30;
          const x = centerX + Math.cos(angles[index]) * labelRadius;
          const y = centerY + Math.sin(angles[index]) * labelRadius;

          return (
            <SvgText
              key={`label-${index}`}
              x={x}
              y={y}
              fill="#333333"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {getBig5Label(trait)}
            </SvgText>
          );
        })}
      </Svg>
    );
  };

  const getBig5Label = (trait: string): string => {
    const labels: Record<string, string> = {
      openness: '개방성',
      conscientiousness: '성실성',
      extraversion: '외향성',
      agreeableness: '우호성',
      neuroticism: '안정성',
    };
    return labels[trait] || trait;
  };

  const getBig5Description = (trait: string): string => {
    const descriptions: Record<string, string> = {
      openness: '새로운 경험에 열린 태도',
      conscientiousness: '목표 지향적이고 체계적',
      extraversion: '사회적이고 에너지 넘침',
      agreeableness: '협조적이고 공감 능력 높음',
      neuroticism: '정서적으로 안정적',
    };
    return descriptions[trait] || '';
  };

  const handleShare = async () => {
    try {
      if (!analysisData) return;

      const personaType = analysisData.personaType;
      const message = `나는 '${personaType}' 타입의 집사님! 🐱\n하루 앱으로 Big5 성격 유형을 확인해보세요!`;

      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleStartApp = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(tabs)/');
  };

  const handleViewFullReport = () => {
    setShowFullReport(!showFullReport);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (!analysisData) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText style={styles.loadingText}>데이터를 불러오는 중...</ThemedText>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* 캣터스와 결과 */}
          <View style={styles.resultHeader}>
            <View style={styles.characterContainer}>
              <ThemedText style={styles.characterEmoji}>🐱🎉</ThemedText>
            </View>

            <ThemedText style={styles.resultTitle}>
              분석이 완료되었어요!
            </ThemedText>

            <ThemedText style={styles.personaType}>
              당신은 {'\n'}
              <ThemedText style={styles.personaTypeText}>
                {analysisData.personaType}
              </ThemedText>
              {'\n'} 타입의 집사님
            </ThemedText>

            <ThemedText style={styles.personaDescription}>
              {dataService.getPersonaDescription(analysisData.personaType)}
            </ThemedText>
          </View>

          {/* 방사형 그래프 */}
          <View style={styles.chartContainer}>
            <ThemedText style={styles.chartTitle}>Big5 성격 유형 분석</ThemedText>
            <View style={styles.chartWrapper}>
              {createRadarChart()}
            </View>
          </View>

          {/* 성격 특성 상세 */}
          <View style={styles.traitsContainer}>
            <View style={styles.traitsHeader}>
              <ThemedText style={styles.traitsTitle}>성격 특성</ThemedText>
              <TouchableOpacity
                style={styles.fullReportButton}
                onPress={handleViewFullReport}
              >
                <ThemedText style={styles.fullReportButtonText}>
                  {showFullReport ? '간단히 보기' : '전체 보고서'}
                </ThemedText>
              </TouchableOpacity>
            </View>

            {Object.entries(analysisData.scores).map(([trait, value]) => (
              <TouchableOpacity
                key={trait}
                style={[
                  styles.traitItem,
                  selectedTrait === trait && styles.traitItemSelected
                ]}
                onPress={() => setSelectedTrait(selectedTrait === trait ? null : trait)}
              >
                <View style={styles.traitHeader}>
                  <ThemedText style={styles.traitName}>
                    {getBig5Label(trait)}
                  </ThemedText>
                  <ThemedText style={styles.traitValue}>
                    {(value * 10).toFixed(0)}%
                  </ThemedText>
                </View>

                {/* 진행 막대 */}
                <View style={styles.traitBar}>
                  <View
                    style={[
                      styles.traitBarFill,
                      { width: `${(animationProgress / 100) * (value * 10)}%` }
                    ]}
                  />
                </View>

                <ThemedText style={styles.traitDescription}>
                  {getBig5Description(trait)}
                </ThemedText>

                {/* 근거 표시 */}
                {selectedTrait === trait && analysisData.evidence[trait] && (
                  <View style={styles.evidenceContainer}>
                    <ThemedText style={styles.evidenceTitle}>발견된 특징:</ThemedText>
                    {analysisData.evidence[trait].high_indicators.length > 0 && (
                      <View style={styles.evidenceItem}>
                        <ThemedText style={styles.evidenceLabel}>긍정적:</ThemedText>
                        <ThemedText style={styles.evidenceText}>
                          {analysisData.evidence[trait].high_indicators.join(', ')}
                        </ThemedText>
                      </View>
                    )}
                    {analysisData.evidence[trait].low_indicators.length > 0 && (
                      <View style={styles.evidenceItem}>
                        <ThemedText style={styles.evidenceLabel}>제한적:</ThemedText>
                        <ThemedText style={styles.evidenceText}>
                          {analysisData.evidence[trait].low_indicators.join(', ')}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {/* 전체 보고서 */}
            {showFullReport && (
              <View style={styles.fullReportContainer}>
                <ThemedText style={styles.fullReportTitle}>📋 전체 분석 보고서</ThemedText>
                <ThemedText style={styles.fullReportText}>
                  {analysisData.report}
                </ThemedText>
              </View>
            )}

            {/* AI 통찰 */}
            <View style={styles.insightContainer}>
              <ThemedText style={styles.insightTitle}>💡 AI 통찰</ThemedText>
              <ThemedText style={styles.insightText}>
                {analysisData.llm_insights}
              </ThemedText>
              <ThemedText style={styles.processingTime}>
                처리 시간: {analysisData.processing_time}초
              </ThemedText>
            </View>
          </View>

          {/* 버튼들 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.shareButtonText}>
                결과 공유하기
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartApp}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.startButtonText}>
                하루와 시작하기
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

// Line 컴포넌트
const Line = ({ x1, y1, x2, y2, stroke, strokeWidth }: any) => (
  <Path
    d={`M ${x1} ${y1} L ${x2} ${y2}`}
    stroke={stroke}
    strokeWidth={strokeWidth}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 18,
    color: '#666666',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 40,
  },
  content: {
    width: width * 0.9,
    alignItems: 'center',
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  characterContainer: {
    marginBottom: 20,
  },
  characterEmoji: {
    fontSize: 80,
    lineHeight: 90,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  personaType: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 12,
  },
  personaTypeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#59AC77',
  },
  personaDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  chartWrapper: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
  },
  traitsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  traitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  traitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  fullReportButton: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#59AC77',
  },
  fullReportButtonText: {
    fontSize: 12,
    color: '#59AC77',
    fontWeight: '600',
  },
  traitItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  traitItemSelected: {
    backgroundColor: '#E8F5E8',
  },
  traitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  traitName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  traitValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#59AC77',
  },
  traitBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  traitBarFill: {
    height: '100%',
    backgroundColor: '#59AC77',
    borderRadius: 4,
  },
  traitDescription: {
    fontSize: 14,
    color: '#666666',
  },
  evidenceContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  evidenceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  evidenceItem: {
    marginBottom: 6,
  },
  evidenceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#59AC77',
    marginRight: 8,
  },
  evidenceText: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  fullReportContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  fullReportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  fullReportText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#666666',
  },
  insightContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#59AC77',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
    marginBottom: 8,
  },
  processingTime: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  shareButton: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#59AC77',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#59AC77',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#59AC77',
    paddingHorizontal: 40,
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
    textAlign: 'center',
  },
});