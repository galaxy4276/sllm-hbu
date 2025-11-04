# M4 Pro LLM 테스트 모음

하루온 앱을 위한 Qwen2-1.5B 모델 개발 테스트 파일들입니다.

## 📋 테스트 순서

### 1. 환경 테스트
```bash
python 01_environment_test.py
```
- M4 Pro PyTorch MPS 지원 확인
- 필수 라이브러리 설치 상태 확인
- 기본 텐서 연산 테스트

### 2. Qwen2-1.5B 모델 테스트
```bash
python 02_qwen_test.py
```
- Qwen2-1.5B 모델 로딩 테스트
- 기본 추론 능력 확인
- Big5 심리 분석 시나리오 테스트
- 성능 측정 (로딩 시간, 추론 속도)

### 3. 데이터셋 생성
```bash
python 03_dataset_creation.py
```
- 골드 스탠다드 Big5 예제 생성
- ChatML 형식 데이터셋 저장
- 초기 5개 예제 포함

## 🎯 예상 실행 시간

- `01_environment_test.py`: 1-2분
- `02_qwen_test.py`: 5-10분 (모델 다운로드 포함)
- `03_dataset_creation.py`: 1분

## 📊 성능 기대치 (M4 Pro 48GB)

| 테스트 | 예상 결과 |
|--------|----------|
| MPS 지원 | ✅ True |
| 모델 로딩 | < 10초 |
| 기본 추론 | < 3초 |
| Big5 분석 | < 15초 |

## 🚨 문제 해결

### MPS 관련 문제
```bash
# MPS 활성화 확인
python -c "import torch; print(torch.backends.mps.is_available())"

# False가 나오면:
# 1. macOS 업데이트 확인
# 2. PyTorch 재설치
```

### 메모리 부족
```bash
# 메모리 압박 확인
memory_pressure

# 여유 공간이 20% 미만이면:
# 1. 불필요한 앱 종료
# 2. 브라우저 탭 닫기
```

### 모델 다운로드 실패
```bash
# Hugging Face 접속 확인
curl -I https://huggingface.co

# 인터넷 연결 상태 확인
ping huggingface.co
```

## 📈 다음 단계

모든 테스트가 성공하면:

1. **데이터셋 확장**: `03_dataset_creation.py` 수정하여 100개 예제 추가
2. **파인튜닝 시작**: LLaMA-Factory 사용
3. **모델 평가**: 튜닝된 모델 성능 테스트
4. **앱 통합**: React Native 앱에 모델 탑재

## 💡 유용한 명령어

```bash
# 환경 활성화
conda activate qwen-tuning

# 성능 모니터링
memory_pressure

# Jupyter 시작
jupyter notebook

# 파일 목록 확인
ls -la
```

## 📞 도움이 필요하면

각 테스트 파일 실행 시 문제가 발생하면:
1. 에러 메시지 전체를 복사
2. 실행 환경 (M4 Pro 사양, macOS 버전) 확인
3. 어떤 단계에서 막혔는지 기록