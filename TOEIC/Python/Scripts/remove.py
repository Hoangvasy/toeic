import json
from pathlib import Path

INPUT_FILE = Path("Data/toeic_teacher_v3_clean.jsonl")
OUTPUT_FILE = Path("Data/toeic_teacher_v4_final.jsonl")


# =========================
# EXTRACT LABEL (ROBUST)
# =========================
def extract_label(assistant_text: str):
    lines = assistant_text.splitlines()

    for i, line in enumerate(lines):
        line_strip = line.strip()

        # CASE 1: Label: word_form (same line)
        if "Label:" in line_strip:
            parts = line_strip.split("Label:")
            if len(parts) > 1:
                label = parts[1].strip()
                if label:
                    return label.lower()

            # CASE 2: Label: then next line
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                if next_line and not next_line.startswith("Explanation"):
                    return next_line.lower()

        # CASE 3: line is exactly label (fallback)
        if line_strip in [
            "word_form",
            "vocabulary_collocation",
            "vocabulary_meaning",
            "adverb",
            "pronoun",
            "preposition",
            "conjunction",
            "subject_verb_agreement",
            "tense_voice",
            "adjective",
            "confusing_words"
        ]:
            return line_strip.lower()

    return "unknown"


# =========================
# CLEAN CHECK
# =========================
def is_valid_label(label: str):
    return label not in ["unknown", "none", "null", ""]


# =========================
# CONVERT PIPELINE
# =========================
def convert():
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    total = 0
    kept = 0
    removed = 0

    label_stats = {}

    with open(INPUT_FILE, "r", encoding="utf-8") as f_in, \
         open(OUTPUT_FILE, "w", encoding="utf-8") as f_out:

        for line in f_in:
            if not line.strip():
                continue

            try:
                sample = json.loads(line)
                messages = sample["messages"]

                user = messages[0]["content"]
                assistant = messages[1]["content"]

                label = extract_label(assistant)

                total += 1

                # skip bad label
                if not is_valid_label(label):
                    removed += 1
                    continue

                kept += 1

                # stats per label
                label_stats[label] = label_stats.get(label, 0) + 1

                new_sample = {
                    "messages": [
                        {"role": "user", "content": user},
                        {"role": "assistant", "content": assistant}
                    ]
                }

                f_out.write(json.dumps(new_sample, ensure_ascii=False) + "\n")

            except Exception as e:
                print(f"[SKIP] {e}")

    # =========================
    # REPORT
    # =========================
    print("\n====================")
    print("DONE")
    print(f"Total samples: {total}")
    print(f"Kept: {kept}")
    print(f"Removed (unknown): {removed}")
    print(f"Saved: {OUTPUT_FILE}")

    print("\nLabel distribution:")
    for k, v in sorted(label_stats.items(), key=lambda x: -x[1]):
        print(f"{k}: {v}")


if __name__ == "__main__":
    convert()