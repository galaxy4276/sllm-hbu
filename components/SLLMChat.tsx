import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useOnDeviceSLLM, SLLMMessage } from '../hooks/useOnDeviceSLLM';

interface SLLMChatProps {
  onModelReady?: () => void;
  onError?: (error: string) => void;
  initialMessages?: SLLMMessage[];
  maxLength?: number;
  placeholder?: string;
}

export function SLLMChat({
  onModelReady,
  onError,
  initialMessages = [],
  maxLength = 1000,
  placeholder = "메시지를 입력하세요..."
}: SLLMChatProps) {
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    isReady,
    isLoading,
    error,
    messages,
    modelInfo,
    addMessage,
    clearMessages,
    clearError,
    initializeService,
    saveModel,
    fineTuneModel
  } = useOnDeviceSLLM({
    onReady: () => {
      onModelReady?.();
      Alert.alert('sLLM 준비 완료', '온디바이스 AI 모델이 준비되었습니다!');
    },
    onError: (error) => {
      onError?.(error);
    }
  });

  // 초기 메시지 설정
  useEffect(() => {
    if (initialMessages.length > 0) {
      // 초기 메시지를 추가하는 로직은 useOnDeviceSLLM 훅에서 직접 관리
    }
  }, []);

  // 메시지가 추가될 때마다 스크롤을 아래로
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const messageToSend = inputText.trim();
    setInputText('');
    clearError();

    try {
      await addMessage(messageToSend, true);
    } catch (err) {
      console.error('메시지 전송 실패:', err);
    }
  };

  const handleKeyPress = () => {
    if (Platform.OS === 'web' && !event?.shiftKey) {
      event?.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    Alert.alert(
      '채팅 기록 초기화',
      '모든 채팅 기록을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: clearMessages
        }
      ]
    );
  };

  const handleSaveModel = async () => {
    try {
      const modelPath = await saveModel();
      Alert.alert('모델 저장 성공', `모델이 저장되었습니다: ${modelPath}`);
    } catch (err) {
      Alert.alert('모델 저장 실패', '모델 저장 중 오류가 발생했습니다.');
    }
  };

  const handleFineTune = () => {
    Alert.prompt(
      '파인튜닝 데이터',
      '학습할 대화 데이터를 JSON 형식으로 입력하세요:\n[{"input": "안녕", "output": "반갑습니다"}]',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '학습',
          onPress: (input) => {
            if (input) {
              try {
                const trainingData = JSON.parse(input);
                fineTuneModel(trainingData);
              } catch (err) {
                Alert.alert('데이터 파싱 오류', 'JSON 형식이 올바르지 않습니다.');
              }
            }
          }
        }
      ],
      'plain-text'
    );
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>
          {isLoading ? '모델 로드 중...' : 'sLLM 서비스 준비 중...'}
        </Text>
        {modelInfo && (
          <View style={styles.modelInfo}>
            <Text style={styles.modelInfoText}>
              어휘 크기: {modelInfo.vocabSize} | 파라미터: {modelInfo.params.toLocaleString()}
            </Text>
          </View>
        )}
        {!isLoading && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={initializeService}
          >
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>온디바이스 AI 챗봇</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleClearChat}
          >
            <Text style={styles.headerButtonText}>초기화</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleFineTune}
          >
            <Text style={styles.headerButtonText}>학습</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSaveModel}
          >
            <Text style={styles.headerButtonText}>저장</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 메시지 목록 */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>아직 대화가 없습니다.</Text>
            <Text style={styles.emptyStateSubText}>메시지를 입력하여 대화를 시작하세요!</Text>
          </View>
        ) : (
          messages.map(message => (
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
              <Text style={styles.messageTime}>
                {message.timestamp.toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          ))
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity onPress={clearError}>
              <Text style={styles.errorDismiss}>닫기</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 입력 영역 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline
          maxLength={maxLength}
          editable={!isLoading}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (isLoading || !inputText.trim()) && styles.disabledButton
          ]}
          onPress={handleSendMessage}
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.sendButtonText}>전송</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 모델 정보 */}
      {modelInfo && (
        <View style={styles.footerInfo}>
          <Text style={styles.footerInfoText}>
            어휘: {modelInfo.vocabSize} | 파라미터: {modelInfo.params.toLocaleString()}
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  modelInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8
  },
  modelInfoText: {
    fontSize: 14,
    color: '#1976d2',
    textAlign: 'center'
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 6
  },
  headerButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  messagesContainer: {
    flex: 1
  },
  messagesContent: {
    padding: 16
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#999'
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
    backgroundColor: '#e9ecef'
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4
  },
  userText: {
    color: 'white'
  },
  botText: {
    color: '#333'
  },
  messageTime: {
    fontSize: 11,
    opacity: 0.7,
    alignSelf: 'flex-end'
  },
  userMessage .messageTime,
  botMessage .messageTime: {
    color: 'rgba(255, 255, 255, 0.7)'
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    flex: 1
  },
  errorDismiss: {
    color: '#1976d2',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
    alignItems: 'flex-end'
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60
  },
  disabledButton: {
    backgroundColor: '#b0b0b0'
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  footerInfo: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9'
  },
  footerInfoText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666'
  }
});