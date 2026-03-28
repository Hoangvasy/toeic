import React, { useState, useEffect, useRef } from "react";

const UploadPart7 = ({ testId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [groups, setGroups] = useState([]); // ✅ group theo passage
  const fileRef = useRef(null);

  const key = `draft_part7_${testId}`;

  // ================= LOAD =================
  useEffect(() => {
    if (!testId) return;
    try {
      const saved = localStorage.getItem(key);
      if (saved) setGroups(JSON.parse(saved));
      else setGroups([]);
    } catch {
      setGroups([]);
    }
  }, [testId]);

  // ================= SAVE =================
  useEffect(() => {
    if (!testId) return;
    localStorage.setItem(key, JSON.stringify(groups));
  }, [groups, testId]);

  // ================= PARSER =================
  const parseQuestions = (rawText) => {
    const text = rawText
      .replace(/\r\n/g, "\n")
      .replace(/\n+/g, "\n");

    const answerStart = text.search(/\b\d{3}\.\s*[A-D]\s*-/);
    const mainText = answerStart !== -1 ? text.slice(0, answerStart) : text;
    const answerText = answerStart !== -1 ? text.slice(answerStart) : "";

    const answers = {};
    const answerRegex = /(\d{3})\.\s*([A-D])\s*-\s*([\s\S]*?)(?=\n\s*\d{3}\.|$)/g;

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

        let header = "";
        let passage = [];
        let questions = [];
        let current = null;

        lines.forEach((line) => {
          if (/^Questions\s+\d+-\d+/i.test(line)) {
            header = line;
            return;
          }

          const qMatch = line.match(/^(\d{3})\.\s*(.*)/);
          if (qMatch) {
            if (current) questions.push(current);

            current = {
              number: qMatch[1],
              question: qMatch[2],
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
          header,
          passage: passage.join("\n"),
          questions,
        };
      })
      .filter((g) => g.questions.length > 0);
  };

  // ================= FILE =================
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const parsed = parseQuestions(event.target.result || "");
      setGroups(parsed);
    };

    reader.readAsText(file);
  };

  // ================= DELETE =================
  const deleteGroup = (index) => {
    setGroups((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteQuestion = (gIndex, qIndex) => {
    setGroups((prev) =>
      prev
        .map((g, i) => {
          if (i !== gIndex) return g;
          const newQ = g.questions.filter((_, j) => j !== qIndex);
          return { ...g, questions: newQ };
        })
        .filter((g) => g.questions.length > 0)
    );
  };

  // ================= UPDATE =================
  const updateGroup = (index, value) => {
    setGroups((prev) =>
      prev.map((g, i) => (i === index ? { ...g, passage: value } : g))
    );
  };

  const updateQuestion = (gIndex, qIndex, field, value) => {
    setGroups((prev) =>
      prev.map((g, i) => {
        if (i !== gIndex) return g;

        const newQuestions = g.questions.map((q, j) => {
          if (j !== qIndex) return q;

          if (["A", "B", "C", "D"].includes(field)) {
            return {
              ...q,
              options: { ...q.options, [field]: value },
            };
          }

          return { ...q, [field]: value };
        });

        return { ...g, questions: newQuestions };
      })
    );
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!testId) return alert("Chọn test trước!");

    const payload = [];

    groups.forEach((g) => {
      g.questions.forEach((q) => {
        payload.push({
          header: g.header || "",
          passage: g.passage || "",
          questionNumber: Number(q.number),
          question: q.question || "",
          optionA: q.options?.A || "",
          optionB: q.options?.B || "",
          optionC: q.options?.C || "",
          optionD: q.options?.D || "",
          answer: q.answer || "",
          explanation: q.explanation || "",
        });
      });
    });

    try {
      await fetch(`http://localhost:8080/api/part7/save?testId=${testId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      alert("✅ Saved Part7");
    } catch (err) {
      console.error(err);
      alert("❌ Save failed");
    }
  };

  // ================= UI =================
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Upload Part 7</h1>

      {/* Upload */}
      <div
        onClick={() => fileRef.current?.click()}
        className="bg-white p-10 rounded-2xl shadow mb-8 text-center border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer"
      >
        <input
          ref={fileRef}
          type="file"
          accept=".txt"
          onChange={handleChange}
          className="hidden"
        />
        <p>📂 Click để chọn file</p>
        {selectedFile && <p className="mt-2">📄 {selectedFile.name}</p>}
      </div>

      {/* Content */}
      <div className="space-y-8">
        {groups.map((g, gi) => (
          <div key={gi} className="bg-white p-6 rounded-2xl shadow border">
            <div className="flex justify-between mb-2">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
                {g.header}
              </span>
              <button
                onClick={() => deleteGroup(gi)}
                className="text-red-500"
              >
                🗑
              </button>
            </div>

            <textarea
              value={g.passage}
              onChange={(e) => updateGroup(gi, e.target.value)}
              className="w-full border p-3 rounded-lg mb-4 bg-gray-50"
            />

            {g.questions.map((q, qi) => (
              <div key={qi} className="border rounded-xl p-4 mb-4">
                <div className="flex justify-between">
                  <b>{q.number}</b>
                  <button
                    onClick={() => deleteQuestion(gi, qi)}
                    className="text-red-500"
                  >
                    ❌
                  </button>
                </div>

                <textarea
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(gi, qi, "question", e.target.value)
                  }
                  className="w-full border p-2 rounded mt-2"
                />

                <div className="grid md:grid-cols-2 gap-2 mt-2">
                  {["A", "B", "C", "D"].map((opt) => (
                    <input
                      key={opt}
                      value={q.options?.[opt] || ""}
                      onChange={(e) =>
                        updateQuestion(gi, qi, opt, e.target.value)
                      }
                      className={`p-2 border rounded ${
                        q.answer === opt ? "border-green-500 bg-green-50" : ""
                      }`}
                    />
                  ))}
                </div>

                <select
                  value={q.answer}
                  onChange={(e) =>
                    updateQuestion(gi, qi, "answer", e.target.value)
                  }
                  className="mt-2 border p-2 rounded"
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
                    updateQuestion(gi, qi, "explanation", e.target.value)
                  }
                  className="w-full border p-2 rounded mt-2"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {groups.length > 0 && (
        <button
          onClick={handleSave}
          className="mt-6 w-full bg-blue-500 text-white py-3 rounded-xl"
        >
          💾 Save
        </button>
      )}
    </div>
  );
};

export default UploadPart7;
