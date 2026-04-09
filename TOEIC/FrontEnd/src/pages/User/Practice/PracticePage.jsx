import PracticePartCard from "../../../components/common/Practice/PracticePartCard";
import { BookOpen, FileText, ClipboardList } from "lucide-react";

export default function PracticeHome() {
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">TOEIC Practice</h1>

          <p className="text-gray-500">
            Improve your TOEIC skills with targeted practice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PracticePartCard
            title="Part 5"
            description="Incomplete Sentences - Grammar & Vocabulary"
            icon={<ClipboardList size={32} />}
            path="/practice/part5"
            color="bg-blue-500"
          />

          <PracticePartCard
            title="Part 6"
            description="Text Completion - Grammar in context"
            icon={<FileText size={32} />}
            path="/practice/part6"
            color="bg-green-500"
          />

          <PracticePartCard
            title="Part 7"
            description="Reading Comprehension passages"
            icon={<BookOpen size={32} />}
            path="/practice/part7"
            color="bg-purple-500"
          />
        </div>
      </div>
    </div>
  );
}
