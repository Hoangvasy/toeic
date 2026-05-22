
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api/tests";

export default function PracticeTest() {
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH TESTS =================
  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch tests");
      }

      const data = await response.json();

      setTests(data);
    } catch (error) {
      console.error("Fetch tests error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= HELPERS =================
  const formatNumber = (number) => {
    if (!number) return "0";

    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}k`;
    }

    return number.toString();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-700";

      case "DRAFT":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600 font-medium">
            Đang tải đề thi...
          </p>
        </div>
      </div>
    );
  }

  // ================= EMPTY =================
  if (tests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow-lg text-center">
          <div className="text-6xl mb-4">📭</div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Chưa có đề thi
          </h2>

          <p className="text-gray-500">
            Hiện tại chưa có đề TOEIC nào.
          </p>
        </div>
      </div>
    );
  }

  // ================= MAIN =================
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm mb-4">
            🎯 TOEIC Practice
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            TOEIC Practice Tests
          </h1>

          <p className="text-blue-100 text-lg max-w-2xl">
            Luyện tập với các đề thi TOEIC mô phỏng đề thật,
            giúp cải thiện kỹ năng Listening và Reading.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon="📚"
            title="Tổng số đề"
            value={tests.length}
          />

          <StatCard
            icon="📖"
            title="Tổng số phần"
            value={tests.length * 7}
          />

          <StatCard
            icon="👥"
            title="Người đã học"
            value={formatNumber(
              tests.reduce(
                (sum, test) => sum + (test.totalStudents || 0),
                0
              )
            )}
          />
        </div>

        {/* TEST LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden group"
            >
              {/* TOP BAR */}
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

              <div className="p-6">
                {/* STATUS */}
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusStyle(
                      test.status
                    )}`}
                  >
                    {test.status || "DRAFT"}
                  </span>
                </div>

                {/* TITLE */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition">
                  {test.title}
                </h2>

                {/* DESCRIPTION */}
                <p className="text-gray-500 text-sm mb-6 min-h-[40px]">
                  {test.description ||
                    "Full TOEIC Practice Test"}
                </p>

                {/* INFO */}
                <div className="space-y-3 mb-6">
                  <InfoRow
                    icon="⏱"
                    label="Thời gian"
                    value="120 phút"
                  />

                  <InfoRow
                    icon="📘"
                    label="Số phần"
                    value="7 phần"
                  />

                  <InfoRow
                    icon="❓"
                    label="Số câu hỏi"
                    value="200 câu"
                  />

                  <InfoRow
                    icon="👥"
                    label="Người đã học"
                    value={formatNumber(
                      test.totalStudents || 0
                    )}
                  />
                </div>

                {/* BUTTON */}
                <button
                  onClick={() =>
                    navigate(`/practice-test/${test.id}`)
                  }
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl font-semibold transition"
                >
                  Làm đề
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="text-center mt-14">
          <p className="text-gray-500 text-sm">
            💡 Các đề được thiết kế dựa trên format TOEIC thật
          </p>
        </div>
      </div>
    </div>
  );
}

// ================= COMPONENTS =================

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">
            {title}
          </p>

          <h3 className="text-3xl font-bold text-gray-800">
            {value}
          </h3>
        </div>

        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center text-gray-600">
        <span className="mr-2">{icon}</span>

        <span>{label}</span>
      </div>

      <span className="font-semibold text-gray-800">
        {value}
      </span>
    </div>
  );
}
