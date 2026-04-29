import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";

export default function Part6List() {
  // danh sách bài test
  const [tests, setTests] = useState([]);

  // trạng thái loading
  const [loading, setLoading] = useState(true);

  // lỗi khi gọi api
  const [error, setError] = useState(null);

  // load danh sách bài luyện tập
  useEffect(() => {
    const loadTests = async () => {
      try {
        // gọi api lấy danh sách test
        const res = await axios.get(
          "http://localhost:8080/api/practice/part6/tests",
        );

        setTests(res.data);
      } catch (err) {
        // xử lý lỗi
        setError("Không thể tải danh sách bài luyện tập");
      } finally {
        // tắt loading
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-10">
      <div className="max-w-6xl mx-auto">
        {/* tiêu đề */}

        <div className="mb-10">
          <h1 className="text-3xl font-bold dark:text-white">
            Luyện tập Part 6
          </h1>

          <p className="text-gray-500 dark:text-gray-400">
            Chọn một bài luyện tập để bắt đầu
          </p>
        </div>

        {/* hiển thị lỗi */}

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* trạng thái loading */}

        {loading && (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow animate-pulse h-32"
              />
            ))}
          </div>
        )}

        {/* danh sách bài test */}

        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <Link
                key={test.id}
                to={`/practice/part6/${test.id}`}
                className="
                  group
                  bg-white dark:bg-gray-800
                  p-6 rounded-xl shadow
                  border dark:border-gray-700
                  hover:shadow-xl
                  transition
                "
              >
                {/* icon */}

                <div className="flex items-center justify-between mb-4">
                  <FileText
                    className="text-blue-500 group-hover:scale-110 transition"
                    size={28}
                  />

                  <ArrowRight
                    className="text-gray-400 group-hover:text-blue-500 transition"
                    size={20}
                  />
                </div>

                {/* tiêu đề bài */}

                <h2 className="text-lg font-semibold dark:text-white">
                  {test.title || `Practice Test ${test.id}`}
                </h2>

                {/* thông tin thêm */}

                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Questions 141 – 146
                </p>

                <p className="text-xs text-gray-400 mt-1">Text Completion</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
