# generate_advice.py

import os
import sys
import argparse
from google import genai
from google.genai import types

def build_prompt(sleep_records: str, days: int) -> str:
    """
    sleep_records: 아래와 같은 형식의 문자열
      • 2025-06-01: 23:30 → 07:10 (특이사항: 코골이 심함)
      • 2025-06-02: 22:45 → 06:50 (특이사항: 숙면)
      ...
    days: 분석할 최근 일수
    """
    return f"""
다음은 사용자의 최근 {days}일간 수면 기록입니다:
{sleep_records}

위 데이터를 바탕으로:
1. 사용자의 수면 패턴(예: 평균 수면시간, 규칙성, 특이사항)을 간단히 분석해 주세요.
2. 수면의 질을 높이기 위한 구체적인 조언 3가지를 제안해 주세요.

※ 한국어로 답변해 주시고, 가능한 친근한 어투로 작성해 주세요.
""".strip()

def call_gemma(prompt_text: str) -> str:
    """
    Google AI Studio Gemma 모델에 prompt_text를 보내고,
    모델이 생성한 텍스트(조언)를 받아서 반환합니다.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("환경 변수 GEMINI_API_KEY가 설정되어 있지 않습니다.")

    client = genai.Client(api_key=api_key)

    # 사용할 Gemma 모델 이름: 가벼운 버전부터 무거운 버전까지 원하시는 모델로 교체 가능
    model_name = "gemma-3-1b-it"  # 예시: 물리적으로 가벼운 버전을 사용
    # (프로젝트 상황에 맞춰 ex: "gemma-3b" 또는 "gemma-7b" 등으로 바꿔도 됩니다)

    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=prompt_text),
            ],
        ),
    ]
    generate_config = types.GenerateContentConfig(
        response_mime_type="text/plain",
        temperature=0.7,      # 0.0 ~ 1.0 사이. 0에 가까울수록 결정적 응답
        max_output_tokens=512 # 출력 토큰(단어) 수 제한
    )

    # “스트리밍” 형식으로 읽어오고 싶지 않다면 generate_content(...) 를 써도 됩니다.
    # 여기서는 편의상 동기식 스트리밍 예제를 사용합니다.
    result_text = ""
    for chunk in client.models.generate_content_stream(
        model=model_name,
        contents=contents,
        config=generate_config,
    ):
        # chunk.text에는 생성된 텍스트의 일부가 담깁니다.
        result_text += chunk.text

    return result_text.strip()

def main():
    parser = argparse.ArgumentParser(
        description="Gemma LLM을 이용해 수면 기록을 분석하고 AI 조언을 생성합니다."
    )
    parser.add_argument(
        "-d", "--days",
        type=int,
        default=7,
        help="최근 N일간 기록을 분석하려면 해당 일수를 지정하세요. (기본: 7일)"
    )
    parser.add_argument(
        "-f", "--file",
        type=str,
        help="수면 기록을 미리 작성한 파일 경로(텍스트). 없으면 stdin에서 읽습니다."
    )
    args = parser.parse_args()

    # 1) sleep_records 입력 받기
    if args.file:
        # 파일에서 그대로 내용을 읽어옴
        try:
            with open(args.file, "r", encoding="utf-8") as fp:
                sleep_records = fp.read().strip()
        except Exception as e:
            print(f"파일을 읽어오는 중 오류 발생: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        # stdin으로부터 텍스트 전체를 읽음
        print("▶ 표준 입력으로 최근 수면 기록을 줄 단위로 입력하세요. 입력이 끝나면 Ctrl+D(Unix/macOS) 또는 Ctrl+Z+Enter(Windows)를 누르세요.")
        sleep_records = sys.stdin.read().strip()

    if not sleep_records:
        print("❌ 수면 기록 텍스트가 비어 있습니다. 입력을 확인하세요.", file=sys.stderr)
        sys.exit(1)

    # 2) Prompt 생성
    prompt_text = build_prompt(sleep_records, args.days)

    # 3) Gemma API 호출
    try:
        advice = call_gemma(prompt_text)
    except Exception as e:
        print(f"Gemma API 호출 중 오류 발생: {e}", file=sys.stderr)
        sys.exit(1)

    # 4) 결과 출력
    print("\n=== AI의 수면 진단 및 조언 ===\n")
    print(advice)
    print("\n============================\n")

if __name__ == "__main__":
    main()
