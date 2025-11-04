import { useFonts } from 'expo-font';
import { fontFamilies } from '../styles/theme';

/**
 * Custom hook to load Pretendard fonts
 * Returns loading state and font loaded status
 */
export const usePretendardFonts = () => {
  const [fontsLoaded] = useFonts({
    [fontFamilies.thin]: require('../assets/fonts/Pretendard-Thin.otf'),
    [fontFamilies.extralight]: require('../assets/fonts/Pretendard-ExtraLight.otf'),
    [fontFamilies.light]: require('../assets/fonts/Pretendard-Light.otf'),
    [fontFamilies.regular]: require('../assets/fonts/Pretendard-Regular.otf'),
    [fontFamilies.medium]: require('../assets/fonts/Pretendard-Medium.otf'),
    [fontFamilies.semibold]: require('../assets/fonts/Pretendard-SemiBold.otf'),
    [fontFamilies.bold]: require('../assets/fonts/Pretendard-Bold.otf'),
    [fontFamilies.black]: require('../assets/fonts/Pretendard-Black.otf'),
  });

  return {
    fontsLoaded,
    isLoading: !fontsLoaded,
  };
};

/**
 * Hook to load essential fonts only (for faster loading)
 */
export const useEssentialFonts = () => {
  const [fontsLoaded] = useFonts({
    [fontFamilies.regular]: require('../assets/fonts/Pretendard-Regular.otf'),
    [fontFamilies.medium]: require('../assets/fonts/Pretendard-Medium.otf'),
    [fontFamilies.bold]: require('../assets/fonts/Pretendard-Bold.otf'),
  });

  return {
    fontsLoaded,
    isLoading: !fontsLoaded,
  };
};