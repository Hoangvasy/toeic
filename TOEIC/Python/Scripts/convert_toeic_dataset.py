import json
import re
from pathlib import Path

INPUT_FILE = Path("Data/toeic_teacher_v7_clean.jsonl")
OUTPUT_FILE = Path("Data/toeic_teacher_v9.jsonl")


# =========================
# EXTRACT ANSWER (FIXED)
# =========================
def extract_answer(text: str):
    # hỗ trợ cả v5 và v7
    patterns = [
        r"Correct Answer:\s*([A-D])",
        r"Answer:\s*([A-D])"
    ]

    for p in patterns:
        m = re.search(p, text)
        if m:
            return m.group(1)

    return "UNKNOWN"


# =========================
# EXTRACT LABEL
# =========================
def extract_label(text: str):
    m = re.search(r"Label:\s*([a-zA-Z_]+)", text)
    return m.group(1).lower() if m else "unknown"


# =========================
# CLEAN EXPLANATION (ROBUST v7)
# =========================
def clean_explanation(text: str):
    lines = text.splitlines()
    cleaned = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # remove headers
        if line.startswith("Answer:"):
            continue
        if line.startswith("Correct Answer:"):
            continue
        if line.startswith("Explanation:"):
            continue
        if line.startswith("Label:"):
            continue

        # remove standalone label artifacts
        if re.fullmatch(r"[a-zA-Z_]+", line):
            continue

        cleaned.append(line)

    paragraph = " ".join(cleaned)
    paragraph = re.sub(r"\s+", " ", paragraph).strip()
    return paragraph


# =========================
# CONVERT
# =========================
def convert():
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    total = 0
    kept = 0
    removed = 0

    with open(INPUT_FILE, "r", encoding="utf-8") as f_in, \
         open(OUTPUT_FILE, "w", encoding="utf-8") as f_out:

        for line in f_in:
            if not line.strip():
                continue

            sample = json.loads(line)

            user = sample["messages"][0]["content"]
            assistant = sample["messages"][1]["content"]

            total += 1

            answer = extract_answer(assistant)
            label = extract_label(assistant)

            if answer == "UNKNOWN" or label == "unknown":
                removed += 1
                continue

            explanation = clean_explanation(assistant)

            new_sample = {
                "messages": [
                    {
                        "role": "user",
                        "content": user
                    },
                    {
                        "role": "assistant",
                        "content": f"Answer: {answer}\nExplanation: {explanation}"
                    }
                ],
                "meta": {
                    "answer": answer,
                    "label": label
                }
            }

            f_out.write(json.dumps(new_sample, ensure_ascii=False) + "\n")
            kept += 1

    print("\n====================")
    print("V9 FIXED DONE")
    print(f"Total: {total}")
    print(f"Kept: {kept}")
    print(f"Removed: {removed}")
    print(f"Saved: {OUTPUT_FILE}")


if __name__ == "__main__":
    convert()