# 🏗️ Architecture Diagram - Practice by Topics System

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      TOEIC LEARNING PLATFORM                        │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                ┌──────────────────┼──────────────────┐
                │                  │                  │
                ▼                  ▼                  ▼
        ┌─────────────┐    ┌─────────────┐   ┌─────────────┐
        │  Frontend   │    │   Backend   │   │  Database   │
        │  React/     │    │  Spring     │   │   MySQL     │
        │  Vite       │    │  Boot       │   │             │
        └─────────────┘    └─────────────┘   └─────────────┘
```

## Frontend Structure

```
┌─ LEARNING HUB ────────────────────────────────────────────┐
│                                                             │
│  /learning                                                 │
│    ├─ Part 5                                              │
│    │   ├─ Grammar      [85% | 45/50 | Start]            │
│    │   ├─ Vocabulary   [72% | 36/50 | Start]            │
│    │   └─ Word Forms   [90% | 45/50 | Start]            │
│    │                                                      │
│    ├─ Part 6                                              │
│    │   ├─ Discourse    [78% | 39/50 | Start]            │
│    │   └─ Vocabulary   [68% | 34/50 | Start]            │
│    │                                                      │
│    └─ Part 7                                              │
│        ├─ Single Pass  [82% | 41/50 | Start]            │
│        ├─ Multiple     [75% | 37/50 | Start]            │
│        └─ Charts       [88% | 44/50 | Start]            │
│                                                             │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼ (User clicks "Start")
┌─ PRACTICE MODE ────────────────────────────────────────────┐
│                                                             │
│  Part 5 > Grammar (3/20 questions)                        │
│  ┌────────────────────────────────────────────────────┐  │
│  │ The CEO _____ the strategy yesterday.             │  │
│  │                                                    │  │
│  │ A) announce   B) announced                         │  │
│  │ C) announces  D) announcing                        │  │
│  │                                                    │  │
│  │ [Skip]  [A] [B] [C] [D]                           │  │
│  │                                                    │  │
│  │ ▓▓▓░░░░░░░░░░░░░░░░░ 15% Complete               │  │
│  └────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼ (Submit answer)
┌─ RESULT CARD ──────────────────────────────────────────────┐
│                                                             │
│  ✓ CORRECT!                                               │
│  Your Answer: B (announced)                               │
│  Explanation: Past tense is needed here...               │
│  Related: Past Tense Conjugation                         │
│                                                             │
│  Session: 2/20 correct (90%)                             │
│  Topic Accuracy: 88%                                      │
│                                                             │
│  [Continue →]                                             │
│                                                             │
└─────────────────────────────────────────────────────────┘
```

## Backend Data Flow

```
┌──────────────────────────────────┐
│    REST API Request              │
│  GET /api/practice/topics/5      │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  PracticeController              │
│  ├─ getTopicsByPart()           │
│  ├─ getQuestionsByTopic()       │
│  └─ submitAnswer()              │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  PracticeService                 │
│  ├─ Fetch topics from DB        │
│  ├─ Validate answers            │
│  ├─ Calculate accuracy          │
│  └─ Update progress             │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  Repositories                    │
│  ├─ PracticeTopicRepo           │
│  ├─ PracticeQuestionRepo        │
│  ├─ UserPracticeRecordRepo      │
│  └─ TopicProgressRepo           │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  MySQL Database                  │
│  ├─ practice_topics             │
│  ├─ practice_questions          │
│  ├─ user_practice_records       │
│  └─ topic_progress              │
└──────────────────────────────────┘
```

## Entity Relationships (ERD)

```
┌──────────────────┐
│    User          │
│  ────────────    │
│ • id (PK)        │
│ • username       │
│ • email          │
│ • role           │
└────────┬─────────┘
         │ 1
         │
         │ *
         ▼
┌──────────────────────────┐        ┌─────────────────────┐
│  UserPracticeRecord      │        │  PracticeTopic      │
│  ──────────────────────  │        │  ────────────────── │
│ • id (PK)                │────────│ • id (PK)           │
│ • user_id (FK)           │   *    │ • topicName         │
│ • question_id (FK)       │        │ • partNumber (5,6,7)│
│ • topic_id (FK)          │        │ • displayOrder      │
│ • userAnswer             │        │ • description       │
│ • isCorrect              │        └─────────────────────┘
│ • timeSpent              │                   △
│ • practiceDate           │                   │ 1
│ • attemptNumber          │                   │
└──────────────────────────┘                   │ *
         △                          ┌────────────────────────┐
         │ *                        │  PracticeQuestion      │
         │                          │  ──────────────────────│
         └──────────────────────────│ • id (PK)              │
                                    │ • question_text        │
                                    │ • context              │
                                    │ • optionA,B,C,D        │
                                    │ • correctAnswer        │
                                    │ • explanation          │
                                    │ • difficulty           │
                                    │ • topic_id (FK)        │
                                    └────────────────────────┘

┌──────────────────┐
│  TopicProgress   │
│  ──────────────  │
│ • id (PK)        │
│ • user_id (FK)   │
│ • topic_id (FK)  │
│ • totalAttempts  │
│ • correctAnswers │
│ • accuracyRate   │
│ • lastPracticedAt│
│ • streak         │
└──────────────────┘
```

## API Call Sequence

```
SCENARIO: User takes Grammar practice for Part 5

