# 온디바이스 LLM 개발 완전 가이드: Qwen2-1.5B 파인튜닝부터 앱 배포까지

## 🎯 개요

본 문서는 Big5 심리 분석 앱 '하루온'을 위한 온디바이스 LLM 개발 전 과정을 상세히 다룹니다. Qwen2-1.5B 모델을 파인튜닝하여 심리 분석 전문가로 특화하고, 모바일 기기에서 구동 가능하도록 양자화하는 전체 과정을 포함합니다.

### 📋 최종 목표
```
원본 Qwen2-1.5B → Big5 전문가 파인튜닝 → GGUF 변환 → 4비트 양자화 → iOS 앱 탑재
```

### 🚀 예상 소요 시간: 2-3주 (초급자 기준)

---

## 📚 사전 준비 사항

### 하드웨어 요구사항
- **GPU**: VRAM 16GB+ (RTX 4090, A100, H100 권장)
- **RAM**: 32GB 이상
- **저장 공간**: 100GB 이상 여유 공간
- **OS**: Linux (Ubuntu 20.04+) 또는 macOS (Apple Silicon 권장)

### 소프트웨어 요구사항
- Python 3.9+
- CUDA 11.8+ (NVIDIA GPU 사용 시)
- Git
- Conda (권장)

---

## 🗺️ 7단계 개발 로드맵

### 1단계: 개발 환경 설정 (1-2일)

#### 1.1 하드웨어 환경 확인
```bash
# GPU 확인
nvidia-smi
# 출력 예시: Tesla V100-SXM2-32GB, 32510MiB

# CPU 및 RAM 확인
lscpu
free -h

# 저장 공간 확인
df -h
```

#### 1.2 Conda 환경 설정
```bash
# 전용 환경 생성
conda create -n qwen-tuning python=3.10 -y
conda activate qwen-tuning

# PyTorch 설치 (CUDA 버전 확인 후)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# GPU 테스트
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"
```

#### 1.3 필수 라이브러리 설치
```bash
# Hugging Face 생태계
pip install transformers datasets accelerate bitsandbytes peft

# 튜닝 프레임워크
pip install trl wandb tensorboard

# 유틸리티
pip install tqdm numpy pandas matplotlib

# GGUF 변환용 (llama.cpp)
pip install sentencepiece protobuf
```

---

### 2단계: 데이터셋 구축 (3-5일) ⭐ **가장 중요한 단계**

#### 2.1 데이터 구조 설계

**ChatML 형식 (Qwen2 권장)**:
```json
{
  "messages": [
    {
      "role": "system",
      "content": "당신은 Big5 심리학 모델을 기반으로 사용자의 답변을 분석하는 전문 심리 분석가입니다. 사용자의 5가지 답변을 바탕으로, 각 특성(개방성, 성실성, 외향성, 우호성, 신경성)을 분석하고 긍정적이며 통찰력 있는 종합 리포트를 작성해주세요. 절대 의학적 진단을 내리지 마세요."
    },
    {
      "role": "user",
      "content": "1. 개방성: '요즘은 주말마다 새로운 베이킹 레시피를 배우는 게 가장 즐거워요. 새로운 걸 배우는 것 자체가 에너지를 줍니다.'\n2. 성실성: '계획했던 일을 마치면 정말 뿌듯하고, 스스로에 대한 자신감이 생겨요. 체크리스트를 지워나가는 쾌감이 있습니다.'\n3. 외향성: '솔직히 혼자 있을 때가 더 편해요. 사람들과 있는 것도 좋지만, 결국 에너지는 혼자 책 읽거나 쉬면서 충전돼요.'\n4. 우호성: '친구가 힘들어하면 일단 무슨 일인지 끝까지 들어주려고 노력해요. 공감해주고 옆에 있어 주는 편입니다.'\n5. 신경성: '스트레스를 받으면 잠을 잘 못 자고 예민해져요. 주로 혼자 조용한 음악을 듣거나 산책하면서 풀려고 합니다.'"
    },
    {
      "role": "assistant",
      "content": "## Big5 심리 분석 리포트\n\n당신의 답변을 바탕으로 분석한 성격 특성은 다음과 같습니다.\n\n### 개방성 (Openness): 높음\n'새로운 레시피 배우기'에서 즐거움을 얻는다는 점에서, 당신은 새로운 경험과 지식에 대해 매우 개방적인 성향을 보입니다. 호기심이 많고 배움을 즐기는 모습이 뚜렷합니다.\n\n### 성실성 (Conscientiousness): 매우 높음\n'계획'과 '체크리스트'를 통해 '뿌듯함'과 '자신감'을 얻는 모습은 매우 높은 성실성을 나타냅니다. 책임감이 강하고 목표 지향적이며 체계적인 성격입니다.\n\n### 외향성 (Extraversion): 낮음 (내향성)\n에너지를 '혼자 있을 때' 얻는다고 명확히 답한 부분에서 내향적인 성향이 강하게 드러납니다. 사회적 교류보다는 개인적인 시간을 통해 재충전하는 타입입니다.\n\n### 우호성 (Agreeableness): 높음\n타인의 말을 '끝까지 들어주고 공감'하려는 태도는 높은 우호성을 시사합니다. 타인에게 협조적이며 공감 능력이 뛰어난 따뜻한 성격입니다.\n\n### 신경성 (Neuroticism): 다소 높음\n스트레스 상황에서 '잠을 못 자고 예민해지는' 반응은 정서적 민감성(신경성)이 다소 높을 수 있음을 보여줍니다. 다만, '음악 듣기', '산책' 등 건강한 방식으로 해소하려 노력하는 점도 긍정적입니다.\n\n## 종합 의견\n\n당신은 성실하고 책임감이 강하며, 새로운 지식에 열려있는 '학습자' 유형입니다. 내향적인 성향 덕분에 깊이 있는 학습이 가능하며, 타인에 대한 공감 능력도 뛰어납니다. 정서적 민감성이 있지만, 건강한 스트레스 해소 방식을 알고 있습니다. 이러한 특성들의 조화가 당신을 신뢰할 수 있고 통찰력 있는 사람으로 만들어줍니다."
    }
  ]
}
```

