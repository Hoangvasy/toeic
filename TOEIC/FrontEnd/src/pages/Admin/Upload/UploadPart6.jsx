import React, { useState, useEffect, useRef } from "react";

const UploadPart6 = ({ testId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [passages, setPassages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef(null);

  const key = `draft_part6_${testId}`;

  // ================= LOAD =================
  useEffect(() => {
    if (!testId) return;

    const loadData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/part6?testId=${testId}`);
        const data = await res.json();

        if (data?.length > 0) {
          const grouped = {};

          data.forEach((q) => {
            const group = q.groupId || 1;

            if (!grouped[group]) {
              grouped[group] = {
                passage: q.passage || "",
                passageVn: q.passageVn || "",
                questions: [],
              };
            }

            grouped[group].questions.push({
              number: q.questionNumber?.toString() || "",
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
              label: q.label || ""
            });
          });

          setPassages(Object.values(grouped));
        } else {
          const saved = localStorage.getItem(key);
          if (saved) setPassages(JSON.parse(saved));
        }
      } catch (err) {
        console.error("Load error:", err);
        const saved = localStorage.getItem(key);
        if (saved) setPassages(JSON.parse(saved));
      }
    };

    loadData();
  }, [testId]);

  // ================= AUTO SAVE =================
  useEffect(() => {
    if (!testId || passages.length === 0) return;
    const t = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(passages));
    }, 500);
    return () => clearTimeout(t);
  }, [passages, testId]);

  // ================= PARSER =================
  const parseFile = (rawText) => {
    const text = rawText
      .replace(/\r\n/g, "\n")
      .trim();

    // Tách các nhóm bằng ________________ hoặc ----
    const rawGroups = text.split(/\n_{10,}\n|\n-{10,}\n/);
    const parsedGroups = [];

    for (const rawGroup of rawGroups) {
      if (!rawGroup.trim()) continue;

      const lines = rawGroup.split("\n");
      
      // Tìm dòng đầu tiên là số câu hỏi (ví dụ "131-134")
      let headerLine = "";
      let startLine = 0;
      
      for (let i = 0; i < Math.min(5, lines.length); i++) {
        if (/^\d{3}-\d{3}/.test(lines[i].trim())) {
          headerLine = lines[i].trim();
          startLine = i + 1;
          break;
        }
      }

      // Tìm vị trí bắt đầu câu hỏi - pattern: "131. _____ (131)" hoặc "131. _____"
      let questionStartIndex = -1;
      for (let i = startLine; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/^\d{3}\.\s+_____/.test(line)) {
          questionStartIndex = i;
          break;
        }
      }

      if (questionStartIndex === -1) {
        console.warn("Không tìm thấy câu hỏi trong nhóm:", headerLine);
        continue;
      }

      // Phần transcript (từ đầu đến trước câu hỏi)
      const transcriptLines = lines.slice(startLine, questionStartIndex);
      let passage = "";
      let passageVn = "";
      let isTranslation = false;
      
      for (const line of transcriptLines) {
        if (/^Dịch:|^Dịch nghĩa:/i.test(line)) {
          isTranslation = true;
          continue;
        }
        if (isTranslation) {
          passageVn += (passageVn ? "\n" : "") + line;
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

        // Bắt đầu câu hỏi: "131. _____ (131)" hoặc "131. _____"
        const qMatch = line.match(/^(\d{3})\.\s+_____/);
        if (qMatch) {
          if (currentQuestion) questions.push(currentQuestion);
          
          currentQuestion = {
            number: qMatch[1],
            options: { A: "", B: "", C: "", D: "" },
            optionsVn: { A: "", B: "", C: "", D: "" },
            answer: "",
            explanation: "",
            label: ""
          };
          continue;
        }

        if (!currentQuestion) continue;

        // Option tiếng Anh: "A. seek"
        const optMatch = line.match(/^([A-D])\.\s+(.*)/);
        if (optMatch && !line.toLowerCase().includes("_vi")) {
          const optKey = optMatch[1];
          const optText = optMatch[2];
          // Bỏ qua nếu là câu hỏi con (có dạng A., B., C., D. nhưng không phải option của câu chính)
          if (!optText.includes("_____")) {
            currentQuestion.options[optKey] = optText;
          }
          continue;
        }

        // Option tiếng Việt: "A_vi: tìm kiếm..."
        const optViMatch = line.match(/^([A-D])_vi:\s*(.*)/);
        if (optViMatch) {
          const optKey = optViMatch[1];
          const optText = optViMatch[2];
          currentQuestion.optionsVn[optKey] = optText;
          continue;
        }

        // Đáp án đúng: "Đáp án đúng: C"
        const answerMatch = line.match(/Đáp án đúng:\s*([A-D])/i);
        if (answerMatch) {
          currentQuestion.answer = answerMatch[1];
          continue;
        }

        // Giải thích
        if (line.match(/^Giải thích:|^Giải thích chi tiết đáp án/i)) {
          let explanationText = line.replace(/^Giải thích:|^Giải thích chi tiết đáp án/i, "").trim();
          if (!explanationText) {
            const nextLine = questionLines[i + 1]?.trim() || "";
            if (nextLine && !nextLine.match(/^\d{3}\./) && !nextLine.match(/^[A-D]\./) && !nextLine.match(/^[A-D]_vi:/)) {
              explanationText = nextLine;
              i++;
            }
          }
          currentQuestion.explanation = explanationText;
          continue;
        }
      }

      if (currentQuestion) questions.push(currentQuestion);

      if (questions.length > 0) {
        parsedGroups.push({
          header: headerLine || `Questions ${questions[0].number} - ${questions[questions.length-1].number}`,
          passage: passage.trim(),
          passageVn: passageVn.trim(),
          questions
        });
      }
    }

    return parsedGroups;
  };

  // ================= HANDLE FILE UPLOAD =================
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsLoading(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target.result || "";
        console.log("File content preview:", content.substring(0, 500));
        
        const parsed = parseFile(content);
        
        const converted = parsed.map(group => ({
          passage: group.passage,
          passageVn: group.passageVn,
          questions: group.questions.map(q => ({
            number: q.number,
            options: q.options,
            optionsVn: q.optionsVn,
            answer: q.answer,
            explanation: q.explanation,
            label: q.label || ""
          }))
        }));
        
        setPassages(converted);
        
        if (converted.length === 0) {
          alert("Không parse được dữ liệu. Vui lòng kiểm tra định dạng file.\n\nYêu cầu:\n- Mỗi nhóm bắt đầu bằng '131-134'\n- Có dòng 'Transcript:' và 'Dịch:'\n- Câu hỏi dạng '131. _____ (131)'\n- Option dạng 'A. seek'\n- Option VI dạng 'A_vi: ...'\n- Phân cách nhóm bằng '________________'");
        } else {
          alert(`✅ Parse thành công ${converted.length} nhóm câu hỏi!`);
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

  // ================= UPDATE =================
  const updatePassage = (gIndex, field, value) => {
    setPassages(prev =>
      prev.map((p, i) => i === gIndex ? { ...p, [field]: value } : p)
    );
  };

  const updateQuestion = (gIndex, qIndex, field, value, optKey = null) => {
    setPassages(prev =>
      prev.map((p, i) => {
        if (i !== gIndex) return p;

        const newQuestions = p.questions.map((q, j) => {
          if (j !== qIndex) return q;

          if (optKey) {
            if (field === "options") {
              return { ...q, options: { ...q.options, [optKey]: value } };
            }
            if (field === "optionsVn") {
              return { ...q, optionsVn: { ...q.optionsVn, [optKey]: value } };
            }
          }

          return { ...q, [field]: value };
        });

        return { ...p, questions: newQuestions };
      }),
    );
  };

  // ================= DELETE =================
  const deleteQuestion = (gIndex, qIndex) => {
    if (window.confirm("Xóa câu hỏi này?")) {
      setPassages(prev =>
        prev.map((p, i) => {
          if (i !== gIndex) return p;
          const newQuestions = p.questions.filter((_, j) => j !== qIndex);
          return { ...p, questions: newQuestions };
        })
      );
    }
  };

  const deleteGroup = (gIndex) => {
    if (window.confirm("Xóa toàn bộ nhóm câu hỏi này?")) {
      setPassages(prev => prev.filter((_, i) => i !== gIndex));
    }
  };

  // ================= AI ANALYZE =================
  const analyzePart6 = async (gIndex, qIndex) => {
    const q = passages[gIndex].questions[qIndex];

    const questionText = `
Q${q.number}
A. ${q.options.A}
B. ${q.options.B}
C. ${q.options.C}
D. ${q.options.D}
`;

    try {
      const res = await fetch("http://localhost:8080/api/ai/analyze-part6", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText })
      });

      const data = await res.json();

      if (data.label) updateQuestion(gIndex, qIndex, "label", data.label);
      if (data.answer) updateQuestion(gIndex, qIndex, "answer", data.answer);
    } catch (err) {
      console.error("AI error:", err);
      alert("Không thể gọi AI. Kiểm tra server!");
    }
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!testId) return alert("Chọn test trước!");
    if (passages.length === 0) return alert("Không có dữ liệu để lưu!");

    const payload = [];

    passages.forEach((group, gIndex) => {
      group.questions.forEach((q) => {
        payload.push({
          passage: group.passage,
          passageVn: group.passageVn,
          groupId: gIndex + 1,
          questionNumber: parseInt(q.number),
          optionA: q.options.A,
          optionB: q.options.B,
          optionC: q.options.C,
          optionD: q.options.D,
          optionAVn: q.optionsVn.A,
          optionBVn: q.optionsVn.B,
          optionCVn: q.optionsVn.C,
          optionDVn: q.optionsVn.D,
          answer: q.answer,
          explanation: q.explanation,
          label: q.label
        });
      });
    });

    try {
      const response = await fetch(`http://localhost:8080/api/part6/save?testId=${testId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("✅ Đã lưu Part 6 thành công!");
      } else {
        const error = await response.text();
        alert("❌ Lưu thất bại: " + error);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi kết nối server!");
    }
  };

  // ================= UI =================
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📄 Upload Part 6 (Điền từ vào chỗ trống)</h2>
      <p className="text-sm text-gray-600 mb-4">
        Định dạng: Số câu hỏi (ví dụ 131-134) → Transcript → Dịch → Câu hỏi → Options EN → Options VI → Đáp án → Giải thích
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
      {passages.map((g, gi) => (
        <div key={gi} className="border rounded-lg p-4 mt-6 shadow-sm bg-white">
          <div className="flex justify-between items-center mb-3 pb-2 border-b">
            <h3 className="font-bold text-lg">Nhóm câu hỏi {gi + 1}</h3>
            <button onClick={() => deleteGroup(gi)} className="text-red-500 hover:text-red-700">
              🗑️ Xóa nhóm
            </button>
          </div>

          {/* PASSAGE - EN */}
          <div className="mb-4">
            <label className="font-semibold block mb-1 text-gray-700">📖 Đoạn văn (EN)</label>
            <textarea
              className="w-full border rounded p-2 h-40 font-mono text-sm"
              value={g.passage}
              onChange={(e) => updatePassage(gi, "passage", e.target.value)}
              placeholder="Đoạn văn tiếng Anh (có chỗ trống _____(131))"
            />
          </div>

          {/* PASSAGE - VI */}
          <div className="mb-4">
            <label className="font-semibold block mb-1 text-gray-700">🌐 Đoạn văn (VI)</label>
            <textarea
              className="w-full border rounded p-2 h-40 font-mono text-sm bg-gray-50"
              value={g.passageVn}
              onChange={(e) => updatePassage(gi, "passageVn", e.target.value)}
              placeholder="Đoạn văn tiếng Việt"
            />
          </div>

          {/* QUESTIONS */}
          <div className="mt-4">
            <h4 className="font-bold mb-2">📝 Câu hỏi</h4>
            {g.questions.map((q, qi) => (
              <div key={qi} className="border rounded p-3 mt-3 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-blue-600">Câu {q.number}</span>
                  <button onClick={() => deleteQuestion(gi, qi)} className="text-red-500 hover:text-red-700 text-sm">
                    ❌ Xóa
                  </button>
                </div>

                {/* OPTIONS */}
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
                          value={q.optionsVn?.[opt] || ""}
                          onChange={(e) => updateQuestion(gi, qi, "optionsVn", e.target.value, opt)}
                          placeholder={`Đáp án ${opt} (tiếng Việt)`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* ANSWER + LABEL + AI */}
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
                      <option>grammar</option>
                      <option>vocabulary</option>
                      <option>preposition</option>
                      <option>conjunction</option>
                      <option>verb_form</option>
                      <option>word_form</option>
                      <option>context</option>
                    </select>
                  </div>

                  <button
                    className="bg-purple-500 text-white px-3 rounded hover:bg-purple-600 text-sm"
                    onClick={() => analyzePart6(gi, qi)}
                  >
                    🤖 AI tự động
                  </button>
                </div>

                {/* EXPLANATION */}
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
      {passages.length > 0 && (
        <button
          onClick={handleSave}
          className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          💾 Lưu Part 6 vào database
        </button>
      )}

      {/* INSTRUCTION */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg text-sm">
        <p className="font-bold">📌 Hướng dẫn định dạng file TXT cho Part 6:</p>
        <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
{`131-134
Transcript:
[Đoạn văn tiếng Anh có chỗ trống _____(131)...]
Dịch:
[Đoạn văn tiếng Việt...]

131. _____ (131)
A. seek
B. to seek
C. seeking
D. are seeking
A_vi: tìm kiếm (động từ nguyên mẫu)
B_vi: để tìm kiếm
C_vi: đang tìm kiếm
D_vi: đang tìm kiếm (chia theo chủ ngữ)
Đáp án đúng: C
Giải thích: "advertisement seeking the partnership" = quảng cáo tìm kiếm sự hợp tác.

________________

132. _____ (132)
A. extensive
B. restricted
C. generous
D. limitless
A_vi: nhiều, rộng rãi
B_vi: hạn chế
C_vi: hào phóng
D_vi: vô hạn
Đáp án đúng: A
Giải thích: "extensive experience" = kinh nghiệm phong phú.
...`}
        </pre>
        <p className="mt-2 text-red-600 font-semibold">
          ⚠️ Lưu ý: Giữa "_____" và "(131)" có thể có hoặc không có dấu cách.
        </p>
      </div>
    </div>
  );
};

export default UploadPart6;