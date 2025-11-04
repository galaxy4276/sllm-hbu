# sLLM 연동 가이드

Expo 프로젝트에 small Language Model(sLLM)을 통합하는 방법에 대한 가이드입니다.

## 개요

이 가이드는 Expo 앱에 sLLM을 통합하는 두 가지 주요 방법을 다룹니다:
- **온디바이스 sLLM**: 로컬에서 모델 실행
- **클라우드 sLLM 연동**: 외부 API와의 통합

## 아키텍처 선택

### 1. 온디바이스 실행 (On-Device)

**장점**
- 오프라인 작동
- 낮은 지연 시간
- 데이터 프라이버시 보호
- API 비용 없음

**단점**
- 모델 크기 제약
- 기기 성능 의존성
- 제한된 모델 성능

**적합한 사용 case**
- 개인화된 추천
- 오프라인 텍스트 생성
- 프라이버시 중심 앱

### 2. 클라우드 API 연동 (Cloud API)

**장점**
- 강력한 모델 성능
- 무제한 모델 크기
- 쉬운 확장성

**단점**
- 인터넷 연결 필요
- API 비용 발생
- 지연 시간 존재

**적합한 사용 case**
- 복잡한 추론 작업
- 높은 정확도 요구
- 다양한 모델 활용

## 필수 패키지 설치

```bash
# 기본 머신러닝 프레임워크
npm install @tensorflow/tfjs-react-native
npm install @tensorflow/tfjs

# 이미지 처리 (선택사항)
npm install @tensorflow/tfjs-react-native-platform

# 클라우드 연동
npm install axios
npm install @react-native-async-storage/async-storage

# 플랫폼별 의존성
npx expo install expo-file-system
npx expo install expo-gl-cpp
```

## 온디바이스 sLLM 구현

### TensorFlow Lite 모델 사용

```typescript
// src/services/OnDeviceSLLMService.ts
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

export class OnDeviceSLLMService {
  private model: tf.LayersModel | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // TensorFlow.js 초기화
      await tf.ready();

      // 모델 로드
      const modelPath = `${FileSystem.documentDirectory}models/sllm-model.json`;
      this.model = await tf.loadLayersModel(modelPath);

      this.isInitialized = true;
      console.log('모델이 성공적으로 로드되었습니다');
    } catch (error) {
      console.error('모델 초기화 실패:', error);
      throw error;
    }
  }

  async generateResponse(inputText: string): Promise<string> {
    if (!this.model) {
      throw new Error('모델이 초기화되지 않았습니다');
    }

    // 텍스트 전처리
    const preprocessed = this.preprocessText(inputText);

    // 모델 추론
    const inputTensor = tf.tensor2d([preprocessed]);
    const prediction = this.model.predict(inputTensor) as tf.Tensor;

    // 결과 후처리
    const response = this.postprocessOutput(prediction);

    // 메모리 정리
    inputTensor.dispose();
    prediction.dispose();

    return response;
  }

  private preprocessText(text: string): number[] {
    // 토크나이징 및 벡터화 로직
    const tokens = text.toLowerCase().split(' ');
    return tokens.map((_, index) => index % 1000); // 간단한 예시
  }

  private postprocessOutput(output: tf.Tensor): string {
    const data = output.dataSync();
    return Array.from(data)
      .map(Math.round)
      .join(' ');
  }

  async dispose(): Promise<void> {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isInitialized = false;
    }
  }
}
```

### 모델 튜닝 기능