#### 2.2 데이터 생성 전략

**1단계: 골드 스탠다드 데이터 생성 (100건)**
```python
import json
from datetime import datetime

def create_golden_dataset():
    """수동으로 제작한 최고 품질의 학습 데이터"""

    golden_examples = [
        {
            "user_answers": {
                "openness": "새로운 프로그래밍 언어 배우는 걸 좋아해요. 매달 새로운 기술 스택을 시도해봐요.",
                "conscientiousness": "프로젝트 계획을 짜고 그대로 실행하는 걸 즐겨요. 칸반보드로 진행 상황을 관리해요.",
                "extraversion": "사람들과 함께 협업하는 건 좋지만, 코드 리뷰는 혼자 조용히 할 때 더 집중이 잘돼요.",
                "agreeableness": "팀원이 어려워하면 먼저 다가가서 도와주려고 해요. 함께 성장하는 게 중요하다고 생각해요.",
                "neuroticism": "데드라인이 다가오면 불안해서 잠을 설쳐요. 명상이나 운동으로 스트레스를 풀어요."
            },
            "golden_report": """## Big5 심리 분석 리포트

당신의 답변을 바탕으로 분석한 성격 특성은 다음과 같습니다.

### 개방성 (Openness): 매우 높음
'새로운 프로그래밍 언어 배우기'와 '매달 새로운 기술 스택 시도'에서 보여주는 태도는 매우 높은 개방성을 나타냅니다. 기술에 대한 호기심과 학습 의지가 뛰어나며, 변화와 새로움을 적극적으로 수용하는 모습입니다.

### 성실성 (Conscientiousness): 매우 높음
'프로젝트 계획'과 '칸반보드 관리'에서 드러나는 체계적인 접근 방식은 매우 높은 성실성의 특징입니다. 목표 지향적이고 책임감이 강하며, 자신의 업무를 효율적으로 관리하는 능력이 뛰어납니다.

### 외향성 (Extraversion): 중간
'협업 즐김'과 '혼자 코드 리뷰'의 모습은 사회적 상호작용과 개인적 집중 사이의 균형을 보여줍니다. 상황에 따라 외향적, 내향적 특성을 유연하게 조절할 수 있는 균형 잡힌 성향입니다.

### 우호성 (Agreeableness): 높음
'팀원 도와주기'와 '함께 성장'의 가치관에서 높은 우호성이 엿보입니다. 타인의 성장을 지원하고 협력적인 관계를 중시하는 따뜻하고 이타적인 성격입니다.

### 신경성 (Neuroticism): 중간
'데드라인 불안'과 '명상/운동으로 해소'의 패턴은 정서적 민감성이 있지만, 건강한 대처 방식을 알고 있음을 보여줍니다. 스트레스 상황에서 불안을 느끼되, 이를 효과적으로 관리하는 능력을 갖추고 있습니다.

## 종합 의견

당신은 학습에 대한 열정과 체계적인 실행력을 겸비한 '성장형 개발자'입니다. 새로운 기술을 적극적으로 탐구하면서도, 프로젝트를 체계적으로 관리하는 능력이 뛰어납니다. 팀원들과의 협력을 중시하며, 스트레스 상황에서도 건강한 대처 방식을 알고 있습니다. 이러한 특성들의 조화가 당신을 기술적으로 뛰어나면서도 팀워크에 기여하는 개발자로 만들어줍니다."""
        }
        # ... 99개의 예제 추가
    ]

    return golden_examples

# 골드 데이터셋 생성 및 저장
golden_data = create_golden_dataset()
with open('golden_dataset.jsonl', 'w', encoding='utf-8') as f:
    for example in golden_data:
        messages = [
            {"role": "system", "content": "당신은 Big5 심리학 모델을 기반으로 사용자의 답변을 분석하는 전문 심리 분석가입니다. 사용자의 5가지 답변을 바탕으로, 각 특성(개방성, 성실성, 외향성, 우호성, 신경성)을 분석하고 긍정적이며 통찰력 있는 종합 리포트를 작성해주세요. 절대 의학적 진단을 내리지 마세요."},
            {"role": "user", "content": format_user_input(example["user_answers"])},
            {"role": "assistant", "content": example["golden_report"]}
        ]
        f.write(json.dumps({"messages": messages}, ensure_ascii=False) + '\n')
```

