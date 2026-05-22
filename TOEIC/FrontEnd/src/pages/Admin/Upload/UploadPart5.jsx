import React, { useState, useEffect, useRef } from "react";
import UploadLayout from "./UploadLayout";
import QuestionCard from "./QuestionCard";

const UploadPart5 = ({ testId }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [search, setSearch] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingIndex, setAnalyzingIndex] = useState(null);
  const [progress, setProgress] = useState(0);

  const fileRef = useRef();
  const key = `draft_part5_${testId}`;

  // ================= LOAD =================
  useEffect(() => {
    if (!testId) return;

    const loadData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/part5?testId=${testId}`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();

        if (data && data.length > 0) {
          const mapped = data.map((q) => ({
            number: q.questionNumber?.toString(),
            label: q.label || "",
            question: q.question || "",
            translationVn: q.translationVn || "",

            options: {
              A: q.optionA || "",
              B: q.optionB || "",
              C: q.optionC || "",
              D: q.optionD || "",
            },

            optionsVn: {
              A: q.optionAVn || "",
              B: q.optionBVn || "",
              C: q.optionCVn || "",
              D: q.optionDVn || "",
            },

            answer: q.answer || "",
            explanation: q.explanation || "",
          }));

          setQuestions(mapped);
        } else {
          const saved = localStorage.getItem(key);
          if (saved) setQuestions(JSON.parse(saved));
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [testId]);

  // ================= AUTO SAVE =================
  useEffect(() => {
    if (!testId) return;

    const timeout = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(questions));
    }, 500);

    return () => clearTimeout(timeout);
  }, [questions, testId]);

  // ================= DELETE =================
  const handleDeleteQuestion = (index) => {
    if (!window.confirm("Xóa câu này?")) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDiscard = () => {
    if (!window.confirm("Bỏ dữ liệu hiện tại?")) return;
    setQuestions([]);
    setSelectedFile(null);
    localStorage.removeItem(key);
  };

  const parseQuestions = (rawText) => {
  const text = rawText
    .replace(/\r\n/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // ✅ FIX: không bị mất câu đầu (101)
  const blocks = text
    .split(/(?=^\d{3}\s*$)/gm)
    .map((b) => b.trim())
    .filter((b) => /^\d{3}/.test(b));

  return blocks.map((block) => {
    const number = block.match(/^(\d{3})/)?.[1] || "";

    const question =
      block.match(/Q:\s*(.*?)(?=\nQ_VN:)/s)?.[1]?.trim() || "";

    const translationVn =
      block.match(/Q_VN:\s*(.*?)(?=\n[A-D]:)/s)?.[1]?.trim() || "";

    const options = {
      A: block.match(/A:\s*(.*?)(?=\n[A-D]_VN:|\nB:|\nANS:)/s)?.[1]?.trim() || "",
      B: block.match(/B:\s*(.*?)(?=\n[A-D]_VN:|\nC:|\nANS:)/s)?.[1]?.trim() || "",
      C: block.match(/C:\s*(.*?)(?=\n[A-D]_VN:|\nD:|\nANS:)/s)?.[1]?.trim() || "",
      D: block.match(/D:\s*(.*?)(?=\n[A-D]_VN:|\nANS:)/s)?.[1]?.trim() || "",
    };

    const optionsVn = {
      A: block.match(/A_VN:\s*(.*?)(?=\nB:|\nANS:)/s)?.[1]?.trim() || "",
      B: block.match(/B_VN:\s*(.*?)(?=\nC:|\nANS:)/s)?.[1]?.trim() || "",
      C: block.match(/C_VN:\s*(.*?)(?=\nD:|\nANS:)/s)?.[1]?.trim() || "",
      D: block.match(/D_VN:\s*(.*?)(?=\nANS:)/s)?.[1]?.trim() || "",
    };

    // ✅ Parse trực tiếp
    const answer =
      block.match(/ANS:\s*([A-D])/i)?.[1]?.toUpperCase() || "";

    const explanation =
      block.match(/EXP:\s*([\s\S]*?)(?=\nLABEL:|$)/i)?.[1]?.trim() || "";

    const label =
      block.match(/LABEL:\s*(.*)/i)?.[1]?.trim() || "";

    return {
      number,
      question,
      translationVn,
      options,
      optionsVn,
      answer,
      explanation,
      label,
    };
  });
};

  // ================= UPLOAD =================
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (questions.length > 0 && !window.confirm("Ghi đè dữ liệu hiện tại?")) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setQuestions(parseQuestions(event.target.result));
    };
    reader.readAsText(file);
  };

  // ================= EDIT =================
  const handleChangeQuestion = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== index) return q;

        if (["A", "B", "C", "D"].includes(field)) {
          return {
            ...q,
            options: { ...q.options, [field]: value },
          };
        }

        if (["AVn", "BVn", "CVn", "DVn"].includes(field)) {
          return {
            ...q,
            optionsVn: {
              ...q.optionsVn,
              [field.replace("Vn", "")]: value,
            },
          };
        }

        return { ...q, [field]: value };
      }),
    );
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!testId) return alert("❗ Chọn đề trước!");
    if (questions.some((q) => !q.answer))
      return alert("⚠ Thiếu đáp án!");

    const payload = questions.map((q) => ({
      testId,
      questionNumber: parseInt(q.number),
      label: q.label,

      question: q.question,
      translationVn: q.translationVn,

      optionA: q.options.A,
      optionB: q.options.B,
      optionC: q.options.C,
      optionD: q.options.D,

      optionAVn: q.optionsVn?.A || "",
      optionBVn: q.optionsVn?.B || "",
      optionCVn: q.optionsVn?.C || "",
      optionDVn: q.optionsVn?.D || "",

      answer: q.answer,
      explanation: q.explanation,
    }));

    try {
      await fetch(`http://localhost:8080/api/part5/save?testId=${testId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      alert("✅ Saved!");
      localStorage.removeItem(key);
    } catch (err) {
      console.error(err);
      alert("❌ Save failed");
    }
  };

  // ================= AI =================
  const analyzeAllWithAI = async () => {
    if (questions.length === 0 || isAnalyzing) return;

    setIsAnalyzing(true);
    setProgress(0);

    const updated = [...questions];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      setAnalyzingIndex(i);

      const block = `
${q.question}
A. ${q.options.A}
B. ${q.options.B}
C. ${q.options.C}
D. ${q.options.D}`;

      try {
        const res = await fetch("http://localhost:8080/api/ai/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ question: block }),
        });

        if (res.ok) {
          const data = await res.json();
          updated[i] = {
            ...updated[i],
            label: data.label || updated[i].label,
            answer: data.answer || updated[i].answer,
          };
        }
      } catch (err) {
        console.error(err);
      }

      setProgress(Math.round(((i + 1) / questions.length) * 100));
      setQuestions([...updated]);

      await new Promise((r) => setTimeout(r, 1200));
    }

    setIsAnalyzing(false);
    setAnalyzingIndex(null);
    setProgress(0);

    alert("✅ Hoàn tất!");
  };

  // ================= FILTER =================
  const filtered = questions.filter((q) =>
    q.question.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <UploadLayout
      title="Upload Part 5"
      selectedFile={selectedFile}
      hasData={questions.length > 0}
      onUploadClick={() => fileRef.current.click()}
      onDiscard={handleDiscard}
      onSave={handleSave}
    >
      {questions.length > 0 && (
        <div className="flex gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 border p-3 rounded-xl"
          />

          <button
            onClick={analyzeAllWithAI}
            disabled={isAnalyzing}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl"
          >
            {isAnalyzing
              ? `AI... ${progress}%`
              : `🤖 AI (${questions.length})`}
          </button>
        </div>
      )}

      <div className="space-y-6">
        {filtered.map((q) => {
          const realIndex = questions.findIndex((i) => i.number === q.number);

          return (
            <QuestionCard
              key={realIndex}
              question={q}
              index={realIndex}
              onQuestionChange={handleChangeQuestion}
              onDelete={() => handleDeleteQuestion(realIndex)}
            />
          );
        })}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".txt"
        onChange={handleChange}
        className="hidden"
      />
    </UploadLayout>
  );
};

export default UploadPart5;
