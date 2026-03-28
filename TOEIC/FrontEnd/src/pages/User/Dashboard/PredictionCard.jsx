function PredictionCard({ ai }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="font-semibold mb-2">📈 Prediction</h3>

      <p className="text-3xl font-bold text-blue-600">
        {ai.prediction}
      </p>

      <p className="text-sm text-gray-500">
        +30 điểm nếu duy trì học
      </p>
    </div>
  );
}

export default PredictionCard;