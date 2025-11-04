# 하루 (Haru) 🐱 🌱

AI 기반 성격 분석과 고양이 캐릭터를 결합한 혁신적인 반려동물 관리 앱

## 🌟 주요 기능

### 🧠 Big5 성격 분석 시스템
- **LLaMA-Factory** 기반 파인튜닝된 Qwen2-1.5B 모델
- **하이브리드 분석**: 규칙 기반 + AI 통찰 결합
- **5가지 성격 차원**: 개방성, 성실성, 외향성, 우호성, 신경성
- **8가지 페르소나 타입**: 자동 성격 유형 결정

### 🎮 온보딩 플로우
- **5개 질문**으로 성격 데이터 수집
- **실시간 분석**으로 로딩 스피너 표시
- **방사형 그래프**로 시각적 결과 제시
- **AI 통찰** 및 맞춤 조언 제공

### 📱 React Native Expo
- **크로스플랫폼**: iOS & Android 동시 지원
- **애니메이션 효과**: 부드러운 사용자 경험
- **햅틱 피드백**: 촉각적 상호작용
- **반응형 디자인**: 다양한 화면 크기 최적화

## 🚀 시작하기

### 사전 요구사항
- **Node.js** (v18+)
- **npm** 또는 **yarn**
- **Expo Go** 앱 (개발용)

### 1. 의존성 설치
```bash
npm install
```

### 2. LLaMA-Factory 서버 실행 (선택사항)
```bash
cd llm/LLaMA-Factory
llamafactory-cli api test_inference.yaml
```

### 3. Expo 앱 시작
```bash
npx expo start
```

### 4. 앱 실행 방법
- **QR 코드 스캔**: Expo Go 앱으로 스캔
- **iOS 시뮬레이터**: `i` 키 누르기
- **Android 에뮬레이터**: `a` 키 누르기
- **웹 브라우저**: `w` 키 누르기

## 🏗️ 기술 스택

### 프론트엔드
- **React Native** with **Expo**
- **TypeScript** (타입 안전성)
- **React Native SVG** (차트 시각화)
- **Expo Haptics** (향aptic feedback)

### AI/ML
- **LLaMA-Factory** (파인튜닝 프레임워크)
- **Qwen2-1.5B** (기본 LLM)
- **LoRA** (메모리 효율적 파인튜닝)
- **Big5 Psychology Model** (성격 분석)

### 데이터 처리
- **HTTP API** (OpenAI 호환)
- **AsyncStorage** (데이터 영속성)
- **ShareGPT 형식** (데이터셋)

## 📁 프로젝트 구조

```
├── app/
│   ├── services/                    # 비즈니스 로직
│   │   ├── Big5AnalyzerService.ts   # 하이브리드 분석 엔진
│   │   └── OnboardingDataService.ts # 데이터 관리
│   ├── onboarding/                  # 온보딩 화면
│   │   ├── main.tsx                 # 질문 수집
│   │   ├── loading-animated.tsx     # 분석 진행
│   │   └── result-animated.tsx      # 결과 시각화
│   └── (tabs)/                      # 메인 탭 네비게이션
├── llm/
│   └── LLaMA-Factory/               # AI 모델 설정
├── components/                      # 재사용 컴포넌트
└── assets/                         # 이미지 및 폰트
```

## 🧪 테스팅

### 모델 테스트
```bash
cd llm/LLaMA-Factory
python big5_model_tester.py
```

### 하이브리드 분석 테스트
```bash
python hybrid_big5_analyzer.py
```

## 📊 분석 결과

### Big5 5차원 점수
- **개방성 (Openness)**: 새로운 경험에 대한 열린 태도
- **성실성 (Conscientiousness)**: 목표 지향적 체계성
- **외향성 (Extraversion)**: 사회적 에너지 수준
- **우호성 (Agreeableness)**: 협조적 공감 능력
- **신경성 (Neuroticism)**: 정서적 안정성

### 페르소나 타입
- 창의적 사교가, 성실한 조화가, 발전적 리더, 외향적 혁신가
- 내향적 연구가, 안정적 지원가, 신중한 계획가, 감성적 표현가

## 🔧 커스터마이징

### 질문 수정
```typescript
// app/onboarding/main.tsx
const onboardingQuestions = [
  {
    id: 'q1',
    question: '새로운 취미를 시작할 때 어떤가요?',
    options: ['즉시 도전한다', '신중하게 계획한다', ...]
  }
];
```

### 페르소나 타입 추가
```typescript
// app/services/OnboardingDataService.ts
const determinePersonaType = (scores) => {
  if (scores.openness > 80 && scores.conscientiousness > 80) {
    return "혁신적 성취가";
  }
  // ... 추가 로직
};
```

## 🤝 기여

버그 리포트, 기능 요청, 코드 기여는 언제나 환영합니다!

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 운영됩니다.

---

**Made with ❤️ for cat lovers and personality enthusiasts**
