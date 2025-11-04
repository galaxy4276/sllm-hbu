#!/usr/bin/env python3
"""
M4 Pro 환경 테스트
PyTorch MPS 지원 및 기본 라이브러리 확인
"""

import sys
import torch

def test_environment():
    """기본 환경 테스트"""

    print("🍎 M4 Pro LLM 개발 환경 테스트")
    print("=" * 50)

    # Python 정보
    print(f"Python 버전: {sys.version}")
    print(f"Python 실행 경로: {sys.executable}")

    # PyTorch 정보
    print(f"PyTorch 버전: {torch.__version__}")
    print(f"MPS 사용 가능: {torch.backends.mps.is_available()}")
    print(f"MPS 빌드됨: {torch.backends.mps.is_built()}")

    # 장치 정보
    if torch.backends.mps.is_available():
        device = torch.device("mps")
        print(f"🔥 GPU 장치: {device}")
        print("✅ M4 Pro GPU 가속 준비 완료!")
    else:
        device = torch.device("cpu")
        print(f"💻 CPU 장치: {device}")
        print("⚠️  MPS를 사용할 수 없습니다. CPU 모드로 실행됩니다.")

    print("=" * 50)
    return device

def test_basic_tensor_operations(device):
    """기본 텐서 연산 테스트"""

    print("🧪 기본 텐서 연산 테스트")
    print("-" * 30)

    try:
        # 텐서 생성
        x = torch.randn(1000, 1000, device=device)
        y = torch.randn(1000, 1000, device=device)

        # 행렬 곱셈
        import time
        start_time = time.time()
        z = torch.matmul(x, y)

        if device.type == "mps":
            torch.mps.synchronize()

        end_time = time.time()

        print(f"✅ 1000x1000 행렬 곱셈: {(end_time - start_time):.4f}초")
        print(f"✅ 결과 텐서 크기: {z.shape}")

        return True

    except Exception as e:
        print(f"❌ 텐서 연산 실패: {e}")
        return False

def test_huggingface_libraries():
    """Hugging Face 라이브러리 테스트"""

    print("\n🤗 Hugging Face 라이브러리 테스트")
    print("-" * 40)

    try:
        import transformers
        import datasets
        import accelerate

        print(f"✅ Transformers 버전: {transformers.__version__}")
        print(f"✅ Datasets 버전: {datasets.__version__}")
        print(f"✅ Accelerate 버전: {accelerate.__version__}")

        return True

    except ImportError as e:
        print(f"❌ Hugging Face 라이브러리 import 실패: {e}")
        return False

def test_memory_info():
    """메모리 정보 확인"""

    print("\n💾 메모리 정보")
    print("-" * 20)

    try:
        import psutil
        memory = psutil.virtual_memory()

        print(f"전체 메모리: {memory.total / (1024**3):.1f} GB")
        print(f"사용 가능: {memory.available / (1024**3):.1f} GB")
        print(f"사용률: {memory.percent:.1f}%")

        return True

    except ImportError:
        print("⚠️  psutil이 설치되지 않았습니다.")
        return False

def main():
    """메인 테스트 함수"""

    print("🚀 M4 Pro LLM 개발 환경 테스트 시작...")
    print()

    # 기본 환경 테스트
    device = test_environment()

    # 텐서 연산 테스트
    tensor_success = test_basic_tensor_operations(device)

    # Hugging Face 라이브러리 테스트
    hf_success = test_huggingface_libraries()

    # 메모리 정보
    memory_success = test_memory_info()

    # 결과 요약
    print("\n🎯 테스트 결과 요약")
    print("=" * 30)
    print(f"기본 환경: ✅")
    print(f"텐서 연산: {'✅' if tensor_success else '❌'}")
    print(f"Hugging Face: {'✅' if hf_success else '❌'}")
    print(f"메모리 정보: {'✅' if memory_success else '❌'}")

    if tensor_success and hf_success:
        print("\n🎉 환경 설정 완벽! Qwen2-1.5B 모델을 테스트할 수 있습니다.")
        print("📋 다음 단계: python 02_qwen_test.py")
    else:
        print("\n⚠️  일부 구성 요소에 문제가 있습니다. 확인 후 다시 실행하세요.")

    print("\n" + "=" * 50)

if __name__ == "__main__":
    main()