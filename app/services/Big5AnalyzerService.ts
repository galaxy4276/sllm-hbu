/**
 * 앱 내에서 직접 작동하는 Big5 하이브리드 분석기
 * API 서버 없이 규칙 기반 + LLM 통찰 결합
 */

export interface Big5Scores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface Big5Evidence {
  score: number;
  high_indicators: string[];
  low_indicators: string[];
}

export interface AnalysisResult {
  scores: Big5Scores;
  evidence: Record<keyof Big5Scores, Big5Evidence>;
  llm_insights: string;
  processing_time: number;
  report: string;
}

export class Big5AnalyzerService {
  private static instance: Big5AnalyzerService;
  private readonly API_URL = 'http://localhost:8000/v1/chat/completions';
  private readonly MODEL_NAME = 'qwen2-1.5b-big5-full';

  // Big5 키워드 사전 (한국어 최적화)
  private readonly big5Keywords = {
    openness: {
      high: ['새로운', '창의적', '실험', '혁신', '예술', '다양한', '호기심', '배우다', '탐험', '개방적', '독창적'],
      low: ['전통적', '보수적', '익숙한', '체계적', '정해진', '규칙적', '반복적', '틀에 박힌']
    },
    conscientiousness: {
      high: ['계획', '목표', '마감', '체계적', '성실', '책임감', '정리', '准时', 'organized', '규칙', '순서'],
      low: ['즉흥적', '충동적', '무계획', '늦다', '산만', 'chaotic', '무질서', '혼란스러운']
    },
    extraversion: {
      high: ['사람들', '어울리다', '사교', '에너지', '대화', '리더', '활동적', '外向', '사람', '모임'],
      low: ['혼자', '조용히', '내성적', '개인', '독립적', 'introverted', '조용한', '혼자만']
    },
    agreeableness: {
      high: ['공감', '도우다', '협조', '존중', '중재', '친절', '배려', '우호', '협력', '다정'],
      low: ['경쟁적', '직설적', '비판적', '독립적', 'assertive', '솔직', '비판', '갈등']
    },
    neuroticism: {
      high: ['불안', '스트레스', '걱정', '민감', '감정 기복', '두려움', '신경', '불안정'],
      low: ['안정', '차분', '회복력', '긍정적', '冷静', 'stable', '평온', '침착']
    }
  };

  // 성격 특성 한국어명
  private readonly traitNames = {
    openness: '개방성 (Openness)',
    conscientiousness: '성실성 (Conscientiousness)',
    extraversion: '외향성 (Extraversion)',
    agreeableness: '우호성 (Agreeableness)',
    neuroticism: '신경성 (Neuroticism)'
  };

  // 성격 수준 설명
  private getLevelDescription(score: number): { level: string; emoji: string } {
    if (score >= 8) return { level: '매우 높음', emoji: '🔥' };
    if (score >= 6) return { level: '높음', emoji: '📈' };
    if (score >= 4) return { level: '보통', emoji: '➖' };
    return { level: '낮음', emoji: '📉' };
  }

  private constructor() {}

  public static getInstance(): Big5AnalyzerService {
    if (!Big5AnalyzerService.instance) {
      Big5AnalyzerService.instance = new Big5AnalyzerService();
    }
    return Big5AnalyzerService.instance;
  }

  /**
   * 규칙 기반 Big5 분석 수행
   */
  private ruleBasedAnalysis(text: string): Record<keyof Big5Scores, Big5Evidence> {
    const evidence = {} as Record<keyof Big5Scores, Big5Evidence>;
    const normalizedText = text.toLowerCase();

    for (const [trait, keywords] of Object.entries(this.big5Keywords)) {
      const traitKey = trait as keyof Big5Scores;
      let highScore = 0;
      let lowScore = 0;
      const foundHigh: string[] = [];
      const foundLow: string[] = [];

      // 긍정 키워드 검색
      for (const keyword of keywords.high) {
        if (normalizedText.includes(keyword)) {
          highScore += 1;
          foundHigh.push(keyword);
        }
      }

      // 부정 키워드 검색
      for (const keyword of keywords.low) {
        if (normalizedText.includes(keyword)) {
          lowScore += 1;
          foundLow.push(keyword);
        }
      }

      // 점수 계산 (1-10점)
      const totalKeywords = highScore + lowScore;
      let score: number;
      if (totalKeywords === 0) {
        score = 5; // 기본값
      } else {
        score = 5 + (highScore - lowScore) * 1.5;
        score = Math.max(1, Math.min(10, score));
      }

      evidence[traitKey] = {
        score: Math.round(score * 10) / 10, // 소수점 첫째 자리까지
        high_indicators: foundHigh,
        low_indicators: foundLow
      };
    }

    return evidence;
  }

