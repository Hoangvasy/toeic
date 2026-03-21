import React, { useState, useEffect } from "react";
import UploadPart5 from "./UploadPart5";
import UploadPart6 from "./UploadPart6";
import UploadPart7 from "./UploadPart7";

const Upload = () => {

  const [part, setPart] = useState(5);
  const [tests, setTests] = useState([]);
  const [testId, setTestId] = useState("");
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/tests")
      .then(res => res.json())
      .then(data => setTests(data));
  }, []);

  const handleCreateTest = async () => {

    if (!newTitle) {
      alert("Nhập tên đề!");
      return;
    }

    const res = await fetch("http://localhost:8080/api/tests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: newTitle,
        description: "Full test"
      })
    });

    const data = await res.json();

    setTests([...tests, data]);
    setTestId(data.id);
    setNewTitle("");

    alert("Tạo đề thành công!");
  };

  return (
    <div style={{ padding: "40px" }}>

      <h1>Upload TOEIC</h1>

      {/* chọn đề */}
      <select
        value={testId}
        onChange={(e) => setTestId(Number(e.target.value))}
      >
        <option value="">-- Chọn đề --</option>
        {tests.map(t => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>

      {/* tạo đề */}
      <div style={{ marginTop: 10 }}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Tên đề"
        />
        <button onClick={handleCreateTest}>+ Tạo</button>
      </div>

      {/* chọn part */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setPart(5)}>Part5</button>
        <button onClick={() => setPart(6)}>Part6</button>
        <button onClick={() => setPart(7)}>Part7</button>
      </div>

      {!testId && <p style={{ color: "red" }}>Chọn đề trước!</p>}

      {testId && part === 5 && <UploadPart5 testId={testId} />}
      {testId && part === 6 && <UploadPart6 testId={testId} />}
      {testId && part === 7 && <UploadPart7 testId={testId} />}

    </div>
  );
};

export default Upload;