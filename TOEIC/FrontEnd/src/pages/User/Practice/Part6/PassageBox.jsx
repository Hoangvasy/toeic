export default function PassageBox({ passage }) {
  if (!passage) return null;

  const lines = passage.split("\n");
  const title = lines[0];
  const content = lines.slice(1).join("\n");

  return (
    <div className="bg-white border rounded-lg p-6 shadow h-fit">
      <h2 className="font-semibold mb-4 text-gray-800">{title}</h2>

      <div className="border p-6 bg-gray-50 whitespace-pre-line leading-relaxed text-gray-700">
        {content}
      </div>
    </div>
  );
}
