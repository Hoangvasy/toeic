import { useParams, useNavigate } from "react-router-dom";

export default function SelectPart() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const goPart = (part) => {
    navigate(`/take-test/${testId}?part=${part}`);
  };

  const goFull = () => {
    navigate(`/take-test/${testId}`);
  };

  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold mb-6">
        Chọn phần muốn làm
      </h1>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => goPart(5)}
          className="bg-blue-500 text-white py-3 rounded-lg"
        >
          Part 5
        </button>

        <button
          onClick={() => goPart(6)}
          className="bg-green-500 text-white py-3 rounded-lg"
        >
          Part 6
        </button>

        <button
          onClick={() => goPart(7)}
          className="bg-purple-500 text-white py-3 rounded-lg"
        >
          Part 7
        </button>

        <button
          onClick={goFull}
          className="bg-red-500 text-white py-3 rounded-lg mt-4"
        >
          Làm full đề
        </button>
      </div>
    </div>
  );
}