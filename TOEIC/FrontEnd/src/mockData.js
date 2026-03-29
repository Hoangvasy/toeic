// mockData.js
export const dashboardData = {
  user: {
    name: "Thắng",
    goal: 750,
    currentScore: 680,
    streak: 5,
  },

  ai: {
    recommendation: ["Part 5 - Tenses", "Part 7 - Reading"],
    weakTopics: [
      { name: "Tenses", accuracy: 40 },
      { name: "Prepositions", accuracy: 55 },
      { name: "Reading", accuracy: 65 },
    ],
    prediction: 710,
  },

  stats: {
    totalPoints: 50,
    used: 10,
    remaining: 40,
  },

  activity: [
    "✔ Hoàn thành Part 5 - 20 câu (80%)",
    "✔ Luyện nghe Part 2",
    "❌ Sai 5 câu Tenses",
  ],
};