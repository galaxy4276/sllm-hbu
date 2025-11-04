import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TypographyProvider } from '../Typography';
import { Button, PrimaryButton, SecondaryButton, GhostButton } from './index';

/**
 * Test component to verify Pretendard font integration with Button components
 */
export const ButtonTypographyTest = () => {
  const handlePress = () => {
    console.log('Button pressed - Pretendard font test');
  };

  return (
    <TypographyProvider>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Typography variant="h3" color="primary">
            Pretendard 폰트 테스트 - Button 컴포넌트
          </Typography>
          <Typography variant="p" color="secondary">
            아래 버튼들은 Pretendard OTF 폰트가 적용되어야 합니다.
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="h4">Primary Buttons</Typography>

          <Button variant="primary" onPress={handlePress} style={styles.button}>
            Primary 버튼 (Regular)
          </Button>

          <Button variant="primary" weight="bold" onPress={handlePress} style={styles.button}>
            Primary 버튼 (Bold)
          </Button>

          <PrimaryButton onPress={handlePress} style={styles.button}>
            PrimaryButton (Pre-configured)
          </PrimaryButton>
        </View>

        <View style={styles.section}>
          <Typography variant="h4">Secondary Buttons</Typography>

          <Button variant="secondary" onPress={handlePress} style={styles.button}>
            Secondary 버튼 (Regular)
          </Button>

          <Button variant="secondary" weight="semibold" onPress={handlePress} style={styles.button}>
            Secondary 버튼 (SemiBold)
          </Button>

          <SecondaryButton onPress={handlePress} style={styles.button}>
            SecondaryButton (Pre-configured)
          </SecondaryButton>
        </View>

        <View style={styles.section}>
          <Typography variant="h4">Ghost Buttons</Typography>

          <Button variant="ghost" onPress={handlePress} style={styles.button}>
            Ghost 버튼 (Regular)
          </Button>

          <Button variant="ghost" weight="medium" onPress={handlePress} style={styles.button}>
            Ghost 버튼 (Medium)
          </Button>

          <GhostButton onPress={handlePress} style={styles.button}>
            GhostButton (Pre-configured)
          </GhostButton>
        </View>

        <View style={styles.section}>
          <Typography variant="h4">Size Variants</Typography>

          <Button size="sm" variant="primary" onPress={handlePress} style={styles.button}>
            Small 버튼 (Typography: small)
          </Button>

          <Button size="md" variant="primary" onPress={handlePress} style={styles.button}>
            Medium 버튼 (Typography: p)
          </Button>

          <Button size="lg" variant="primary" onPress={handlePress} style={styles.button}>
            Large 버튼 (Typography: lead)
          </Button>
        </View>

        <View style={styles.section}>
          <Typography variant="h4">Korean Text Test</Typography>

          <Button variant="primary" onPress={handlePress} style={styles.button}>
            한국어 테스트 (한글)
          </Button>

          <Button variant="secondary" onPress={handlePress} style={styles.button}>
            프리텐다드 폰트 테스트
          </Button>

          <Button variant="ghost" onPress={handlePress} style={styles.button}>
            다양한 웨이트 테스트
          </Button>
        </View>

        <View style={styles.section}>
          <Typography variant="h4">Mixed Text Test</Typography>

          <Button variant="primary" onPress={handlePress} style={styles.button}>
            Mixed English/한국어 Test
          </Button>

          <Button variant="secondary" onPress={handlePress} style={styles.button}>
            123 Numbers & 특수문자 @#$!
          </Button>
        </View>

        <View style={styles.section}>
          <Typography variant="caption" color="tertiary">
            만약 위 버튼들의 텍스트가 Pretendard 폰트로 보이지 않는다면:
            1. app.json에 폰트 경로가 올바른지 확인
            2. expo build 후 다시 실행
            3. 캐시 삭제 후 재시작
          </Typography>
        </View>

      </ScrollView>
    </TypographyProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  button: {
    marginBottom: 8,
  },
});

export default ButtonTypographyTest;