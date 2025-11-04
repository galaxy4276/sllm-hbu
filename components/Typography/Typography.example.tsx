import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import {
  Typography,
  H1,
  H2,
  H3,
  H4,
  Body,
  Lead,
  Small,
  Caption,
  Label,
  DisplayText,
  ErrorMessage,
  SuccessMessage,
  WarningMessage,
  InfoMessage,
  TypographyUtils,
  TypographyProvider,
} from './index';

const { width: screenWidth } = Dimensions.get('window');

// Responsive typography example
const ResponsiveTitle = TypographyUtils.createResponsive('h2', {
  small: 'h4',
  medium: 'h3',
  large: 'h1',
});

// Custom styled typography example
const CustomStyledText = TypographyUtils.createStyled({
  fontSize: 20,
  fontWeight: '600',
  color: '#59AC77',
  letterSpacing: 1,
});

export const TypographyExamples = () => {
  const [customFont, setCustomFont] = useState<string | undefined>();

  const longText = `
    이것은 긴 본문 텍스트의 예시입니다.
    Pretendard 폰트는 한국어 웹 환경에서 최적의 가독성을 제공하도록 설계된 시스템 폰트 대체용 폰트입니다.
    다양한 웨이트와 크기를 지원하여 어떤 콘텐츠에도 잘 어울립니다.
    편안한 색상 팔레트를 사용하여 눈의 피로를 줄여줍니다.
  `;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Typography variant="h1" color="primary">Typography 컴포넌트 예시</Typography>
        <Typography variant="p" color="secondary">Pretendard 폰트를 사용한 다양한 텍스트 스타일</Typography>
      </View>

      {/* Basic Typography Variants */}
      <View style={styles.section}>
        <Typography variant="h2" color="primary">기본 변형 (Basic Variants)</Typography>

        <View style={styles.exampleGroup}>
          <H1>H1 - 메인 헤드라인</H1>
          <Typography variant="caption">32px, Bold, #2D3748</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <H2>H2 - 페이지 제목</H2>
          <Typography variant="caption">28px, Bold, #2D3748</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <H3>H3 - 섹션 제목</H3>
          <Typography variant="caption">24px, SemiBold, #2D3748</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <H4>H4 - 소제목</H4>
          <Typography variant="caption">20px, SemiBold, #2D3748</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="h5">H5 - 작은 제목</Typography>
          <Typography variant="caption">18px, Medium, #2D3748</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="h6">H6 - 마이크로 제목</Typography>
          <Typography variant="caption">16px, Medium, #2D3748</Typography>
        </View>
      </View>

      {/* Body Text Variants */}
      <View style={styles.section}>
        <Typography variant="h2" color="primary">본문 텍스트 (Body Text)</Typography>

        <View style={styles.exampleGroup}>
          <Typography variant="lead">
            리드 텍스트는 섹션을 소개하는 중요한 텍스트입니다.
            조금 더 큰 크기로 돋보이게 만듭니다.
          </Typography>
          <Typography variant="caption">18px, Regular, #4A5568</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Body>
            {longText}
          </Body>
          <Typography variant="caption">16px, Regular, #2D3748</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Small>
            작은 텍스트는 부가 정보나 각주에 사용됩니다.
            본문보다 작지만 가독성을 유지합니다.
          </Small>
          <Typography variant="caption">14px, Regular, #4A5568</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Caption>
            캡션 텍스트는 이미지 설명이나 라벨에 사용됩니다.
          </Caption>
          <Typography variant="caption">12px, Regular, #718096</Typography>
        </View>
      </View>

      {/* Color Variants */}
      <View style={styles.section}>
        <Typography variant="h2" color="primary">색상 변형 (Color Variants)</Typography>

        <View style={styles.exampleGroup}>
          <Typography variant="p" color="primary">Primary 텍스트</Typography>
          <Typography variant="caption">#2D3748 - 부드러운 검은색</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" color="secondary">Secondary 텍스트</Typography>
          <Typography variant="caption">#4A5568 - 뮤트된 보조색</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" color="tertiary">Tertiary 텍스트</Typography>
          <Typography variant="caption">#718096 - 더 옅은 보조색</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" color="accent">Accent 텍스트</Typography>
          <Typography variant="caption">#59AC77 - 브랜드 컬러</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" color="muted">Muted 텍스트</Typography>
          <Typography variant="caption">#A0AEC0 - 매우 옅은 텍스트</Typography>
        </View>
      </View>

      {/* Semantic Colors */}
      <View style={styles.section}>
        <Typography variant="h2" color="primary">의미론적 색상 (Semantic Colors)</Typography>

        <View style={styles.exampleGroup}>
          <SuccessMessage>✓ 성공 메시지</SuccessMessage>
        </View>

        <View style={styles.exampleGroup}>
          <WarningMessage>⚠ 경고 메시지</WarningMessage>
        </View>

        <View style={styles.exampleGroup}>
          <ErrorMessage>✗ 에러 메시지</ErrorMessage>
        </View>

        <View style={styles.exampleGroup}>
          <InfoMessage>ℹ 정보 메시지</InfoMessage>
        </View>
      </View>

      {/* Weight Variants */}
      <View style={styles.section}>
        <Typography variant="h2" color="primary">폰트 웨이트 (Font Weights)</Typography>

        <View style={styles.exampleGroup}>
          <Typography variant="p" weight="thin">Thin (100) - 가장 얇은 폰트</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" weight="light">Light (300) - 얇은 폰트</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" weight="regular">Regular (400) - 기본 폰트</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" weight="medium">Medium (500) - 중간 굵기</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" weight="semibold">SemiBold (600) - 반은 굵은 폰트</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" weight="bold">Bold (700) - 굵은 폰트</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" weight="black">Black (900) - 가장 굵은 폰트</Typography>
        </View>
      </View>

      {/* Text Alignment */}
      <View style={styles.section}>
        <Typography variant="h2" color="primary">텍스트 정렬 (Text Alignment)</Typography>

        <View style={styles.exampleGroup}>
          <Typography variant="p" align="left">왼쪽 정렬 텍스트</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" align="center">중앙 정렬 텍스트</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" align="right">오른쪽 정렬 텍스트</Typography>
        </View>
      </View>

      {/* Text Decoration */}
      <View style={styles.section}>
        <Typography variant="h2" color="primary">텍스트 장식 (Text Decoration)</Typography>

        <View style={styles.exampleGroup}>
          <Typography variant="p" decoration="none">기본 텍스트 (장식 없음)</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" decoration="underline">밑줄 텍스트</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" decoration="line-through">취소선 텍스트</Typography>
        </View>
      </View>

      {/* Text Transform */}
      <View style={styles.section}>
        <Typography variant="h2" color="primary">텍스트 변환 (Text Transform)</Typography>

        <View style={styles.exampleGroup}>
          <Typography variant="p" transform="none">기본 텍스트 (변환 없음)</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" transform="capitalize">첫 글자만 대문자</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" transform="uppercase">모두 대문자</Typography>
        </View>

        <View style={styles.exampleGroup}>
          <Typography variant="p" transform="lowercase">모두 소문자</Typography>
        </View>
      </View>

      {/* Responsive Typography */}
      <View style={styles.section}>
        <Typography variant="h2" color="primary">반응형 타이포그래피</Typography>

        <View style={styles.exampleGroup}>
          <ResponsiveTitle screenWidth={screenWidth}>
            화면 크기에 따라 변하는 제목
          </ResponsiveTitle>
          <Typography variant="caption">
            현재 화면 너비: {screenWidth}px
          </Typography>
        </View>
      </View>

      {/* Custom Styled Typography */}
      <View style={styles.section}>
        <Typography variant="h2" color="primary">커스텀 스타일 타이포그래피</Typography>

        <View style={styles.exampleGroup}>
          <CustomStyledText>커스텀 스타일이 적용된 텍스트</CustomStyledText>
          <Typography variant="caption">20px, 600, #59AC77, LetterSpacing: 1</Typography>
        </View>
      </View>

      {/* Typography with Context */}
      <View style={styles.section}>
        <Typography variant="h2" color="primary">테마 컨텍스트 (Theme Context)</Typography>

        <TypographyProvider fontFamily="Pretendard-Bold" customColors={{ primary: '#59AC77' }}>
          <View style={styles.exampleGroup}>
            <Typography>컨텍스트에서 제공하는 폰트와 색상</Typography>
            <Typography variant="caption">커스텀 폰트와 색상이 적용됨</Typography>
          </View>
        </TypographyProvider>
      </View>

      {/* Specialized Typography */}
      <View style={styles.section}>
        <Typography variant="h2" color="primary">특수 목적 타이포그래피</Typography>

        <View style={styles.exampleGroup}>
          <Label>폼 라벨</Label>
          <Caption>14px, Medium, Primary</Caption>
        </View>

        <View style={styles.exampleGroup}>
          <DisplayText>디스플레이 텍스트</DisplayText>
          <Caption>32px, Bold, Primary</Caption>
        </View>
      </View>

      {/* Accessibility Examples */}
      <View style={styles.section}>
        <Typography variant="h2" color="primary">접근성 (Accessibility)</Typography>

        <View style={styles.exampleGroup}>
          <Typography
            variant="p"
            accessible={true}
            accessibilityLabel="스크린 리더용 라벨"
            accessibilityHint="이 텍스트는 접근성을 위해 최적화되었습니다"
          >
            접근성이 적용된 텍스트
          </Typography>
          <Typography variant="caption">accessibility props 적용</Typography>
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  exampleGroup: {
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
});

export default TypographyExamples;