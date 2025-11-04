# 하루온 (Haru-On) 프로젝트 작업 지침

## 프로젝트 개요
**하루온**은 온디바이스 Big5 심리 분석 리포트 앱입니다. 사용자의 5가지 답변을 기반으로 Qwen2-1.5B 기반 sLLM이 심리 분석 리포트를 생성합니다.

## 개발 환경 설정

### 🖥️ 개발 시스템 정보
- **기기**: MacBook Pro (M4 Pro, 2024)
- **모델**: Mac16,8 / Z1FE0004VKH/A
- **칩셋**: Apple M4 Pro
- **CPU 코어**: 12코어 (8개 성능 + 4개 효율)
- **메모리**: 48 GB 통합 메모리
- **저장 공간**:
  - 내장 SSD: 460GB (사용 10GB, 여유 31GB)
  - 외장 저장소: 931GB (사용 245GB, 여유 686GB)
- **OS**: macOS 최신 버전
- **시리얼**: LXW77NWF65

### 시스템 상태
- **메모리 사용률**: 42% 여유
- **스왑 사용**: 적극적 (Swapins: 5,230,035, Swapouts: 8,028,840)
- **압축기**: 활성 (Pages used: 1,398,288)
- **메모리 압박**: 정상 상태

### 기술 스택
- **프레임워크**: Expo (React Native)
- **언어**: TypeScript
- **빌드 방식**: Expo Development Client 또는 Prebuild (Expo Go 불가)
- **AI 모델**: Qwen2-1.5B (GGUF 형식, 4비트 양자화)
- **추론 엔진**: llama.cpp
- **타겟 플랫폼**: iOS (최신 버전 - 2)

### 프로젝트 구조
```
haru-on/
├── app/                 # Expo Router 기반 앱 구조
├── components/          # 재사용 가능한 컴포넌트
│   ├── Button/         # 버튼 컴포넌트 시스템
│   ├── Typography/     # 텍스트 컴포넌트
│   └── TouchRipple/    # 터치 효과 컴포넌트
├── hooks/              # 커스텀 훅
│   ├── useFonts.ts     # 폰트 로딩
│   └── useOnDeviceSLLM.ts # 온디바이스 sLLM 훅
├── services/           # 비즈니스 로직 및 API
├── styles/             # 스타일 관련
├── utils/              # 유틸리티 함수
├── types/              # TypeScript 타입 정의
├── assets/             # 정적 리소스
│   ├── fonts/          # 폰트 파일
│   └── images/         # 이미지 리소스
└── docs/               # 프로젝트 문서
    ├── PRD.md          # 제품 요구사항 문서
    ├── app-requirement.md
    └── qwen-model-tuning-guide.md
```

## 개발 가이드라인

### 1. 컴포넌트 개발

#### 버튼 컴포넌트 시스템
- **기본 컴포넌트**: `/components/Button/Button.tsx`
- **타입**: `/types/button.ts`
- **스타일**: `/components/Button/Button.styles.ts`
- **팩토리**: `/components/Button/Button.factory.ts`
- **테마**: `/styles/theme.ts`

**버튼 변형**:
- **Primary**: 주요 CTA, 중요한 작업
- **Secondary**: 보조 작업, 취소/뒤로가기 버튼
- **Ghost**: 최소한의 시각적 영향, 3차적 작업

**사이즈 시스템**:
- **Small (sm)**: 32px 높이, 14px 폰트, 조밀한 인터페이스
- **Medium (md)**: 44px 높이, 16px 폰트, 표준 사용 (기본값)
- **Large (lg)**: 56px 높이, 18px 폰트, 중요한 CTA

### 2. 상태 관리
- React State 및 Context API 사용
- 복잡한 상태는 useReducer 사용 고려
- 비동기 상태 관리를 위한 커스텀 훅 활용

### 3. 스타일링
- StyleSheet API 사용
- 테마 기반 스타일링 (colors, spacing, typography)
- 다크 모드 지원 고려
- 반응형 디자인 (다양한 기기 크기)

### 4. 타이포그래피
- Typography 컴포넌트 사용
- 일관된 폰트 크기 및 웨이트 사용
- 가독성 최적화

## 핵심 기능 구현

### 1. Big5 질문 응답 시스템
```typescript
// 질문 타입 정의
interface Big5Question {
  id: string;
  trait: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
  question: string;
  hint: string;
  maxLength: number; // 500자
}

// 답변 타입 정의
interface UserAnswer {
  questionId: string;
  answer: string;
  timestamp: Date;
}
```

### 2. 온디바이스 sLLM 연동
```typescript
// sLLM 훅 사용 예시
import { useOnDeviceSLLM } from '@/hooks/useOnDeviceSLLM';

const {
  isLoading,
  error,
  generateReport,
  isGenerating
} = useOnDeviceSLLM();

// 리포트 생성
const handleGenerateReport = async (answers: UserAnswer[]) => {
  try {
    const prompt = buildPrompt(answers);
    const report = await generateReport(prompt);
    return report;
  } catch (error) {
    // 에러 처리
  }
};
```

## M4 Pro 최적화 설정

### 1. 환경 변수 설정
```bash
# MPS (Metal Performance Shaders) 최적화
export PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.0
export PYTORCH_ENABLE_MPS_FALLBACK=1
export OMP_NUM_THREADS=8
export MKL_NUM_THREADS=8
```

### 2. 배치 크기 최적화
- **기본 배치 크기**: 2 (48GB 메모리 기준)
- **그래디언트 누적**: 8
- **유효 배치 크기**: 16

