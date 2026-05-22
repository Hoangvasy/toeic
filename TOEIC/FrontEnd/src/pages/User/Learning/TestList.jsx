import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TestList() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTest, setSelectedTest] = useState(null); // 🔥 test đang chọn
  const [showModal, setShowModal] = useState(false); // 🔥 mở chọn part

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/tests")
      .then(res => res.json())
      .then(data => setTests(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openSelectPart = (testId) => {
    setSelectedTest(testId);
    setShowModal(true);
  };

  const goPart = (part) => {
    navigate(`/take-test/${selectedTest}?part=${part}`);
    setShowModal(false);
  };

  const goFull = () => {
    navigate(`/take-test/${selectedTest}`);
    setShowModal(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Danh sách đề thi TOEIC Reading
      </h1>

      {loading ? <p>Đang tải...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map(test => (
            <div
              key={test.id}
              className="border rounded-xl p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">
                {test.title || `Đề ${test.id}`}
              </h2>

              <p className="text-gray-600 mt-2">
                Số câu: {test.totalQuestions || '100'}
              </p>

              <p className="text-sm text-gray-500 mt-4">
                Thời gian: 75 phút
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => openSelectPart(test.id)}
                  className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Luyện tập
                </button>

                <button
                  onClick={() => openSelectPart(test.id)}
                  className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Luyện thi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 MODAL CHỌN PART */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 text-center">
            <h2 className="text-xl font-bold mb-4">
              Chọn phần muốn làm
            </h2>

            <div className="grid gap-3">
              <button
                onClick={() => goPart(5)}
                className="bg-blue-500 text-white py-2 rounded"
              >
                Part 5
              </button>

              <button
                onClick={() => goPart(6)}
                className="bg-green-500 text-white py-2 rounded"
              >
                Part 6
              </button>

              <button
                onClick={() => goPart(7)}
                className="bg-purple-500 text-white py-2 rounded"
              >
                Part 7
              </button>

              <button
                onClick={goFull}
                className="bg-red-500 text-white py-2 rounded mt-2"
              >
                Full đề
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 mt-2"
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}