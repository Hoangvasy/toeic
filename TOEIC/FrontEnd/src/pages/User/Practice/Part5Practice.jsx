import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Timer from "../../../components/common/Practice/Timer";
import ProgressBar from "../../../components/common/Practice/ProgressBar";
import QuestionCard from "../../../components/common/Practice/QuestionCard";
import ExplanationBox from "../../../components/common/Practice/ExplanationBox";
import PracticeResult from "./PracticeResult";

export default function Part5Practice() {
  const { label } = useParams();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/practice/part5/random?label=${label}&limit=10`,
        );

        setQuestions(res.data);
        setLoading(false);

        const session = await axios.post(
          "http://localhost:8080/api/practice/session/start",
          {
            userId: 1,
            part: 5,
            topic: label,
            questionCount: res.data.length,
          },
        );

        setSessionId(session.data.id);
      } catch (err) {
        console.error("Error loading questions", err);
      }
    };

    loadQuestions();
  }, [label]);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!questions.length) {
    return <div className="p-10 text-center">No questions available</div>;
  }

  if (current >= questions.length) {
    const correct = answers.filter((a) => a.selected === a.correct).length;

    axios.post("http://localhost:8080/api/practice/session/end", {
      sessionId: sessionId,
      correctAnswers: correct,
    });

    return <PracticeResult answers={answers} />;
  }

  const question = questions[current];

  const handleSubmit = async () => {
    const newAnswer = {
      question: question,
      selected: selected,
      correct: question.answer,
    };

    setAnswers([...answers, newAnswer]);

    try {
      await axios.post("http://localhost:8080/api/practice/answer", {
        sessionId: sessionId,
        questionId: question.id,
        userAnswer: selected,
        correctAnswer: question.answer,
        timeSpent: 10,
      });
    } catch (err) {
      console.error("Error saving answer", err);
    }

    setShowResult(true);
  };

  const handleNext = () => {
    setCurrent(current + 1);
    setSelected("");
    setShowResult(false);
  };

  const isCorrect = selected === question.answer;

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <header className="flex justify-between mb-6">
          <h1 className="font-bold text-xl capitalize">
            {label.replace("_", " ")} Practice
          </h1>

          <Timer seconds={1200} />
        </header>

        <p className="text-sm text-gray-500 mb-2">
          Question {current + 1} / {questions.length}
        </p>

        <ProgressBar current={current + 1} total={questions.length} />

        <QuestionCard
          question={question}
          selected={selected}
          setSelected={setSelected}
        />

        {!showResult && (
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Submit Answer
          </button>
        )}

        {showResult && (
          <>
            <ExplanationBox
              isCorrect={isCorrect}
              answer={question.answer}
              explanation={question.explanation}
            />

            <button
              onClick={handleNext}
              className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Next Question
            </button>
          </>
        )}
      </div>
    </div>
  );
}