### 3. 메모리 관리
- **모델 정밀도**: float16
- **MPS 메모리 비율**: 80%
- **압축기 활용**: Apple Silicon 메모리 압축 자동 활용

### 4. 성능 기대치
- **모델 로딩**: < 3초 (48GB 메모리)
- **추론 속도**: < 10초 (M4 Pro 최적화)
- **병렬 처리**: 12코어 활용

### 3. 프롬프트 생성
```typescript
const buildPrompt = (answers: UserAnswer[]): string => {
  const systemPrompt = `당신은 Big5 심리학 모델을 기반으로 사용자의 답변을 분석하는 전문 심리 분석가입니다.
사용자의 5가지 답변을 바탕으로, 각 특성(개방성, 성실성, 외향성, 우호성, 신경성)을 분석하고
긍정적이며 통찰력 있는 종합 리포트를 작성해주세요. 절대 의학적 진단을 내리지 마세요.`;

  const userAnswers = answers.map((answer, index) =>
    `${index + 1}. ${answer.questionId}: ${answer.answer}`
  ).join('\n');

  return `${systemPrompt}\n\n${userAnswers}`;
};
```

## 성능 요구사항

### 1. 모델 로딩
- **목표**: 5초 이내
- **구현**: 앱 시작 시 또는 첫 사용 시 모델 로딩
- **상태 표시**: "분석 엔진을 준비 중입니다..."

### 2. 리포트 생성
- **목표**: 15초 이내 (5개 답변, 2,500자 이내)
- **구현**: 프롬프트 생성 → sLLM 추론 → 결과 반환
- **상태 표시**: "리포트를 작성 중입니다..."

### 3. 메모리 관리
- 앱 크래시 방지를 위한 메모리 최적화
- 모델 언로드 기능 고려
- 백그라운드에서의 모델 해제

## 보안 및 프라이버시

### 1. 데이터 처리
- 모든 데이터 처리는 기기 내부에서 완료 (100% On-Device)
- 외부 서버로 데이터 전송 금지
- 로컬 저장 시 암호화 고려

### 2. 모델 보안
- GGUF 모델 파일의 무결성 검증
- 역공격 및 모델 추출 방지

## 테스트 전략

### 1. 단위 테스트
- 컴포넌트 테스트 (React Native Testing Library)
- 훅 테스트
- 유틸리티 함수 테스트

### 2. 통합 테스트
- sLLM 연동 테스트
- 프롬프트 생성 테스트
- 전체 사용자 흐름 테스트

### 3. 성능 테스트
- 모델 로딩 시간 측정
- 리포트 생성 시간 측정
- 메모리 사용량 모니터링

## 배포 및 빌드

### 1. Expo 개발 환경
```bash
# Expo Development Client 빌드
npx expo install --fix
npx expo run:ios

# Prebuild (EAS Build)
npx expo prebuild
eas build --platform ios
```

### 2. 모델 파일 포함
- GGUF 모델 파일을 assets 폴더에 포함
- Metro 번들러 설정 확인
- 앱 크기 모니터링 (1.5GB 이내 권장)

## 개발 명령어

### 주요 명령어
```bash
# 개발 서버 시작
npx expo start

# iOS 시뮬레이터에서 실행
npx expo run:ios

# 타입 검사
npx tsc --noEmit

# 린트 검사
npx eslint .

# 테스트 실행
npm test
```

### 디버깅
- Flipper 사용
- React Native Debugger 활용
- 콘솔 로그 적극 활용

## 문서 관리

### 1. 코드 문서화
- JSDoc 주석 사용
- 컴포넌트 prop 타입 명확화
- README 파일 유지보수

### 2. API 문서
- sLLM API 문서화
- 프롬프트 템플릿 문서화
- 내부 API 규격 정의

## 주의사항

### 1. 모델 페르소나 유지
- 생성된 리포트는 항상 전문성, 공감 능력, 통찰력, 조심성, 구조화된 특성 유지
- 단정적인 진단 표현 금지
- 가능성을 제시하는 어조 사용

### 2. 에러 핸들링
- 모델 로딩 실패 시 사용자 친화적인 에러 메시지
- 재시도 옵션 제공
- 오프라인 상태에서의 동작 보장

### 3. 사용자 경험
- 로딩 상태 명확한 표시
- 진행 상황 시각적 피드백
- 접근성 고려 (스크린 리더 지원)

## 개발 환경 명령어

### M4 Pro 전용 명령어
```bash
# 환경 활성화
conda activate qwen-tuning

# MPS 성능 확인
python -c "import torch; print(f'MPS: {torch.backends.mps.is_available()}')"

# llama.cpp 컴파일 (Metal 지원)
cd ~/llama.cpp && LLAMA_METAL=1 make -j$(sysctl -n hw.ncpu)

# 메모리 모니터링
memory_pressure

# Jupyter 최적화 시작
jupyter notebook --NotebookApp.max_buffer_size=10000000000
```

### 일반 개발 명령어
```bash
# 개발 서버 시작
npx expo start

# iOS 시뮬레이터에서 실행
npx expo run:ios

# 타입 검사
npx tsc --noEmit

# 린트 검사
npx eslint .

# 테스트 실행
npm test
```

## 변경 로그

### v0.1.0 (초기 버전)
- 기본 앱 구조 설정
- Big5 질문 시스템 구현
- 온디바이스 sLLM 기본 연동
- 리포트 생성 및 표시 기능

### v0.1.1 (M4 Pro 최적화)
- 개발 시스템 정보 기록 (MacBook Pro M4 Pro, 48GB)
- MPS (Metal Performance Shaders) 최적화 설정 추가
- M4 Pro 전용 성능 기대치 설정
- 메모리 관리 및 배치 크기 최적화