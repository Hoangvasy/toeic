import { useState } from "react";
import PracticePart7 from "./PracticePart7";
import { FileText, Layers, Library } from "lucide-react";

const PracticePart7Menu = () => {
  // loại bài đọc đang chọn
  const [type, setType] = useState(null);

  // nếu đã chọn thì render trang luyện tập
  if (type) {
    return <PracticePart7 type={type} />;
  }

  // danh sách các option part 7
  const options = [
    {
      type: "SINGLE",
      title: "Single Passage",
      description: "1 đoạn văn + 2-4 câu hỏi",
      icon: <FileText className="text-blue-500" size={28} />,
      color: "hover:border-blue-500",
    },
    {
      type: "DOUBLE",
      title: "Double Passage",
      description: "2 đoạn văn liên quan + 5 câu hỏi",
      icon: <Layers className="text-green-500" size={28} />,
      color: "hover:border-green-500",
    },
    {
      type: "TRIPLE",
      title: "Triple Passage",
      description: "3 đoạn văn + 5 câu hỏi khó",
      icon: <Library className="text-purple-500" size={28} />,
      color: "hover:border-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-12 px-8">
      <div className="max-w-5xl mx-auto">
        {/* tiêu đề */}

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold dark:text-white">
            Luyện tập Part 7
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Chọn loại bài đọc bạn muốn luyện tập
          </p>
        </div>

        {/* danh sách lựa chọn */}

        <div className="grid md:grid-cols-3 gap-6">
          {options.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setType(opt.type)}
              className={`
                bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                rounded-xl
                p-6
                shadow-sm
                hover:shadow-lg
                transition
                text-left
                ${opt.color}
              `}
            >
              {/* icon */}

              <div className="mb-4">{opt.icon}</div>

              {/* tiêu đề option */}

              <h2 className="text-lg font-semibold dark:text-white">
                {opt.title}
              </h2>

              {/* mô tả */}

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticePart7Menu;
