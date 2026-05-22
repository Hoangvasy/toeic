import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  CheckCircle, 
  Target, 
  Brain, 
  FileText, 
  TrendingUp,
  Calendar,
  Award
} from "lucide-react";

export default function History() {
  const [attempts, setAttempts] = useState([]);
  const [examAttempts, setExamAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const aiRes = await axios.get(
          "http://localhost:8080/api/ai-path/history",
          { withCredentials: true }
        );

        const examRes = await axios.get(
          "http://localhost:8080/api/exam/history/1"
        );

        setAttempts(aiRes.data || []);
        setExamAttempts(examRes.data || []);
      } catch (err) {
        console.error("Fetch history error:", err);
        setAttempts([]);
        setExamAttempts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Format data cho AI Path
  const aiPathData = attempts.map((a) => ({
    id: a.id || a.attemptId,
    correct: a.correctAnswers ?? 0,
    total: a.totalQuestions ?? 1,
    createdAt: a.createdAt,
  }));

  // Format data cho Luyện đề
  const practiceData = examAttempts.map((e) => ({
    id: e.id,
    correct: e.correctAnswers ?? 0,
    total: e.totalQuestions ?? 1,
    createdAt: e.endTime || e.createdAt,
    testId: e.testId,
  }));

  // Sắp xếp theo thời gian mới nhất trước
  const sortByDate = (data) => {
    return [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const sortedAiPath = sortByDate(aiPathData);
  const sortedPractice = sortByDate(practiceData);

  const getScoreColor = (percent) => {
    if (percent >= 80) return "text-green-600";
    if (percent >= 60) return "text-blue-600";
    if (percent >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (percent) => {
    if (percent >= 80) return "bg-green-500";
    if (percent >= 60) return "bg-blue-500";
    if (percent >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const renderHistoryItem = (item, type, index) => {
    const percent = Math.floor((item.correct / item.total) * 100);
    const toeic = Math.floor((item.correct / item.total) * 495);
    const scoreColor = getScoreColor(percent);
    const progressColor = getProgressColor(percent);
    const isAiPath = type === "AI_PATH";

    return (
      <div
        key={`${type}-${item.id}-${index}`}
       onClick={() =>
  navigate(
    isAiPath
      ? `/overview/${item.id}`
      : `/practice-history/${item.id}`
  )
}
        className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-gray-200"
      >
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Section */}
            <div className="flex-1 space-y-3">
              {/* Badge & Date */}
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${
                    isAiPath
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {isAiPath ? (
                    <>
                      <Brain className="w-3 h-3" />
                      AI Path
                    </>
                  ) : (
                    <>
                      <FileText className="w-3 h-3" />
                      Luyện đề
                    </>
                  )}
                </span>
                
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString("vi-VN")
                    : "Không có ngày"}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-xs text-gray-500">Đúng</div>
                    <div className="font-semibold text-gray-800">
                      {item.correct}/{item.total}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-600" />
                  <div>
                    <div className="text-xs text-gray-500">Tỉ lệ</div>
                    <div className={`font-semibold ${scoreColor}`}>
                      {percent}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">TOEIC</div>
                    <div className="font-bold text-blue-600">
                      {toeic}/495
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${progressColor} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Section - Score */}
            <div className="lg:text-right">
              <div className="flex lg:flex-col items-center lg:items-end gap-3 lg:gap-1">
                <div className={`text-2xl lg:text-3xl font-bold ${scoreColor}`}>
                  {percent}%
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover effect indicator */}
        <div
          className={`h-1 transition-all duration-300 ${
            isAiPath ? "bg-purple-500" : "bg-blue-500"
          } group-hover:h-1.5`}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải lịch sử...</p>
        </div>
      </div>
    );
  }

  const hasAiPath = sortedAiPath.length > 0;
  const hasPractice = sortedPractice.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Award className="w-8 h-8 text-blue-600" />
            Lịch sử làm bài
          </h1>
          <p className="text-gray-500">
            Tổng hợp kết quả các bài thi AI Path và Luyện đề
          </p>
        </div>

        {!hasAiPath && !hasPractice ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có bài làm nào
            </h3>
            <p className="text-gray-500">
              Hãy bắt đầu làm bài để xem kết quả tại đây
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* PHẦN AI PATH - HIỆN TRƯỚC */}
            {hasAiPath && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-xl">
                    <Brain className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">AI Path</h2>
                    <p className="text-sm text-gray-500">
                      {sortedAiPath.length} bài thi
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {sortedAiPath.map((item, idx) => renderHistoryItem(item, "AI_PATH", idx))}
                </div>
              </div>
            )}

            {/* PHẦN LUYỆN ĐỀ - HIỆN SAU */}
            {hasPractice && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Luyện đề</h2>
                    <p className="text-sm text-gray-500">
                      {sortedPractice.length} bài thi
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {sortedPractice.map((item, idx) => renderHistoryItem(item, "PRACTICE", idx))}
                </div>
              </div>
            )}

            {/* Tổng kết */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 mt-6 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Tổng kết</h3>
                  <p className="text-blue-100 text-sm">
                    Đã hoàn thành {sortedAiPath.length + sortedPractice.length} bài thi
                  </p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{sortedAiPath.length}</div>
                    <div className="text-xs text-blue-100">Bài AI Path</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{sortedPractice.length}</div>
                    <div className="text-xs text-blue-100">Bài Luyện đề</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}