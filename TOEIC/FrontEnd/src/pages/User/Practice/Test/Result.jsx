import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = location.state?.sessionId;

  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    if (!sessionId) return;
    fetch(`http://localhost:8080/api/exam/review/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setReview(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Load review error:", err);
        setLoading(false);
      });
  }, [sessionId]);

  // ================= FLATTEN =================
  const flatQuestions = useMemo(() => {
    return review.map((a) => ({
      id: a.questionId,
      question: a.question,
      translationVn: a.translationVn,
      optionA: a.optionA, optionB: a.optionB, optionC: a.optionC, optionD: a.optionD,
      optionAVn: a.optionAVn, optionBVn: a.optionBVn, optionCVn: a.optionCVn, optionDVn: a.optionDVn,
      userAnswer: a.userAnswer,
      answer: a.correctAnswer,
      explanation: a.explanation,
      label: a.label,
      isCorrect: a.isCorrect,
      part: a.part,
    }));
  }, [review]);

  // ================= SCORE =================
  const stats = useMemo(() => {
    const correct = flatQuestions.filter((q) => q.isCorrect).length;
    const total = flatQuestions.length;
    return {
      correct,
      wrong: total - correct,
      total,
      score: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  }, [flatQuestions]);

  // ================= LABEL STATS CHO BIỂU ĐỒ =================
  const chartData = useMemo(() => {
    const result = {};
    flatQuestions.forEach((q) => {
      const label = q.label || "Unknown";
      if (!result[label]) result[label] = { label, đúng: 0, sai: 0, total: 0 };
      result[label].total++;
      if (q.isCorrect) result[label].đúng++;
      else result[label].sai++;
    });
    return Object.values(result).map(item => ({
      ...item,
      percent: Math.round((item.đúng / item.total) * 100)
    }));
  }, [flatQuestions]);

  // ================= PIE DATA =================
  const pieData = [
    { name: "Đúng", value: stats.correct, color: "#10b981" },
    { name: "Sai", value: stats.wrong, color: "#ef4444" },
  ];

  // ================= NHẬN XÉT =================
  const getFeedback = () => {
    const weak = chartData.filter(c => c.percent < 50);
    const strong = chartData.filter(c => c.percent >= 80);
    const feedback = [];
    
    if (stats.score >= 80) feedback.push("🎉 Xuất sắc! Bạn đã nắm vững kiến thức.");
    else if (stats.score >= 60) feedback.push("👍 Khá tốt! Còn một số lỗ hổng nhỏ.");
    else if (stats.score >= 40) feedback.push("📚 Cố gắng! Cần ôn tập thêm.");
    else feedback.push("⚠️ Cần nỗ lực nhiều hơn. Hãy xem lại giải thích bên dưới.");
    
    if (weak.length) feedback.push(`📌 Chủ đề yếu: ${weak.map(w => w.label).join(", ")}`);
    if (strong.length) feedback.push(`⭐ Chủ đề mạnh: ${strong.map(s => s.label).join(", ")}`);
    
    return feedback;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white shadow-lg rounded-2xl px-8 py-6 text-lg font-semibold">
          ⏳ Đang tải kết quả...
        </div>
      </div>
    );
  }

  if (!flatQuestions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="text-5xl mb-4">😢</div>
          <div className="text-xl font-bold mb-4">Không có dữ liệu</div>
          <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
            Làm bài ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER + SCORE CARDS */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800">📊 Kết quả bài làm</h1>
              <p className="text-gray-500 mt-2">Xem lại kết quả TOEIC và chữa đề chi tiết</p>
            </div>
            <button onClick={() => navigate("/")} className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">
              🔄 Làm lại
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-5">
            <Card title="✔ Câu đúng" value={stats.correct} bg="bg-green-100" text="text-green-600" />
            <Card title="❌ Câu sai" value={stats.wrong} bg="bg-red-100" text="text-red-600" />
            <Card title="🎯 Accuracy" value={`${stats.score}%`} bg="bg-blue-100" text="text-blue-600" />
            <Card title="📦 Tổng câu" value={stats.total} bg="bg-slate-100" text="text-slate-700" />
          </div>
        </div>

        {/* NHẬN XÉT */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-3">🤖 Nhận xét thông minh</h2>
          {getFeedback().map((text, i) => (
            <p key={i} className="text-white/90 mb-1">{text}</p>
          ))}
        </div>

        {/* BIỂU ĐỒ TRÒN + THỐNG KÊ TỔNG QUAN */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">🎯 Tỷ lệ đúng/sai</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">📊 Thống kê kỹ năng</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} unit="%" />
                  <YAxis type="category" dataKey="label" width={100} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="percent" name="Tỷ lệ đúng" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* CHI TIẾT TỪNG CÂU */}
        <div className="space-y-5">
          {flatQuestions.map((q, index) => (
            <QuestionCard key={q.id} q={q} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ================= COMPONENTS =================
function Card({ title, value, bg, text }) {
  return (
    <div className={`rounded-2xl ${bg} p-5`}>
      <div className="text-sm font-medium">{title}</div>
      <div className={`text-4xl font-extrabold mt-2 ${text}`}>{value}</div>
    </div>
  );
}

function QuestionCard({ q, index }) {
  const options = [
    ["A", q.optionA, q.optionAVn],
    ["B", q.optionB, q.optionBVn],
    ["C", q.optionC, q.optionCVn],
    ["D", q.optionD, q.optionDVn],
  ];

  return (
    <div className={`rounded-3xl bg-white shadow-lg p-6 border-l-8 ${q.isCorrect ? "border-green-500" : "border-red-500"}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full text-white font-bold flex items-center justify-center ${q.isCorrect ? "bg-green-500" : "bg-red-500"}`}>
          {index + 1}
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg">{q.question}</div>
          {q.translationVn && (
            <div className="mt-2 text-slate-600 italic bg-slate-100 rounded-xl p-3">🇻🇳 {q.translationVn}</div>
          )}
          <div className="mt-2 text-xs bg-slate-200 inline-block px-3 py-1 rounded-full">{q.label}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {options.map(([key, value, valueVn]) => {
          const isCorrect = key === q.answer;
          const isUser = key === q.userAnswer;
          return (
            <div
              key={key}
              className={`rounded-xl border p-4 ${
                isCorrect ? "bg-green-100 border-green-400" : isUser && !q.isCorrect ? "bg-red-100 border-red-400" : "bg-slate-50"
              }`}
            >
              <div className="font-semibold">{key}. {value}</div>
              {valueVn && <div className="text-sm text-gray-500 italic mt-1">{valueVn}</div>}
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-5">
        <div className="bg-slate-100 rounded-xl p-4">
          <div className="text-sm text-gray-500">Your Answer</div>
          <div className="font-bold text-lg">{q.userAnswer || "No Answer"}</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="text-sm text-blue-500">Correct Answer</div>
          <div className="font-bold text-lg text-blue-700">{q.answer}</div>
        </div>
      </div>

      {q.explanation && (
        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="font-bold text-amber-700 mb-2">📘 Giải thích</div>
          <div className="whitespace-pre-line leading-7 text-slate-700">{q.explanation}</div>
        </div>
      )}
    </div>
  );
}