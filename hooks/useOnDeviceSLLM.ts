import { useState, useEffect, useCallback, useRef } from 'react';
import { OnDeviceSLLMService } from '../services/OnDeviceSLLMService';

export interface SLLMMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface UseOnDeviceSLLMOptions {
  autoInitialize?: boolean;
  modelPath?: string;
  onReady?: () => void;
  onError?: (error: string) => void;
}

export function useOnDeviceSLLM({
  autoInitialize = true,
  modelPath,
  onReady,
  onError
}: UseOnDeviceSLLMOptions = {}) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<SLLMMessage[]>([]);
  const [modelInfo, setModelInfo] = useState<{ vocabSize: number; params: number } | null>(null);

  const serviceRef = useRef<OnDeviceSLLMService | null>(null);
  const isInitializedRef = useRef(false);

  // 서비스 초기화
  useEffect(() => {
    if (!isInitializedRef.current && autoInitialize) {
      initializeService();
    }

    return () => {
      if (serviceRef.current) {
        serviceRef.current.dispose();
      }
    };
  }, [autoInitialize]);

  const initializeService = useCallback(async () => {
    if (isInitializedRef.current) return;

    try {
      setError(null);
      setIsLoading(true);

      console.log('sLLM 서비스 초기화 중...');

      if (!serviceRef.current) {
        serviceRef.current = new OnDeviceSLLMService();
      }

      if (modelPath) {
        await serviceRef.current.loadModel(modelPath);
      } else {
        await serviceRef.current.initialize();
      }

      const info = serviceRef.current.getModelInfo();
      setModelInfo({
        vocabSize: info.vocabSize,
        params: info.params
      });

      setIsReady(true);
      isInitializedRef.current = true;
      setIsLoading(false);

      console.log('sLLM 서비스 준비 완료');
      onReady?.();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '서비스 초기화 실패';
      setError(errorMessage);
      setIsLoading(false);
      onError?.(errorMessage);
      console.error('sLLM 서비스 초기화 실패:', err);
    }
  }, [modelPath, onReady, onError]);

  // 메시지 생성
  const generateResponse = useCallback(async (inputText: string): Promise<string> => {
    if (!isReady || !serviceRef.current) {
      throw new Error('서비스가 준비되지 않았습니다');
    }

    try {
      setError(null);
      setIsLoading(true);

      const response = await serviceRef.current.generateResponse(inputText);
      return response;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '응답 생성 실패';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isReady]);

  // 채팅 메시지 추가
  const addMessage = useCallback(async (text: string, isUser: boolean = true) => {
    const message: SLLMMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);

    if (isUser) {
      try {
        const response = await generateResponse(text);
        const botMessage: SLLMMessage = {
          id: (Date.now() + 1).toString(),
          text: response,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (err) {
        console.error('봇 응답 생성 실패:', err);
      }
    }
  }, [generateResponse]);

  // 모델 파인튜닝
  const fineTuneModel = useCallback(async (
    trainingData: { input: string; output: string }[],
    epochs: number = 5
  ) => {
    if (!isReady || !serviceRef.current) {
      throw new Error('서비스가 준비되지 않았습니다');
    }

    try {
      setError(null);
      setIsLoading(true);

      await serviceRef.current.fineTune(trainingData, epochs);

      const info = serviceRef.current.getModelInfo();
      setModelInfo({
        vocabSize: info.vocabSize,
        params: info.params
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '파인튜닝 실패';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isReady]);

  // 모델 저장
  const saveModel = useCallback(async (): Promise<string> => {
    if (!isReady || !serviceRef.current) {
      throw new Error('서비스가 준비되지 않았습니다');
    }

    return await serviceRef.current.saveModel();
  }, [isReady]);

  // 메시지 기록 초기화
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 상태
    isReady,
    isLoading,
    error,
    messages,
    modelInfo,

    // 메서드
    initializeService,
    generateResponse,
    addMessage,
    fineTuneModel,
    saveModel,
    clearMessages,
    clearError,

    // 유틸리티
    service: serviceRef.current
  };
}