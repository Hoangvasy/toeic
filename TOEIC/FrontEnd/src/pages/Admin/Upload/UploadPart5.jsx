import React, { useState } from "react";

const UploadPart5 = ({ testId }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [loadingAll, setLoadingAll] = useState(false);

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  // ================= PARSER =================
  const parseQuestions = (rawText) => {
    const text = rawText
      .replace(/\r\n/g, "\n")
      .replace(/\n+/g, "\n")
      .replace(/\s+/g, " ")
      .trim();

    const answerStart = text.search(/\d{3}\.\s*[A-D]\s*-/);

    const questionText =
      answerStart !== -1 ? text.slice(0, answerStart) : text;

    const answerText =
      answerStart !== -1 ? text.slice(answerStart) : "";

    const blocks = questionText
      .split(/(?=\d{3}\.)/)
      .map((b) => b.trim())
      .filter((b) => /^\d{3}\./.test(b));

    const questions = blocks.map((block) => {
      const number = block.match(/^(\d{3})\./)?.[1] || "";

      const question =
        block.match(/^\d{3}\.\s*(.*?)\s*A\./s)?.[1]?.trim() || "";

      const options = {};

      ["A", "B", "C", "D"].forEach((letter) => {
        const match = block.match(
          new RegExp(`${letter}\\.\\s*(.*?)(?=\\s*[A-D]\\.|$)`, "s")
        );
        options[letter] = match ? match[1].trim() : "";
      });

      return {
        number,
        label: "",
        question,
        options,
        answer: "",
        explanation: "",
      };
    });

    // parse answer
    const answers = {};
    const answerRegex =
      /(\d{3})\.\s*([A-D])\s*-\s*(.*?)(?=\s*\d{3}\.\s*[A-D]\s*-|$)/gs;

    let match;
    while ((match = answerRegex.exec(answerText)) !== null) {
      const [, num, ans, exp] = match;

      answers[num] = {
        answer: ans,
        explanation: exp.replace(/\s+/g, " ").trim(),
      };
    }

    return questions.map((q) => ({
      ...q,
      answer: answers[q.number]?.answer || "",
      explanation: answers[q.number]?.explanation || "",
    }));
  };

  // ================= FILE =================
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const parsed = parseQuestions(event.target.result);
      setQuestions(parsed);
    };

    reader.readAsText(file);
  };

  // ================= AI =================
  const analyzeWithAI = async (index) => {
    const q = questions[index];
    if (!q.question) return;

    setLoadingIndex(index);

    const block = `
${q.question}
A. ${q.options.A}
B. ${q.options.B}
C. ${q.options.C}
D. ${q.options.D}
`;

    try {
      const res = await fetch(
        "http://localhost:8080/api/ai/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: block }),
        }
      );

      if (!res.ok) {
        console.error("API ERROR:", res.status);
        return;
      }

      const data = await res.json();

      const updated = [...questions];

      if (data.label) updated[index].label = data.label;
      if (data.answer) updated[index].answer = data.answer;

      setQuestions(updated);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }

    setLoadingIndex(null);
  };

  const analyzeAll = async () => {
    setLoadingAll(true);

    for (let i = 0; i < questions.length; i++) {
      await analyzeWithAI(i);
      await sleep(1500); // tránh 429
    }

    setLoadingAll(false);
  };

  // ================= EDIT =================
  const handleChangeQuestion = (index, field, value) => {
    const updated = [...questions];

    if (["A", "B", "C", "D"].includes(field)) {
      updated[index].options[field] = value;
    } else {
      updated[index][field] = value;
    }

    setQuestions(updated);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!testId) {
      alert("❗ Chọn đề trước!");
      return;
    }

    const invalid = questions.filter((q) => !q.answer);

    if (invalid.length > 0) {
      alert("⚠ Thiếu đáp án!");
      return;
    }

    const payload = questions.map((q) => ({
      testId,
      questionNumber: q.number,
      label: q.label,
      question: q.question,
      optionA: q.options.A,
      optionB: q.options.B,
      optionC: q.options.C,
      optionD: q.options.D,
      answer: q.answer,
      explanation: q.explanation,
    }));

    try {
      await fetch(
        `http://localhost:8080/api/part5/save?testId=${testId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      alert("✅ Saved!");
    } catch (err) {
      console.error(err);
      alert("❌ Save failed");
    }
  };

  // ================= UI =================
  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "auto" }}>
      <h1>Upload Part 5</h1>

      <input type="file" accept=".txt" onChange={handleChange} />

      {selectedFile && <p>📄 {selectedFile.name}</p>}

      {questions.length > 0 && (
        <button onClick={analyzeAll} disabled={loadingAll}>
          {loadingAll ? "Analyzing..." : "🤖 Analyze All"}
        </button>
      )}

      {questions.map((q, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            padding: 20,
            marginTop: 20,
            borderRadius: 8,
          }}
        >
          <h3>Question {q.number}</h3>

          <button
            onClick={() => analyzeWithAI(index)}
            disabled={loadingIndex === index}
          >
            {loadingIndex === index ? "..." : "AI"}
          </button>

          <p>🏷 Label: <b>{q.label || "N/A"}</b></p>

          <textarea
            value={q.question}
            onChange={(e) =>
              handleChangeQuestion(index, "question", e.target.value)
            }
            style={{ width: "100%", marginTop: 10 }}
          />

          {["A", "B", "C", "D"].map((opt) => (
            <input
              key={opt}
              value={q.options[opt]}
              onChange={(e) =>
                handleChangeQuestion(index, opt, e.target.value)
              }
              style={{
                width: "100%",
                marginTop: 5,
                background:
                  q.answer === opt ? "#d4edda" : "white",
              }}
              placeholder={`Option ${opt}`}
            />
          ))}

          <select
            value={q.answer}
            onChange={(e) =>
              handleChangeQuestion(index, "answer", e.target.value)
            }
          >
            <option value="">Answer</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
          </select>

          <textarea
            value={q.explanation}
            onChange={(e) =>
              handleChangeQuestion(index, "explanation", e.target.value)
            }
            placeholder="Explanation..."
            style={{ width: "100%", marginTop: 10 }}
          />
        </div>
      ))}

      {questions.length > 0 && (
        <button
          onClick={handleSave}
          style={{
            marginTop: 30,
            padding: "10px 20px",
            background: "#4a6cf7",
            color: "white",
            border: "none",
            borderRadius: 6,
          }}
        >
          💾 Save
        </button>
      )}
    </div>
  );
};

export default UploadPart5;