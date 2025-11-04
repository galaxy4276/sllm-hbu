import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar, Dimensions, ScrollView, TouchableOpacity, Share } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Svg, Path, Circle, Text as SvgText, Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Big5 결과 데이터 (예시)
const mockBig5Data = {
  openness: 75,
  conscientiousness: 85,
  extraversion: 60,
  agreeableness: 90,
  neuroticism: 40,
};

const big5Labels = {
  openness: '개방성',
  conscientiousness: '성실성',
  extraversion: '외향성',
  agreeableness: '우호성',
  neuroticism: '안정성',
};

const big5Descriptions = {
  openness: '새로운 경험에 열린 태도',
  conscientiousness: '목표 지향적이고 체계적',
  extraversion: '사회적이고 에너지 넘침',
  agreeableness: '협조적이고 공감 능력 높음',
  neuroticism: '정서적으로 안정적',
};

export default function ResultScreen() {
  const router = useRouter();
  const [animationProgress, setAnimationProgress] = useState(0);
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // 애니메이션
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

  // 페르소나 타입 결정
  const getPersonaType = () => {
    const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = mockBig5Data;

    if (openness > 70 && extraversion > 70) return "창의적 사교가";
    if (conscientiousness > 80 && agreeableness > 80) return "성실한 조화가";
    if (neuroticism < 30 && agreeableness > 70) return "차분한 친구";
    if (openness > 70 && conscientiousness > 70) return "통찰력 있는 계획가";
    return "균형잡힌 탐구가";
  };

  // 방사형 그래프 생성
  const createRadarChart = () => {
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    const data = mockBig5Data;
    const traits = Object.keys(data) as Array<keyof typeof data>;

    // 5개의 각도 (360도 / 5 = 72도)
    const angles = traits.map((_, index) => (index * 72 - 90) * (Math.PI / 180));

    // 데이터 포인트
    const dataPoints = traits.map((trait, index) => {
      const value = data[trait];
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
        <Line
          key={`axis-${index}`}
          x1={centerX}
          y1={centerY}
          x2={x}
          y2={y}
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
              {big5Labels[trait]}
            </SvgText>
          );
        })}
      </Svg>
    );
  };

  const handleShare = async () => {
    try {
      const personaType = getPersonaType();
      await Share.share({
        message: `나는 '${personaType}' 타입의 집사님! 🐱\n하루 앱으로 Big5 성격 유형을 확인해보세요!`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleStartApp = () => {
    router.replace('/(tabs)/');
  };

  return (
    <View style={styles.container}>
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
                  {getPersonaType()}
                </ThemedText>
                {'\n'} 타입의 집사님
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
              <ThemedText style={styles.traitsTitle}>성격 특성</ThemedText>
              {Object.entries(mockBig5Data).map(([trait, value]) => (
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
                      {big5Labels[trait as keyof typeof big5Labels]}
                    </ThemedText>
                    <ThemedText style={styles.traitValue}>
                      {value}%
                    </ThemedText>
                  </View>

                  {/* 진행 막대 */}
                  <View style={styles.traitBar}>
                    <View
                      style={[
                        styles.traitBarFill,
                        { width: `${(animationProgress / 100) * value}%` }
                      ]}
                    />
                  </View>

                  <ThemedText style={styles.traitDescription}>
                    {big5Descriptions[trait as keyof typeof big5Descriptions]}
                  </ThemedText>
                </TouchableOpacity>
              ))}
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
    </View>
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
  },
  personaTypeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#59AC77',
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
  traitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
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