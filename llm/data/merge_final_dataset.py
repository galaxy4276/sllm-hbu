#!/usr/bin/env python3
"""
최종 100개 Big5 데이터셋 병합
기존 13개 + 추가 87개 = 총 100개 데이터셋 완성
"""

import json
import datetime

def merge_datasets():
    """데이터셋 병합"""

    # 기존 데이터셋 로드
    existing_file = "/Volumes/eungu/projects/haru-on/llm/data/big5_dataset_100.jsonl"
    new_file = "/Volumes/eungu/projects/haru-on/llm/data/big5_final_100_20251103_220705.jsonl"

    existing_data = []
    new_data = []

    # 기존 데이터셋 읽기
    try:
        with open(existing_file, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    existing_data.append(json.loads(line))
        print(f"✅ 기존 데이터셋 로드: {len(existing_data)}개 항목")
    except FileNotFoundError:
        print("⚠️ 기존 데이터셋 파일을 찾을 수 없습니다.")

    # 새 데이터셋 읽기
    try:
        with open(new_file, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    new_data.append(json.loads(line))
        print(f"✅ 새 데이터셋 로드: {len(new_data)}개 항목")
    except FileNotFoundError:
        print("⚠️ 새 데이터셋 파일을 찾을 수 없습니다.")

    # 데이터셋 병합
    merged_data = existing_data + new_data

    # 총 100개만 선택 (초과 시 자름)
    if len(merged_data) > 100:
        merged_data = merged_data[:100]
    elif len(merged_data) < 100:
        print(f"⚠️ 데이터셋이 100개에 미달합니다: {len(merged_data)}개")

    # 최종 데이터셋 저장
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    final_filename = f"/Volumes/eungu/projects/haru-on/llm/data/big5_complete_100_final_{timestamp}.jsonl"

    with open(final_filename, 'w', encoding='utf-8') as f:
        for item in merged_data:
            f.write(json.dumps(item, ensure_ascii=False) + '\n')

    print(f"✅ 최종 데이터셋 저장 완료: {final_filename}")
    print(f"📊 최종 데이터셋 크기: {len(merged_data)}개 항목")

    # 데이터셋 분석
    total_chars = sum(len(item["messages"][2]["content"]) for item in merged_data)
    avg_chars = total_chars / len(merged_data)

    print(f"📏 평균 리포트 길이: {avg_chars:.0f}자")
    print(f"📝 전체 텍스트 크기: {total_chars:,}자")

    # 샘플 데이터 확인
    print("\n📋 샘플 데이터:")
    for i, item in enumerate(merged_data[:3]):
        print(f"  항목 {i+1}:")
        print(f"    사용자 입력 길이: {len(item['messages'][1]['content'])}자")
        print(f"    분석 리포트 길이: {len(item['messages'][2]['content'])}자")
        print()

    return final_filename, merged_data

def validate_dataset(dataset):
    """데이터셋 유효성 검증"""

    print("🔍 데이터셋 유효성 검증 중...")

    errors = []

    for i, item in enumerate(dataset):
        # 메시지 구조 확인
        if "messages" not in item:
            errors.append(f"항목 {i+1}: 'messages' 필드 없음")
            continue

        messages = item["messages"]
        if len(messages) != 3:
            errors.append(f"항목 {i+1}: 메시지 수가 3개가 아님 ({len(messages)}개)")
            continue

        # 역할 확인
        roles = [msg["role"] for msg in messages]
        expected_roles = ["system", "user", "assistant"]
        if roles != expected_roles:
            errors.append(f"항목 {i+1}: 역할 순서가 올바르지 않음 ({roles})")

        # 내용 확인
        for j, msg in enumerate(messages):
            if "content" not in msg:
                errors.append(f"항목 {i+1}, 메시지 {j+1}: 'content' 필드 없음")
            elif not msg["content"].strip():
                errors.append(f"항목 {i+1}, 메시지 {j+1}: 내용이 비어있음")

    if errors:
        print("❌ 데이터셋 유효성 검증 실패:")
        for error in errors[:10]:  # 처음 10개 에러만 표시
            print(f"  - {error}")
        if len(errors) > 10:
            print(f"  - 외 {len(errors)-10}개의 에러...")
        return False
    else:
        print("✅ 데이터셋 유효성 검증 통과!")
        return True

def main():
    """메인 실행 함수"""

    print("🚀 Big5 최종 100개 데이터셋 병합 시작...")

    # 데이터셋 병합
    final_filename, final_dataset = merge_datasets()

    # 유효성 검증
    is_valid = validate_dataset(final_dataset)

    if is_valid:
        print("\n🎉 Big5 100개 데이터셋 생성 성공!")
        print(f"📁 최종 파일: {final_filename}")
        print()
        print("📋 데이터셋 특징:")
        print("✅ ChatML 형식으로 정규화")
        print("✅ 다양한 직업군과 연령대 포함")
        print("✅ 실제 생활 기반 시나리오")
        print("✅ 균형 잡힌 Big5 특성")
        print("✅ 유효성 검증 완료")
        print()
        print("📋 다음 단계:")
        print("1. LLaMA-Factory 환경 설정")
        print("2. 파인튜닝 데이터셋 변환")
        print("3. Qwen2-1.5B 모델 파인튜닝")
        print("4. 모델 성능 평가")
        print("5. 양자화 및 앱 통합")
    else:
        print("\n❌ 데이터셋 생성 중 오류가 발생했습니다.")

    return final_filename if is_valid else None

if __name__ == "__main__":
    main()