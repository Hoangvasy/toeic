import { X } from "lucide-react";
import { useState } from "react";

export default function FlashcardCreate({
  newSetName,
  setNewSetName,
  createSet,
  setShowCreate,
}) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!newSetName.trim()) {
      alert("Vui lòng nhập tiêu đề");
      return;
    }

    try {
      setLoading(true);

      await createSet(description); // gọi API tạo bộ

      setDescription("");
      setShowCreate(false); // ✅ tự đóng modal
    } catch (e) {
      console.error(e);
      alert("Tạo thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-[520px] rounded-xl shadow-xl p-6 relative">
        {/* nút đóng */}
        <button
          onClick={() => setShowCreate(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
        >
          <X size={20} />
        </button>

        {/* tiêu đề */}
        <h2 className="text-xl font-bold mb-6 dark:text-white">
          Tạo bộ từ vựng mới
        </h2>

        {/* input tiêu đề */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Tiêu đề bộ từ vựng
          </label>

          <input
            value={newSetName}
            onChange={(e) => setNewSetName(e.target.value)}
            placeholder="Nhập tiêu đề..."
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        {/* mô tả */}
        <div className="mb-6">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Mô tả (tùy chọn)
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả..."
            rows={3}
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        {/* nút tạo */}
        <div className="flex justify-center">
          <button
            onClick={handleCreate}
            disabled={loading}
            className={`
              px-6 py-2 rounded-lg text-white transition
              ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            {loading ? "Đang tạo..." : "Tạo bộ"}
          </button>
        </div>
      </div>
    </div>
  );
}
