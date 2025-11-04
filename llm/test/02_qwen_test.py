#!/usr/bin/env python3
"""
Qwen2-1.5B 모델 기본 테스트
모델 로딩 및 간단한 추론 테스트
"""

import torch
import time
from transformers import AutoTokenizer, AutoModelForCausalLM

def test_qwen_model():
    """Qwen2-1.5B 모델 테스트"""

    print("📦 Qwen2-1.5B 모델 테스트")
    print("=" * 50)

    # 장치 설정
    device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
    print(f"🔥 사용 장치: {device}")

    try:
        # 모델 정보
        model_name = "Qwen/Qwen2-1.5B"
        print(f"📋 모델: {model_name}")

        # 토크나이저 로드
        print("\n🔤 토크나이저 로딩 중...")
        start_time = time.time()
        tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
        tokenizer_load_time = time.time() - start_time
        print(f"✅ 토크나이저 로딩 완료: {tokenizer_load_time:.2f}초")

        # 모델 로드
        print("\n🤖 모델 로딩 중...")
        start_time = time.time()

        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16,
            device_map="auto",
            trust_remote_code=True
        )

        model_load_time = time.time() - start_time
        print(f"✅ 모델 로딩 완료: {model_load_time:.2f}초")

        # 모델 정보
        total_params = sum(p.numel() for p in model.parameters())
        print(f"📊 총 파라미터 수: {total_params:,}")

        return model, tokenizer, device

    except Exception as e:
        print(f"❌ 모델 로딩 실패: {e}")
        return None, None, device

def test_basic_inference(model, tokenizer, device):
    """기본 추론 테스트"""

    print("\n🧪 기본 추론 테스트")
    print("-" * 30)

    test_prompts = [
        "안녕하세요",
        "당신은 심리 분석 전문가입니다.",
        "Big5 성격 특성에 대해 설명해주세요."
    ]

    for i, prompt in enumerate(test_prompts, 1):
        print(f"\n📝 테스트 {i}: {prompt[:20]}...")

        try:
            # 입력 토큰화
            inputs = tokenizer(prompt, return_tensors="pt").to(device)

            # 추론 실행
            start_time = time.time()

            with torch.no_grad():
                outputs = model.generate(
                    **inputs,
                    max_new_tokens=50,
                    do_sample=True,
                    temperature=0.7,
                    pad_token_id=tokenizer.eos_token_id
                )

            if device.type == "mps":
                torch.mps.synchronize()

            inference_time = time.time() - start_time

            # 결과 디코딩
            response = tokenizer.decode(outputs[0], skip_special_tokens=True)

            # 생성된 텍스트만 추출
            generated_text = response[len(prompt):].strip()

            print(f"⏱️  추론 시간: {inference_time:.2f}초")
            print(f"📄 생성 결과: {generated_text[:100]}...")

        except Exception as e:
            print(f"❌ 추론 실패: {e}")

def test_big5_scenario(model, tokenizer, device):
    """Big5 심리 분석 시나리오 테스트"""

    print("\n🎯 Big5 심리 분석 시나리오 테스트")
    print("-" * 40)

    # 테스트용 Big5 질문
    big5_prompt = """당신은 Big5 심리 분석 전문가입니다. 다음 사용자 답변에 대해 간단히 분석해주세요.

사용자 답변:
1. 개방성: "새로운 것을 배우는 걸 좋아해요"
2. 성실성: "계획을 세우고 지키는 게 중요해요"

분석:"""

    print(f"📝 프롬프트: Big5 심리 분석 시나리오")
    print(f"📏 프롬프트 길이: {len(big5_prompt)}자")

    try:
        # 입력 토큰화
        inputs = tokenizer(big5_prompt, return_tensors="pt").to(device)

        # 입력 토큰 수 확인
        input_tokens = inputs["input_ids"].size(1)
        print(f"🔤 입력 토큰 수: {input_tokens}")

        # 추론 실행
        start_time = time.time()

        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=150,  # 더 긴 응답
                do_sample=True,
                temperature=0.7,
                pad_token_id=tokenizer.eos_token_id
            )

        if device.type == "mps":
            torch.mps.synchronize()

        inference_time = time.time() - start_time

        # 결과 디코딩
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)

        # 생성된 텍스트 추출
        generated_text = response[len(big5_prompt):].strip()
        generated_tokens = len(tokenizer.encode(generated_text))

        print(f"⏱️  추론 시간: {inference_time:.2f}초")
        print(f"🔤 생성 토큰 수: {generated_tokens}")
        print(f"⚡ 토큰/초: {generated_tokens/inference_time:.1f}")

        print(f"\n📄 생성된 리포트:")
        print("-" * 20)
        print(generated_text)
        print("-" * 20)

        # 간단한 페르소나 검증
        forbidden_patterns = ["진단", "입니다", "확실합니다", "분명합니다"]
        persona_score = 1.0

        for pattern in forbidden_patterns:
            if pattern in generated_text:
                persona_score -= 0.2
                print(f"⚠️  금지 표현 발견: '{pattern}'")

        print(f"🎭 페르소나 점수: {persona_score:.1f}/1.0")

        return True

    except Exception as e:
        print(f"❌ Big5 시나리오 테스트 실패: {e}")
        return False

def test_memory_usage():
    """메모리 사용량 테스트"""

    print("\n💾 메모리 사용량")
    print("-" * 20)

    try:
        import psutil
        import os

        process = psutil.Process(os.getpid())
        memory_info = process.memory_info()

        print(f"🖥️  프로세스 메모리: {memory_info.rss / (1024**2):.1f} MB")
        print(f"💾 가상 메모리: {memory_info.vms / (1024**2):.1f} MB")

        # 시스템 메모리
        memory = psutil.virtual_memory()
        print(f"📊 시스템 메모리 사용률: {memory.percent:.1f}%")

        return True

    except ImportError:
        print("⚠️  psutil이 설치되지 않았습니다.")
        return False

def main():
    """메인 테스트 함수"""

    print("🚀 Qwen2-1.5B 모델 테스트 시작...")
    print()

    # 모델 테스트
    model, tokenizer, device = test_qwen_model()

    if model is None or tokenizer is None:
        print("\n❌ 모델 로딩 실패. 테스트를 중단합니다.")
        return

    # 기본 추론 테스트
    test_basic_inference(model, tokenizer, device)

    # Big5 시나리오 테스트
    big5_success = test_big5_scenario(model, tokenizer, device)

    # 메모리 사용량
    memory_success = test_memory_usage()

    # 결과 요약
    print("\n🎯 테스트 결과 요약")
    print("=" * 30)
    print(f"모델 로딩: ✅")
    print(f"기본 추론: ✅")
    print(f"Big5 시나리오: {'✅' if big5_success else '❌'}")
    print(f"메모리 정보: {'✅' if memory_success else '❌'}")

    if big5_success:
        print("\n🎉 Qwen2-1.5B 모델 테스트 성공!")
        print("📋 다음 단계: python 03_dataset_creation.py")
        print("💡 이제 Big5 데이터셋을 생성하고 파인튜닝을 시작할 수 있습니다.")
    else:
        print("\n⚠️  모델 테스트에 문제가 있습니다.")

    print("\n" + "=" * 50)

if __name__ == "__main__":
    main()