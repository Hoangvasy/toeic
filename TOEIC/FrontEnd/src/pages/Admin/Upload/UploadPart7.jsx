import React, { useState } from "react";

const UploadPart7 = ({ testId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [passages, setPassages] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // ================= PARSER =================
  const parseQuestions = (rawText) => {
  // ================= NORMALIZE =================
  const text = rawText
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/–|—/g, "-")
    .trim();

  // ================= SPLIT ANSWER =================
  const answerStartMatch = text.match(/(^|\n)\s*\d{2,3}\s*\.\s*[A-D]/);
  const answerStartIndex = answerStartMatch
    ? text.indexOf(answerStartMatch[0])
    : -1;

  const mainText =
    answerStartIndex !== -1
      ? text.slice(0, answerStartIndex).trim()
      : text;

  const answerText =
    answerStartIndex !== -1
      ? text.slice(answerStartIndex).trim()
      : "";

  // ================= PARSE ANSWERS =================
  const answers = {};

  const answerRegex =
    /(\d{2,3})\s*\.\s*([A-D])\s*[-:]?\s*([\s\S]*?)(?=\n\s*\d{2,3}\s*\.|\s*$)/g;

  let match;
  while ((match = answerRegex.exec(answerText)) !== null) {
    const [, num, choice, content] = match;

    answers[num] = {
      answer: choice.trim(),
      explanation: content
        .replace(/\s+/g, " ")
        .replace(/^["“”]+|["“”]+$/g, "")
        .trim(),
    };
  }

  console.log("✅ Answers parsed:", Object.keys(answers).length);

  // ================= SPLIT BLOCK =================
  const blocks = mainText.split(/(?=Questions\s+\d{2,3}[-–]\d{2,3})/i);

  const result = [];

  blocks.forEach((block, blockIndex) => {
    if (!block.trim()) return;

    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(
        (l) =>
          l &&
          !l.startsWith("Directions") &&
          !l.startsWith("PART") &&
          !/^\(/.test(l)
      );

    if (lines.length === 0) return;

    let passageLines = [];
    let questions = [];
    let currentQuestion = null;
    let lastOption = null;

    lines.forEach((line) => {
      // ===== QUESTION =====
      const qMatch =
        line.match(/^Question\s+(\d{2,3})/i) ||
        line.match(/^(\d{2,3})\.\s*(.*)/);

      if (qMatch) {
        if (currentQuestion) questions.push(currentQuestion);

        currentQuestion = {
          number: qMatch[1],
          question: (qMatch[2] || "").trim(),
          options: {},
        };

        lastOption = null;
        return;
      }

      // ===== OPTION =====
      const optMatch = line.match(/^([A-D])\.\s*(.+)$/);
      if (optMatch && currentQuestion) {
        lastOption = optMatch[1];
        currentQuestion.options[lastOption] = optMatch[2].trim();
        return;
      }

      // ===== MULTI-LINE OPTION =====
      if (
        lastOption &&
        currentQuestion &&
        !line.match(/^([A-D])\./) &&
        !line.match(/^\d{2,3}\./)
      ) {
        currentQuestion.options[lastOption] += " " + line;
        return;
      }

      // ===== PASSAGE / QUESTION TEXT =====
      if (!currentQuestion) {
        passageLines.push(line);
      } else if (Object.keys(currentQuestion.options).length === 0) {
        currentQuestion.question +=
          (currentQuestion.question ? " " : "") + line;
      }
    });

    if (currentQuestion) questions.push(currentQuestion);

    // ================= MAP ANSWERS =================
    questions.forEach((q) => {
      if (answers[q.number]) {
        q.answer = answers[q.number].answer;
        q.explanation = answers[q.number].explanation;
      }
    });

    // ================= DEBUG =================
    const missing = questions
      .filter((q) => !answers[q.number])
      .map((q) => q.number);

    if (missing.length > 0) {
      console.warn(`❌ Block ${blockIndex + 1} missing answers:`, missing);
    }

    const missingOptions = questions
      .filter(
        (q) =>
          !q.options.A ||
          !q.options.B ||
          !q.options.C ||
          !q.options.D
      )
      .map((q) => q.number);

    if (missingOptions.length > 0) {
      console.warn(`⚠️ Missing options:`, missingOptions);
    }

    if (questions.length > 0) {
      result.push({
        passage: passageLines.join("\n").trim(),
        questions: questions.sort(
          (a, b) => Number(a.number) - Number(b.number)
        ),
      });
    }
  });

  // ================= FINAL CHECK =================
  const totalQuestions = result.flatMap((p) => p.questions).length;

  console.log("✅ Total questions:", totalQuestions);

  console.log(
    "❌ Missing answers overall:",
    result
      .flatMap((p) => p.questions)
      .filter((q) => !q.answer)
      .map((q) => q.number)
  );

  return result;
};

  // ================= FILE HANDLER =================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPassages([]);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const parsed = parseQuestions(ev.target.result);
      setPassages(parsed);
    };
    reader.readAsText(file);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!testId) {
      alert("Vui lòng chọn test trước!");
      return;
    }

    if (passages.length === 0) {
      alert("Chưa parse được dữ liệu nào!");
      return;
    }

    const missingAnswer = passages
      .flatMap((p) => p.questions)
      .filter((q) => !q.answer);

    if (missingAnswer.length > 0) {
      alert(`Có ${missingAnswer.length} câu thiếu đáp án. Kiểm tra console để xem chi tiết.`);
      console.warn("Câu thiếu đáp án:", missingAnswer.map((q) => q.number));
      return;
    }

    setIsSaving(true);

    const payload = [];

    passages.forEach((p) => {
      p.questions.forEach((q) => {
        payload.push({
          questionNumber: q.number,
          passage: p.passage,
          question: q.question.trim(),
          optionA: q.options.A || "",
          optionB: q.options.B || "",
          optionC: q.options.C || "",
          optionD: q.options.D || "",
          answer: q.answer,
          explanation: q.explanation || "",
        });
      });
    });

    try {
      const res = await fetch(
        `http://localhost:8080/api/part7/save?testId=${testId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      alert(`Đã lưu thành công ${payload.length} câu hỏi Part 7!`);
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ================= RENDER =================
  return (
    <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "24px" }}>Upload & Parse TOEIC Part 7</h1>

      <input
        type="file"
        accept=".txt,.text"
        onChange={handleFileChange}
        style={{ marginBottom: "16px" }}
      />

      {selectedFile && (
        <p style={{ color: "#555", marginBottom: "24px" }}>
          File: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
        </p>
      )}

      {passages.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <p>Tổng: <strong>{passages.flatMap(p => p.questions).length}</strong> câu hỏi từ <strong>{passages.length}</strong> khối passage</p>
        </div>
      )}

      {passages.map((p, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: "40px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            background: "#f9f9f9",
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            Khối {idx + 1} {p.questions[0]?.number ? `(bắt đầu từ Q${p.questions[0].number})` : ""}
          </h3>

          <textarea
            readOnly
            value={p.passage}
            style={{
              width: "100%",
              height: "160px",
              fontSize: "14px",
              marginBottom: "20px",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          {p.questions.map((q) => (
            <div
              key={q.number}
              style={{
                marginBottom: "24px",
                padding: "16px",
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "6px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontWeight: "bold", color: "#d35400", marginBottom: "8px" }}>
                Question {q.number}
              </div>

              <p style={{ margin: "0 0 12px 0", lineHeight: "1.5" }}>{q.question.trim()}</p>

              {["A", "B", "C", "D"].map((opt) => (
                <div
                  key={opt}
                  style={{
                    padding: "6px 12px",
                    marginBottom: "6px",
                    background: q.answer === opt ? "#e8f5e9" : "#f5f5f5",
                    borderRadius: "4px",
                    border: q.answer === opt ? "1px solid #81c784" : "none",
                  }}
                >
                  <strong>{opt}.</strong> {q.options[opt]}
                </div>
              ))}

              {q.answer && (
                <p style={{ marginTop: "12px", color: "#2e7d32", fontWeight: "500" }}>
                  Đáp án đúng: <strong>{q.answer}</strong>
                </p>
              )}

              {q.explanation && (
                <p style={{ marginTop: "8px", color: "#555", fontSize: "14px" }}>
                  <strong>Giải thích:</strong> {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      ))}

      {passages.length > 0 && (
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            padding: "12px 32px",
            fontSize: "16px",
            background: isSaving ? "#aaa" : "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: isSaving ? "not-allowed" : "pointer",
            marginTop: "24px",
          }}
        >
          {isSaving ? "Đang lưu..." : "Lưu vào Database"}
        </button>
      )}
    </div>
  );
};

export default UploadPart7;