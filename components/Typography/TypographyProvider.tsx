import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { usePretendardFonts } from '../../hooks/useFonts';
import { TypographyContext, TypographyContextValue } from './Typography.factory';

interface TypographyProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  customColors?: Record<string, string>;
  fontFamily?: string;
  showLoadingIndicator?: boolean;
}

/**
 * Typography Provider that loads Pretendard fonts and provides context
 * Should be used at the root of your app
 */
export const TypographyProvider: React.FC<TypographyProviderProps> = ({
  children,
  fallback,
  customColors,
  fontFamily,
  showLoadingIndicator = true,
}) => {
  const { fontsLoaded, isLoading } = usePretendardFonts();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded && !isReady) {
      setIsReady(true);
    }
  }, [fontsLoaded, isReady]);

  const contextValue: TypographyContextValue = {
    theme: undefined,
    fontFamily: fontFamily || 'Pretendard-Regular',
    customColors,
  };

  // Show loading indicator while fonts are loading
  if (isLoading || !isReady) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showLoadingIndicator) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <ActivityIndicator size="large" color="#59AC77" />
        </View>
      );
    }

    // Return null if no loading indicator should be shown
    return null;
  }

  return (
    <TypographyContext.Provider value={contextValue}>
      {children}
    </TypographyContext.Provider>
  );
};

export default TypographyProvider;