**2단계: 합성 데이터 생성 (500-1000건)**
```python
import openai
from typing import List, Dict

def generate_synthetic_data(base_examples: List[Dict], count: int = 500):
    """고품질 기반 데이터를 활용한 합성 데이터 생성"""

    synthetic_data = []

    for i in range(count):
        # 기존 예제에서 패턴 학습
        base_example = base_examples[i % len(base_examples)]

        # 프롬프트 엔지니어링
        prompt = f"""
다음 Big5 심리 분석 예제를 기반으로, 새로운 사용자 답변과 그에 대한 전문적 리포트를 생성해주세요.

기준 예제:
{format_example(base_example)}

요구사항:
1. 각 Big5 특성에 대해 새로운 구체적인 답변 생성
2. 전문성, 공감 능력, 통찰력, 조심성, 구조화된 페르소나 유지
3. 단정적 진단 표현 금지 ("~입니다" 대신 "~한 성향을 보입니다")
4. 긍정적이고 수용적인 톤 유지
5. 각 특성별 분석과 종합 의견 포함

JSON 형식으로 답변해주세요.
"""

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )

            synthetic_example = json.loads(response.choices[0].message.content)
            synthetic_data.append(synthetic_example)

            if (i + 1) % 50 == 0:
                print(f"Generated {i + 1}/{count} synthetic examples")

        except Exception as e:
            print(f"Error generating example {i}: {e}")
            continue

    return synthetic_data

# 합성 데이터 생성
synthetic_data = generate_synthetic_data(golden_data, count=800)
```

#### 2.3 데이터 검수 및 정제
```python
def validate_dataset(dataset: List[Dict]):
    """데이터셋 품질 검수"""

    validation_results = {
        "total_examples": len(dataset),
        "valid_examples": 0,
        "issues": []
    }

    for i, example in enumerate(dataset):
        issues = []

        # 1. 구조 검증
        if "messages" not in example:
            issues.append("Missing 'messages' field")

        # 2. 역할 검증
        roles = [msg["role"] for msg in example.get("messages", [])]
        if set(roles) != {"system", "user", "assistant"}:
            issues.append("Invalid role structure")

        # 3. 페르소나 검증
        assistant_content = ""
        for msg in example.get("messages", []):
            if msg["role"] == "assistant":
                assistant_content = msg["content"]
                break

        # 금지 표현 검사
        forbidden_patterns = [
            "진단", "입니다", "확실합니다", "분명합니다",
            "문제가 있습니다", "비정상입니다"
        ]

        for pattern in forbidden_patterns:
            if pattern in assistant_content:
                issues.append(f"Contains forbidden pattern: {pattern}")

        # 필수 구조 검사
        required_sections = ["개방성", "성실성", "외향성", "우호성", "신경성", "종합 의견"]
        for section in required_sections:
            if section not in assistant_content:
                issues.append(f"Missing required section: {section}")

        if not issues:
            validation_results["valid_examples"] += 1
        else:
            validation_results["issues"].append({
                "example_id": i,
                "issues": issues
            })

    return validation_results

# 데이터셋 검수 실행
validation_results = validate_dataset(final_dataset)
print(f"Validation Results:")
print(f"Total: {validation_results['total_examples']}")
print(f"Valid: {validation_results['valid_examples']}")
print(f"Invalid: {validation_results['total_examples'] - validation_results['valid_examples']}")
```

---

### 3단계: 모델 다운로드 및 기본 테스트 (1일)

#### 3.1 Qwen2-1.5B 모델 다운로드
```python
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

def download_qwen_model():
    """Qwen2-1.5B 모델 다운로드 및 기본 설정"""

    model_name = "Qwen/Qwen2-1.5B"

    print("Downloading Qwen2-1.5B model...")
    tokenizer = AutoTokenizer.from_pretrained(
        model_name,
        trust_remote_code=True,
        padding_side="left"
    )

    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        device_map="auto",
        trust_remote_code=True
    )

    # 패딩 토큰 설정
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    print("Model downloaded successfully!")
    return model, tokenizer

# 모델 다운로드
model, tokenizer = download_qwen_model()
```

#### 3.2 기본 추론 테스트
```python
def test_basic_inference(model, tokenizer):
    """모델 기본 추론 능력 테스트"""

    test_prompt = """당신은 Big5 심리 분석 전문가입니다. 다음 사용자 답변에 대해 간단히 분석해주세요.

사용자 답변:
1. 개방성: "새로운 것을 배우는 걸 좋아해요"
2. 성실성: "계획을 세우고 지키는 게 중요해요"

분석:"""

    inputs = tokenizer(test_prompt, return_tensors="pt", padding=True)
    inputs = {k: v.to(model.device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=200,
            temperature=0.7,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )

    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print("Basic Inference Test Result:")
    print(response)

    return response

# 기본 추론 테스트
test_response = test_basic_inference(model, tokenizer)
```

---

### 4단계: 파인튜닝 실행 (3-7일)

#### 4.1 LLaMA-Factory 사용 (가장 쉬운 방법)

**LLaMA-Factory 설치 및 설정**:
```bash
# 1. LLaMA-Factory 클론
git clone https://github.com/hiyouga/LLaMA-Factory.git
cd LLaMA-Factory

# 2. 설치
pip install -e .[torch,metrics]

# 3. 데이터셋 디렉토리 생성
mkdir -p data/big5_dataset
```

