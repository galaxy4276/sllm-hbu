# 온보딩 Big5 분석 통합 가이드

## 🎯 개요

React Native Expo 앱에 온보딩-분석-결과 플로우를 완전히 통합하는 방법입니다. 사용자가 온보딩 질문에 답변하면 실시간으로 Big5 분석을 수행하고, 로딩 스피너와 함께 결과를 시각화하여 보여줍니다.

## 🏗️ 통합 아키텍처

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   온보딩 화면    │    │   로딩 화면      │    │   결과 화면      │
│                 │    │                 │    │                 │
│ • 5개 질문 수집  │──►│ • Big5 분석 실행  │──►│ • 방사형 그래프   │
│ • 사용자 답변     │    │ • 실시간 진행    │    │ • 페르소나 타입  │
│ • 데이터 저장     │    │ • 스피너 애니메이션│    │ • AI 통찰 표시   │
│                 │    │ • 에러 처리      │    │ • 공유 기능      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  데이터 서비스    │    │  Big5 분석기     │    │  LLaMA-Factory  │
│                 │    │                 │    │                 │
│ • 답변 관리      │    │ • 규칙 기반 분석  │    │ • Qwen2-1.5B     │
│ • 텍스트 결합    │    │ • LLM 통찰       │    │   LLM 서버     │
│ • 페르소나 계산  │    │ • 점수 계산      │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📁 파일 구조

```
app/
├── services/
│   ├── Big5AnalyzerService.ts      # 하이브리드 Big5 분석기
│   └── OnboardingDataService.ts      # 온보딩 데이터 관리
├── onboarding/
│   ├── main.tsx                      # 온보딩 메인 화면
│   ├── loading-animated.tsx         # 개선된 로딩 화면
│   ├── loading.tsx                   # 기존 로딩 화면
│   ├── result-animated.tsx          # 개선된 결과 화면
│   └── result.tsx                    # 기존 결과 화면
├── components/
│   ├── Big5AnalyzerNative.tsx       # 앱 내 분석기
│   └── Button/                       # 버튼 컴포넌트
└── (tabs)/
    └── index.tsx                     # 메인 화면
```

## 🚀 빠른 시작 가이드

### 1. LLaMA-Factory 서버 실행
```bash
# LLaMA-Factory API 서버 실행
cd /Volumes/eungu/projects/haru-on/llm/LLaMA-Factory
llamafactory-cli api test_inference.yaml

# 확인: http://localhost:8000/v1/chat/completions
```

### 2. 파일 추가
위에서 생성한 파일들을 프로젝트에 추가:
- `app/services/Big5AnalyzerService.ts`
- `app/services/OnboardingDataService.ts`
- `app/onboarding/main.tsx`
- `app/onboarding/loading-animated.tsx`
- `app/onboarding/result-animated.tsx`

### 3. Expo 앱 실행
```bash
npx expo start
# QR 코드 스캔하여 테스트
```

## 🎮 사용자 플로우

### 1. 온보딩 시작
- 5개의 성격 관련 질문 제시
- 각 질문마다 4개의 선택지 제공
- 진행 상황 시각적으로 표시

### 2. 분석 실행 (자동)
- 답변 완료 시 자동으로 로딩 화면으로 이동
- Big5 하이브리드 분석 실시간 수행
- 5단계 분석 과정 애니메이션으로 표시

### 3. 결과 확인
- 방사형 그래프로 Big5 5차원 시각화
- 페르소나 타입 자동 결정
- 상세 분석 보고서 및 AI 통찰 제공
- 결과 공유 기능

## 🔧 기능 상세 설명

### 온보딩 메인 화면 (`main.tsx`)
```typescript
// 주요 기능
- 5개의 질문으로 사용자 성격 데이터 수집
- 실시간 진행률 표시 (20% 단위)
- 이전/다음 버튼으로 답변 수정 가능
- 건너뛰기 옵션 (권장하지 않음)
```

### 로딩 화면 (`loading-animated.tsx`)
```typescript
// 실제 Big5 분석 수행
- 데이터 준비 → 텍스트 분석 → Big5 분석 → 결과 생성 → 완료
- 각 단계별 진행률 표시
- 에러 발생 시 재시도 옵션 제공
- 애니메이션 스피너로 사용자 경험 개선
```

### 결과 화면 (`result-animated.tsx`)
```typescript
// 실제 분석 결과 시각화
- 방사형 그래프: 5개 Big5 차원 동시 표시
- 페르소나 타입: 8가지 유형 자동 결정
- 상세 보고서: 전체 분석 내용 제공
- 근거 표시: 각 특성별 키워드 표시
```

## 📊 분석 결과 데이터 구조

