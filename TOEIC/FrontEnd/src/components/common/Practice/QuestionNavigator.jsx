const QuestionNavigator = ({ questions, answers, current, setCurrent }) => {
  const handleClick = (index, questionNumber) => {
    setCurrent(index);

    const el = document.getElementById(`question-${questionNumber}`);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="sticky bottom-0 bg-white border-t p-4">
      <div className="flex justify-center gap-2 flex-wrap">
        {questions.map((q, index) => {
          const answered = answers[q.id];

          let style =
            "w-10 h-10 flex items-center justify-center rounded border text-sm cursor-pointer";

          if (answered) {
            style += " bg-blue-500 text-white border-blue-500";
          } else {
            style += " bg-white";
          }

          if (current === index) {
            style += " ring-2 ring-black";
          }

          return (
            <button
              key={q.id}
              onClick={() => handleClick(index, q.questionNumber)}
              className={style}
            >
              {q.questionNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionNavigator;