**데이터셋 설정**:
```yaml
# dataset_info.yaml 수정
big5_dataset:
  path_or_name: data/big5_dataset
  prompt_template: qwen
  formatting: alpaca
```

**파인튜닝 실행**:
```bash
# QLoRA 파인튜닝 실행
llamafactory-cli train \
  --model_name_or_path qwen2-1.5b \
  --dataset big5_dataset \
  --template qwen \
  --finetuning_type lora \
  --lora_target q_proj,v_proj \
  --lora_rank 64 \
  --lora_alpha 128 \
  --q_lora true \
  --output_dir saves/qwen2-1.5b-big5 \
  --per_device_train_batch_size 4 \
  --gradient_accumulation_steps 4 \
  --lr_scheduler_type cosine \
  --logging_steps 10 \
  --save_steps 500 \
  --learning_rate 1e-4 \
  --num_train_epochs 3 \
  --plot_loss true \
  --bf16 true \
  --dataset_dir data \
  --preprocessing_num_workers 16
```

#### 4.2 직접 튜닝 (더 많은 제어)

**커스텀 트레이닝 스크립트**:
```python
import torch
from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    TrainingArguments,
    DataCollatorForSeq2Seq
)
from peft import LoraConfig, get_peft_model, TaskType
from trl import SFTTrainer

class QwenBig5Trainer:
    def __init__(self, model_name="Qwen/Qwen2-1.5B"):
        self.model_name = model_name
        self.tokenizer = None
        self.model = None

    def setup_model_and_tokenizer(self):
        """모델과 토크나이저 설정"""

        print("Setting up model and tokenizer...")

        # 토크나이저
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.model_name,
            trust_remote_code=True,
            padding_side="left"
        )

        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token

        # 모델
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_name,
            torch_dtype=torch.float16,
            device_map="auto",
            trust_remote_code=True
        )

        # LoRA 설정
        lora_config = LoraConfig(
            task_type=TaskType.CAUSAL_LM,
            inference_mode=False,
            r=64,
            lora_alpha=128,
            lora_dropout=0.1,
            target_modules=["q_proj", "v_proj", "k_proj", "o_proj"]
        )

        self.model = get_peft_model(self.model, lora_config)
        self.model.print_trainable_parameters()

    def load_and_preprocess_dataset(self, dataset_path):
        """데이터셋 로드 및 전처리"""

        print(f"Loading dataset from {dataset_path}...")

        dataset = load_dataset("json", data_files=dataset_path, split="train")

        def formatting_prompts_func(examples):
            output_texts = []
            for i in range(len(examples["messages"])):
                messages = examples["messages"][i]

                # ChatML 형식으로 변환
                formatted_text = ""
                for message in messages:
                    if message["role"] == "system":
                        formatted_text += f"<|im_start|>system\n{message['content']}<|im_end|>\n"
                    elif message["role"] == "user":
                        formatted_text += f"<|im_start|>user\n{message['content']}<|im_end|>\n"
                    elif message["role"] == "assistant":
                        formatted_text += f"<|im_start|>assistant\n{message['content']}<|im_end|>"

                output_texts.append(formatted_text)

            return {"text": output_texts}

        dataset = dataset.map(formatting_prompts_func, batched=True)
        return dataset

    def train(self, dataset_path, output_dir="./qwen2-1.5b-big5-tuned"):
        """파인튜닝 실행"""

        # 모델 설정
        self.setup_model_and_tokenizer()

        # 데이터셋 로드
        dataset = self.load_and_preprocess_dataset(dataset_path)

        # 트레이닝 인자
        training_args = TrainingArguments(
            output_dir=output_dir,
            per_device_train_batch_size=4,
            gradient_accumulation_steps=4,
            learning_rate=1e-4,
            logging_steps=10,
            save_steps=500,
            num_train_epochs=3,
            lr_scheduler_type="cosine",
            warmup_steps=100,
            fp16=True,
            dataloader_num_workers=4,
            save_total_limit=3,
            load_best_model_at_end=True,
            metric_for_best_model="eval_loss",
            greater_is_better=False,
            report_to="tensorboard"
        )

        # 데이터 콜레이터
        data_collator = DataCollatorForSeq2Seq(
            tokenizer=self.tokenizer,
            model=self.model,
            padding=True,
            return_tensors="pt"
        )

        # 트레이너 설정
        trainer = SFTTrainer(
            model=self.model,
            args=training_args,
            train_dataset=dataset,
            data_collator=data_collator,
            tokenizer=self.tokenizer,
            max_seq_length=2048,
            dataset_text_field="text",
            packing=False
        )

        # 트레이닝 실행
        print("Starting training...")
        trainer.train()

        # 모델 저장
        trainer.save_model(output_dir)
        self.tokenizer.save_pretrained(output_dir)

        print(f"Training completed! Model saved to {output_dir}")
        return trainer

# 트레이너 실행
trainer = QwenBig5Trainer()
trainer.train("final_dataset.jsonl")
```