### Big5 점수 (1-10점 척도)
```typescript
{
  openness: 8.5,        // 개방성
  conscientiousness: 9.2, // 성실성
  extraversion: 6.0,     // 외향성
  agreeableness: 7.8,    // 우호성
  neuroticism: 4.3       // 신경성 (낮을수록 안정적)
}
```

### 페르소나 타입 결정 로직
```typescript
// 예시: 높은 개방성 + 높은 외향성 = "창의적 사교가"
if (openness > 70 && extraversion > 70) return "창의적 사교가";
if (conscientiousness > 80 && agreeableness > 80) return "성실한 조화가";
// ... 총 8가지 유형
```

## 🎨 주요 특징

### 1. **실시간 분석**
- 답변 완료 후 즉시 Big5 분석 시작
- 평균 5-15초 내 분석 완료
- 진행 상황 실시간 표시

### 2. **시각적 표현**
- 방사형 그래프로 5차원 동시 표시
- 색상으로 구분된 성격 특성
- 애니메이션 효과로 사용자 경험 개선

### 3. **지능형 처리**
- 규칙 기반 분석 + LLM 통찰 결합
- 자동 페르소나 타입 결정
- 개인화된 조언 생성

### 4. **에러 처리**
- LLM 서버 연결 실패 시 재시도 옵션
- 분석 실패 시 친절한 에러 메시지
- 데이터 유효성 검사

## 🔧 사용자 정의 옵션

### 1. **질문 수정**
```typescript
// onboarding/main.tsx
const onboardingQuestions = [
  {
    id: 'q1',
    question: '새로운 취미를 시작할 때 어떤가요?',
    category: 'lifestyle',
    options: ['즉시 도전한다', '신중하게 계획한다', ...]
  },
  // 더 많은 질문 추가 가능
];
```

### 2. **페르소나 타입 추가**
```typescript
// OnboardingDataService.ts
const determinePersonaType = (scores) => {
  // 새로운 타입 로직 추가
  if (scores.openness > 80 && scores.conscientiousness > 80) {
    return "혁신적 성취가";
  }
  // ...
};
```

### 3. **애니메이션 커스터마이징**
```typescript
// loading-animated.tsx
const animationTimer = setInterval(() => {
  setProgress((prev) => prev + 3); // 속도 조절
}, 120); // 간격 조절
```

## 🚨 주의사항

### 1. **서버 의존성**
- LLM 통찰 기능은 LLaMA-Factory 서버 실행 필요
- `http://localhost:8000/v1/chat/completions` 접속 가능해야 함
- 서버 연결 실패 시 규칙 기반 분석만 제공

### 2. **성능 고려사항**
- Big5 분석: 5-20초 소요 (LLM 통찰 유무에 따라)
- 대량 사용자 시 서버 부하 고려
- 오프라인 모드 지원 검토 필요

### 3. **데이터 저장**
- 현재는 메모리에만 저장 (앱 재시작 시 데이터 초기화)
- AsyncStorage 연동 시 영구적 저장 가능
- 사용자 동의 및 데이터 보호 정책 필요

## 🔄 다음 단계 개선 사항

### 1. **데이터 영속성**
```typescript
// AsyncStorage 연동
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveToStorage = async () => {
  await AsyncStorage.setItem('onboardingData', JSON.stringify(data));
};
```

### 2. **오프라인 모드**
```typescript
// 오프라인 분석 결과 캐싱
const offlineCache = new Map<string, Big5AnalysisData>();
```

### 3. **다국어 지원**
```typescript
// 다국어 질문 및 결과
const i18n = {
  ko: { /* 한국어 질문 */ },
  en: { /* 영어 질문 */ }
};
```

## 📱 테스트 체크리스트

- [ ] LLaMA-Factory 서버 실행 확인
- [ ] 온보딩 화면에서 질문 표시 확인
- [ ] 답변 선택 및 다음 질문 이동 확인
- [ ] 로딩 화면에서 Big5 분석 실행 확인
- [ ] 결과 화면에서 정확한 점수 표시 확인
- [ ] 방사형 그래프 시각화 확인
- [ ] 페르소나 타입 결정 확인
- [ ] AI 통찰 표시 확인
- [ ] 결과 공유 기능 확인
- [ ] 앱 시작 화면으로 돌아가기 확인

## 🎯 배포 준비

1. **테스트**: 실제 기기에서 전체 플로우 테스트
2. **최적화**: 애니메이션 속도 및 성능 최적화
3. **에러 처리**: 네트워크 오류 및 예외 상황 처리
4. **배포**: App Store 및 Google Play 배포

---

*이 가이드를 따라 완전한 온보딩 Big5 분석 시스템을 구현할 수 있습니다!*