1️⃣ Load Learning Hub
   Client              Server
   │                   │
   ├─ GET /practice/topics/5
   │──────────────────→ │
   │                   ├─ Query: practice_topics WHERE part=5
   │                   │ (Grammar, Vocabulary, Word Forms...)
   │ ←─────────────────┤
   │ [Topics List]      │

2️⃣ User Selects Grammar Topic
   
   ├─ GET /practice/questions/1?limit=5
   │──────────────────→ │
   │                   ├─ Query: practice_questions WHERE topic_id=1
   │                   │ (Return 5 random questions)
   │ ←─────────────────┤
   │ [Question #1]      │

3️⃣ User Answers Question
   
   ├─ POST /practice/answers
   │  {
   │   "questionId": 1,
   │   "userAnswer": "B",
   │   "timeSpent": 35
   │  }
   │──────────────────→ │
   │                   ├─ Validate answer
   │                   ├─ Record UserPracticeRecord
   │                   ├─ Update TopicProgress
   │                   ├─ Calculate new accuracy
   │ ←─────────────────┤
   │ {
   │  "isCorrect": true,
   │  "correctAnswer": "B",
   │  "explanation": "...",
   │  "topicAccuracy": 85%
   │ }

4️⃣ Repeat for Questions 2-5

5️⃣ Session Complete - Get Analytics
   
   ├─ GET /practice/progress/topic/1
   │──────────────────→ │
   │                   ├─ Query: topic_progress WHERE
   │                   │ user_id=X AND topic_id=1
   │ ←─────────────────┤
   │ {
   │  "totalQuestions": 50,
   │  "completed": 25,
   │  "accuracy": 88%,
   │  "streak": 5
   │ }
```

## Component Hierarchy

```
App.jsx
│
├─ Routes
│  ├─ UserLayout
│  │  ├─ Header
│  │  ├─ Sidebar
│  │  └─ Page Routes
│  │     │
│  │     ├─ Learning.jsx ◄─── NEW
│  │     │  ├─ PartSelector.jsx ◄─── NEW
│  │     │  ├─ TopicList.jsx ◄─── NEW
│  │     │  │  ├─ TopicCard.jsx ◄─── NEW
│  │     │  │  │  ├─ ProgressBar.jsx
│  │     │  │  │  ├─ AccuracyDisplay.jsx
│  │     │  │  │  └─ Button [Start Practice]
│  │     │  │  └─ [Topic2, Topic3...]
│  │     │  │
│  │     │  └─ RecommendationPanel.jsx ◄─── NEW
│  │     │
│  │     ├─ PracticeMode.jsx ◄─── NEW
│  │     │  ├─ QuestionDisplay.jsx ◄─── NEW
│  │     │  ├─ AnswerOptions.jsx ◄─── NEW
│  │     │  ├─ QuestionTimer.jsx ◄─── NEW
│  │     │  ├─ ProgressBar.jsx
│  │     │  └─ ResultCard.jsx ◄─── NEW
│  │     │
│  │     ├─ Analytics.jsx
│  │     │  ├─ TopicProgressChart.jsx ◄─── NEW
│  │     │  ├─ WeeklyStats.jsx ◄─── NEW
│  │     │  ├─ StreakCounter.jsx ◄─── NEW
│  │     │  └─ WeaknessList.jsx ◄─── NEW
│  │     │
│  │     └─ [Dashboard, Profile...]
│  │
│  └─ AdminLayout
│     ├─ AdminManageTopics.jsx ◄─── NEW
│     ├─ AdminManageQuestions.jsx ◄─── NEW
│     └─ AdminStats.jsx

Key: ◄─── NEW = Components cần tạo mới
```

## State Management (Frontend)

```
Using React Context & Hooks:

PracticeContext (Global State)
│
├─ currentPart: 5
├─ currentTopic: {id: 1, name: "Grammar"}
├─ currentQuestion: {...}
├─ sessionQuestions: [...]
├─ userAnswers: {
│   "q1": "B",
│   "q2": "A",
│   "q3": null
│ }
│
├─ sessionStats: {
│   correct: 2,
│   total: 3,
│   accuracy: 67%
│ }
│
├─ topicsProgress: {
│   "1": {accuracy: 85%, completed: 25, total: 50},
│   "2": {accuracy: 72%, completed: 18, total: 50}
│ }
│
└─ Actions:
   ├─ fetchTopics(partNumber)
   ├─ selectTopic(topicId)
   ├─ startSession(topicId, questionCount)
   ├─ submitAnswer(questionId, answer)
   ├─ getNextQuestion()
   └─ endSession()
```

## Performance Optimization

```
Frontend:
├─ Lazy load components (Learning, Practice)
├─ Virtualize long topic lists
├─ Cache question data
└─ Debounce submit requests

Backend:
├─ Index on user_id, topic_id, question_id
├─ Cache popular topics in Redis (optional)
├─ Pagination for question lists (20 per page)
└─ Async calculation for batch stats updates
```

---

**Diagram này giúp bạn hiểu rõ kiến trúc toàn hệ thống và cách các component tương tác.**
