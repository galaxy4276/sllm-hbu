import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

export class OnDeviceSLLMService {
  private model: tf.LayersModel | null = null;
  private isInitialized = false;
  private vocab: string[] = [];
  private vocabSize = 1000;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('TensorFlow.js 초기화 중...');
      await tf.ready();

      console.log('간단한 sLLM 모델 생성 중...');
      this.model = this.createSimpleModel();

      console.log('기본 어휘 생성 중...');
      this.vocab = this.createBasicVocabulary();

      this.isInitialized = true;
      console.log('sLLM 서비스 초기화 완료');
    } catch (error) {
      console.error('모델 초기화 실패:', error);
      throw error;
    }
  }

  private createSimpleModel(): tf.LayersModel {
    const model = tf.sequential({
      layers: [
        tf.layers.embedding({
          inputDim: this.vocabSize,
          outputDim: 128,
          inputLength: 50
        }),
        tf.layers.lstm({
          units: 256,
          returnSequences: true,
          dropout: 0.2
        }),
        tf.layers.lstm({
          units: 128,
          dropout: 0.2
        }),
        tf.layers.dense({
          units: this.vocabSize,
          activation: 'softmax'
        })
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  private createBasicVocabulary(): string[] {
    const basicWords = [
      '안녕', '하세요', '감사', '합니다', '좋은', '아침', '저녁',
      '잘', '지냈어요', '만나서', '반갑습니다', '네', '아니요',
      '무엇을', '도와드릴까요', '궁금한', '점이', '있으신가요',
      '문의', '사항', '있으시면', '말씀', '주세요', '알겠습니다',
      '죄송합니다', '기다려', '주세요', '잠시', '만요', '확인',
      '해드릴게요', '감사합니다', '이용해주셔서', '다음', '고객님',
      '안녕히', '계세요', '또', '오세요', '행운을', '빌어요'
    ];

    const vocab = [...basicWords];

    // 기본 단어 추가
    for (let i = vocab.length; i < this.vocabSize; i++) {
      vocab.push(`단어${i}`);
    }

    return vocab;
  }

  async generateResponse(inputText: string, maxLength: number = 50): Promise<string> {
    if (!this.model) {
      throw new Error('모델이 초기화되지 않았습니다');
    }

    try {
      console.log('응답 생성 중:', inputText);

      // 텍스트 전처리
      const inputTokens = this.textToTokens(inputText);
      const paddedTokens = this.padTokens(inputTokens, 50);

      // 모델 추론
      const inputTensor = tf.tensor2d([paddedTokens], [1, 50]);
      const prediction = this.model.predict(inputTensor) as tf.Tensor;

      // 결과 후처리
      const outputTokens = this.tokensFromPrediction(prediction);
      const response = this.tokensToText(outputTokens.slice(0, maxLength));

      // 메모리 정리
      inputTensor.dispose();
      prediction.dispose();

      console.log('생성된 응답:', response);
      return response || '죄송합니다. 다시 한번 말씀해주시겠어요?';
    } catch (error) {
      console.error('응답 생성 실패:', error);
      return '죄송합니다. 오류가 발생했습니다.';
    }
  }

  private textToTokens(text: string): number[] {
    const words = text.toLowerCase().split(/\s+/);
    const tokens: number[] = [];

    for (const word of words) {
      const index = this.vocab.findIndex(v => v.includes(word));
      if (index !== -1) {
        tokens.push(index);
      } else {
        // 미지의 단어는 해시로 변환
        tokens.push(Math.abs(word.split('').reduce((a, b) => {
          return ((a << 5) - a) + b.charCodeAt(0);
        }, 0)) % this.vocabSize);
      }
    }

    return tokens;
  }

  private tokensToText(tokens: number[]): string {
    const words = tokens.map(token => {
      if (token < this.vocab.length) {
        return this.vocab[token];
      }
      return '';
    }).filter(word => word.length > 0);

    return words.join(' ');
  }

  private padTokens(tokens: number[], maxLength: number): number[] {
    const padded = [...tokens];
    while (padded.length < maxLength) {
      padded.push(0); // 패딩 토큰
    }
    return padded.slice(0, maxLength);
  }

  private tokensFromPrediction(prediction: tf.Tensor): number[] {
    const data = prediction.dataSync();
    const tokens: number[] = [];

    // 각 타임스텝에서 가장 높은 확률의 토큰 선택
    for (let i = 0; i < data.length; i += this.vocabSize) {
      const slice = data.slice(i, i + this.vocabSize);
      const maxIndex = slice.indexOf(Math.max(...slice));
      tokens.push(maxIndex);
    }

    return tokens;
  }

  async fineTune(
    trainingData: { input: string; output: string }[],
    epochs: number = 5
  ): Promise<void> {
    if (!this.model) {
      throw new Error('모델이 초기화되지 않았습니다');
    }

    console.log('모델 파인튜닝 시작...');
    console.log(`데이터셋 크기: ${trainingData.length}`);

    try {
      // 학습 데이터 준비
      const { inputs, outputs } = this.prepareTrainingData(trainingData);

      // 모델 재컴파일 (더 낮은 학습률)
      this.model.compile({
        optimizer: tf.train.adam(0.0001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      // 학습 실행
      await this.model.fit(inputs, outputs, {
        epochs,
        batchSize: Math.min(16, trainingData.length),
        validationSplit: 0.2,
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}/${epochs}: loss = ${logs?.loss?.toFixed(4)}, accuracy = ${logs?.acc?.toFixed(4)}`);
          }
        }
      });

      console.log('파인튜닝 완료');

      // 메모리 정리
      inputs.dispose();
      outputs.dispose();
    } catch (error) {
      console.error('파인튜닝 실패:', error);
      throw error;
    }
  }

  private prepareTrainingData(data: { input: string; output: string }[]) {
    const inputArrays: number[][] = [];
    const outputArrays: number[][] = [];

    for (const pair of data) {
      const inputTokens = this.textToTokens(pair.input);
      const outputTokens = this.textToTokens(pair.output);

      inputArrays.push(this.padTokens(inputTokens, 50));
      outputArrays.push(this.createOneHotVector(outputTokens[0] || 0));
    }

    const inputs = tf.tensor2d(inputArrays);
    const outputs = tf.tensor2d(outputArrays);

    return { inputs, outputs };
  }

  private createOneHotVector(tokenIndex: number): number[] {
    const vector = new Array(this.vocabSize).fill(0);
    if (tokenIndex < this.vocabSize) {
      vector[tokenIndex] = 1;
    }
    return vector;
  }

  async saveModel(): Promise<string> {
    if (!this.model) {
      throw new Error('모델이 초기화되지 않았습니다');
    }

    const modelPath = `${FileSystem.documentDirectory}models/sllm-model`;
    await this.model.save(`file://${modelPath}`);
    console.log('모델 저장 완료:', modelPath);
    return modelPath;
  }

  async loadModel(modelPath: string): Promise<void> {
    try {
      console.log('모델 로드 중...', modelPath);
      this.model = await tf.loadLayersModel(`file://${modelPath}`);
      this.isInitialized = true;
      console.log('모델 로드 완료');
    } catch (error) {
      console.error('모델 로드 실패:', error);
      throw error;
    }
  }

  async dispose(): Promise<void> {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isInitialized = false;
      console.log('모델 메모리 해제 완료');
    }
  }

  getModelInfo(): { isInitialized: boolean; vocabSize: number; params: number } {
    return {
      isInitialized: this.isInitialized,
      vocabSize: this.vocabSize,
      params: this.model ? this.model.countParams() : 0
    };
  }
}