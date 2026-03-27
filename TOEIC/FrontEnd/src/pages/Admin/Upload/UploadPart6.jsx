import React, { useState } from "react";

const UploadPart6 = ({ testId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [passages, setPassages] = useState([]);

  // ================= PARSER =================
  const parseQuestions = (rawText) => {
    const text = rawText
      .replace(/\r\n/g, "\n")
      .replace(/\n+/g, "\n");

    // ===== DETECT ANSWER BLOCK =====
    const answerStart = text.search(/\b\d{3}\.\s*[A-D]\s*-/);
    const hasAnswer = answerStart !== -1;

    const mainText = hasAnswer ? text.slice(0, answerStart) : text;
    const answerText = hasAnswer ? text.slice(answerStart) : "";

    // ===== PARSE ANSWERS =====
    const answers = {};

    if (hasAnswer) {
      const answerRegex =
        /(\d{3})\.\s*([A-D])\s*-\s*([\s\S]*?)(?=\n\s*\d{3}\.\s*[A-D]\s*-|$)/g;

      let m;
      while ((m = answerRegex.exec(answerText)) !== null) {
        const [, num, ans, exp] = m;

        answers[num] = {
          answer: ans,
          explanation: exp.replace(/\s+/g, " ").trim(),
        };
      }
    }

    // ===== SPLIT PASSAGES =====
    const blocks = mainText.split(/(?=Questions\s+\d+-\d+)/i);

    const result = [];

    blocks.forEach((block) => {
      const lines = block
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      if (!lines.length) return;

      let passage = [];
      let questions = [];
      let current = null;

      lines.forEach((line) => {
        // ===== DETECT QUESTION =====
        let qMatch = line.match(/^Question\s+(\d{3})/i);

        if (!qMatch) {
          qMatch =
            line.match(/^(\d{3})\.$/) ||
            line.match(/^(\d{3})\./) ||
            line.match(/^(\d{3})$/);
        }

        if (qMatch) {
          if (current) questions.push(current);

          current = {
            number: qMatch[1],
            options: {},
            answer: "",
            explanation: "",
          };
          return;
        }

        // ===== OPTIONS =====
        const optMatch = line.match(/^([A-D])\.\s*(.*)/);
        if (optMatch && current) {
          current.options[optMatch[1]] = optMatch[2];
          return;
        }

        // ===== PASSAGE =====
        if (!current) {
          passage.push(line);
        }
      });

      if (current) questions.push(current);

      // ===== CLEAN + REMOVE DUPLICATE =====
      const cleanQuestions = questions
        .filter(
          (q) =>
            q.options.A &&
            q.options.B &&
            q.options.C &&
            q.options.D
        )
        .reduce((acc, q) => {
          if (!acc.find((x) => x.number === q.number)) {
            acc.push(q);
          }
          return acc;
        }, []);

      // ===== SORT =====
      cleanQuestions.sort(
        (a, b) => Number(a.number) - Number(b.number)
      );

      // ===== MERGE ANSWERS =====
      cleanQuestions.forEach((q) => {
        if (answers[q.number]) {
          q.answer = answers[q.number].answer;
          q.explanation = answers[q.number].explanation;
        }
      });

      if (cleanQuestions.length > 0) {
        result.push({
          passage: passage.join("\n"),
          questions: cleanQuestions,
        });
      }
    });

    console.log("FINAL:", result);
    return result;
  };

  // ================= FILE =================
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const parsed = parseQuestions(event.target.result);
      setPassages(parsed);
    };

    reader.readAsText(file);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!testId) {
      alert("Chọn test trước!");
      return;
    }

    const payload = [];

    passages.forEach((p) => {
      p.questions.forEach((q) => {
        payload.push({
          questionNumber: q.number,
          passage: p.passage,
          question: "", // Part 6 không có question riêng
          optionA: q.options.A || "",
          optionB: q.options.B || "",
          optionC: q.options.C || "",
          optionD: q.options.D || "",
          answer: q.answer,
          explanation: q.explanation,
        });
      });
    });

    console.log("PAYLOAD:", payload);

    try {
      await fetch(
        `http://localhost:8080/api/part6/save?testId=${testId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      alert("✅ Saved Part6");
    } catch (err) {
      console.error(err);
      alert("❌ Save failed");
    }
  };

  // ================= UI =================
  const highlightPassage = (text) => {
    return text.replace(/\((\d{3})\)/g, "👉 ($1)");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Upload Part 6</h1>

      <input type="file" accept=".txt" onChange={handleChange} />

      {selectedFile && <p>📄 {selectedFile.name}</p>}

      {passages.map((p, i) => (
        <div key={i} style={{ marginTop: 30 }}>
          {/* PASSAGE */}
          <textarea
            value={highlightPassage(p.passage)}
            readOnly
            style={{
              width: "100%",
              height: 150,
              background: "#f8f9fa",
            }}
          />

          {/* QUESTIONS */}
          {p.questions.map((q) => (
            <div
              key={q.number}
              style={{
                marginTop: 20,
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 6,
              }}
            >
              <h4>Question {q.number}</h4>

              {["A", "B", "C", "D"].map((opt) => (
                <div
                  key={opt}
                  style={{
                    background:
                      q.answer === opt ? "#d4edda" : "transparent",
                    padding: 6,
                    borderRadius: 4,
                  }}
                >
                  {opt}. {q.options[opt]}
                </div>
              ))}

              <p>
                ✅ Answer: <b>{q.answer || "N/A"}</b>
              </p>

              <p style={{ color: "#555" }}>
                📖 {q.explanation || ""}
              </p>
            </div>
          ))}
        </div>
      ))}

      {passages.length > 0 && (
        <button
          onClick={handleSave}
          style={{
            marginTop: 30,
            padding: "10px 20px",
            background: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: 6,
          }}
        >
          Save
        </button>
      )}
    </div>
  );
};

export default UploadPart6;