import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// 👇 import component Part5 (tí nữa mình viết)
import Part5 from '../Learning/Components/Part5';

export default function TakeTest() {
  const { testId } = useParams();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const selectedPart = query.get("part"); // "5" | "6" | "7"

  const [part5, setPart5] = useState([]);
  const [part6, setPart6] = useState([]);
  const [part7, setPart7] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:8080/api/part5?testId=${testId}`).then(res => res.json()),
      fetch(`http://localhost:8080/api/part6?testId=${testId}`).then(res => res.json()),
      fetch(`http://localhost:8080/api/part7?testId=${testId}`).then(res => res.json()),
    ])
      .then(([p5, p6, p7]) => {
        setPart5(p5 || []);
        setPart6(p6 || []);
        setPart7(p7 || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [testId]);

  if (loading) return <p className="p-6">Đang tải đề...</p>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 🔥 PART 5 */}
      {selectedPart === "5" && <Part5 data={part5} testId={testId} />}

      {/* 🔥 PART 6 (tạm placeholder) */}
      {selectedPart === "6" && (
        <div className="p-6 text-center text-lg">
          Part 6 đang phát triển...
        </div>
      )}

      {/* 🔥 PART 7 */}
      {selectedPart === "7" && (
        <div className="p-6 text-center text-lg">
          Part 7 đang phát triển...
        </div>
      )}
    </div>
  );
}