#### 4.3 트레이닝 모니터링
```python
import wandb
from torch.utils.tensorboard import SummaryWriter

# WandB 초기화
wandb.init(
    project="qwen2-big5-tuning",
    config={
        "model": "Qwen2-1.5B",
        "dataset_size": len(dataset),
        "epochs": 3,
        "batch_size": 4,
        "learning_rate": 1e-4
    }
)

# TensorBoard 로깅
writer = SummaryWriter("./logs/big5-tuning")

def log_training_metrics(trainer, epoch, loss):
    """트레이닝 메트릭 로깅"""

    # WandB 로깅
    wandb.log({
        "epoch": epoch,
        "train_loss": loss,
        "learning_rate": trainer.args.learning_rate
    })

    # TensorBoard 로깅
    writer.add_scalar("Loss/Train", loss, epoch)
    writer.add_scalar("Learning_Rate", trainer.args.learning_rate, epoch)
```

---

### 5단계: 모델 병합 및 테스트 (1-2일)

#### 5.1 LoRA 어댑터 병합
```python
from peft import PeftModel
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

def merge_lora_adapter(base_model_path, lora_adapter_path, output_path):
    """LoRA 어댑터를 원본 모델에 병합"""

    print("Loading base model...")
    base_model = AutoModelForCausalLM.from_pretrained(
        base_model_path,
        torch_dtype=torch.float16,
        device_map="auto",
        trust_remote_code=True
    )

    print("Loading LoRA adapter...")
    model = PeftModel.from_pretrained(base_model, lora_adapter_path)

    print("Merging adapter...")
    merged_model = model.merge_and_unload()

    print("Saving merged model...")
    merged_model.save_pretrained(output_path)

    # 토크나이저도 저장
    tokenizer = AutoTokenizer.from_pretrained(base_model_path, trust_remote_code=True)
    tokenizer.save_pretrained(output_path)

    print(f"Merged model saved to {output_path}")
    return merged_model

# 병합 실행
merge_lora_adapter(
    base_model_path="Qwen/Qwen2-1.5B",
    lora_adapter_path="./saves/qwen2-1.5b-big5",
    output_path="./merged-qwen2-1.5b-big5"
)
```

#### 5.2 튜닝 결과 테스트
```python
def test_tuned_model(model_path, test_cases):
    """튜닝된 모델 성능 테스트"""

    print("Loading tuned model...")
    tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        model_path,
        torch_dtype=torch.float16,
        device_map="auto",
        trust_remote_code=True
    )

    results = []

    for i, test_case in enumerate(test_cases):
        print(f"Testing case {i+1}/{len(test_cases)}")

        # 프롬프트 생성
        prompt = build_big5_prompt(test_case["answers"])

        # 추론
        inputs = tokenizer(prompt, return_tensors="pt", padding=True)
        inputs = {k: v.to(model.device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=800,
                temperature=0.7,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )

        response = tokenizer.decode(outputs[0], skip_special_tokens=True)

        # 응답 분석
        analysis = analyze_response(response, test_case["expected_personas"])

        results.append({
            "test_case": test_case,
            "response": response,
            "analysis": analysis
        })

        print(f"✓ Case {i+1} completed")

    return results

# 테스트 케이스 정의
test_cases = [
    {
        "answers": {
            "openness": "새로운 프로그래밍 언어를 배우는 걸 좋아해요",
            "conscientiousness": "계획을 세우고 그대로 실행하는 게 중요해요",
            "extraversion": "사람들과 함께 일하는 걸 좋아하지만, 혼자 일할 때도 좋아요",
            "agreeableness": "팀원들을 돕는 걸 즐겨요",
            "neuroticism": "스트레스를 받으면 운동으로 풀어요"
        },
        "expected_personas": ["openness_high", "conscientiousness_high"]
    }
    # ... 더 많은 테스트 케이스
]

# 테스트 실행
test_results = test_tuned_model("./merged-qwen2-1.5b-big5", test_cases)
```

#### 5.3 모델 성능 평가
```python
def evaluate_model_performance(test_results):
    """모델 성능 평가 및 리포트 생성"""

    evaluation_metrics = {
        "total_tests": len(test_results),
        "persona_compliance": 0,
        "structure_compliance": 0,
        "safety_compliance": 0,
        "average_response_length": 0,
        "issues": []
    }

    total_compliance_score = 0
    total_length = 0

    for result in test_results:
        response = result["response"]
        analysis = result["analysis"]

        # 페르소나 준수율
        persona_score = analysis.get("persona_compliance_score", 0)
        total_compliance_score += persona_score

        # 구조 준수율
        structure_score = analysis.get("structure_compliance_score", 0)
        total_compliance_score += structure_score

        # 안전성 준수율
        safety_score = analysis.get("safety_compliance_score", 0)
        total_compliance_score += safety_score

        # 응답 길이
        total_length += len(response)

        # 이슈 수집
        if analysis.get("issues"):
            evaluation_metrics["issues"].extend(analysis["issues"])

    # 평균 계산
    evaluation_metrics["persona_compliance"] = total_compliance_score / (len(test_results) * 3)
    evaluation_metrics["average_response_length"] = total_length / len(test_results)

    # 결과 출력
    print("=== Model Performance Evaluation ===")
    print(f"Total Tests: {evaluation_metrics['total_tests']}")
    print(f"Average Compliance Score: {evaluation_metrics['persona_compliance']:.2%}")
    print(f"Average Response Length: {evaluation_metrics['average_response_length']:.0f} chars")

    if evaluation_metrics["issues"]:
        print("\nIssues Found:")
        for issue in evaluation_metrics["issues"][:10]:  # 상위 10개만 표시
            print(f"  - {issue}")

    return evaluation_metrics

# 성능 평가 실행
performance_report = evaluate_model_performance(test_results)
```