  /**
   * LLM으로부터 추가 통찰 얻기
   */
  private async getLLMInsights(text: string): Promise<string> {
    try {
      const simplePrompt = `다음 성격 특성에 대해 간단하게 설명해주세요:\n\n${text}\n\n주요 특징을 2-3문장으로 요약해주세요.`;

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.MODEL_NAME,
          messages: [{ role: 'user', content: simplePrompt }],
          temperature: 0.3,
          max_tokens: 200
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '추가 통찰을 얻지 못했습니다.';
    } catch (error) {
      console.warn('LLM 통찰 생성 실패:', error);
      return 'AI 통찰을 생성할 수 없습니다. 규칙 기반 분석만 제공됩니다.';
    }
  }

  /**
   * 개인화된 조언 생성
   */
  private generateAdvice(scores: Big5Scores): string[] {
    const advice: string[] = [];

    if (scores.openness >= 7) {
      advice.push('창의적인 프로젝트나 새로운 기술 학습에 참여하면 만족도가 높을 것입니다.');
    }
    if (scores.conscientiousness >= 7) {
      advice.push('목표 지향적인 업무나 프로젝트 관리 역할에 적합합니다.');
    }
    if (scores.extraversion >= 7) {
      advice.push('팀워크가 중요한 환경이나 리더십 역할에서 좋은 성과를 낼 수 있습니다.');
    }
    if (scores.agreeableness >= 7) {
      advice.push('협업이나 고객 응대, 중재 역할에서 강점을 발휘할 수 있습니다.');
    }
    if (scores.neuroticism <= 4) {
      advice.push('스트레스 관리 능력이 뛰어나 고압 환경에서도 안정적인 성과를 낼 수 있습니다.');
    }

    if (advice.length === 0) {
      advice.push('균형 잡힌 성격으로 다양한 상황에 잘 적응할 수 있습니다.');
    }

    return advice;
  }

  /**
   * 종합 보고서 생성
   */
  private generateComprehensiveReport(
    evidence: Record<keyof Big5Scores, Big5Evidence>,
    llmInsights: string,
    originalText: string,
    scores: Big5Scores
  ): string {
    let report = `# 🧠 Big5 성격 분석 보고서\n\n## 📝 분석 대상\n${originalText.substring(0, 100)}...\n\n## 📊 Big5 5가지 차원 분석\n\n`;

    // 각 특성별 분석 추가
    for (const [trait, analysis] of Object.entries(evidence)) {
      const traitKey = trait as keyof Big5Scores;
      const traitName = this.traitNames[traitKey];
      const score = analysis.score;
      const { level, emoji } = this.getLevelDescription(score);

      report += `### ${emoji} ${traitName}: ${score}/10점 (${level})\n\n**발견된 특징:**\n`;

      if (analysis.high_indicators.length > 0) {
        report += `- 긍정적 지표: ${analysis.high_indicators.join(', ')}\n`;
      }

      if (analysis.low_indicators.length > 0) {
        report += `- 제한적 지표: ${analysis.low_indicators.join(', ')}\n`;
      }

      report += '\n';
    }

    // 주요 특성 분석
    const dominantTraits = Object.entries(scores)
      .filter(([_, score]) => score >= 7)
      .map(([trait, _]) => this.traitNames[trait as keyof Big5Scores]);

    report += `## 🎯 전체적인 성격 유형\n**주요 특성:** ${dominantTraits.length > 0 ? dominantTraits.join(', ') : '균형 잡힌 성격'}\n\n`;

    // AI 통찰 추가
    report += `## 💡 추가 통찰 (AI 분석)\n${llmInsights}\n\n`;

    // 실제 적용 조언
    const advice = this.generateAdvice(scores);
    report += `## 📈 실제 적용 조언\n`;
    advice.forEach(tip => {
      report += `- ${tip}\n`;
    });

    report += `\n---\n*본 분석은 하이브리드 방식(규칙 기반 + AI 통찰)으로 제공되며, 전문가 상담이 필요할 경우 임상심리사와 상담하시기 바랍니다.*`;

    return report;
  }

  /**
   * 전체 분석 수행
   */
  public async analyzePersonality(text: string): Promise<AnalysisResult> {
    const startTime = Date.now();

    // 1. 규칙 기반 분석
    const evidence = this.ruleBasedAnalysis(text);

    // 2. 점수 추출
    const scores: Big5Scores = {
      openness: evidence.openness.score,
      conscientiousness: evidence.conscientiousness.score,
      extraversion: evidence.extraversion.score,
      agreeableness: evidence.agreeableness.score,
      neuroticism: evidence.neuroticism.score
    };

    // 3. LLM 통찰 (비동기)
    const llmInsights = await this.getLLMInsights(text);

    // 4. 종합 보고서 생성
    const report = this.generateComprehensiveReport(evidence, llmInsights, text, scores);

    const processingTime = (Date.now() - startTime) / 1000;

    return {
      scores,
      evidence,
      llm_insights: llmInsights,
      processing_time: Math.round(processingTime * 100) / 100,
      report
    };
  }

  /**
   * LLM 서버 연결 확인
   */
  public async checkLLMAvailability(): Promise<boolean> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.MODEL_NAME,
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10
        }),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}