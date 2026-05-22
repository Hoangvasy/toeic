import OptionButton from "./OptionButton";

export default function QuestionCard({ question, selected, setSelected }) {
  const options = [
    { key: "A", value: question.optionA },
    { key: "B", value: question.optionB },
    { key: "C", value: question.optionC },
    { key: "D", value: question.optionD },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="mb-6 text-lg">{question.question}</p>

      {options.map((opt) => (
        <OptionButton
          key={opt.key}
          label={opt.key}
          text={opt.value}
          selected={selected === opt.key}
          onClick={() => setSelected(opt.key)}
        />
      ))}
    </div>
  );
}
