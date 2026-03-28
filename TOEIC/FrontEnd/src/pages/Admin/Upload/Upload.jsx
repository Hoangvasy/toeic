import React, { useState, useEffect } from "react";
import UploadPart5 from "./UploadPart5";
import UploadPart6 from "./UploadPart6";
import UploadPart7 from "./UploadPart7";

export default function Upload() {
  const [part, setPart] = useState(5);
  const [tests, setTests] = useState([]);
  const [testId, setTestId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/tests")
      .then(res => res.json())
      .then(data => setTests(data));
  }, []);

  const handleCreateTest = async () => {
    if (!newTitle) return alert("Nhập tên đề!");

    const res = await fetch("http://localhost:8080/api/tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        description: "Full test",
        status: "DRAFT"
      })
    });

    const data = await res.json();
    setTests([...tests, data]);
    setTestId(data.id);
    setNewTitle("");
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Upload TOEIC</h1>

      {/* Create Test */}
      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 rounded w-64"
          placeholder="Tên đề"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button
          onClick={handleCreateTest}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Tạo đề
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tests.map(test => (
          <div
            key={test.id}
            className={`bg-white p-5 rounded-2xl shadow cursor-pointer border ${testId === test.id ? "border-blue-500" : ""}`}
            onClick={() => setTestId(test.id)}
          >
            <h2 className="font-semibold text-lg mb-2">
              {test.title}
            </h2>

            <p className="text-sm text-gray-500 mb-2">
              ⏱ 120 phút
            </p>

            <p className="text-sm text-gray-500 mb-2">
              7 phần thi | 200 câu hỏi
            </p>

            <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
              #{test.status || "DRAFT"}
            </span>

            <button
              className={`mt-4 w-full py-2 rounded-lg ${testId === test.id ? "bg-gray-500 text-white" : "border border-blue-500 text-blue-500"}`}
            >
              {testId === test.id ? "Đang chọn" : "Chọn đề"}
            </button>
          </div>
        ))}
      </div>

      {/* Part Selector */}
      {testId && (
        <div className="mt-8">
          <div className="flex gap-3 mb-4">
            {[5,6,7].map(p => (
              <button
                key={p}
                onClick={() => setPart(p)}
                className={`px-4 py-2 rounded ${part === p ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                Part {p}
              </button>
            ))}
          </div>

          {part === 5 && <UploadPart5 testId={testId} />}
          {part === 6 && <UploadPart6 testId={testId} />}
          {part === 7 && <UploadPart7 testId={testId} />}
        </div>
      )}

      {!testId && (
        <p className="text-red-500 mt-6">Chọn đề trước!</p>
      )}
    </div>
  );
}
