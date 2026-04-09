export default function OptionButton({ label, text, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left border p-3 rounded-lg mb-3 transition
      ${selected ? "bg-blue-100 border-blue-500" : "bg-white hover:bg-gray-100"}
      `}
    >
      <strong>{label}.</strong> {text}
    </button>
  );
}
