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
            options: {
              A: q.optionA || "",
              B: q.optionB || "",
              C: q.optionC || "",
              D: q.optionD || "",
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

  // ================= PARSE =================
  const parseQuestions = (rawText) => {
    const text = rawText
      .replace(/\r\n/g, "\n")
      .replace(/\n{2,}/g, "\n")
      .trim();
    const answerStart = text.search(/\d{3}\.\s*[A-D]\s*-/);
    const questionText = answerStart !== -1 ? text.slice(0, answerStart) : text;
    const answerText = answerStart !== -1 ? text.slice(answerStart) : "";

    const blocks = questionText
      .split(/(?=\d{3}\.)/)
      .map((b) => b.trim())
      .filter((b) => /^\d{3}\./.test(b));

    const questions = blocks.map((block) => {
      const number = block.match(/^(\d{3})\./)?.[1] || "";
      const question =
        block.match(/^\d{3}\.\s*(.*?)\s*A\./s)?.[1]?.trim() || "";

      let options = { A: "", B: "", C: "", D: "" };
      const optMatch = block.match(
        /A\.\s*(.*?)\s*B\.\s*(.*?)\s*C\.\s*(.*?)\s*D\.\s*(.*)/s,
      );

      if (optMatch) {
        options = {
          A: optMatch[1].trim(),
          B: optMatch[2].trim(),
          C: optMatch[3].trim(),
          D: optMatch[4].trim(),
        };
      }

      return {
        number,
        label: "",
        question,
        options,
        answer: "",
        explanation: "",
      };
    });

    const answers = {};
    const answerRegex =
      /(\d{3})\.\s*([A-D])\s*-\s*(.*?)(?=\s*\d{3}\.\s*[A-D]\s*-|$)/gs;

    let match;
    while ((match = answerRegex.exec(answerText)) !== null) {
      const [, num, ans, exp] = match;
      answers[num] = { answer: ans, explanation: exp.trim() };
    }

    return questions.map((q) => ({
      ...q,
      answer: answers[q.number]?.answer || "",
      explanation: answers[q.number]?.explanation || "",
    }));
  };

  // ================= UPLOAD =================
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (questions.length > 0 && !window.confirm("Ghi đè dữ liệu hiện tại?"))
      return;

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
          return { ...q, options: { ...q.options, [field]: value } };
        }
        return { ...q, [field]: value };
      }),
    );
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!testId) return alert("❗ Chọn đề trước!");
    if (questions.some((q) => !q.answer)) return alert("⚠ Thiếu đáp án!");

    const payload = questions.map((q) => ({
      testId,
      questionNumber: parseInt(q.number),
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

  // ================= AI ALL =================
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

      await new Promise((res) => setTimeout(res, 300));
    }

    setIsAnalyzing(false);
    setAnalyzingIndex(null);
    setProgress(0);

    alert("✅ Hoàn tất!");
  };

  // ================= FILTER FIX =================
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
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              placeholder="🔍 Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border p-3 rounded-xl"
            />

            <button
              onClick={analyzeAllWithAI}
              disabled={isAnalyzing}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl"
            >
              {isAnalyzing
                ? `Đang phân tích... ${progress}%`
                : `🤖 AI (${questions.length} câu)`}
            </button>
          </div>
        </>
      )}

      {isAnalyzing && (
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-1">
            Câu {analyzingIndex + 1}/{questions.length}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {filtered.map((q) => {
          const realIndex = questions.findIndex(
            (item) => item.number === q.number,
          );

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
