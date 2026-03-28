import React, { useState, useEffect, useRef } from "react";

const UploadPart6 = ({ testId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [passages, setPassages] = useState([]);
  const fileRef = useRef();

  const key = `draft_part6_${testId}`;

  // ✅ LOAD FROM DB → fallback local
  useEffect(() => {
    if (!testId) return;

    const loadData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/part6?testId=${testId}`
        );
        const data = await res.json();

        if (data && data.length > 0) {
          const grouped = {};

          data.forEach((q) => {
            const passageKey = (q.passage || "").trim();

            if (!grouped[passageKey]) {
              grouped[passageKey] = [];
            }

            grouped[passageKey].push({
              number: q.questionNumber?.toString(),
              options: {
                A: q.optionA || "",
                B: q.optionB || "",
                C: q.optionC || "",
                D: q.optionD || "",
              },
              answer: q.answer || "",
              explanation: q.explanation || "",
            });
          });

          const formatted = Object.keys(grouped).map((passage) => ({
            passage,
            questions: grouped[passage],
          }));

          setPassages(formatted);
        } else {
          const saved = localStorage.getItem(key);
          if (saved) setPassages(JSON.parse(saved));
          else setPassages([]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [testId]);

  // ✅ AUTO SAVE LOCAL
  useEffect(() => {
    if (!testId) return;

    const timeout = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(passages));
    }, 500);

    return () => clearTimeout(timeout);
  }, [passages, testId]);

  // ✅ DELETE PASSAGE
  const handleDeletePassage = (pIndex) => {
    if (!window.confirm("Xóa passage này?")) return;
    setPassages((prev) => prev.filter((_, i) => i !== pIndex));
  };

  // ✅ DELETE QUESTION
  const handleDeleteQuestion = (pIndex, qIndex) => {
    if (!window.confirm("Xóa câu này?")) return;

    setPassages((prev) =>
      prev.map((p, i) => {
        if (i !== pIndex) return p;

        const newQuestions = p.questions.filter((_, j) => j !== qIndex);

        return { ...p, questions: newQuestions };
      })
    );
  };

  // ✅ PARSE FILE
  const parseQuestions = (rawText) => {
    const text = rawText
      .replace(/\r\n/g, "\n")
      .replace(/\n{2,}/g, "\n");

    const answerStart = text.search(/\b\d{3}\.\s*[A-D]\s*-/);
    const mainText = answerStart !== -1 ? text.slice(0, answerStart) : text;
    const answerText = answerStart !== -1 ? text.slice(answerStart) : "";

    const answers = {};
    const answerRegex =
      /(\d{3})\.\s*([A-D])\s*-\s*(.*?)(?=\n\s*\d{3}\.\s*[A-D]\s*-|$)/gs;

    let m;
    while ((m = answerRegex.exec(answerText)) !== null) {
      answers[m[1]] = {
        answer: m[2],
        explanation: m[3].trim(),
      };
    }

    const blocks = mainText.split(/(?=Questions\s+\d+-\d+)/i);

    return blocks
      .map((block) => {
        const lines = block
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);

        let passage = [];
        let questions = [];
        let current = null;

        lines.forEach((line) => {
          const qMatch = line.match(/(\d{3})/);

          if (qMatch && line.length < 10) {
            if (current) questions.push(current);

            current = {
              number: qMatch[1],
              options: { A: "", B: "", C: "", D: "" },
              answer: "",
              explanation: "",
            };
            return;
          }

          const optMatch = line.match(/^([A-D])\.\s*(.*)/);
          if (optMatch && current) {
            current.options[optMatch[1]] = optMatch[2];
            return;
          }

          if (!current) passage.push(line);
        });

        if (current) questions.push(current);

        questions.forEach((q) => {
          if (answers[q.number]) {
            q.answer = answers[q.number].answer;
            q.explanation = answers[q.number].explanation;
          }
        });

        return {
          passage: passage.join("\n"),
          questions,
        };
      })
      .filter((p) => p.questions.length > 0);
  };

  // ✅ UPLOAD FILE
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (passages.length > 0) {
      const ok = window.confirm("Dữ liệu hiện tại sẽ bị ghi đè. Tiếp tục?");
      if (!ok) return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPassages(parseQuestions(event.target.result));
    };

    reader.readAsText(file);
  };

  // ✅ UPDATE
  const updatePassage = (index, value) => {
    setPassages((prev) =>
      prev.map((p, i) => (i === index ? { ...p, passage: value } : p))
    );
  };

  const updateQuestion = (pIndex, qIndex, field, value) => {
    setPassages((prev) =>
      prev.map((p, i) => {
        if (i !== pIndex) return p;

        const newQuestions = p.questions.map((q, j) => {
          if (j !== qIndex) return q;

          if (["A", "B", "C", "D"].includes(field)) {
            return {
              ...q,
              options: { ...q.options, [field]: value },
            };
          }

          return { ...q, [field]: value };
        });

        return { ...p, questions: newQuestions };
      })
    );
  };

  // ✅ SAVE
  const handleSave = async () => {
    if (!testId) return alert("Chọn test trước!");

    const payload = [];

    passages.forEach((p) => {
      p.questions.forEach((q) => {
        payload.push({
          questionNumber: parseInt(q.number),
          passage: p.passage,
          question: "",
          optionA: q.options.A,
          optionB: q.options.B,
          optionC: q.options.C,
          optionD: q.options.D,
          answer: q.answer,
          explanation: q.explanation,
        });
      });
    });

    try {
      await fetch(`http://localhost:8080/api/part6/save?testId=${testId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      alert("✅ Saved Part6");
      localStorage.removeItem(key);
    } catch (err) {
      console.error(err);
      alert("❌ Save failed");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">
        Upload Part 6
      </h1>

      <div
        onClick={() => fileRef.current.click()}
        className="bg-white p-10 rounded-2xl shadow mb-6 text-center border-2 border-dashed cursor-pointer"
      >
        <input
          ref={fileRef}
          type="file"
          accept=".txt"
          onChange={handleChange}
          className="hidden"
        />
        <p>📂 Upload file</p>
        {selectedFile && <p>📄 {selectedFile.name}</p>}
      </div>

      {passages.map((p, i) => (
        <div key={i} className="bg-white p-6 rounded shadow mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2>Passage {i + 1}</h2>
            <button
              onClick={() => handleDeletePassage(i)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete Passage
            </button>
          </div>

          <textarea
            value={p.passage}
            onChange={(e) => updatePassage(i, e.target.value)}
            className="w-full border p-3 rounded mb-4"
          />

          {p.questions.map((q, j) => (
            <div key={q.number} className="border p-4 rounded mb-3">
              <div className="flex justify-between">
                <h3>Question {q.number}</h3>
                <button
                  onClick={() => handleDeleteQuestion(i, j)}
                  className="bg-red-400 text-white px-2 rounded"
                >
                  Delete
                </button>
              </div>

              {['A','B','C','D'].map((opt) => (
                <input
                  key={opt}
                  value={q.options[opt]}
                  onChange={(e) => updateQuestion(i, j, opt, e.target.value)}
                  className="w-full border p-2 mt-2"
                />
              ))}

              <select
                value={q.answer}
                onChange={(e) => updateQuestion(i, j, 'answer', e.target.value)}
                className="mt-2 border p-2"
              >
                <option value="">Answer</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>

              <textarea
                value={q.explanation}
                onChange={(e) => updateQuestion(i, j, 'explanation', e.target.value)}
                className="w-full border p-2 mt-2"
              />
            </div>
          ))}
        </div>
      ))}

      {passages.length > 0 && (
        <button
          onClick={handleSave}
          className="w-full bg-green-500 text-white py-3 rounded"
        >
          💾 Save
        </button>
      )}
    </div>
  );
};

export default UploadPart6;
