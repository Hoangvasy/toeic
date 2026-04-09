import TopicCard from "../../../components/common/Practice/TopicCard";

export default function Part5Topics() {
  const grammarTopics = [
    {
      title: "Word Form",
      description: "Adjective, Adverb, Noun forms",
      path: "/practice/part5/word_form",
      color: "bg-blue-500",
    },
    {
      title: "Tense & Voice",
      description: "Verb tense and passive voice",
      path: "/practice/part5/tense_voice",
      color: "bg-blue-500",
    },
    {
      title: "Preposition",
      description: "Common TOEIC prepositions",
      path: "/practice/part5/preposition",
      color: "bg-blue-500",
    },
    {
      title: "Conjunction",
      description: "Sentence connectors",
      path: "/practice/part5/conjunction",
      color: "bg-blue-500",
    },
    {
      title: "Pronoun",
      description: "Subject, object, possessive pronouns",
      path: "/practice/part5/pronoun",
      color: "bg-blue-500",
    },
  ];

  const vocabTopics = [
    {
      title: "Vocabulary Meaning",
      description: "Word meaning in context",
      path: "/practice/part5/vocabulary_meaning",
      color: "bg-purple-500",
    },
    {
      title: "Collocation",
      description: "Common TOEIC word combinations",
      path: "/practice/part5/vocabulary_collocation",
      color: "bg-purple-500",
    },
    {
      title: "Confusing Words",
      description: "Commonly confused TOEIC words",
      path: "/practice/part5/confusing_words",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Part 5 Practice</h1>

        <p className="text-gray-500 mb-8">
          Choose a grammar or vocabulary topic
        </p>

        {/* Grammar */}

        <h2 className="text-xl font-semibold mb-4">Grammar</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {grammarTopics.map((topic) => (
            <TopicCard key={topic.title} {...topic} />
          ))}
        </div>

        {/* Vocabulary */}

        <h2 className="text-xl font-semibold mb-4">Vocabulary</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {vocabTopics.map((topic) => (
            <TopicCard key={topic.title} {...topic} />
          ))}
        </div>
      </div>
    </div>
  );
}