---

### 6단계: GGUF 변환 및 양자화 (1-2일)

#### 6.1 llama.cpp 환경 설정
```bash
# 1. llama.cpp 클론
git clone https://github.com/ggerganov/llama.cpp.git
cd llama.cpp

# 2. Python 의존성 설치
pip install -r requirements.txt

# 3. 컴파일 (Linux/macOS)
make clean
make LLAMA_CUBLAS=1 -j$(nproc)

# 4. 설치 확인
./main --help
```

#### 6.2 GGUF 변환 스크립트
```python
import subprocess
import os

def convert_to_gguf(hf_model_path, output_path, model_type="f16"):
    """Hugging Face 모델을 GGUF 형식으로 변환"""

    print(f"Converting {hf_model_path} to GGUF format...")

    # 변환 명령어
    cmd = [
        "python", "convert.py",
        hf_model_path,
        "--outfile", output_path,
        "--outtype", model_type
    ]

    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        print(f"✓ Conversion completed: {output_path}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Conversion failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def quantize_gguf(input_path, output_path, quant_type="Q4_K_M"):
    """GGUF 모델 양자화"""

    print(f"Quantizing {input_path} to {quant_type}...")

    # 양자화 명령어
    cmd = [
        "./quantize",
        input_path,
        output_path,
        quant_type
    ]

    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)

        # 파일 크기 확인
        original_size = os.path.getsize(input_path)
        quantized_size = os.path.getsize(output_path)
        compression_ratio = (1 - quantized_size / original_size) * 100

        print(f"✓ Quantization completed: {output_path}")
        print(f"  Original size: {original_size / (1024**3):.2f} GB")
        print(f"  Quantized size: {quantized_size / (1024**3):.2f} GB")
        print(f"  Compression ratio: {compression_ratio:.1f}%")

        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Quantization failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

# 변환 및 양자화 실행
if __name__ == "__main__":
    # 경로 설정
    hf_model_path = "../merged-qwen2-1.5b-big5"
    fp16_output = "../qwen2-1.5b-big5.fp16.gguf"
    quantized_output = "../qwen2-1.5b-big5.Q4_K_M.gguf"

    # 1. FP16으로 변환
    if convert_to_gguf(hf_model_path, fp16_output, "f16"):
        # 2. 4비트 양자화
        if quantize_gguf(fp16_output, quantized_output, "Q4_K_M"):
            print("🎉 GGUF conversion and quantization completed successfully!")
        else:
            print("❌ Quantization failed")
    else:
        print("❌ Conversion failed")
```

#### 6.3 양자화 옵션 최적화
```python
def compare_quantization_methods(fp16_model_path):
    """다양한 양자화 방법 비교 테스트"""

    quant_types = [
        "Q4_0",    # 4비트 기본 (빠름, 품질 낮음)
        "Q4_1",    # 4비트 개선형
        "Q4_K_M",  # 4비트 K-Quants 중간 (권장)
        "Q5_K_M",  # 5비트 K-Quants 중간 (더 좋은 품질)
        "Q8_0",    # 8비트 (최고 품질, 큰 파일)
    ]

    results = []

    for quant_type in quant_types:
        output_path = f"../qwen2-1.5b-big5.{quant_type}.gguf"

        print(f"\nTesting {quant_type}...")

        # 양자화
        if quantize_gguf(fp16_model_path, output_path, quant_type):
            # 파일 크기 확인
            size_mb = os.path.getsize(output_path) / (1024**2)

            # 성능 테스트 (간단한 추론)
            inference_time = test_inference_speed(output_path)

            results.append({
                "quant_type": quant_type,
                "size_mb": size_mb,
                "inference_time": inference_time,
                "path": output_path
            })

    # 결과 비교
    print("\n=== Quantization Comparison ===")
    for result in results:
        print(f"{result['quant_type']:8s} | {result['size_mb']:6.1f}MB | {result['inference_time']:6.2f}s")

    return results

def test_inference_speed(model_path, test_prompt="안녕하세요?"):
    """추론 속도 테스트"""

    cmd = [
        "./main",
        "-m", model_path,
        "-p", test_prompt,
        "-n", "100",
        "--color"
    ]

    start_time = time.time()

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        end_time = time.time()

        return end_time - start_time
    except subprocess.TimeoutExpired:
        return 60.0  # 타임아웃

# 양자화 비교 테스트
quantization_results = compare_quantization_methods("../qwen2-1.5b-big5.fp16.gguf")
```

---

### 7단계: 앱 연동 테스트 (1-2일)

