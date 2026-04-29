import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import PassageBox from "./PassageBox";
import QuestionGroup from "./QuestionGroup";
import Timer from "../../../../components/common/Practice/Timer";

import PracticeResult from "../PracticeResult";

export default function PracticePart6() {
  // danh sách câu hỏi
  const [questions, setQuestions] = useState([]);

  // đáp án người dùng
  const [answers, setAnswers] = useState({});

  // trạng thái đã nộp bài
  const [submitted, setSubmitted] = useState(false);

  // session id backend
  const [sessionId, setSessionId] = useState(null);

  // trạng thái loading
  const [loading, setLoading] = useState(true);

  // lấy testId từ url
  const { testId } = useParams();

  // load câu hỏi + tạo session
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // gọi api lấy câu hỏi
        const res = await axios.get(
          "http://localhost:8080/api/practice/part6/random",
          { params: { testId } },
        );

        const data = res.data;
        setQuestions(data);

        // tạo session luyện tập
        const session = await axios.post(
          "http://localhost:8080/api/practice/session/start",
          {
            userId: 1,
            part: 6,
            topic: "text_completion",
            questionCount: data.length,
          },
        );

        setSessionId(session.data.id);
      } catch (err) {
        console.error("lỗi load part6:", err);
      }

      setLoading(false);
    };

    loadQuestions();
  }, [testId]);

  // nhóm câu hỏi theo passage
  const passages = useMemo(() => {
    const grouped = {};

    questions.forEach((q) => {
      if (!grouped[q.passage]) grouped[q.passage] = [];
      grouped[q.passage].push(q);
    });

    return Object.entries(grouped).map(([passage, qs]) => ({
      passage,
      questions: qs.sort((a, b) => a.questionNumber - b.questionNumber),
    }));
  }, [questions]);

  // chọn đáp án
  const handleSelect = (questionId, option) => {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // nộp bài
  const handleSubmit = async () => {
    if (!window.confirm("Bạn chắc chắn muốn nộp bài?")) return;

    let correct = 0;

    try {
      // gửi từng câu trả lời
      await Promise.all(
        questions.map((q) => {
          if (answers[q.id] === q.answer) correct++;

          return axios.post("http://localhost:8080/api/practice/answer", {
            sessionId,
            questionId: q.id,
            userAnswer: answers[q.id],
            correctAnswer: q.answer,
            timeSpent: 10,
          });
        }),
      );

      await axios.post("http://localhost:8080/api/practice/session/end", {
        sessionId,
        correctAnswers: correct,
      });

      setSubmitted(true);
    } catch (err) {
      console.error("lỗi submit:", err);
    }
  };

  // loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Đang tải Part 6...</p>
      </div>
    );
  }

  // không có dữ liệu
  if (!questions.length) {
    return <div className="p-10">No questions found</div>;
  }

  // hiển thị kết quả
  if (submitted) {
    const formattedAnswers = questions.map((q) => ({
      question: {
        ...q,
        part: 6,
        label: "text_completion",
      },
      selected: answers[q.id],
      correct: q.answer,
    }));

    localStorage.setItem("practiceAnswers", JSON.stringify(formattedAnswers));

    return <PracticeResult answers={formattedAnswers} />;
  }

  // giao diện làm bài
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* header */}

      <div className="flex justify-between items-center px-6 py-4 bg-white border-b shadow-sm">
        <h1 className="text-xl font-bold text-green-600">
          PART 6 - TEXT COMPLETION
        </h1>

        <Timer />
      </div>

      {/* nội dung chính */}

      <div className="flex-1 overflow-y-auto px-8 pt-4 pb-10 space-y-16">
        {passages.map((group, index) => (
          <div key={index} className="grid md:grid-cols-2 gap-10 items-start">
            {/* passage */}

            <div className="md:sticky md:top-[72px] self-start">
              <PassageBox passage={group.passage} />
            </div>

            {/* câu hỏi */}

            <div className="self-start">
              <QuestionGroup
                questions={group.questions}
                answers={answers}
                handleSelect={handleSelect}
                submitted={submitted}
              />
            </div>
          </div>
        ))}
      </div>

      {/* nút submit */}

      <div className="p-4 bg-white border-t flex justify-center">
        <button
          onClick={handleSubmit}
          className="
            bg-green-600
            hover:bg-green-700
            text-white
            px-8
            py-3
            rounded-lg
            font-semibold
          "
        >
          Nộp bài
        </button>
      </div>
    </div>
  );
}
