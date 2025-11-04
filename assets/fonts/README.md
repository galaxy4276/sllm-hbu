# Fonts Directory

이 디렉토리에는 Pretendard 폰트 파일들이 저장됩니다.

## ✅ 현재 설치된 폰트

Pretendard OTF 폰트 파일들이 설치되어 있습니다:

- `Pretendard-Thin.otf` (100)
- `Pretendard-ExtraLight.otf` (200)
- `Pretendard-Light.otf` (300)
- `Pretendard-Regular.otf` (400)
- `Pretendard-Medium.otf` (500)
- `Pretendard-SemiBold.otf` (600)
- `Pretendard-Bold.otf` (700)
- `Pretendard-ExtraBold.otf` (800)
- `Pretendard-Black.otf` (900)

## Expo 설정

`app.json` 파일에 모든 Pretendard 폰트가 등록되어 있습니다:

```json
{
  "expo": {
    "fonts": [
      "./assets/fonts/Pretendard-Thin.otf",
      "./assets/fonts/Pretendard-ExtraLight.otf",
      "./assets/fonts/Pretendard-Light.otf",
      "./assets/fonts/Pretendard-Regular.otf",
      "./assets/fonts/Pretendard-Medium.otf",
      "./assets/fonts/Pretendard-SemiBold.otf",
      "./assets/fonts/Pretendard-Bold.otf",
      "./assets/fonts/Pretendard-ExtraBold.otf",
      "./assets/fonts/Pretendard-Black.otf"
    ]
  }
}
```

## Typography 시스템과의 연동

Pretendard 폰트는 Typography 시스템과 Button 컴포넌트에 자동으로 적용됩니다.

### 사용 방법

**1. Typography Provider로 앱 감싸기:**
```tsx
import { TypographyProvider } from './components/Typography';

export default function App() {
  return (
    <TypographyProvider>
      {/* 앱 컴포넌트들 */}
    </TypographyProvider>
  );
}
```

**2. Typography 컴포넌트 사용:**
```tsx
import { Typography } from './components/Typography';

<Typography variant="h1" weight="bold">
  Pretendard 폰트가 적용된 텍스트
</Typography>
```

**3. Button 컴포넌트 사용:**
```tsx
import { Button } from './components/Button';

<Button variant="primary">
  Pretendard 폰트가 자동 적용됨
</Button>
```

## 폰트 웨이트 매핑

| Typography Weight | Pretendard 파일 |
|-------------------|-----------------|
| `thin` (100) | `Pretendard-Thin.otf` |
| `extralight` (200) | `Pretendard-ExtraLight.otf` |
| `light` (300) | `Pretendard-Light.otf` |
| `regular` (400) | `Pretendard-Regular.otf` |
| `medium` (500) | `Pretendard-Medium.otf` |
| `semibold` (600) | `Pretendard-SemiBold.otf` |
| `bold` (700) | `Pretendard-Bold.otf` |
| `black` (900) | `Pretendard-Black.otf` |

## 테스트

Pretendard 폰트가 올바르게 적용되는지 테스트하려면:

```tsx
import { ButtonTypographyTest } from './components/Button';

// 앱에 테스트 컴포넌트 추가
<ButtonTypographyTest />
```

## 문제 해결

**폰트가 보이지 않을 경우:**

1. **Expo 개발 서버 재시작:**
   ```bash
   npx expo start --clear
   ```

2. **캐시 삭제:**
   ```bash
   npx expo start -c
   ```

3. **폰트 파일 경로 확인:**
   - `app.json`의 폰트 경로가 실제 파일 위치와 일치하는지 확인
   - 파일 이름의 대소문자 확인

4. **앱 재빌드:**
   ```bash
   npx expo run:ios    # iOS의 경우
   npx expo run:android # Android의 경우
   ```

## Pretendard 폰트 정보

- **제작자**: Orion Cactus
- **버전**: 1.3.9
- **라이선스**: OFL (Open Font License)
- **특징**:
  - 한국어 웹 환경 최적화
  - Apple System UI와 유사한 디자인
  - 9가지 웨이트 지원
  - 다양한 언어 지원 (한글, 영문, 숫자, 기호)

## 추가 정보

- [Pretendard 공식 GitHub](https://github.com/orioncactus/pretendard)
- [Pretendard 웹사이트](https://orioncactus.github.io/pretendard/)
- [OFL 라이선스](https://scripts.sil.org/OFL)

## 필요한 폰트 파일

프로젝트에서 사용할 Pretendard 폰트 파일들:

- `Pretendard-Black.ttf`
- `Pretendard-Bold.ttf`
- `Pretendard-SemiBold.ttf`
- `Pretendard-Medium.ttf`
- `Pretendard-Regular.ttf`
- `Pretendard-Light.ttf`
- `Pretendard-ExtraLight.ttf`
- `Pretendard-Thin.ttf`

## React Native 설정

### package.json에 폰트 등록
```json
{
  "react-native": {
    "assets": ["./assets/fonts/"]
  }
}
```

### 폰트 링크 실행
```bash
npx react-native link react-native-vector-icons
# 또는 Expo의 경우:
npx expo install expo-font
```

### 사용법
```tsx
<Text style={{ fontFamily: 'Pretendard-Regular' }}>
  Pretendard 폰트 테스트
</Text>
```

## 폰트 웨이트별 용도

- **Thin (100)**: 데코레이티브 텍스트
- **ExtraLight (200)**: 디자인 요소
- **Light (300)**: 부제목, 소제목
- **Regular (400)**: 본문, 일반 텍스트
- **Medium (500)**: 강조 텍스트
- **SemiBold (600)**: 소제목, 강조
- **Bold (700)**: 제목, 중요 텍스트
- **Black (900)**: 헤드라인, 특별 강조