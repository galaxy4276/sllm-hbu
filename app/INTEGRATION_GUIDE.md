# Big5 분석기 앱 내 통합 가이드

## 🎯 개요

React Native Expo 앱 내에 하이브리드 Big5 분석기를 직접 통합하는 방법입니다. 별도의 API 서버 없이 앱 자체에서 분석을 수행합니다.

## 🏗️ 통합 아키텍처

```
┌─────────────────┐    ┌──────────────────┐
│   React Native  │    │  LLaMA-Factory   │
│   Expo 앱       │◄──►│  LLM 서버       │
│                 │    │                 │
│ • Big5Analyzer │    │ • Qwen2-1.5B     │
│ • 규칙 기반 분석│    │   Big5 모델     │
│ • UI/UX         │    │ • AI 통찰 제공   │
│ • 결과 시각화    │    │                 │
└─────────────────┘    └──────────────────┘
```

## 📁 파일 구조

```
app/
├── components/
│   ├── Big5AnalyzerNative.tsx  # 메인 분석 컴포넌트
│   ├── Big5Analyzer.tsx         # 기존 API 기반 버전
│   └── Button/                  # 버튼 컴포넌트
├── services/
│   └── Big5AnalyzerService.ts   # 핵심 분석 로직
├── constants/
│   └── api.ts                   # API 설정 (필요시)
└── (tabs)/
    └── index.tsx                # 메인 화면
```

## 🔧 통합 단계

### 1. 서비스 파일 추가

위에서 생성한 `Big5AnalyzerService.ts`를 `app/services/` 폴더에 추가합니다.

### 2. 컴포넌트 파일 추가

`Big5AnalyzerNative.tsx`를 `app/components/` 폴더에 추가합니다.

### 3. 메인 화면에 통합

```typescript
// app/(tabs)/index.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Big5AnalyzerNative } from '../../components/Big5AnalyzerNative';

export default function TabOneScreen() {
  return <Big5AnalyzerNative />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

### 4. 필요한 의존성 확인

```bash
# 이미 설치된 항목들
npm install react-native-svg
npm install react-native-vector-icons

# 추가 필요 시
npm install @types/react
```

## 🚀 실행 방법

### 1. LLaMA-Factory 서버 시작
```bash
# LLaMA-Factory API 서버 실행
cd /Volumes/eungu/projects/haru-on/llm/LLaMA-Factory
llamafactory-cli api test_inference.yaml
```

### 2. Expo 앱 실행
```bash
# Expo 앱 시작
npx expo start

# 휴대폰에서 Expo Go 앱으로 QR 코드 스캔
```

## 🎯 주요 특징

### 1. **앱 내 직접 분석**
- 별도 API 서버 불필요
- 규칙 기반 분석은 오프라인에서도 작동
- LLM 통찰은 서버 연결 시에만 제공

### 2. **시각적 점수 표시**
- 각 Big5 차원별 막대 그래프
- 색상으로 구분된 시각적 표현
- 수치화된 점수 (1-10점 척도)

### 3. **지능형 서버 상태 관리**
- 자동 서버 연결 확인
- 연결 실패 시 오프라인 모드 작동
- 재시도 기능 제공

### 4. **상세/간단 보기 전환**
- 전체 보고서 또는 핵심 결과만 보기
- 사용자 친화적인 인터페이스

## 🔍 기능 비교

| 기능 | API 서버 방식 | 앱 내 통합 방식 |
|------|---------------|----------------|
| **설치** | 복잡 (서버+앱) | 간단 (앱만) |
| **오프라인** | 불가능 | 규칙 기반 분석 가능 |
| **속도** | 네트워크 지연 | 즉각적인 규칙 분석 |
| **유지보수** | 두 곳 관리 | 앱만 관리 |
| **확장성** | 높음 | 보통 |
| **배포** | 복잡 | 간단 |

## 🛠️ 사용자 정의 옵션

### 1. **키워드 추가**
```typescript
// Big5AnalyzerService.ts
private readonly big5Keywords = {
  openness: {
    high: ['새로운', '창의적', '추가 키워드'],
    // ...
  }
};
```

### 2. **점수 계산 조정**
```typescript
// 현재: score = 5 + (highScore - lowScore) * 1.5
// 개선: score = 5 + (highScore - lowScore) * 2.0  // 더 민감한 반응
```

### 3. **UI 테마 변경**
```typescript
// ScoreBar 색상 변경
<ScoreBar score={score} color="#59AC77" />  // 브랜드 색상
```

## 🚨 주의사항

### 1. **네트워크 요구사항**
- LLM 통찰 기능은 인터넷 연결 필요
- LLaMA-Factory 서버 실행 필요
- `http://localhost:8000` 접속 가능해야 함

### 2. **성능 고려사항**
- 규칙 기반 분석: 즉시 완료 (< 0.1초)
- LLM 통찰: 5-20초 소요
- 긴 텍스트 처리 시 메모리 사용량 증가

### 3. **텍스트 길이 제한**
- 최소 10자, 최대 2000자
- 너무 긴 텍스트는 성능 저하 발생

## 🔄 오프라인 모드 개선 방안

### 향후 개선 사항
```typescript
// 오프라인 캐싱 기능
class OfflineCache {
  private cache = new Map<string, AnalysisResult>();

  save(text: string, result: AnalysisResult) {
    this.cache.set(this.hash(text), result);
  }

  load(text: string): AnalysisResult | null {
    return this.cache.get(this.hash(text)) || null;
  }
}
```

## 📱 테스트 체크리스트

- [ ] 앱 설치 및 실행
- [ ] LLaMA-Factory 서버 연결 확인
- [ ] 텍스트 입력 및 분석 테스트
- [ ] 점수 시각화 확인
- [ ] 상세/간단 보기 전환 테스트
- [ ] 오프라인 모드 테스트 (서버 중단 시)
- [ ] 다양한 입력 테스트
- [ ] 에러 처리 확인

## 🎯 다음 단계

1. **테스트**: 다양한 입력으로 기능 검증
2. **최적화**: 키워드 확장 및 UI 개선
3. **오프라인 기능**: 캐싱 및 로컬 분석 강화
4. **배포**: 실제 사용자 테스트 및 피드백 수집

---

*이 가이드를 따라 Big5 분석기를 성공적으로 앱 내에 통합할 수 있습니다!*