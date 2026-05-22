import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TestDetail() {
  const { id } = useParams();

  const [part5, setPart5] = useState([]);
  const [part6, setPart6] = useState([]);
  const [part7, setPart7] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/part5?testId=${id}`)
      .then(res => res.json())
      .then(setPart5);

    fetch(`http://localhost:8080/api/part6?testId=${id}`)
      .then(res => res.json())
      .then(setPart6);

    fetch(`http://localhost:8080/api/part7?testId=${id}`)
      .then(res => res.json())
      .then(setPart7);

  }, [id]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        Test {id}
      </h1>

      {/* PART 5 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        Part 5
      </h2>

      {part5.map(q => (
        <div key={q.id} className="mb-4 bg-white p-4 rounded shadow">
          <p>{q.questionNumber}. {q.question}</p>

          <div className="ml-4 mt-2">
            <p>A. {q.optionA}</p>
            <p>B. {q.optionB}</p>
            <p>C. {q.optionC}</p>
            <p>D. {q.optionD}</p>
          </div>
        </div>
      ))}

      {/* PART 6 */}
      <h2 className="text-xl font-semibold mt-10 mb-3">
        Part 6
      </h2>

      {part6.map(q => (
        <div key={q.id} className="mb-4 bg-white p-4 rounded shadow">
          <p>{q.question}</p>
        </div>
      ))}

      {/* PART 7 */}
      <h2 className="text-xl font-semibold mt-10 mb-3">
        Part 7
      </h2>

      {part7.map(q => (
        <div key={q.id} className="mb-4 bg-white p-4 rounded shadow">
          <p>{q.question}</p>
        </div>
      ))}
    </div>
  );
}