#### 7.1 iOS 앱 모델 통합
```typescript
// hooks/useOnDeviceSLLM.ts
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

interface SLLMConfig {
  modelPath: string;
  contextLength: number;
  temperature: number;
}

export const useOnDeviceSLLM = (config: SLLMConfig) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<any>(null);

  // 모델 로드
  const loadModel = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const startTime = Date.now();

      // 네이티브 모듈 호출
      const loadedModel = await SLLMNative.loadModel(config);

      const loadTime = Date.now() - startTime;
      console.log(`Model loaded in ${loadTime}ms`);

      // 성능 기준 확인 (5초 이내)
      if (loadTime > 5000) {
        console.warn(`Model loading took ${loadTime}ms, exceeding 5s target`);
      }

      setModel(loadedModel);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Model loading failed');
      console.error('Model loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  // 텍스트 생성
  const generateText = useCallback(async (prompt: string): Promise<string> => {
    if (!model) {
      throw new Error('Model not loaded');
    }

    setIsGenerating(true);
    setError(null);

    try {
      const startTime = Date.now();

      const result = await SLLMNative.generateText(model, {
        prompt,
        maxTokens: 800,
        temperature: config.temperature,
        stopSequences: ["<|im_end|>"]
      });

      const inferenceTime = Date.now() - startTime;
      console.log(`Inference completed in ${inferenceTime}ms`);

      // 성능 기준 확인 (15초 이내)
      if (inferenceTime > 15000) {
        console.warn(`Inference took ${inferenceTime}ms, exceeding 15s target`);
      }

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Generation failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [model, config.temperature]);

  // 메모리 해제
  const unloadModel = useCallback(async () => {
    if (model) {
      try {
        await SLLMNative.unloadModel(model);
        setModel(null);
      } catch (err) {
        console.error('Model unloading error:', err);
      }
    }
  }, [model]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      unloadModel();
    };
  }, [unloadModel]);

  return {
    model,
    isLoading,
    isGenerating,
    error,
    loadModel,
    generateText,
    unloadModel
  };
};
```

#### 7.2 네이티브 모듈 연동 (iOS)
```objective-c
// SLLMNative.mm
#import <Foundation/Foundation.h>
#import "llama.h"

@interface SLLMNative ()
@property (nonatomic, assign) llama_model* model;
@property (nonatomic, assign) llama_context* context;
@end

@implementation SLLMNative

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(loadModel:(NSDictionary *)config
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSString *modelPath = config[@"modelPath"];

        // 모델 파라미터 설정
        llama_model_params modelParams = llama_model_default_params();
        modelParams.n_gpu_layers = 0; // iOS에서는 CPU 사용

        // 모델 로드
        NSString *fullPath = [[NSBundle mainBundle] pathForResource:modelPath ofType:nil];
        self.model = llama_load_model_from_file([fullPath UTF8String], modelParams);

        if (!self.model) {
            reject(@"MODEL_LOAD_ERROR", @"Failed to load model", nil);
            return;
        }

        // 컨텍스트 설정
        llama_context_params contextParams = llama_context_default_params();
        contextParams.n_ctx = [config[@"contextLength"] integerValue];
        contextParams.seed = 1234;

        self.context = llama_new_context_with_model(self.model, contextParams);

        if (!self.context) {
            llama_free_model(self.model);
            self.model = NULL;
            reject(@"CONTEXT_CREATE_ERROR", @"Failed to create context", nil);
            return;
        }

        resolve(@{@"modelId": @(1)}); // 성공 시 ID 반환
    });
}

RCT_EXPORT_METHOD(generateText:(nonnull NSNumber *)modelId
                  config:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        if (!self.model || !self.context) {
            reject(@"MODEL_NOT_LOADED", @"Model not loaded", nil);
            return;
        }

        NSString *prompt = config[@"prompt"];
        NSInteger maxTokens = [config[@"maxTokens"] integerValue];
        float temperature = [config[@"temperature"] floatValue];

        // 토큰화
        std::vector<llama_token> tokens;
        tokens.resize(llama_tokenize(self.model, [prompt UTF8String], strlen([prompt UTF8String]), tokens.data(), tokens.size(), true, false));

        // 배치 설정
        llama_batch batch = llama_batch_init(tokens.size(), 0, 1);

        for (size_t i = 0; i < tokens.size(); i++) {
            batch.token[i] = tokens[i];
            batch.pos[i] = i;
            batch.seq_id[i] = 0;
            batch.logits[i] = i == tokens.size() - 1;
        }
        batch.n_tokens = tokens.size();

        // 추론 실행
        std::string result;
        for (int i = 0; i < maxTokens; i++) {
            llama_decode(self.context, batch);

            // 다음 토큰 샘플링
            llama_token newToken = llama_sample_token_greedy(self.context, nullptr);

            if (newToken == llama_token_eos(self.model)) {
                break;
            }

            // 결과에 추가
            char piece[256];
            int n = llama_token_to_piece(self.model, newToken, piece, sizeof(piece), true);
            result.append(piece, n);

            // 배치 업데이트
            batch = llama_batch_init(1, 0, 1);
            batch.token[0] = newToken;
            batch.pos[0] = tokens.size() + i;
            batch.seq_id[0] = 0;
            batch.logits[0] = true;
            batch.n_tokens = 1;
        }

        llama_batch_free(batch);

        resolve(@(result.c_str()));
    });
}

RCT_EXPORT_METHOD(unloadModel:(nonnull NSNumber *)modelId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (self.context) {
        llama_free(self.context);
        self.context = NULL;
    }

    if (self.model) {
        llama_free_model(self.model);
        self.model = NULL;
    }

    resolve(@{@"success": @YES});
}

@end
```

