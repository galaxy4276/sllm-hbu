/**
 * 온보딩 데이터 관리 서비스
 * 사용자 응답 수집 및 Big5 분석 연동
 */

export interface OnboardingAnswer {
  id: string;
  question: string;
  answer: string;
  category: 'lifestyle' | 'personality' | 'preference' | 'social' | 'emotional';
}

export interface OnboardingData {
  answers: OnboardingAnswer[];
  personalityText: string;
  completedAt: Date;
}

export interface Big5AnalysisData {
  scores: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  evidence: Record<string, {
    score: number;
    high_indicators: string[];
    low_indicators: string[];
  }>;
  llm_insights: string;
  processing_time: number;
  report: string;
  personaType: string;
}

export class OnboardingDataService {
  private static instance: OnboardingDataService;
  private onboardingData: OnboardingData | null = null;
  private analysisResult: Big5AnalysisData | null = null;

  private constructor() {}

  public static getInstance(): OnboardingDataService {
    if (!OnboardingDataService.instance) {
      OnboardingDataService.instance = new OnboardingDataService();
    }
    return OnboardingDataService.instance;
  }

  /**
   * 온보딩 응답 데이터 저장
   */
  public saveOnboardingData(answers: OnboardingAnswer[]): void {
    // 모든 답변을 하나의 텍스트로 결합
    const personalityText = answers
      .map(answer => `${answer.question} ${answer.answer}`)
      .join('. ');

    this.onboardingData = {
      answers,
      personalityText,
      completedAt: new Date()
    };
  }

  /**
   * 온보딩 데이터 가져오기
   */
  public getOnboardingData(): OnboardingData | null {
    return this.onboardingData;
  }

  /**
   * Big5 분석 결과 저장
   */
  public saveAnalysisResult(analysisData: Big5AnalysisData): void {
    this.analysisResult = analysisData;
  }

  /**
   * Big5 분석 결과 가져오기
   */
  public getAnalysisResult(): Big5AnalysisData | null {
    return this.analysisResult;
  }

  /**
   * 페르소나 타입 결정
   */
  public determinePersonaType(scores: Big5AnalysisData['scores']): string {
    const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = scores;

    // Big5 점수를 백분위로 변환 (1-10점 → 0-100%)
    const opennessPct = openness * 10;
    const conscientiousnessPct = conscientiousness * 10;
    const extraversionPct = extraversion * 10;
    const agreeablenessPct = agreeableness * 10;
    const neuroticismPct = (10 - neuroticism) * 10; // 신경성은 역으로 계산 (안정성)

    // 페르소나 타입 로직
    if (opennessPct > 70 && extraversionPct > 70) return "창의적 사교가";
    if (conscientiousnessPct > 80 && agreeablenessPct > 80) return "성실한 조화가";
    if (neuroticismPct > 70 && agreeablenessPct > 70) return "차분한 친구";
    if (opennessPct > 70 && conscientiousnessPct > 70) return "통찰력 있는 계획가";
    if (extraversionPct > 70 && neuroticismPct > 70) return "사교적 안정가";
    if (conscientiousnessPct > 80 && neuroticismPct > 60) return "성실한 안정가";
    if (opennessPct > 70 && agreeablenessPct > 70) return "개방적인 조화가";
    if (extraversionPct > 70 && conscientiousnessPct > 70) return "사교적 성실가";

    return "균형잡힌 탐구가";
  }

  /**
   * 페르소나 타입 설명
   */
  public getPersonaDescription(personaType: string): string {
    const descriptions: Record<string, string> = {
      "창의적 사교가": "새로운 아이디어를 즐기고 사람들과의 교류를 통해 영감을 얻는 타입",
      "성실한 조화가": "체계적이고 목표 지향적이며 타인과의 조화를 중시하는 타입",
      "차분한 친구": "감정적으로 안정되고 다른 사람들과 편안한 관계를 형성하는 타입",
      "통찰력 있는 계획가": "새로운 경험을 열어두면서도 체계적인 계획을 세우는 타입",
      "사교적 안정가": "사람들과 어울리기를 즐기면서도 감정적 안정을 유지하는 타입",
      "성실한 안정가": "계획적이고 책임감이 강하며 감정적으로 안정된 타입",
      "개방적인 조화가": "새로운 경험에 열려 있고 다른 사람들과 잘 어울리는 타입",
      "사교적 성실가": "사람들과의 교류를 즐기면서도 목표 지향적인 타입",
      "균형잡힌 탐구가": "다양한 특성이 균형 있게 조화된 타입"
    };

    return descriptions[personaType] || "독특한 매력을 가진 타입";
  }

  /**
   * 데이터 초기화
   */
  public clearData(): void {
    this.onboardingData = null;
    this.analysisResult = null;
  }

  /**
   * 데이터가 완료되었는지 확인
   */
  public isDataComplete(): boolean {
    return this.onboardingData !== null && this.analysisResult !== null;
  }

  /**
   * 온보딩 상태 저장 (AsyncStorage)
   */
  public async saveToStorage(): Promise<void> {
    try {
      // AsyncStorage가 필요하면 여기에 구현
      // 현재는 메모리에만 저장
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }

  /**
   * 온보딩 상태 불러오기 (AsyncStorage)
   */
  public async loadFromStorage(): Promise<void> {
    try {
      // AsyncStorage가 필요하면 여기에 구현
      // 현재는 메모리에만 저장
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  }
}