```typescript
// src/services/ModelTuner.ts
export class ModelTuner {
  private model: tf.LayersModel | null = null;

  async fineTune(
    model: tf.LayersModel,
    trainingData: { input: string; output: string }[],
    epochs: number = 10
  ): Promise<void> {
    this.model = model;

    // 학습 데이터 준비
    const { inputs, outputs } = this.prepareTrainingData(trainingData);

    // 모델 컴파일
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });

    // 학습 실행
    await this.model.fit(inputs, outputs, {
      epochs,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss}`);
        }
      }
    });

    // 메모리 정리
    inputs.dispose();
    outputs.dispose();
  }

  private prepareTrainingData(data: { input: string; output: string }[]) {
    // 학습 데이터 전처리 로직
    const inputArrays = data.map(item => this.textToTensor(item.input));
    const outputArrays = data.map(item => this.textToTensor(item.output));

    const inputs = tf.stack(inputArrays);
    const outputs = tf.stack(outputArrays);

    return { inputs, outputs };
  }

  private textToTensor(text: string): tf.Tensor {
    // 텍스트를 텐서로 변환
    const tokens = text.toLowerCase().split(' ');
    const vector = tokens.map((_, index) => index % 100);
    return tf.tensor1d(vector);
  }
}
```

## 클라우드 API 연동

### OpenAI API 통합

```typescript
// src/services/CloudSLLMService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CloudSLLMConfig {
  apiKey: string;
  baseURL?: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export class CloudSLLMService {
  private config: CloudSLLMConfig | null = null;
  private cache = new Map<string, string>();

  async initialize(config: CloudSLLMConfig): Promise<void> {
    // 설정 저장
    await AsyncStorage.setItem('sllm_config', JSON.stringify(config));
    this.config = config;
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.config) {
      throw new Error('서비스가 초기화되지 않았습니다');
    }

    // 캐시 확인
    const cacheKey = this.generateCacheKey(prompt);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(this.config.baseURL || 'https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: this.config.maxTokens || 1000,
          temperature: this.config.temperature || 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      const result = data.choices[0]?.message?.content || '';

      // 캐시에 저장
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw error;
    }
  }

  async streamResponse(
    prompt: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    if (!this.config) {
      throw new Error('서비스가 초기화되지 않았습니다');
    }

    try {
      const response = await fetch(this.config.baseURL || 'https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: this.config.maxTokens || 1000,
          temperature: this.config.temperature || 0.7,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`스트리밍 요청 실패: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('스트리밍 리더를 생성할 수 없습니다');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const chunk = parsed.choices[0]?.delta?.content;
              if (chunk) {
                onChunk(chunk);
              }
            } catch (e) {
              // JSON 파싱 오류 무시
            }
          }
        }
      }
    } catch (error) {
      console.error('스트리밍 실패:', error);
      throw error;
    }
  }

  private generateCacheKey(prompt: string): string {
    // 간단한 캐시 키 생성
    return prompt.slice(0, 100).replace(/\s+/g, '_');
  }

  async clearCache(): Promise<void> {
    this.cache.clear();
  }
}
```

## React Hook 구현

```typescript
// src/hooks/useSLLM.ts
import { useState, useEffect, useCallback } from 'react';
import { OnDeviceSLLMService } from '../services/OnDeviceSLLMService';
import { CloudSLLMService } from '../services/CloudSLLMService';

type SLLMMode = 'on-device' | 'cloud';

export interface UseSLLMOptions {
  mode: SLLMMode;
  cloudConfig?: {
    apiKey: string;
    model: string;
    baseURL?: string;
  };
}

export function useSLLM({ mode, cloudConfig }: UseSLLMOptions) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [onDeviceService] = useState(() => new OnDeviceSLLMService());
  const [cloudService] = useState(() => new CloudSLLMService());

  useEffect(() => {
    initializeService();
  }, [mode]);

  const initializeService = async () => {
    try {
      setError(null);

      if (mode === 'on-device') {
        await onDeviceService.initialize();
      } else if (cloudConfig) {
        await cloudService.initialize(cloudConfig);
      }

      setIsReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '서비스 초기화 실패');
    }
  };

  const generateResponse = useCallback(async (prompt: string): Promise<string> => {
    if (!isReady) {
      throw new Error('서비스가 준비되지 않았습니다');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = mode === 'on-device'
        ? await onDeviceService.generateResponse(prompt)
        : await cloudService.generateResponse(prompt);

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '응답 생성 실패';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [mode, isReady, onDeviceService, cloudService]);

  return {
    isReady,
    isLoading,
    error,
    generateResponse
  };
}
```

## React Native 컴포넌트

```typescript
// src/components/SLLMChat.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useSLLM } from '../hooks/useSLLM';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function SLLMChat({ mode }: { mode: 'on-device' | 'cloud' }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const { isReady, isLoading, error, generateResponse } = useSLLM({
    mode,
    cloudConfig: mode === 'cloud' ? {
      apiKey: 'your-api-key-here',
      model: 'gpt-3.5-turbo'
    } : undefined
  });

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const response = await generateResponse(inputText);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('메시지 전송 실패:', err);
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>sLLM 서비스 준비 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map(message => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.isUser ? styles.userMessage : styles.botMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              message.isUser ? styles.userText : styles.botText
            ]}>
              {message.text}
            </Text>
          </View>
        ))}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>오류: {error}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="메시지를 입력하세요..."
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, isLoading && styles.disabledButton]}
          onPress={handleSendMessage}
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.sendButtonText}>전송</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  },
  messagesContainer: {
    flex: 1,
    padding: 16
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF'
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA'
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20
  },
  userText: {
    color: 'white'
  },
  botText: {
    color: '#000'
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0'
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: '#B0B0B0'
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
```

## 성능 최적화

### 모델 양자화

```typescript
// src/utils/modelOptimization.ts
import * as tf from '@tensorflow/tfjs';

export async function quantizeModel(model: tf.LayersModel): Promise<tf.LayersModel> {
  // 모델 가중치를 8비트로 양자화
  const quantizedWeights = model.getWeights().map(weight => {
    return tf.quantization.quantize(weight, 'uint8');
  });

  // 새로운 모델 생성
  const quantizedModel = tf.sequential();

  // 레이어 복사
  model.layers.forEach((layer, index) => {
    const config = layer.getConfig();
    const newLayer = tf.layers[layer.getClassName()].fromConfig(config);
    quantizedModel.add(newLayer);
  });

  // 양자화된 가중치 설정
  quantizedModel.setWeights(quantizedWeights);

  return quantizedModel;
}
```

### 캐싱 전략

```typescript
// src/utils/cacheManager.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export class CacheManager {
  private static instance: CacheManager;
  private memoryCache = new Map<string, { data: any; timestamp: number }>();
  private readonly maxMemorySize = 100;
  private readonly ttl = 24 * 60 * 60 * 1000; // 24시간

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  async get(key: string): Promise<any | null> {
    // 메모리 캐시 확인
    const memoryData = this.memoryCache.get(key);
    if (memoryData && Date.now() - memoryData.timestamp < this.ttl) {
      return memoryData.data;
    }

    // 스토리지 캐시 확인
    try {
      const stored = await AsyncStorage.getItem(`cache_${key}`);
      if (stored) {
        const { data, timestamp } = JSON.parse(stored);
        if (Date.now() - timestamp < this.ttl) {
          this.setMemoryCache(key, data);
          return data;
        }
      }
    } catch (error) {
      console.error('캐시 읽기 실패:', error);
    }

    return null;
  }

  async set(key: string, data: any): Promise<void> {
    this.setMemoryCache(key, data);

    try {
      await AsyncStorage.setItem(
        `cache_${key}`,
        JSON.stringify({
          data,
          timestamp: Date.now()
        })
      );
    } catch (error) {
      console.error('캐시 저장 실패:', error);
    }
  }

  private setMemoryCache(key: string, data: any): void {
    // 메모리 크기 제한
    if (this.memoryCache.size >= this.maxMemorySize) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }

    this.memoryCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();

    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('캐시 정리 실패:', error);
    }
  }
}
```

## 테스트 전략

### 유닛 테스트

```typescript
// __tests__/sllm-service.test.ts
import { OnDeviceSLLMService } from '../src/services/OnDeviceSLLMService';
import { CloudSLLMService } from '../src/services/CloudSLLMService';

describe('OnDeviceSLLMService', () => {
  let service: OnDeviceSLLMService;

  beforeEach(() => {
    service = new OnDeviceSLLMService();
  });

  test('모델 초기화', async () => {
    await expect(service.initialize()).resolves.not.toThrow();
  });

  test('텍스트 생성', async () => {
    await service.initialize();
    const response = await service.generateResponse('안녕하세요');
    expect(typeof response).toBe('string');
  });
});

describe('CloudSLLMService', () => {
  let service: CloudSLLMService;

  beforeEach(() => {
    service = new CloudSLLMService();
  });

  test('API 설정', async () => {
    const config = {
      apiKey: 'test-key',
      model: 'gpt-3.5-turbo'
    };

    await expect(service.initialize(config)).resolves.not.toThrow();
  });
});
```

## 배포 고려사항

### 1. 보안
- API 키는 환경변수나 보안 스토리지에 저장
- 민감한 데이터는 기기 내에서만 처리
- 네트워크 통신은 HTTPS 사용

### 2. 성능
- 모델 크기 최적화
- 배터리 소모 모니터링
- 메모리 사용량 추적

### 3. 사용자 경험
- 로딩 상태 표시
- 오프라인 모드 지원
- 오류 처리 및 재시도 로직

## 결론

Expo 프로젝트에 sLLM을 통합하는 것은 다양한 방법으로 접근할 수 있습니다. 앱의 요구사항과 제약조건에 따라 적절한 방법을 선택하세요:

- **온디바이스**: 오프라인 지원, 프라이버시 중요
- **클라우드**: 높은 성능, 복잡한 작업 필요
- **하이브리드**: 두 방식의 장점 결합

꾸준한 테스트와 최적화를 통해 안정적인 sLLM 서비스를 구축할 수 있습니다.