#### 7.3 통합 테스트
```typescript
// __tests__/SLLMIntegration.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useOnDeviceSLLM } from '../hooks/useOnDeviceSLLM';

describe('SLLM Integration Tests', () => {
  const mockConfig = {
    modelPath: 'models/qwen2-1.5b-big5.Q4_K_M.gguf',
    contextLength: 2048,
    temperature: 0.7
  };

  it('should load model within 5 seconds', async () => {
    const { result } = renderHook(() => useOnDeviceSLLM(mockConfig));

    const startTime = Date.now();

    await act(async () => {
      await result.current.loadModel();
    });

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.model).toBeTruthy();
  });

  it('should generate report within 15 seconds', async () => {
    const { result } = renderHook(() => useOnDeviceSLLM(mockConfig));

    // 먼저 모델 로드
    await act(async () => {
      await result.current.loadModel();
    });

    const testPrompt = buildBig5Prompt({
      openness: "새로운 것을 배우는 걸 좋아해요",
      conscientiousness: "계획을 세우고 지키는 게 중요해요",
      extraversion: "혼자 있을 때 에너지를 얻어요",
      agreeableness: "사람들을 도와주는 걸 즐겨요",
      neuroticism: "스트레스를 받으면 운동으로 풀어요"
    });

    const startTime = Date.now();

    await act(async () => {
      const response = await result.current.generateText(testPrompt);
    });

    const inferenceTime = Date.now() - startTime;

    expect(inferenceTime).toBeLessThan(15000);
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle model loading errors gracefully', async () => {
    const invalidConfig = {
      ...mockConfig,
      modelPath: 'invalid/model/path.gguf'
    };

    const { result } = renderHook(() => useOnDeviceSLLM(invalidConfig));

    await act(async () => {
      await result.current.loadModel();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeTruthy();
    expect(result.current.model).toBeFalsy();
  });
});
```

---

## 🔧 문제 해결 가이드

### 1. 흔한 문제 및 해결책

#### GPU 메모리 부족
```bash
# 문제: CUDA out of memory
# 해결: 배치 크기 줄이기
per_device_train_batch_size=1
gradient_accumulation_steps=16
```

#### 모델 품질 저하
```python
# 문제: 튜닝 후 성능 저하
# 해결: 학습률 조정
learning_rate=5e-5  # 더 낮은 학습률
num_train_epochs=5   # 더 많은 에포크
```

#### 양자화 후 성능 저하
```bash
# 문제: 4비트 양자화 후 품질 저하
# 해결: 더 높은 양자화 사용
Q5_K_M  # 5비트 K-Quants 중간
Q8_0    # 8비트 양자화
```

### 2. 최적화 팁

#### 데이터 품질 최적화
- 페르소나 일관성 검증 자동화
- 데이터 증강 기법 적용
- 골드 스탠다드 데이터 비율 높이기

#### 트레이닝 최적화
- 조기 종료(early stopping) 설정
- 학습률 스케줄러 튜닝
- 그래디언트 클리핑 적용

#### 추론 최적화
- 컨텍스트 길이 최적화
- 배치 추론 고려
- 캐싱 메커니즘 구현

---

## 📊 성능 벤치마크

### 목표 성능指标
- **모델 로딩**: < 5초 (iPhone 15 Pro)
- **추론 속도**: < 15초 (500토큰 생성)
- **앱 크기**: < 1.5GB (모델 포함)
- **메모리 사용**: < 2GB (평균)

### 모니터링 도구
```python
# 성능 모니터링
import psutil
import GPUtil

def monitor_system_resources():
    """시스템 리소스 모니터링"""

    # CPU 사용량
    cpu_percent = psutil.cpu_percent(interval=1)

    # 메모리 사용량
    memory = psutil.virtual_memory()

    # GPU 사용량
    gpus = GPUtil.getGPUs()
    gpu_memory = gpus[0].memoryUtil * 100 if gpus else 0

    return {
        "cpu_percent": cpu_percent,
        "memory_percent": memory.percent,
        "gpu_memory_percent": gpu_memory
    }
```

---

## 🎯 다음 단계

이 로드맵을 통해 성공적으로 온디바이스 LLM을 개발하셨다면:

1. **앱 통합**: React Native 앱에 완전히 통합
2. **성능 최적화**: 실제 기기에서 테스트 및 최적화
3. **사용자 테스트**: Beta 테스터를 통한 품질 검증
4. **배포**: App Store에 앱 출시

## 📚 추가 학습 자료

- [LLaMA-Factory 공식 문서](https://github.com/hiyouga/LLaMA-Factory)
- [llama.cpp 공식 문서](https://github.com/ggerganov/llama.cpp)
- [Qwen2 모델 허브](https://huggingface.co/Qwen/Qwen2-1.5B)
- [Expo 공식 문서](https://docs.expo.dev/)

---

이 로드맵이 LLM 개발 여정에 도움이 되기를 바랍니다! 궁금한 점이 있다면 언제든지 질문해주세요. 🚀