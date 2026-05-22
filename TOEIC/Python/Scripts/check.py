import json
from pathlib import Path

INPUT_FILE = Path("Data/toeic_teacher_dataset.jsonl")

def extract_outer_label(text):
    """
    Lấy label ở dòng: Label: xxx
    """
    if not isinstance(text, str):
        return None

    import re
    m = re.search(r"Label:\s*([a-zA-Z_]+)", text)
    if m:
        return m.group(1).strip().lower()

    return None


def main():
    total = 0
    unknown_count = 0
    other_labels = {}

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue

            sample = json.loads(line)
            assistant = sample["messages"][1]["content"]

            label = extract_outer_label(assistant)

            total += 1

            if label == "unknown" or label is None:
                unknown_count += 1
            else:
                other_labels[label] = other_labels.get(label, 0) + 1

    print("Total samples:", total)
    print("Unknown labels:", unknown_count)
    print("\nLabel distribution:")
    for k, v in sorted(other_labels.items(), key=lambda x: -x[1]):
        print(f"{k}: {v}")


if __name__ == "__main__":
    main()