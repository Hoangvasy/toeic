import React, { useState, useEffect, useRef } from "react";

const UploadPart7 = ({ testId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef(null);

  const key = `draft_part7_${testId}`;

  // ================= LOAD FROM LOCAL =================
  useEffect(() => {
    if (!testId) return;
    const saved = localStorage.getItem(key);
    if (saved) setGroups(JSON.parse(saved));
  }, [testId]);

  // ================= AUTO SAVE TO LOCAL =================
  useEffect(() => {
    if (!testId || groups.length === 0) return;
    localStorage.setItem(key, JSON.stringify(groups));
  }, [groups, testId]);

  // ================= PARSER - HỖ TRỢ A_vi, B_vi, C_vi, D_vi =================
  const parseFile = (rawText) => {
    const text = rawText
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Tách bằng ________________
    const rawGroups = text.split(/\n_{10,}\n|\n-{10,}\n/);
    const parsedGroups = [];

    for (const rawGroup of rawGroups) {
      if (!rawGroup.trim()) continue;

      const lines = rawGroup.split("\n");
      
      // Tìm dòng số câu hỏi (147-148)
      let questionsRangeLine = "";
      let startLine = 0;
      
      for (let i = 0; i < Math.min(5, lines.length); i++) {
        if (/^\d{3}-\d{3}/.test(lines[i].trim())) {
          questionsRangeLine = lines[i].trim();
          startLine = i + 1;
          break;
        }
      }

      let passage = "";
      let passageTranslation = "";
      let questionStartIndex = -1;

      // Tìm vị trí bắt đầu câu hỏi
      for (let i = startLine; i < lines.length; i++) {
        if (/^\d{3}\./.test(lines[i].trim())) {
          questionStartIndex = i;
          break;
        }
      }

      if (questionStartIndex === -1) continue;

      // Phần transcript
      const transcriptLines = lines.slice(startLine, questionStartIndex);
      let isTranslation = false;
      
      for (const line of transcriptLines) {
        if (/^Dịch:|^Dịch nghĩa:/i.test(line)) {
          isTranslation = true;
          continue;
        }
        if (isTranslation) {
          passageTranslation += (passageTranslation ? "\n" : "") + line;
        } else {
          passage += (passage ? "\n" : "") + line;
        }
      }

      // Phần câu hỏi
      const questionLines = lines.slice(questionStartIndex);
      const questions = [];
      let currentQuestion = null;

      for (let i = 0; i < questionLines.length; i++) {
        const line = questionLines[i];
        if (!line.trim()) continue;

        // Bắt đầu câu hỏi mới: "147. What is indicated..."
        const qMatch = line.match(/^(\d{3})\.\s+(.*)/);
        if (qMatch) {
          if (currentQuestion) questions.push(currentQuestion);
          
          currentQuestion = {
            number: qMatch[1],
            question: qMatch[2],
            question_vn: "",
            options: { A: "", B: "", C: "", D: "" },
            options_vn: { A: "", B: "", C: "", D: "" },
            answer: "",
            explanation: "",
            label: ""
          };
          continue;
        }

        if (!currentQuestion) continue;

        // Dòng là câu hỏi tiếng Việt (không bắt đầu bằng A/B/C/D, không phải đáp án, không phải giải thích)
        if (line.trim() && !line.match(/^[A-D]\./) && !line.match(/^[A-D]_vi:/) && !line.match(/^Đáp án đúng:/) && !line.match(/^Giải thích:/)) {
          const hasVietnamese = /[áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]/i.test(line);
          if (hasVietnamese && !currentQuestion.question_vn) {
            currentQuestion.question_vn = line.trim();
            continue;
          }
        }

        // Option tiếng Anh: "A. It is a family business."
        const optMatch = line.match(/^([A-D])\.\s+(.*)/);
        if (optMatch && !line.includes("_vi")) {
          const optKey = optMatch[1];
          const optText = optMatch[2];
          currentQuestion.options[optKey] = optText;
          continue;
        }

        // Option tiếng Việt: "A_vi: Đó là doanh nghiệp gia đình"
        const optViMatch = line.match(/^([A-D])_vi:\s*(.*)/);
        if (optViMatch) {
          const optKey = optViMatch[1];
          const optText = optViMatch[2];
          currentQuestion.options_vn[optKey] = optText;
          continue;
        }

        // Đáp án đúng
        const answerMatch = line.match(/Đáp án đúng:\s*([A-D])/i);
        if (answerMatch) {
          currentQuestion.answer = answerMatch[1];
          continue;
        }

        // Giải thích
        if (line.match(/^Giải thích:|^Giải thích chi tiết đáp án/i)) {
          const explanationText = line.replace(/^Giải thích:|^Giải thích chi tiết đáp án/i, "").trim();
          if (explanationText) {
            currentQuestion.explanation = explanationText;
          } else {
            const nextLine = questionLines[i + 1]?.trim() || "";
            if (nextLine && !nextLine.match(/^\d{3}\./)) {
              currentQuestion.explanation = nextLine;
              i++;
            }
          }
          continue;
        }
      }

      if (currentQuestion) questions.push(currentQuestion);

      if (questions.length > 0) {
        parsedGroups.push({
          header: questionsRangeLine || `Questions ${questions[0].number} - ${questions[questions.length-1].number}`,
          passage: passage.trim(),
          passage_translation: passageTranslation.trim(),
          questions
        });
      }
    }

    return parsedGroups;
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsLoading(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const parsed = parseFile(event.target.result || "");
        setGroups(parsed);
        if (parsed.length === 0) {
          alert("Không parse được dữ liệu. Vui lòng kiểm tra định dạng file.");
        } else {
          alert(`✅ Parse thành công ${parsed.length} nhóm câu hỏi!`);
        }
      } catch (err) {
        console.error(err);
        alert("Lỗi parse file: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      alert("Lỗi đọc file");
      setIsLoading(false);
    };

    reader.readAsText(file, "UTF-8");
  };

  const updateQuestion = (gi, qi, field, value, subField = null) => {
    setGroups(prev =>
      prev.map((g, i) => {
        if (i !== gi) return g;
        const updatedQuestions = g.questions.map((q, j) => {
          if (j !== qi) return q;
          
          if (subField) {
            return {
              ...q,
              [field]: { ...q[field], [subField]: value }
            };
          }
          return { ...q, [field]: value };
        });
        return { ...g, questions: updatedQuestions };
      })
    );
  };

  const deleteQuestion = (gi, qi) => {
    if (window.confirm("Xóa câu hỏi này?")) {
      setGroups(prev =>
        prev.map((g, i) => {
          if (i !== gi) return g;
          const qs = g.questions.filter((_, j) => j !== qi);
          return { ...g, questions: qs };
        })
      );
    }
  };

  const deleteGroup = (gi) => {
    if (window.confirm("Xóa toàn bộ nhóm câu hỏi này?")) {
      setGroups(prev => prev.filter((_, i) => i !== gi));
    }
  };

  const autoLabel = async (gi, qi, questionText) => {
    try {
      const res = await fetch("http://localhost:8080/api/ai/analyze-part7", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText }),
      });
      const data = await res.json();
      updateQuestion(gi, qi, "label", data.label);
    } catch (err) {
      console.error("AI label error", err);
      alert("Không thể gọi AI. Kiểm tra server!");
    }
  };

  const handleSave = async () => {
    if (!testId) return alert("Chọn test trước!");
    if (groups.length === 0) return alert("Không có dữ liệu để lưu!");

    const payload = groups.map(group => ({
      header: group.header,
      passage: group.passage,
      passageTranslation: group.passage_translation,
      questions: group.questions.map(q => ({
        questionNumber: Number(q.number),
        question: q.question,
        questionVn: q.question_vn || "",
        optionA: q.options.A,
        optionB: q.options.B,
        optionC: q.options.C,
        optionD: q.options.D,
        optionAVn: q.options_vn?.A || "",
        optionBVn: q.options_vn?.B || "",
        optionCVn: q.options_vn?.C || "",
        optionDVn: q.options_vn?.D || "",
        answer: q.answer,
        explanation: q.explanation || "",
        label: q.label || ""
      }))
    }));

    try {
      const response = await fetch(`http://localhost:8080/api/part7/save?testId=${testId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("✅ Đã lưu Part 7 thành công!");
      } else {
        const error = await response.text();
        alert("❌ Lưu thất bại: " + error);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi kết nối server!");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📄 Upload Part 7 (Đọc hiểu)</h2>
      <p className="text-sm text-gray-600 mb-4">
        Định dạng: Số câu hỏi → Transcript → Dịch → Câu hỏi EN → Câu hỏi VI → 
        Option EN (A. xxx) → Option VI (A_vi: xxx) → Đáp án → Giải thích
      </p>

      {/* UPLOAD AREA */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition mb-6"
      >
        <input
          ref={fileRef}
          type="file"
          accept=".txt"
          hidden
          onChange={handleChange}
        />
        <div className="text-4xl mb-2">📂</div>
        <p className="text-gray-600">Nhấp để upload file TXT</p>
        {selectedFile && <p className="text-green-600 mt-2">✅ {selectedFile.name}</p>}
        {isLoading && <p className="text-blue-500 mt-2">⏳ Đang xử lý...</p>}
      </div>

      {/* GROUPS */}
      {groups.map((g, gi) => (
        <div key={gi} className="border rounded-lg p-4 mt-6 shadow-sm bg-white">
          <div className="flex justify-between items-center mb-3 pb-2 border-b">
            <h3 className="font-bold text-lg">{g.header}</h3>
            <button onClick={() => deleteGroup(gi)} className="text-red-500 hover:text-red-700">
              🗑️ Xóa nhóm
            </button>
          </div>

          {/* PASSAGE */}
          <div className="mb-4">
            <label className="font-semibold block mb-1 text-gray-700">📖 Transcript (EN)</label>
            <textarea
              className="w-full border rounded p-2 h-32 font-mono text-sm"
              value={g.passage}
              onChange={(e) => setGroups(prev => prev.map((gr, i) => i === gi ? { ...gr, passage: e.target.value } : gr))}
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold block mb-1 text-gray-700">🌐 Transcript (VI)</label>
            <textarea
              className="w-full border rounded p-2 h-32 font-mono text-sm bg-gray-50"
              value={g.passage_translation}
              onChange={(e) => setGroups(prev => prev.map((gr, i) => i === gi ? { ...gr, passage_translation: e.target.value } : gr))}
            />
          </div>

          {/* QUESTIONS */}
          <div className="mt-4">
            <h4 className="font-bold mb-2">📝 Câu hỏi</h4>
            {g.questions.map((q, qi) => (
              <div key={qi} className="border rounded p-3 mt-3 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-blue-600">Q{q.number}</span>
                  <button onClick={() => deleteQuestion(gi, qi)} className="text-red-500 hover:text-red-700 text-sm">
                    ❌ Xóa
                  </button>
                </div>

                {/* Câu hỏi tiếng Anh */}
                <div className="mb-2">
                  <label className="text-sm font-medium text-gray-600">🇬🇧 Tiếng Anh:</label>
                  <textarea
                    className="w-full border rounded p-2 mt-1"
                    value={q.question}
                    onChange={(e) => updateQuestion(gi, qi, "question", e.target.value)}
                    placeholder="Câu hỏi tiếng Anh"
                    rows={2}
                  />
                </div>

                {/* Câu hỏi tiếng Việt */}
                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-600">🇻🇳 Tiếng Việt:</label>
                  <textarea
                    className="w-full border rounded p-2 mt-1 bg-white"
                    value={q.question_vn}
                    onChange={(e) => updateQuestion(gi, qi, "question_vn", e.target.value)}
                    placeholder="Câu hỏi tiếng Việt"
                    rows={2}
                  />
                </div>

                {/* Options */}
                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-600 block mb-2">📋 Đáp án:</label>
                  {["A", "B", "C", "D"].map(opt => (
                    <div key={opt} className="mb-3 border-l-4 border-gray-200 pl-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold w-6">{opt}.</span>
                        <input
                          className="flex-1 border rounded p-2 text-sm"
                          value={q.options?.[opt] || ""}
                          onChange={(e) => updateQuestion(gi, qi, "options", e.target.value, opt)}
                          placeholder={`Đáp án ${opt} (tiếng Anh)`}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-1 ml-6">
                        <input
                          className="flex-1 border rounded p-2 text-sm bg-white"
                          value={q.options_vn?.[opt] || ""}
                          onChange={(e) => updateQuestion(gi, qi, "options_vn", e.target.value, opt)}
                          placeholder={`Đáp án ${opt} (tiếng Việt)`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Đáp án đúng + Label + AI */}
                <div className="flex flex-wrap gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">✅ Đáp án đúng:</span>
                    <select
                      className="border rounded p-2"
                      value={q.answer}
                      onChange={(e) => updateQuestion(gi, qi, "answer", e.target.value)}
                    >
                      <option value="">Chọn</option>
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                      <option>D</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">🏷️ Label:</span>
                    <select
                      className="border rounded p-2"
                      value={q.label || ""}
                      onChange={(e) => updateQuestion(gi, qi, "label", e.target.value)}
                    >
                      <option value="">Chọn label</option>
                      <option>detail</option>
                      <option>inference</option>
                      <option>reference</option>
                      <option>vocabulary</option>
                      <option>purpose</option>
                    </select>
                  </div>

                  <button
                    className="bg-purple-500 text-white px-3 rounded hover:bg-purple-600 text-sm"
                    onClick={() => autoLabel(gi, qi, q.question)}
                  >
                    🤖 AI tự động label
                  </button>
                </div>

                {/* Giải thích */}
                <div>
                  <label className="text-sm font-medium text-gray-600">💡 Giải thích:</label>
                  <textarea
                    className="w-full border rounded p-2 mt-1 text-sm"
                    value={q.explanation || ""}
                    onChange={(e) => updateQuestion(gi, qi, "explanation", e.target.value)}
                    placeholder="Giải thích đáp án (tiếng Việt)"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* SAVE BUTTON */}
      {groups.length > 0 && (
        <button
          onClick={handleSave}
          className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          💾 Lưu Part 7 vào database
        </button>
      )}
    </div>
  );
};

export default UploadPart7;