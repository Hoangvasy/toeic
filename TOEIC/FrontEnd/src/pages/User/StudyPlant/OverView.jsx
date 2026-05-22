import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Overview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [learningPath, setLearningPath] = useState(null);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= LOAD DATA =================

  useEffect(() => {
  axios
    .get("http://localhost:8080/api/learning-path/today", {
      withCredentials: true,
    })
    .then((res) => {
      console.log("📘 Learning Path:", res.data);
      setLearningPath(res.data);
    })
    .catch((err) => {
      console.error("❌ Lỗi learning path:", err);
    });
}, []);


  useEffect(() => {
    const attemptId = id || location.state?.attemptId || location.state?.id;

    if (location.state?.details) {
      setResult(location.state);
      setLoading(false);
      return;
    }

    if (attemptId) {
      axios
        .get(`http://localhost:8080/api/ai-path/attempt/${attemptId}`, {
          withCredentials: true,
        })
        .then((res) => {
          setResult(res.data);
        })
        .catch((err) => {
          console.error("❌ Lỗi tải kết quả:", err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, location.state]);

  const data = result || {};
  const details = data.details || [];

  // ================= FILTER PARTS =================
  const part5Items = useMemo(() => 
    details.filter(i => i.questionType === "part5"), [details]
  );

  const part6Items = useMemo(() => 
    details.filter(i => i.questionType === "part6"), [details]
  );

  const part7Items = useMemo(() => 
    details.filter(i => i.questionType === "part7"), [details]
  );

  const part5LabelStats = useMemo(() => {
  const stats = {};

  part5Items.forEach(item => {
    const label = item.label || "unknown";

    if (!stats[label]) {
      stats[label] = { correct: 0, total: 0 };
    }

    stats[label].total++;
    if (item.isCorrect) stats[label].correct++;
  });

  return Object.entries(stats).map(([label, s]) => ({
    label,
    accuracy: s.correct / s.total
  }));
}, [part5Items]);

const part5Weak = part5LabelStats
  .filter(l => l.accuracy < 0.5)
  .sort((a, b) => a.accuracy - b.accuracy)[0];

const part5Strong = part5LabelStats
  .filter(l => l.accuracy >= 0.75)
  .sort((a, b) => b.accuracy - a.accuracy)[0];

  // ================= STATS =================
  const labelStats = useMemo(() => {
    const stats = {};

    details.forEach(item => {
      const label = item.label || "unknown";

      if (!stats[label]) {
        stats[label] = { correct: 0, total: 0 };
      }

      stats[label].total++;
      if (item.isCorrect) stats[label].correct++;
    });

    return Object.entries(stats).map(([label, s]) => ({
      label,
      accuracy: s.total ? s.correct / s.total : 0,
      total: s.total
    }));
  }, [details]);

  const weaknesses = useMemo(() => {
  return [...labelStats]
    .filter(l => l.accuracy < 0.5)
    .sort((a, b) => a.accuracy - b.accuracy);
}, [labelStats]);

  const strengths = useMemo(() => {
  return [...labelStats]
    .filter(l => l.accuracy >= 0.5)
    .sort((a, b) => b.accuracy - a.accuracy);
}, [labelStats]);

  const stats = useMemo(() => {
    const part5 = { correct: 0, total: 0 };
    const part6 = { correct: 0, total: 0 };
    const part7 = { correct: 0, total: 0 };

    details.forEach((item) => {
      const isCorrect = Boolean(item.isCorrect);
      const type = item.questionType;

      if (type === "part5") {
        part5.total++;
        if (isCorrect) part5.correct++;
      } else if (type === "part6") {
        part6.total++;
        if (isCorrect) part6.correct++;
      } else if (type === "part7") {
        part7.total++;
        if (isCorrect) part7.correct++;
      }
    });

    return { part5, part6, part7 };
  }, [details]);

  const totalCorrect = data.correctAnswers || 0;
  const totalQuestions = data.totalQuestions || 0;
  const totalWrong = totalQuestions - totalCorrect;

  const percentScore = totalQuestions
    ? Math.round((totalCorrect / totalQuestions) * 100)
    : 0;

  const toeicScore = totalQuestions
    ? Math.floor((totalCorrect / totalQuestions) * 495)
    : 0;


    const part5Priority = useMemo(() => {
  const stats = {};

  part5Items.forEach(item => {
    const label = item.label || "unknown";
    if (!stats[label]) stats[label] = { correct: 0, total: 0 };

    stats[label].total++;
    if (item.isCorrect) stats[label].correct++;
  });

  const arr = Object.entries(stats).map(([label, s]) => ({
    label,
    accuracy: s.correct / s.total,
    total: s.total
  }));

  return arr.sort((a, b) => a.accuracy - b.accuracy)[0]; // yếu nhất
}, [part5Items]);
const part6Priority = useMemo(() => {
  const stats = {};

  part6Items.forEach(item => {
    const label = item.label || "unknown";
    if (!stats[label]) stats[label] = { correct: 0, total: 0 };

    stats[label].total++;
    if (item.isCorrect) stats[label].correct++;
  });

  const arr = Object.entries(stats).map(([label, s]) => ({
    label,
    accuracy: s.correct / s.total,
    total: s.total
  }));

  return arr.sort((a, b) => a.accuracy - b.accuracy)[0];
}, [part6Items]);

const part7Priority = useMemo(() => {
  const total = stats.part7.total;
  const correct = stats.part7.correct;

  if (!total) return null;

  const acc = correct / total;

  if (acc < 0.5) {
    return {
      message: "Bạn đọc hiểu chưa tốt, cần luyện skim & scan và đọc keyword."
    };
  }

  if (acc < 0.75) {
    return {
      message: "Bạn đọc ổn nhưng còn sai chi tiết, cần luyện kỹ năng tìm thông tin."
    };
  }

  return {
    message: "Bạn làm tốt Part 7, thử sức với bài dài và khó hơn."
  };
}, [stats.part7]);
  // ================= EVALUATE =================
  const evaluatePart = (correct, total) => {
    if (!total) {
      return {
        text: "N/A",
        percent: 0,
        color: "text-gray-500",
        bg: "bg-gray-50",
        border: "border-gray-200",
        comment: "",
      };
    }

    const percent = Math.round((correct / total) * 100);

    if (percent >= 75) {
      return {
        text: "✅ Tốt",
        comment: "Bạn nắm vững kiến thức phần này. Hãy duy trì và luyện thêm câu khó.",
        percent,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
      };
    }
    if (percent >= 55) {
      return {
        text: "⚠️ Trung bình",
        comment: "Còn sai nhiều, cần ôn lại chiến thuật và làm thêm bài tập.",
        percent,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
      };
    }
    return {
      text: "🔻 Yếu",
      comment: "Mất gốc hoặc chưa quen dạng bài. Cần học lại từ đầu phần này.",
      percent,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    };
  };

  const part5Eval = evaluatePart(stats.part5.correct, stats.part5.total);
  const part6Eval = evaluatePart(stats.part6.correct, stats.part6.total);
  const part7Eval = evaluatePart(stats.part7.correct, stats.part7.total);

 const priorityFocusList = useMemo(() => {
  const list = [];

  const buildStats = (items) => {
    const stats = {};

    items.forEach((item) => {
      const label = item.label || "unknown";

      if (!stats[label]) {
        stats[label] = { correct: 0, total: 0 };
      }

      stats[label].total++;
      if (item.isCorrect) stats[label].correct++;
    });

    return Object.entries(stats).map(([label, s]) => ({
      label,
      accuracy: s.total ? s.correct / s.total : 0,
      total: s.total,
    }));
  };

  // ================= PART 5 =================
  const part5Weak = buildStats(part5Items)
    .filter(x => x.accuracy < 0.6)
    .sort((a, b) => a.accuracy - b.accuracy);

  if (part5Weak.length) {
    list.push({
      type: "Part 5",
      items: part5Weak.slice(0, 3), // giữ TOP 3 yếu nhất trong Part 5
    });
  }

  // ================= PART 6 =================
  const part6Weak = buildStats(part6Items)
    .filter(x => x.accuracy < 0.6)
    .sort((a, b) => a.accuracy - b.accuracy);

  if (part6Weak.length) {
    list.push({
      type: "Part 6",
      items: part6Weak.slice(0, 3),
    });
  }

  // ================= PART 7 =================
  const part7Acc = stats.part7.total
    ? stats.part7.correct / stats.part7.total
    : 1;

  if (part7Acc < 0.6) {
    list.push({
      type: "Part 7",
      message: "Luyện skim & scan + đọc keyword trước câu hỏi",
    });
  }

  return list; // ❌ KHÔNG SORT GLOBAL
}, [part5Items, part6Items, stats.part7]);

  // ================= CHART =================
  const chartData = {
    labels: ["Đúng", "Sai"],
    datasets: [
      {
        data: [totalCorrect, totalWrong],
        backgroundColor: ["#2c7da0", "#e2e8f0"],
        borderWidth: 0,
        cutout: "65%",
      },
    ],
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-pulse text-slate-600">📖 Đang tải kết quả...</div>
      </div>
    );

  if (!details.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-white rounded-3xl p-10 shadow-xl text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-red-600 mb-4">Không tìm thấy dữ liệu kết quả!</p>
          <button
            onClick={() => navigate("/history")}
            className="px-6 py-3 bg-slate-700 text-white rounded-2xl hover:bg-slate-800 transition shadow-md"
          >
            📜 Quay lại lịch sử
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-3xl p-8 mb-8 text-white shadow-2xl">
          <h1 className="text-4xl font-bold flex items-center gap-4">
            <span className="text-4xl">📊</span> TOEIC Reading Result
          </h1>
          <p className="text-slate-300 mt-3 text-lg">
            Phân tích chi tiết • Lộ trình cải thiện theo điểm yếu
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* LEFT: Score + Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-100 transition-all hover:shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-blue-600">📈</span> Tổng quan kết quả
            </h2>

            <div className="flex flex-col items-center">
              <div className="w-72 h-72">
                <Doughnut data={chartData} options={{ maintainAspectRatio: true, cutout: "65%" }} />
              </div>

              <div className="text-center mt-8">
                <div className="text-7xl font-bold text-slate-800 tracking-tighter">
                  {toeicScore}
                  <span className="text-4xl text-slate-400 font-normal">/495</span>
                </div>
                <div className="text-2xl text-slate-600 mt-2">
                  {totalCorrect}/{totalQuestions} ({percentScore}%)
                </div>
                <div className="text-sm text-slate-500 mt-2">
                  {data.createdAt && new Date(data.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="mt-12 space-y-7">
              {[
                { name: "Part 5", stats: stats.part5, color: "#2c7da0" },
                { name: "Part 6", stats: stats.part6, color: "#8b5cf6" },
                { name: "Part 7", stats: stats.part7, color: "#f59e0b" },
              ].map((part) => {
                const percent = part.stats.total
                  ? (part.stats.correct / part.stats.total) * 100
                  : 0;

                return (
                  <div key={part.name}>
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="font-semibold">{part.name}</span>
                      <span className="font-semibold text-slate-600">
                        {part.stats.correct}/{part.stats.total} ({Math.round(percent)}%)
                      </span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${percent}%`, backgroundColor: part.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Đánh giá theo Part */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-100 transition-all hover:shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-orange-500">📋</span> Đánh giá chi tiết
            </h2>

            <div className="space-y-6">
              <PartEvaluationCard 
  partName="Part 5" 
  evalData={part5Eval} 
  stats={stats.part5}
  weak={part5Weak}
  strong={part5Strong}
/>
              <PartEvaluationCard partName="Part 6" evalData={part6Eval} stats={stats.part6} />
              <PartEvaluationCard partName="Part 7" evalData={part7Eval} stats={stats.part7} />
            </div>

            
          </div>
        </div>

      <div className="mt-8 bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50 rounded-2xl p-6 shadow-md border border-amber-100">
  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-100 transition-all hover:shadow-xl">
    <h3 className="font-bold text-xl mb-5 flex items-center gap-3 text-slate-800">
      <span className="text-3xl">🧠</span> 
      <span className="bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent">Phân tích kỹ năng</span>
    </h3>

    <div className="grid md:grid-cols-2 gap-6">
      {/* Weakness */}
      {weaknesses.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-500 text-sm">🔻</span>
            </div>
            <p className="text-red-700 font-bold text-sm uppercase tracking-wide">Cần cải thiện ngay</p>
          </div>
          <div className="space-y-2">
            {weaknesses.map(w => (
              <div key={w.label} className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-red-50 to-red-100/30 p-3 border border-red-200 hover:shadow-md transition-all">
                <div className="flex justify-between items-center relative z-10">
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    {w.label}
                  </span>
                  <span className="text-red-600 font-black text-lg bg-white/50 px-3 py-1 rounded-full shadow-sm">
                    {Math.round(w.accuracy * 100)}%
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-red-400/30 w-full rounded-b-xl" style={{ width: `${Math.round(w.accuracy * 100)}%` }}></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strength */}
      {strengths.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-500 text-sm">✅</span>
            </div>
            <p className="text-green-700 font-bold text-sm uppercase tracking-wide">Điểm mạnh nổi bật</p>
          </div>
          <div className="space-y-2">
            {strengths.map(s => (
              <div key={s.label} className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-green-50 to-emerald-50/30 p-3 border border-green-200 hover:shadow-md transition-all">
                <div className="flex justify-between items-center relative z-10">
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    {s.label}
                  </span>
                  <span className="text-green-600 font-black text-lg bg-white/50 px-3 py-1 rounded-full shadow-sm">
                    {Math.round(s.accuracy * 100)}%
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-green-400/40 w-full rounded-b-xl" style={{ width: `${Math.round(s.accuracy * 100)}%` }}></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Nếu không có weaknesses hoặc strengths thì hiển thị thông báo */}
    {weaknesses.length === 0 && strengths.length === 0 && (
      <div className="text-center py-8 text-slate-400">
        <span className="text-4xl">📊</span>
        <p className="mt-2">Chưa đủ dữ liệu để phân tích kỹ năng</p>
      </div>
    )}
  </div>

  {/* Phần yếu nhất - Cần cải thiện */}
<div className="mt-8">
  <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 shadow-lg overflow-hidden transition-all hover:shadow-xl">
    
    {/* Header */}
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl">
          🎯
        </div>
        <div>
          <p className="text-amber-100 text-xs font-semibold uppercase tracking-wider">
            Ưu tiên hàng đầu
          </p>
          <p className="text-white text-sm font-medium">
            Tập trung cải thiện ngay để tăng điểm nhanh
          </p>
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      {priorityFocusList.length > 0 ? (
        <div className="space-y-5">
          {priorityFocusList.map((part, idx) => (
            <div key={idx} className="rounded-xl bg-white/70 p-4">
              <h3 className="font-bold text-slate-800 mb-2">
                {part.type}
              </h3>

              {part.items ? (
                <div className="space-y-2">
                  {part.items.map((it, i) => {
                    const percent = Math.round(it.accuracy * 100);
                    return (
                      <div key={i} className="flex justify-between bg-white p-3 rounded-lg">
                        <span>{it.label}</span>
                        <span className="font-bold text-red-600">
                          {percent}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-600">{part.message}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500">
          Không có dữ liệu yếu
        </p>
      )}
    </div>
  </div>
</div>
</div>

{learningPath && (
  <div className="mt-10 bg-white rounded-2xl p-6 shadow">
    <h2 className="text-xl font-bold mb-4">📚 Learning Path hôm nay</h2>

    <p className="mb-2">
      ⏱ Ước tính: {learningPath.estimatedTime} phút
    </p>

    <div className="grid md:grid-cols-3 gap-4">
      <div>
        <h3 className="font-bold text-blue-600">Review</h3>
        <p>{learningPath.review.length} câu</p>
      </div>

      <div>
        <h3 className="font-bold text-green-600">New</h3>
        <p>{learningPath.new.length} câu</p>
      </div>

      <div>
        <h3 className="font-bold text-red-600">Weak skills</h3>
        <p>{learningPath.weakSkills.length} kỹ năng</p>
      </div>
    </div>
  </div>
)}
<div className="mt-6 text-center">
  <button
    onClick={() => navigate("/today-learning")}
    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow hover:scale-105 transition"
  >
    🚀 Bắt đầu học hôm nay
  </button>
</div>

        {/* Chi tiết câu hỏi */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-100">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="text-purple-600">🔍</span> Phân tích câu hỏi chi tiết
          </h2>

          <PartTable title="Part 5 - Incomplete Sentences" items={part5Items} color="blue" evalData={part5Eval} stats={stats.part5} />
          <PartTable title="Part 6 - Text Completion" items={part6Items} color="purple" evalData={part6Eval} stats={stats.part6} />
          <PartTable title="Part 7 - Reading Comprehension" items={part7Items} color="orange" evalData={part7Eval} stats={stats.part7} />
        </div>

        {/* Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/aipath")}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <span className="text-2xl">🔄</span> Làm bài kiểm tra mới
          </button>
        </div>
      </div>
    </div>
  );
}

// ================= COMPONENT CON =================
function PartEvaluationCard({ partName, evalData, stats, weak, strong }) {
  if (stats.total === 0) return null;

  return (
    <div className={`${evalData.bg} rounded-2xl p-7 border ${evalData.border} transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-xl text-slate-800">{partName}</h3>
          <p className="text-4xl font-bold mt-3 text-slate-700">
            {stats.correct}<span className="text-2xl text-slate-400">/{stats.total}</span>
          </p>
        </div>
        <span className={`text-2xl font-bold ${evalData.color} bg-white/50 px-4 py-2 rounded-full shadow-sm`}>
          {evalData.text}
        </span>
      </div>
      <p className="mt-5 text-slate-600 leading-relaxed">{evalData.comment}</p>
      {(weak || strong) && (
  <p className="mt-3 text-sm text-slate-500 italic">
    {(weak || strong) && (
  <p className="mt-3 text-sm text-slate-500 italic">
    {weak && (
      <>
        Bạn thường sai ở <b>{weak.label}</b> 
        ({Math.round(weak.accuracy * 100)}% đúng)
      </>
    )}

    {weak && strong && ", "}

    {strong && (
      <>
        trong khi <b>{strong.label}</b> bạn làm khá tốt 
        ({Math.round(strong.accuracy * 100)}%).
      </>
    )}
  </p>
)}
  </p>
)}
    </div>
  );
}

function PartTable({ title, items, color, evalData, stats }) {
  if (items.length === 0) return null;

  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-700",
      header: "bg-blue-50 border-blue-200"
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      badge: "bg-purple-100 text-purple-700",
      header: "bg-purple-50 border-purple-200"
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      badge: "bg-orange-100 text-orange-700",
      header: "bg-orange-50 border-orange-200"
    }
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="mb-16 last:mb-0">
      <div className={`flex items-center gap-4 mb-5 ${c.bg} px-6 py-4 rounded-2xl border ${c.border}`}>
        <div className={`w-12 h-12 ${c.text.replace('text', 'bg')} bg-opacity-20 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md`}>
          {title.split(" ")[0].replace("Part", "")}
        </div>
        <div>
          <h3 className={`font-bold ${c.text} text-2xl`}>{title}</h3>
          <p className={`${c.text} text-sm opacity-80`}>
            {stats.correct}/{stats.total} đúng • {evalData.percent}% chính xác
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className={`${c.header} border-b-2 ${c.border}`}>
              <th className="text-left p-5 font-bold w-16 text-slate-700">#</th>
              <th className="text-left p-5 font-bold text-slate-700">Label</th>
              <th className="text-left p-5 font-bold text-slate-700">Câu hỏi</th>
              <th className="text-left p-5 font-bold text-slate-700">Đáp án đúng</th>
              <th className="text-left p-5 font-bold text-slate-700">Bạn chọn</th>
              <th className="text-left p-5 font-bold w-28 text-slate-700">Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-slate-50 transition-colors">
                <td className="p-5 font-medium text-slate-500">{idx + 1}</td>
                <td className="p-5">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold ${c.badge}`}>
                    {item.label || item.questionType?.toUpperCase()}
                  </span>
                </td>
                <td className="p-5 text-slate-600 font-medium">Question {item.questionId}</td>
                <td className="p-5 font-semibold text-green-600">{item.correctAnswer}</td>
                <td className="p-5 font-semibold text-slate-700">{item.userAnswer || "—"}</td>
                <td className="p-5">
                  {item.isCorrect ? (
                    <span className="px-5 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold shadow-sm">✓ Đúng</span>
                  ) : (
                    <span className="px-5 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-bold shadow-sm">✗ Sai</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}